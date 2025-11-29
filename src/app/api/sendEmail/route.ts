import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createEmailTemplate } from "@/utils/emailTemplate";

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ ok: false, message: 'Email requerido' }, { status: 400 })
    }
    const emailTrim = email.trim().toLowerCase()
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailRegex.test(emailTrim)) {
      return NextResponse.json({ ok: false, message: 'Email inválido' }, { status: 422 })
    }
    const userMail = process.env.MAIL_USER;
    const passMail = process.env.MAIL_PASS;
    if (!userMail || !passMail) {
      console.error('[sendEmail] MAIL_USER o MAIL_PASS faltan')
      return NextResponse.json({ ok: false, message: 'Configuración de correo ausente' }, { status: 500 })
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: userMail, pass: passMail },
    });
    const mensajeHtml = createEmailTemplate();
    await transporter.sendMail({
      from: `"GT Auto Market" <${userMail}>`,
      to: emailTrim,
      subject: "🚗 Bienvenido a GT Auto Market",
      html: mensajeHtml,
      // Remove file attachment to avoid serverless file system issues
      // attachments: [
      //   { filename: 'icon-gt.png', path: `${process.cwd()}/public/icon-gt.png`, cid: 'icon-gt' }
      // ],
    });
    return NextResponse.json({ ok: true, message: "Correo enviado exitosamente" });
  } catch (error: any) {
    console.error("Error al enviar correo:", { message: error?.message, name: error?.name });
    return NextResponse.json({ ok: false, message: "Error al enviar correo" }, { status: 500 });
  }
}
