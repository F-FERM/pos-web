"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginForm from "./LoginForm";
import LoginImage from "./LoginImage";
import LoginLogo from "./LoginLogo";
import { LocalStorage } from "@/src/utility/localStorage";

const Login = () => {
  const router = useRouter();

  // already logged in -> go straight to the dashboard
  useEffect(() => {
    const token = LocalStorage.getItem("access_token");
    if (token) {
      router.replace("/pos/dashboard"); 
    }
  }, [router]);

  return (
    <main className="min-h-dvh bg-[#DCDCDC] lg:grid lg:grid-cols-2 lg:p-6">
    
      <LoginImage />

      <section className="flex min-h-dvh items-center justify-center px-5 py-8 sm:px-8 lg:min-h-0 lg:py-6">
        <div className="flex w-full max-w-[368px] flex-col gap-8 sm:gap-10">
          <div className="flex justify-center lg:hidden">
            <LoginLogo />
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
};

export default Login;




