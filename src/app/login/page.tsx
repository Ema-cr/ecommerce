import React from "react";
import RegisterForm from "@/components/registerform/RegisterForm";
import Link from "next/link";

const Login = () => {
  return (
    <>
      <div className="flex flex-col gap-6 p-7 md:flex-row md:gap-8 rounded-2xl">
        <Link href="/">
          <img src="/icon-gt.png" alt="GT AutoMarket" width="300px"/>
        </Link>
      </div>
      <div>Login</div>
    </>
  );
};

export default Login;
