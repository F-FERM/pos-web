"use client";

import { useEffect, useState } from "react";

const LoginClock = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = now ? now.getHours() : 0;
  const time = now
    ? `${String(h % 12 || 12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    : "--:--";
  const ampm = now ? (h >= 12 ? "PM" : "AM") : "";
  const weekday = now?.toLocaleDateString("en-US", { weekday: "long" }) ?? "";
  const date =
    now?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) ?? "";

  return (
    <div className="flex h-[157px] w-[270px] max-w-full flex-col justify-center rounded-[20px] border border-[#A7A7A7] bg-[#7C7C7C63] p-[10px] pl-4 font-poppins text-white backdrop-blur-[4px]">
      <p className="flex items-baseline gap-2 leading-none">
        <span className="text-[60px] font-medium">{time}</span>
        <span className="text-[24px] font-medium">{ampm}</span>
      </p>
      <p className="mt-1 text-[20px] leading-[1.3]">{weekday}</p>
      <p className="text-[20px] leading-[1.3]">{date}</p>
    </div>
  );
};

export default LoginClock;