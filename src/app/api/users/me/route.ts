import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { hash, compare } from 'bcryptjs'

export async function GET(req: Request) {
  // use next-auth jwt token to validate request in app route handlers
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()
  const user = await db.collection('users').findOne({ email: token.email })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // remove sensitive fields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safe } = user as any
  // ensure a default avatar is present for clients
  const image = safe.image && String(safe.image).length > 0 ? safe.image : '/default-avatar.svg'
  return NextResponse.json({ user: { ...safe, _id: user._id.toString(), image } })
}

export async function PATCH(req: Request) {
  // allow authenticated users to update their profile (image, name, email, address, password, etc)
  console.log('[PATCH /api/users/me] Request received')
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) {
    console.log('[PATCH /api/users/me] Not authenticated')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { image, name, email, address, password, newPassword } = body as {
      image?: string
      name?: string
      email?: string
      address?: string
      password?: string
      newPassword?: string
    }

    // validate at least one field is provided
    if (!image && !name && !email && !address && !password && !newPassword) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // if password change is requested, verify old password first
    if (newPassword) {
      if (!password) {
        return NextResponse.json({ error: 'Current password required to change password' }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password too short (min 6)' }, { status: 422 })
      }

      const currentUser = await db.collection('users').findOne({ email: token.email })
      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const isPasswordValid = await compare(password, currentUser.password)
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
    }

    // prepare update object with only provided fields
    const updateData: any = {}
    if (image) updateData.image = image
    if (name) updateData.name = name
    if (email) {
      // prevent changing to an email already used by another user (only check if different from current)
      if (email !== token.email) {
        const existingWithEmail = await db.collection('users').findOne({ email })
        if (existingWithEmail) {
          return NextResponse.json({ error: 'Email ya está en uso' }, { status: 409 })
        }
      }
      updateData.email = email
    }
    if (address !== undefined) updateData.address = address
    if (newPassword) updateData.password = await hash(newPassword, 10)

    // Upsert to avoid 404 when the authenticated user doc hasn't been created yet
    await db.collection('users').updateOne(
      { email: token.email },
      { $setOnInsert: { email: token.email }, $set: updateData },
      { upsert: true }
    )

    const updated = await db.collection('users').findOne({ email: token.email })
    if (!updated) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 })
    }

    const { password: _, ...safe } = updated as any
    const imageFinal = safe.image && String(safe.image).length > 0 ? safe.image : '/default-avatar.svg'

    return NextResponse.json({ user: { ...safe, _id: safe._id.toString(), image: imageFinal } })
  } catch (error: any) {
    console.error('Error updating user:', { message: error?.message, code: error?.code })
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'Duplicate key' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
