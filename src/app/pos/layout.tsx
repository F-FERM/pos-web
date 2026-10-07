"use client";

import MobileSidebar from "@/src/components/common/layout/MobileSidebar";
import Navbar from "@/src/components/common/layout/Navbar";
import { ALL_ITEMS, isActive } from "@/src/components/common/layout/NavConfig";
import Sidebar from "@/src/components/common/layout/Sidebar";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";


export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [expanded, setExpanded] = useState(false); 
  const [mobileOpen, setMobileOpen] = useState(false); 

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (window.innerWidth < 1024) setExpanded(false);
  }, [pathname]);

  const activeItem = ALL_ITEMS.find((i) => isActive(pathname, i.url));
  const title = activeItem?.heading ?? activeItem?.title ?? "Dashboard";

  return (
    <div className="min-h-screen bg-[#E0E0E0]">
      <Sidebar
        pathname={pathname}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      />
      <MobileSidebar
        pathname={pathname}
        open={mobileOpen}
        onClose={closeMobile}
      />

      <div
        className={`flex min-h-screen min-w-0 flex-col px-3 transition-[margin] duration-200 ease-out md:ml-[60px] ${
          expanded ? "lg:ml-[244px]" : ""
        }`}
      >
        <Navbar title={title} onOpenMobile={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1 py-3">{children}</main>
      </div>
    </div>
  );
}