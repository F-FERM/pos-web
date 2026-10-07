"use client";

import { Clock, Lock, Menu, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "../Searchbar";
import Logo from "./Logo";

interface NavbarProps {
  title: string;
  onOpenMobile: () => void;
}

export default function Navbar({ title, onOpenMobile }: NavbarProps) {
  const [time, setTime] = useState("00:00:00 PM");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex min-h-[71px] w-full flex-wrap items-center gap-3 rounded-b-[10px] bg-[#EFEFEF] px-4 py-[10px] sm:flex-nowrap sm:gap-4 sm:px-[25px]">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open menu"
        className="flex shrink-0 items-center gap-2 md:hidden"
      >
        <Logo size={32} />
        <Menu size={20} className="text-gray-600" />
      </button>

      <h1 className="min-w-0 truncate text-[16px] font-semibold tracking-wide text-black sm:text-xl md:mr-4 uppercase">
        {title}
      </h1>

      <div className="relative order-last w-full min-w-0 sm:order-none sm:w-auto sm:max-w-[234px] sm:flex-1">
        <SearchBar placeholder="Search" className="max-w-none" />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Clock (lg and up) */}
        <div className="hidden h-10 items-center gap-2 rounded-lg bg-[#E5E5E5] px-4  border border-[#D5D5D5] text-sm text-[#484848] lg:flex">
          <Clock size={16} />
          <span className="tabular-nums">{time}</span>
        </div>

        {/* User */}
        <div className="flex h-10 items-center gap-2 rounded-lg bg-[#E4E4E4] border border-[#D5D5D5] px-2 text-sm text-[#484848] sm:px-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-white text-primary">
            <User size={14} />
          </span>
          <span className="hidden whitespace-nowrap md:inline text-[#484848]">
            Name <span className="text-[#ACACAC]">(Owner)</span>
          </span>
          <Lock size={13} className="hidden text-[#484848] md:block" />
        </div>
        {/* New sale */}
        <Link
          href="/pos/billing"
          aria-label="New Sale"
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#F24DEB] bg-[#FF00F51A] px-4  text-sm font-normal leading-[100%] tracking-[0%] text-[#F24DEB] transition-colors hover:bg-[#FF00F530] sm:w-[113px] sm:px-2 sm:py-[5px]"
        >
          <ShoppingCart size={16} className="shrink-0" />
          <span className="hidden sm:inline">New Sale</span>
        </Link>
      </div>
    </header>
  );
}