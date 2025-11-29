import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Cars from "@/app/database/models/Cars";
import crypto from 'crypto';
import { getToken } from 'next-auth/jwt';

// Run on Node to avoid potential edge limitations with crypto & mongoose
export const runtime = 'nodejs'

// In-memory cache for shuffled id lists per seed. Key = seed, Value = { ids, createdAt }
const randomOrderCache = new Map<string, { ids: string[]; createdAt: number }>()
// TTL for cache entries (ms)
const CACHE_TTL = 1000 * 60 * 10 // 10 minutes

function cleanupCache() {
  const now = Date.now()
  for (const [key, value] of randomOrderCache.entries()) {
    if (now - value.createdAt > CACHE_TTL) randomOrderCache.delete(key)
  }
}

// Simple seeded RNG (sfc32) using hash-derived seeds
function seededRng(seed: string) {
  const hash = crypto.createHash('sha256').update(seed).digest()
  let a = hash.readUInt32LE(0)
  let b = hash.readUInt32LE(4)
  let c = hash.readUInt32LE(8)
  let d = hash.readUInt32LE(12)
  return function() {
    let t = (a + b) | 0
    a = b ^ (b >>> 9)
    b = (c + (c << 3)) | 0
    c = (c << 21) | (c >>> 11)
    d = (d + 1) | 0
    t = (t + d) | 0
    c = (c + t) | 0
    return (t >>> 0) / 4294967296
  }
}

function shuffleWithSeed<T>(arr: T[], seed: string) {
  const a = arr.slice()
  const rand = seededRng(seed)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
// no extra mongoose types needed

function validateCarPayload(data: Record<string, unknown>) {
  const errors: string[] = []
  const requiredString = ['brand','model','imageUrl']
  requiredString.forEach(f => {
    const v = data[f]
    if (!v || typeof v !== 'string' || v.trim().length === 0) errors.push(`${f} requerido`)
  })
  const year = data.year
  if (year === undefined || isNaN(Number(year))) errors.push('year inválido')
  const price = data.price
  if (price === undefined || isNaN(Number(price))) errors.push('price inválido')
  const engine = data.engine as Record<string, unknown> | undefined
  if (!engine) errors.push('engine requerido')
  else {
    ['type','fuel','hp','transmission'].forEach(k => {
      const val = engine[k]
      if (val === undefined || (typeof val === 'string' && val.trim() === '') || (k==='hp' && isNaN(Number(val)))) errors.push(`engine.${k} inválido`)
    })
  }
  return errors
}

export async function createCar(data: Record<string, unknown>) {
  await connectDB();
  const errs = validateCarPayload(data)
  if (errs.length) {
    return { error: true, messages: errs }
  }
  const {
    brand, model, year, price, currency, engine, km, condition, imageUrl, status, tags,
  } = data;
  const kmNumber = km !== undefined && km !== null ? parseInt(String(km)) : 0
  const newCar = new Cars({
    brand,
    model,
    year,
    price,
    currency,
    engine,
    km: isNaN(kmNumber) ? 0 : kmNumber,
    condition,
    imageUrl,
    status,
    tags,
  });
  await newCar.save();
  return newCar;
}

export async function getCars(page: number = 1, limit: number = 10, random: boolean = false, seed?: string) {
  await connectDB();

  cleanupCache()

  const total = await Cars.countDocuments();

  if (random) {
    // If no seed provided, generate one and create a shuffled order stored in cache.
    if (!seed) {
      seed = crypto.randomBytes(16).toString('hex')
    }

    const seedStr: string = String(seed)

    if (!randomOrderCache.has(seedStr)) {
      // fetch all ids and build a shuffled permutation for this seed
      const allIdsRaw = await Cars.distinct('_id')
      const allIds = (allIdsRaw as unknown[]).map(id => String(id))
      const shuffled = shuffleWithSeed(allIds, seedStr)
      randomOrderCache.set(seedStr, { ids: shuffled, createdAt: Date.now() })
    }

    const cached = randomOrderCache.get(seedStr)!
    const start = (page - 1) * limit
    const pagedIds = cached.ids.slice(start, start + limit)

    // fetch documents for the page and preserve the shuffled order
    const docs = await Cars.find({ _id: { $in: pagedIds } }).lean() as Array<{ _id: unknown } & Record<string, unknown>>
    const docsById = new Map(docs.map(d => [String(d._id), d]))
    const ordered = pagedIds.map(id => docsById.get(id)).filter(Boolean)

    return { items: ordered, total, page, limit, seed: seedStr }
  }

  const cars = await Cars.find()
    .skip((page - 1) * limit)
    .limit(limit)

  return { items: cars, total, page, limit }
}

export async function POST(request: Request) {
  try {
    // Check admin authorization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify user is admin
    const { default: clientPromise } = await import('@/lib/mongodb');
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne({ email: token.email });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const newCar = await createCar(body);
    if ((newCar as any)?.error) {
      return NextResponse.json({ ok: false, errors: (newCar as any).messages }, { status: 422 })
    }
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating car:", error);
    return NextResponse.json({ ok: false, message: "Error creating car" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const random = searchParams.get("random") === "true";
    const seed = searchParams.get("seed") || undefined;
    const q = searchParams.get('q')?.trim();

    // If query provided, perform filtered search by brand/model/year/engine/fuel/tags
    if (q) {
      await connectDB();
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const results = await Cars.find({
        $or: [
          { brand: regex },
          { model: regex },
          { condition: regex },
          { status: regex },
          { currency: regex },
          { tags: { $in: [regex] } },
          { 'engine.type': regex },
          { 'engine.fuel': regex },
          { 'engine.transmission': regex },
        ]
      })
      .limit(limit)
      .lean();

      // Also allow numeric year or price searches
      const yearNum = Number(q);
      if (!isNaN(yearNum)) {
        const yearMatches = await Cars.find({ year: yearNum }).limit(limit).lean();
        // merge unique by _id
        const map = new Map<string, any>();
        [...results, ...yearMatches].forEach((d: any) => map.set(String(d._id), d));
        return NextResponse.json({ items: Array.from(map.values()), total: map.size, page: 1, limit });
      }

      return NextResponse.json({ items: results, total: results.length, page: 1, limit });
    }

    const carsData = await getCars(page, limit, random, seed);
    return NextResponse.json(carsData);
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Error fetching cars" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Check admin authorization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify user is admin
    const { default: clientPromise } = await import('@/lib/mongodb');
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne({ email: token.email });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { carId, ...updateData } = body;

    if (!carId) {
      return NextResponse.json({ error: 'carId is required' }, { status: 400 });
    }

    await connectDB();
    const updatedCar = await Cars.findByIdAndUpdate(carId, updateData, { new: true });

    if (!updatedCar) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, car: updatedCar });
  } catch (error: any) {
    console.error("❌ Error updating car:", error);
    if (error?.code === 11000) {
      return NextResponse.json({ ok: false, message: 'Duplicate key' }, { status: 409 })
    }
    return NextResponse.json({ ok: false, message: "Error updating car" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check admin authorization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify user is admin
    const { default: clientPromise } = await import('@/lib/mongodb');
    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne({ email: token.email });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const carId = searchParams.get("carId");

    if (!carId) {
      return NextResponse.json({ error: 'carId is required' }, { status: 400 });
    }

    await connectDB();
    const deletedCar = await Cars.findByIdAndDelete(carId);

    if (!deletedCar) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting car:", error);
    return NextResponse.json({ ok: false, message: "Error deleting car" }, { status: 500 });
  }
}
