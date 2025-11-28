import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(req: Request) {
  // use next-auth jwt token to validate request in app route handlers
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
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
  return NextResponse.json({ user: { ...safe, _id: user._id.toString() } })
}
