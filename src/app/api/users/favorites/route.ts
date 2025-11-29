import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { ObjectId } from 'mongodb'

export async function GET(req: Request) {
  try {
    // get user's favorite cars or check a specific carId via query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection('users').findOne({ email: token.email })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const url = new URL(req.url)
    const carId = url.searchParams.get('carId')
    if (carId) {
      const isFav = (user.favorites || []).some((id: unknown) => {
        try {
          const oid = typeof id === 'string' ? new ObjectId(id) : id
          return new ObjectId(carId).equals(oid as ObjectId)
        } catch {
          return false
        }
      })
      return NextResponse.json({ isFavorite: isFav })
    }
    const favoriteIds = user.favorites || []
    const favorites = await db
      .collection('cars')
      .find({ _id: { $in: favoriteIds.map((id: string) => new ObjectId(id)) } })
      .toArray()
    return NextResponse.json({ favorites: favorites || [] })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // add car to favorites
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { carId } = body as { carId: string }

    if (!carId) {
      return NextResponse.json({ error: 'carId is required' }, { status: 400 })
    }

    let carObjectId: ObjectId
    try {
      carObjectId = new ObjectId(carId)
    } catch {
      return NextResponse.json({ error: 'Invalid carId' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Upsert user to avoid 404 on first-time favorites usage
    await db.collection('users').updateOne(
      { email: token.email },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $setOnInsert: { email: token.email }, $addToSet: { favorites: carObjectId } } as any,
      { upsert: true }
    )

    const updatedUser = await db.collection('users').findOne({ email: token.email })
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 })
    }

    return NextResponse.json({ success: true, favorites: updatedUser.favorites || [] })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  // remove car from favorites
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token || !token.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { carId } = body as { carId: string }

    if (!carId) {
      return NextResponse.json({ error: 'carId is required' }, { status: 400 })
    }

    let carObjectId: ObjectId
    try {
      carObjectId = new ObjectId(carId)
    } catch {
      return NextResponse.json({ error: 'Invalid carId' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Ensure user doc exists, then pull favorite
    await db.collection('users').updateOne(
      { email: token.email },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $setOnInsert: { email: token.email }, $pull: { favorites: carObjectId } } as any,
      { upsert: true }
    )

    const updatedUser = await db.collection('users').findOne({ email: token.email })
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 })
    }

    return NextResponse.json({ success: true, favorites: updatedUser.favorites || [] })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}
