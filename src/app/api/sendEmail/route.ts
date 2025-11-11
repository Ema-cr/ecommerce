import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createEmailTemplate } from "@/utils/emailTemplate";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const userMail = process.env.MAIL_USER;
    const passMail = process.env.MAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userMail,
        pass: passMail,
      },
    });

    const mensajeHtml = createEmailTemplate();

    await transporter.sendMail({
      from: `"Frozono App" <${userMail}>`,
      to: email, // 👈 Se recibe desde el form
      subject: "❄️ Bienvenido a Frozono App",
      html: mensajeHtml,
      attachments: [
        {
          filename: "frozono.png",
          path: "public/frozono.png", // 👈 Imagen local
          cid: "frozono-logo", // 👈 Debe coincidir con el HTML
        },
      ],
    });

    return NextResponse.json({ success: true, message: "Correo enviado exitosamente" });
  } catch (error: any) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json({ success: false, message: "Error al enviar correo", error }, { status: 500 });
  }
}
