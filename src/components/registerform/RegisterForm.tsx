"use client";

import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirm: "",
    terminos: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    // 👉 Registrar en la base de datos
    try {
      const res = await axios.post("/api/auth/register", {
        name: form.nombre,
        email: form.email,
        password: form.password,
      });

      if (res.status === 201) {
        await axios.post("/api/sendEmail", { email: form.email });
        toast.success("Usuario registrado y correo enviado");
      } else {
        toast.error("Error al registrar usuario");
      }
    } catch (error) {
      toast.error("Error al registrar usuario");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="text-gray-500">
            Completa el formulario para comenzar tu experiencia en nuestro concesionario
          </p>
        </div>

        {/* Nombre */}
        <div>
          <label className="font-medium text-gray-700">Nombre Completo</label>
          <div className="relative mt-1">
            <UserIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="nombre"
              required
              placeholder="Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
              className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Correo */}
        <div>
          <label className="font-medium text-gray-700">Correo Electrónico</label>
          <div className="relative mt-1">
            <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="font-medium text-gray-700">Teléfono</label>
          <div className="relative mt-1">
            <PhoneIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="telefono"
              placeholder="+57 123 456 7890"
              value={form.telefono}
              onChange={handleChange}
              className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-700">Contraseña</label>
            <div className="relative mt-1">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700">Confirmar</label>
            <div className="relative mt-1">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="confirm"
                required
                placeholder="Repite contraseña"
                value={form.confirm}
                onChange={handleChange}
                className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Términos */}
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            name="terminos"
            checked={form.terminos}
            onChange={handleChange}
            required
          />
          <span className="text-sm">
            Acepto los <span className="text-blue-600">términos y condiciones</span> y la{" "}
            <span className="text-blue-600">política de privacidad</span>
          </span>
        </label>

        {/* Botón crear cuenta */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
        >
          Crear Cuenta
        </button>
        {/* Ir a login */}
        <p className="text-center text-gray-600 text-sm mt-3">
          ¿Ya tienes cuenta? <a className="text-blue-600" href="/login">Inicia sesión aquí</a>
        </p>
      </form>
      <ToastContainer />
    </>
  );
}
