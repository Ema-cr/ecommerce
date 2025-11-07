import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  // Si no hay token y el usuario intenta acceder a rutas protegidas
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Permitir continuar
  return NextResponse.next();
}

// (opcional) Define las rutas donde se aplica el middleware
export const config = {
  matcher: ["/dashboard/"], // solo rutas que empiecen con /dashboard
};
