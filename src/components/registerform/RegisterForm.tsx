"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { useI18n } from '@/app/i18n/I18nProvider';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const router = useRouter();
  const { t } = useI18n();
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
      toast.error(t('registerForm.passwordMismatch'));
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
        // Send welcome email (non-blocking)
        axios.post("/api/sendEmail", { email: form.email }).catch((err) => {
          console.warn('[RegisterForm] Failed to send welcome email:', err.message);
        });
        toast.success(t('registerForm.success'));
        // Redirect to login after successful registration
        setTimeout(() => router.push('/login'), 1200);
      } else {
        toast.error(t('registerForm.error'));
      }
    } catch {
      toast.error(t('registerForm.error'));
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('registerForm.title')}</h2>
          <p className="text-gray-500">
            {t('registerForm.subtitle')}
          </p>
        </div>

        {/* Nombre */}
        <div>
          <label className="font-medium text-gray-700">{t('registerForm.fullName')}</label>
          <div className="relative mt-1">
            <UserIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="nombre"
              required
              placeholder={t('registerForm.fullNamePlaceholder')}
              value={form.nombre}
              onChange={handleChange}
              className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Correo */}
        <div>
          <label className="font-medium text-gray-700">{t('registerForm.email')}</label>
          <div className="relative mt-1">
            <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder={t('registerForm.emailPlaceholder')}
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="font-medium text-gray-700">{t('registerForm.phone')}</label>
          <div className="relative mt-1">
            <PhoneIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="telefono"
              placeholder={t('registerForm.phonePlaceholder')}
              value={form.telefono}
              onChange={handleChange}
              className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-700">{t('registerForm.password')}</label>
            <div className="relative mt-1">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder={t('registerForm.passwordPlaceholder')}
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 border-none rounded-xl p-2 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700">{t('registerForm.confirm')}</label>
            <div className="relative mt-1">
              <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="confirm"
                required
                placeholder={t('registerForm.confirmPlaceholder')}
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
            {t('registerForm.terms')} <span className="text-blue-600">{t('registerForm.termsLink')}</span> {t('registerForm.and')}{" "}
            <span className="text-blue-600">{t('registerForm.privacyLink')}</span>
          </span>
        </label>

        {/* Botón crear cuenta */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition"
        >
          {t('registerForm.submit')}
        </button>
        {/* Ir a login */}
        <p className="text-center text-gray-600 text-sm mt-3">
          {t('registerForm.hasAccount')} <a className="text-blue-600" href="/login">{t('registerForm.loginLink')}</a>
        </p>
      </form>
      <ToastContainer />
    </>
  );
}
