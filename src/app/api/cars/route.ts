import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Cars from "@/app/database/models/Cars";
import crypto from 'crypto';

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

export async function createCar(data: Record<string, unknown>) {
  await connectDB();

  const {
    brand,
    model,
    year,
    price,
    currency,
    engine,
    km,
    condition,
    imageUrl,
    status,
    tags,
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
    const body = await request.json();
    const newCar = await createCar(body);
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating car:", error);
    return NextResponse.json({ message: "Error creating car", error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const random = searchParams.get("random") === "true";
    const seed = searchParams.get("seed") || undefined;
    const carsData = await getCars(page, limit, random, seed);
    return NextResponse.json(carsData);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching cars", error }, { status: 500 });
  }
}
