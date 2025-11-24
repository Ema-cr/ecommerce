"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import InputWithIcon from "@/components/inputwithicon/InputWithIcon";

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
    <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold">Iniciar Sesión</h2>
        <p className="text-gray-500 text-sm">
          Accede a tu cuenta para explorar nuestro catálogo de vehículos nuevos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputWithIcon
          icon={<EnvelopeIcon className="h-5 w-5" />}
          type="email"
          name="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputWithIcon
          icon={<LockClosedIcon className="h-5 w-5" />}
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm text-gray-600">Recordarme</span>
        </label>

        <button className="bg-black text-white w-full py-3 rounded-xl font-semibold">
          Iniciar Sesión
        </button>
      </form>

      <div className="flex items-center gap-4">
        <hr className="grow" />
        <span className="text-gray-400 text-sm">O continuar con</span>
        <hr className="grow" />
      </div>

      <button
        onClick={() => signIn("google")}
        className="flex items-center justify-center gap-2 w-full border py-3 rounded-xl"
      >
        <img src="/google_icon.png" className="w-5 h-5" alt="Google" />
        Google
      </button>

      <p className="text-center text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-blue-600 font-semibold">Regístrate aquí</a>
      </p>
    </div>
  );
}
