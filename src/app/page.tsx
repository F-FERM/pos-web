"use client";


import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LocalStorage } from "../utility/localStorage";

export default function Home() {
  const userToken = LocalStorage.getItem("access_token");

  const router = useRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (userToken) {
      router.push("/pos/dashboard");
    } else {
      router.push("/login");
    }
  }, [userToken]);

  return (
    <div className="flex h-[90vh] w-[100%] items-center justify-center">
      
      <Loader type="dots" size={30} className="animate-spin" />
    </div>
  );
}
