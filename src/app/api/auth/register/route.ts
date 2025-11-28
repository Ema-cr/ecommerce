import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/dbConnect";
import User from "@/app/database/models/Users";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "El correo ya está registrado." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Set a default avatar for new users
    // use a public asset so the client can load it at `/default-avatar.svg`
    if (!newUser.image) newUser.image = '/default-avatar.svg'

    await newUser.save();

    return NextResponse.json(
      { message: "Usuario registrado correctamente", ok: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registrando usuario:", error);
    return NextResponse.json(
      { message: "Error registrando usuario" },
      { status: 500 }
    );
  }
}
