import { NextResponse } from 'next/server'
import { emailTemplateOffer } from '@/utils/emailTemplateOffer'
import clientPromise from '@/lib/mongodb'

// Simple mailer via existing sendEmail route or direct provider
async function sendEmail(to: string, subject: string, html: string) {
  // If you have a dedicated mailer, integrate here.
  // For now, reuse internal route to centralize SMTP config.
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/sendEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: to, subject, html }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function GET() {
  try {
    const { default: Cars } = await import('@/app/database/models/Cars')
    const { connectDB } = await import('@/lib/dbConnect')
    await connectDB()

    const client = await clientPromise
    const db = client.db()

    // Subscribers collection (create if not exists). For demo: send to all user emails.
    const subscribers = await db.collection('users').find({ email: { $exists: true } }).project({ email: 1 }).toArray()

    // Pick top 5 most expensive cars as "offers"
    const cars = await Cars.find({}).sort({ price: -1 }).limit(5).lean()

    const html = emailTemplateOffer({
      title: 'Ofertas Diarias • GT AutoMarket',
      intro: 'Descubre nuestro inventario premium con precios actualizados.',
      offers: cars.map((c: any) => ({
        brand: c.brand,
        model: c.model,
        price: c.price,
        currency: c.currency || 'USD',
        imageUrl: c.imageUrl,
        link: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/cars?modal=${encodeURIComponent(String(c._id))}`,
      })),
    })

    const subject = 'GT AutoMarket • Ofertas del día'

    let sent = 0
    for (const s of subscribers) {
      const ok = await sendEmail(s.email, subject, html)
      if (ok) sent++
    }

    return NextResponse.json({ ok: true, sent, total: subscribers.length })
  } catch (e) {
    console.error('cron dailyOffers error', e)
    return NextResponse.json({ ok: false, error: 'Failed to send offers' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'