"use client";
import { useState } from "react";

export default function SendEmailForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);
    setMessage(data.message);
  };

  return (

    
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow-lg">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl">
        <div className="flex items-center my-6">
          <hr className="grow border-gray-300" />
          <span className="mx-3 text-gray-400">o continuar con</span>
          <hr className="grow border-gray-300" />
        </div>
    <button
          className="w-full mb-6 py-3 rounded-xl text-white font-medium bg-linear-to-l from-[#0d1f4a] via-[#0e2a67] to-[#0a1b3c] hover:opacity-90 transition"
        >
          Iniciar sesión con Google
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mb-4 text-sky-600">Enviar correo de Frozono</h2>

      <input
        type="email"
        placeholder="Correo destinatario"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        {loading ? "Enviando..." : "Enviar ❄️"}
      </button>

      {message && (
        <p className="mt-3 text-center text-sky-600 font-medium">{message}</p>
      )}
    </form>
  );
}
