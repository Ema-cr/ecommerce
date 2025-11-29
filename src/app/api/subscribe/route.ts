import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email: string | undefined = body?.email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Upsert subscriber flag in users, or store in separate collection
    await db.collection('subscribers').updateOne(
      { email },
      { $set: { email, createdAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('subscribe error', e)
    return NextResponse.json({ error: 'Error de servidor' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'