"use client";

import Link from "next/link";
import { isActive, NAV_SECTIONS, NavItem, SETTINGS_ITEM } from "./NavConfig";


function SidebarLink({
  item,
  active,
  showLabel,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  showLabel: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.url}
      onClick={onClick}
      title={showLabel ? undefined : item.title}
      aria-label={item.title}
      aria-current={active ? "page" : undefined}
      className={`flex h-[33px] w-full items-center gap-[10px] overflow-hidden rounded-[6px] border py-[5px] text-sm transition-colors ${
        showLabel ? "px-[10px]" : "px-[8px]"
      } ${
        active
          ? "border-[#5E155B2E] bg-[#F24DEB] font-medium text-white"
          : "border-transparent text-gray-700 hover:border-[#5E155B2E] hover:bg-[#F24DEB] hover:text-white"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} className="shrink-0" />
      {showLabel && (
        <span className="truncate whitespace-nowrap">{item.title}</span>
      )}
    </Link>
  );
}

export default function SidebarNav({
  pathname,
  showLabels,
  onNavigate,
}: {
  pathname: string;
  showLabels: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav
        className={`mt-4 flex min-h-0 flex-1 flex-col gap-[3px] overflow-y-auto overflow-x-hidden pl-3 pr-1 [scrollbar-gutter:stable] [scrollbar-width:thin] ${
          showLabels
            ? "[scrollbar-color:#C4C4C4_transparent] hover:[scrollbar-color:#A8A8A8_transparent]"
            : "[scrollbar-color:transparent_transparent]"
        }`}
        aria-label="Main navigation"
      >
        {NAV_SECTIONS.map((section, i) => (
          <div key={section.label} className="flex flex-col gap-[3px]">
            {showLabels ? (
              <p
                className={`mb-1.5 px-[10px] text-[12px] font-semibold uppercase leading-none tracking-normal text-[#8F8F8F] ${
                  i === 0 ? "" : "mt-4"
                }`}
              >
                {section.label}
              </p>
            ) : (
              i > 0 && <div className="mx-2 my-2 h-px bg-black/10" />
            )}
            {section.items.map((item) => (
              <SidebarLink
                key={item.url}
                item={item}
                active={isActive(pathname, item.url)}
                showLabel={showLabels}
                onClick={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="px-3 pt-2">
        <SidebarLink
          item={SETTINGS_ITEM}
          active={isActive(pathname, SETTINGS_ITEM.url)}
          showLabel={showLabels}
          onClick={onNavigate}
        />
      </div>
    </>
  );
}