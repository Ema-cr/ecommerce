"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
      remember: remember ? "yes" : "no",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="text-gray-500">
          Accede a tu cuenta para explorar nuestro catálogo de vehículos nuevos
        </p>
      </div>

      <div>
        <label className="font-medium text-gray-700">Correo Electrónico</label>
        <div className="relative mt-1">
          <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="font-medium text-gray-700">Contraseña</label>
        <div className="relative mt-1">
          <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-sm">Recordarme</span>
      </label>

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
      >
        Iniciar Sesión
      </button>

      <div className="flex items-center gap-4">
        <hr className="grow" />
        <span className="text-gray-400 text-sm">O continuar con</span>
        <hr className="grow" />
      </div>

      <button
        type="button"
        onClick={() => signIn("google")}
        className="flex items-center justify-center gap-2 w-full border py-3 rounded-xl hover:bg-gray-100"
      >
        <img src="/google_icon.png" className="w-5 h-5" alt="Google" />
        Google
      </button>

      <p className="text-center text-gray-600 text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-blue-600">
          Regístrate aquí
        </a>
      </p>
    </form>
  );
}
