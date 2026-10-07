"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface FilterTypes {
  search?: string;
  category?: string;
  date?: string;
}

interface SearchBarProps {
  placeholder?: string;
  color?: string;
  className?: string;
  onSearch?: (query: string) => void;
  filterState?: FilterTypes;
  setFilters?: (newFilters: Partial<FilterTypes>) => void;
  value?: string;
  disabled?: boolean;
  /** Any lucide / tabler icon component. Defaults to Search. */
  icon?: React.ElementType;
  iconClassName?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
}

const SearchBar = ({
  placeholder = "Search by name or mobile number...",
  color,
  className,
  onSearch,
  filterState,
  setFilters,
  value,
  disabled = false,
  icon: Icon = Search,
  iconClassName,
  onKeyDown,
  inputRef,
}: SearchBarProps) => {
  const [internal, setInternal] = React.useState(value ?? "");

  // controlled by filterState or value when provided, otherwise internal state
  const current = filterState?.search ?? value ?? internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInternal(next);
    onSearch?.(next);
    setFilters?.({ search: next });
  };

  return (
    <div
      data-slot="search-bar"
      className={cn(
        "flex h-[33px] w-full max-w-[321px] items-center gap-[10px] rounded-[25px] border border-[#D5D5D5] bg-[#E5E5E5] px-[10px] py-[5px]",
        "transition-colors focus-within:border-[#BD29B7]",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <Icon aria-hidden="true" className={cn("size-[18px] shrink-0 text-[#848484]", iconClassName)} />
      <input
        ref={inputRef}
        type="text"
        aria-label={placeholder}
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={current}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        style={color ? { color } : undefined}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent outline-none",
          "font-poppins text-[12px] font-normal leading-[100%] tracking-[0%] text-[#484848]",
          "placeholder:font-poppins placeholder:text-[12px] placeholder:font-normal placeholder:text-[#848484]",
          "disabled:cursor-not-allowed"
        )}
      />
    </div>
  );
};

export default SearchBar;