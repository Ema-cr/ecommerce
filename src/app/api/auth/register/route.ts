import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/dbConnect";
import User from "@/app/database/models/Users";

// Force Node.js runtime (bcryptjs, mongoose reliability in serverless)
export const runtime = 'nodejs'

// Optionally increase the default body size limit (if large payloads expected)
export const maxDuration = 10

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).slice(2)
  try {
    const body = await req.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!name || !email || !password) {
      return NextResponse.json({
        ok: false,
        message: 'Faltan campos requeridos (name, email, password)',
        fields: { name: !!name, email: !!email, password: !!password }
      }, { status: 422 })
    }

    await connectDB();
    // Ensure indexes (unique email) are built before querying for races
    await User.init();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { ok: false, message: 'El correo ya está registrado.' },
        { status: 409 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({
        ok: false,
        message: 'La contraseña debe tener al menos 6 caracteres.'
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (!newUser.image) newUser.image = '/default-avatar.svg';

    await newUser.save();

    return NextResponse.json(
      { ok: true, message: 'Usuario registrado correctamente' },
      { status: 201 }
    );
  } catch (error: any) {
    const code = error?.code;
    // Duplicate key race condition fallback
    if (code === 11000) {
      return NextResponse.json({ ok: false, message: 'El correo ya está registrado.' }, { status: 409 })
    }
    console.error(`[register][${requestId}] Error registrando usuario:`, {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      code: error?.code
    });
    return NextResponse.json(
      { ok: false, message: 'Error registrando usuario', requestId },
      { status: 500 }
    );
  }
}
