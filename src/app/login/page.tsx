import Link from "next/link";
import LoginForm from "@/components/loginform/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-l from-[#0d1f4a] via-[#0e2a67] to-[#0a1b3c] px-4 pb-16">

      <div className="flex flex-col items-center mb-8">
        <Link href="/">
          <img src="/icon-gt.png" className="w-50 h-50 mb-1 cursor-pointer" />
        </Link>
        <h1 className="text-white text-3xl font-semibold">GT AutoMarket</h1>
        <p className="text-white/80 text-sm">Tu concesionario de confianza</p>
      </div>

      <LoginForm />
    </div>
  );
}

