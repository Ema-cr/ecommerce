import React from "react";
import RegisterForm from "@/components/registerform/RegisterForm";
import Link from "next/link";

const Login = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-l from-[#0d1f4a] via-[#0e2a67] to-[#0a1b3c] px-4">
      

      <div className="flex flex-col items-center ">
        <Link href="/">
          <img
            src="/icon-gt.png"
            alt="GT AutoMarket"
            className="w-24 md:w-60"
          />
        </Link>
      </div>


      <p className="text-white/60 text-sm mt-6">
        © 2025 GT AutoMarket. Todos los derechos reservados.
      </p>
    </div>
  );
};

export default Login;
