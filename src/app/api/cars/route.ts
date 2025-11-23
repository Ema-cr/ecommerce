import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cars from "@/app/database/models/Cars";

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    const { brand, model, year, price, engine, mileage, condition, imageUrl, dealerId, status, tags } = body;

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
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating car", error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const cars = await Cars.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Cars.countDocuments();

    return NextResponse.json({ items: cars, total, page, limit });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching cars", error }, { status: 500 });
  }
}
