"use client";
import { Country } from "country-state-city";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";

interface CountryCode {
  isoCode: string;
  code: string;
  country: string;
  flag: string;
}

interface PhoneNumberInputProps {
  name: string;
  description?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  onChange?: (phoneNumber: string, countryCode: string) => void;
  className?: string;
  value?: string;
  countryCode?: string;
  labelClassName?: string;
  onPaste?: (e: React.ClipboardEvent) => void;
  onCopy?: (e: React.ClipboardEvent) => void;
  readOnly?: boolean;
  defaultCountryCode?: string;
}

const countryCodes: CountryCode[] = Country.getAllCountries()
  .filter((c) => c.phonecode)
  .map((c) => ({
    isoCode: c.isoCode,
    code: `+${c.phonecode.replace(/^\+/, "")}`,
    country: c.name,
    flag: c.flag ?? "",
  }));

const FormPhoneNumberInput = ({
  name,
  description,
  placeholder = "enter the registered mobile number",
  label = "",
  className,
  onChange,
  disabled = false,
  required = false,
  optional = false,
  value,
  labelClassName = "",
  onPaste,
  onCopy,
  readOnly = false,
  defaultCountryCode,
}: PhoneNumberInputProps) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    defaultCountryCode ?? "+91",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultCountryCode) setSelectedCountryCode(defaultCountryCode);
  }, [defaultCountryCode]);

  // outside click closes dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearchQuery("");
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  const filteredCountries = countryCodes.filter(
    (c) =>
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery),
  );

  const handleCountrySelect = (code: string) => {
    setSelectedCountryCode(code);
    setSearchQuery("");
    setOpen(false);
    if (onChange) onChange(value || "", code);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    if (onChange) onChange(phoneNumber, selectedCountryCode);
  };

  const selectedCountry = countryCodes.find(
    (c) => c.code === selectedCountryCode,
  );

  return (
    <FormField
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="flex w-full max-w-[508px] min-h-[63px] flex-col gap-[10px] space-y-0">
          {label && (
            <FormLabel
              className={cn(
                "flex gap-1 font-poppins text-[12px] font-medium leading-[100%] tracking-[0%] text-black",
                labelClassName,
              )}
            >
              {label}
              {required && (
                <span className="text-[12px] font-medium text-red-500">*</span>
              )}
              {optional && !required && (
                <span className="text-[12px] font-medium text-black">
                  (Optional)
                </span>
              )}
            </FormLabel>
          )}

          {/* items-stretch (default) keeps the code button the same height as the input */}
          <div className="flex w-full gap-2">
            <div ref={dropdownRef} className="relative w-[110px] shrink-0">
              {/* Trigger: the real <Input> (read-only), so it always matches */}
              <Input
                type="text"
                readOnly
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-invalid={fieldState.invalid}
                value={`${selectedCountry?.flag ?? ""} ${selectedCountryCode}`.trim()}
                onClick={() => !disabled && setOpen((prev) => !prev)}
                onKeyDown={(e) => {
                  if (["Enter", " ", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                    if (!disabled) setOpen(true);
                  }
                }}
                className="cursor-pointer select-none truncate pr-8 caret-transparent"
              />
              <ChevronDown
                className={cn(
                  "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
              />

              {/* Dropdown Panel */}
              {open && (
                <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-64 overflow-hidden rounded-lg border border-[#ACACAC] bg-[#DDDDDD] font-poppins shadow-lg">
                  {/* Search */}
                  <div className="relative px-2 pb-1 pt-2">
                    <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      ref={searchRef}
                      type="text"
                      placeholder="Search country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  {/* Country List */}
                  <div className="max-h-56 overflow-y-auto px-1 pb-1">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.isoCode}
                          type="button"
                          onClick={() => handleCountrySelect(country.code)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-[12px] transition-colors  hover:bg-[#A6A6A6]",
                            selectedCountryCode === country.code &&
                              "bg-[#A6A6A6] font-medium",
                          )}
                        >
                          <span className="text-base">{country.flag}</span>
                          <span className="text-zinc-500">{country.code}</span>
                          <span className="truncate text-black">
                            {country.country}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="py-4 text-center text-[12px] text-muted-foreground">
                        No results found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number Input: same <Input> and defaults as FormInput */}
            <div className="relative min-w-0 flex-1">
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  inputMode="numeric"
                  required={required}
                  placeholder={placeholder}
                  readOnly={readOnly}
                  disabled={disabled}
                  maxLength={15}
                  value={value ?? field.value ?? ""}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    field.onChange(numericValue);
                    handlePhoneNumberChange(numericValue);
                  }}
                  onPaste={(e) => onPaste?.(e)}
                  onCopy={(e) => onCopy?.(e)}
                  className={cn(className)}
                />
              </FormControl>
            </div>
          </div>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-[12px]" />
        </FormItem>
      )}
    />
  );
};

export default FormPhoneNumberInput;