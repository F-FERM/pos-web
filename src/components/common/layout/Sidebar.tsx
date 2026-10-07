"use client";

import Logo from "./Logo";
import SidebarNav from "./SidebarNav";

interface SidebarProps {
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
}

export default function Sidebar({ pathname, expanded, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden flex-col bg-[#E4E4E4] py-4 transition-[width] duration-200 ease-out md:flex ${
        expanded ? "w-[244px]" : "w-[60px]"
      }`}
    >
      <div className="px-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={expanded}
          className="block rounded-full transition-transform cursor-pointer hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F24DEB]"
        >
          <Logo />
        </button>
      </div>

      <SidebarNav pathname={pathname} showLabels={expanded} />
    </aside>
  );
}