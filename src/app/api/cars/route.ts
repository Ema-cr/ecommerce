import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Cars from "@/app/database/models/Cars";

export async function createCar(data: Record<string, any>) {
  await connectDB();

  const {
    brand,
    model,
    year,
    price,
    engine,
    mileage,
    condition,
    imageUrl,
    dealerId,
    status,
    tags,
  } = data;

  const newCar = new Cars({
    brand,
    model,
    year,
    price,
    engine,
    mileage,
    condition,
    imageUrl,
    dealerId,
    status,
    tags,
  });

  await newCar.save();
  return newCar;
}

export async function getCars(page: number = 1, limit: number = 10) {
  await connectDB();

  const cars = await Cars.find()
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Cars.countDocuments();

  return { items: cars, total, page, limit };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCar = await createCar(body);
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating car", error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const carsData = await getCars(page, limit);
    return NextResponse.json(carsData);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching cars", error }, { status: 500 });
  }
}
