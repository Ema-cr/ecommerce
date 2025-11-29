"use client"

import Link from "next/link";
import RegisterForm from '@/components/registerform/RegisterForm';
import { useI18n } from '@/app/i18n/I18nProvider';

export default function RegisterPage() {
  const { t } = useI18n();

  return (
  <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-l from-[#0d1f4a] via-[#0e2a67] to-[#0a1b3c] px-4 pb-16">

      <div className="flex flex-col items-center mb-8">
        <Link href="/">
          <img src="/icon-gt.png" className="w-50 h-50 mb-1 cursor-pointer" />
        </Link>
        <h1 className="text-white text-3xl font-semibold">{t('register.title')}</h1>
        <p className="text-white/80 text-sm">{t('register.subtitle')}</p>
      </div>

      <RegisterForm/>
    </div>
  );
}
