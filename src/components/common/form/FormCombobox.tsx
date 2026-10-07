"use client";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

export interface selectType {
  label: string;
  value: string;
}

interface FormComboboxProps {
  name: string;
  description?: string;
  placeholder: string;
  label?: string;
  valueLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options: selectType[];
  labelClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  labelInline?: boolean;
  labelInlineGap?: string;
  readonly?: boolean;
  optional?: boolean;
  setSearch?: Dispatch<SetStateAction<string>>;
  displayValueOnly?: boolean;
  searchable?: boolean;
}

const FormCombobox = ({
  name,
  description,
  placeholder,
  label,
  className,
  disabled = false,
  required = false,
  options,
  valueLabel,
  labelClassName,
  value,
  onChange,
  labelInline = false,
  labelInlineGap,
  readonly,
  optional,
  setSearch,
  displayValueOnly = false,
  searchable = false,
}: FormComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<selectType | null>(null);

  // Keep the dropdown exactly as wide as the trigger on every screen size
  // (window resize, rotation, sidebar open / close, dialog resize…)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (next) setSearch?.("");
    setOpen(next);
  };

  return (
    <FormField
      name={name}
      render={({ field }) => {
        const currentValue = value || field.value || "";

        const getDisplayValue = () => {
          if (!currentValue) return null;

          if (selectedOption && selectedOption.value === currentValue) {
            return displayValueOnly ? currentValue : selectedOption.label;
          }

          const found = options.find((o) => o.value === currentValue);
          if (!found) return valueLabel || null;
          return displayValueOnly ? currentValue : found.label;
        };

        const displayValue = getDisplayValue();
        const Chevron = open ? ChevronUp : ChevronDown;

        const labelContent = (
          <>
            {label}
            {required && (
              <span className="text-red-500">*</span>
            )}
            {optional && <span className="text-[#585858]">(Optional)</span>}
          </>
        );

        const combobox = (
          <div ref={wrapRef} className="w-full min-w-0">
            <Popover open={open} onOpenChange={handleOpenChange}>
              <PopoverTrigger
                disabled={disabled}
                render={(props) => (
                  <FormControl>
                    <button
                      {...props}
                      type="button"
                      role="combobox"
                      title={displayValue || undefined}
                      className={cn(
                        // smaller side padding on phones so the text gets more room
                        "flex h-[35px] w-full min-w-0 items-center justify-between rounded-[7px] border border-[#ACACAC] bg-[#DDDDDD] px-3 py-[6px] sm:px-5",
                        "font-poppins text-[12px] font-normal tracking-[0%] text-black",
                        "outline-none transition-colors focus-visible:border-[#585858]",
                        "aria-invalid:border-red-500",
                        "disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100",
                        className
                      )}
                    >
                      {/* leading-[1.5] (not 100%) so letters like g, y, p are not clipped by truncate */}
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate text-left leading-[1.5]",
                          !displayValue && "text-[#585858]"
                        )}
                      >
                        {!options?.length
                          ? "No options available"
                          : displayValue || placeholder}
                      </span>
                      <Chevron className="ml-2 h-4 w-4 shrink-0 text-black" />
                    </button>
                  </FormControl>
                )}
              />

              {!readonly && (
                <PopoverContent
                  align="start"
                  sideOffset={4}
                  className="max-w-[calc(100vw-1rem)] overflow-hidden rounded-[7px] border border-[#ACACAC] bg-[#DDDDDD] p-0 shadow-none"
                  style={{ width: width ? `${width}px` : undefined }}
                  onWheel={(e) => e.stopPropagation()}
                >
                  <Command className="bg-transparent">
                    {searchable && (
                      <CommandInput
                        placeholder="Search..."
                        className="font-poppins text-[12px]"
                        onValueChange={(s) => setSearch?.(s)}
                      />
                    )}
                    <CommandList
                      className="max-h-[min(300px,50dvh)] overflow-y-auto"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty className="py-3 text-center font-poppins text-[12px] text-[#585858]">
                        {!options?.length
                          ? "No options available"
                          : "No results found."}
                      </CommandEmpty>
                      <CommandGroup className="p-0">
                        {(options || [])
                          .filter((o) => o && o.value && o.label)
                          .map((option, index) => {
                            const isSelected = option.value === currentValue;
                            return (
                              <CommandItem
                                key={`${option.value}-${index}`}
                                value={`${option.value}-${index}`}
                                keywords={[option.label]}
                                disabled={disabled || readonly}
                                onSelect={() => {
                                  setSelectedOption(option);
                                  field.onChange(option.value);
                                  onChange?.(option.value);
                                  setOpen(false);
                                  setSearch?.("");
                                }}
                                className={cn(
                                  // min-h (not a fixed height) so long labels wrap instead of being cut
                                  "flex min-h-[30px] h-auto cursor-pointer select-none items-center gap-[9px] rounded-none px-3 py-[6px] sm:px-5",
                                  "whitespace-normal break-words font-poppins text-[12px] font-normal leading-[1.3] tracking-[0%] text-black",
                                  "first:rounded-t-[7px] last:rounded-b-[7px]",
                                  "data-[selected=true]:bg-[#C4C4C4] data-[selected=true]:text-black",
                                  isSelected &&
                                    "bg-[#A6A6A6] data-[selected=true]:bg-[#A6A6A6]"
                                )}
                              >
                                {option.label}
                              </CommandItem>
                            );
                          })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
          </div>
        );

        if (labelInline) {
          return (
            <FormItem
              // phones: label above the field; sm and up: label beside it
              className="flex w-full max-w-[508px] flex-col items-stretch space-y-0 sm:flex-row sm:items-center"
              style={{ gap: labelInlineGap ?? "10px" }}
            >
              {label && (
                <FormLabel className={cn("shrink-0", labelClassName)}>
                  {labelContent}
                </FormLabel>
              )}
              <div className="min-w-0 flex-1">{combobox}</div>
            </FormItem>
          );
        }

        return (
          <FormItem className="flex min-h-[63px] w-full max-w-[508px] flex-col gap-[10px] space-y-0">
            {label && (
              <FormLabel className={labelClassName}>{labelContent}</FormLabel>
            )}
            {combobox}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className="text-[12px]" />
          </FormItem>
        );
      }}
    />
  );
};

export default FormCombobox;