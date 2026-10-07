import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/src/components/ui/button";

export type HeaderAction = {
  label: string;
  onClick?: () => void;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  disabled?: boolean;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon: StaticImageData | string;
  iconAlt?: string;
  actions?: HeaderAction[];
  className?: string;
};

export default function PageHeader({
  title,
  subtitle,
  icon,
  iconAlt = "",
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={`flex w-full flex-col gap-3 rounded-[10px] bg-[#EFEFEF] py-4 pl-5 pr-[19px] sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex min-w-0 flex-col gap-[10px]">
        <div className="flex items-start gap-[10px]">
          <span className="mt-[1px] flex size-[21px] shrink-0 items-center justify-center">
            <Image
              src={icon}
              alt={iconAlt}
              width={31}
              height={31}
              className="size-full object-contain"
            />
          </span>
          {/* No `truncate` + 100% line height: that clipped the bottom of letters (g, y, p)
              and cut long titles. The title now wraps and the line height gives the letters room. */}
          <h1 className="min-w-0 break-words font-poppins text-[16px] font-semibold leading-[1.3] tracking-[0%] text-black sm:text-[18px]">
            {title}
          </h1>
        </div>

        {subtitle && (
          <p className="break-words font-poppins text-[12px] font-normal leading-[1.4] tracking-[0%] text-[#848484]">
            {subtitle}
          </p>
        )}
      </div>

      {actions && actions.length > 0 && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions.map((a) => (
            <Button
              key={a.label}
              type="button"
              variant={a.variant}
              onClick={a.onClick}
              disabled={a.disabled}
            >
              {a.icon}
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </header>
  );
}