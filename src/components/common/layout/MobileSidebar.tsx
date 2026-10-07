"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import Logo from "./Logo";
import SidebarNav from "./SidebarNav";

interface MobileSidebarProps {
  pathname: string;
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({
  pathname,
  open,
  onClose,
}: MobileSidebarProps) {
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close the drawer if the screen grows to desktop size (rotate / resize)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handle = (e: MediaQueryListEvent) => e.matches && onClose();
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, [onClose]);

  // Escape to close + lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div className="md:hidden">
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-[244px] max-w-[85vw] flex-col bg-[#E4E4E4] py-4 transition-[transform,visibility] duration-200 ease-out ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-3">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-gray-600 hover:bg-white"
          >
            <X size={18} />
          </button>
        </div>

        <SidebarNav pathname={pathname} showLabels onNavigate={onClose} />
      </aside>
    </div>
  );
}