"use client";
import { ReactNode, useState } from "react";

import { Eye, EyeOff } from "lucide-react";
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

interface FormInputProps {
  name: string;
  description?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type: string;
  value?: string | number;
  Icon?: ReactNode;
  labelClassName?: string;
  onPaste?: (e: React.ClipboardEvent) => void;
  onCopy?: (e: React.ClipboardEvent) => void;
  readOnly?: boolean;
  min?: number | string;
  max?: number | string;
}

const FormInput = ({
  name,
  description,
  placeholder,
  label,
  className,
  onChange,
  disabled = false,
  required = false,
  optional = false,
  type,
  value,
  Icon,
  labelClassName = "",
  onPaste,
  onCopy,
  readOnly = false,
  max,
  min,
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full max-w-[508px] min-h-[63px] flex-col gap-[10px] space-y-0">
          {label && (
            <FormLabel
              className={cn(
                "flex gap-1 font-poppins text-[12px] font-medium leading-[100%] tracking-[0%] text-black",
                labelClassName
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

          <div className="relative w-full">
            <FormControl>
              <Input
                {...field}
                type={inputType}
                min={min}
                max={max}
                required={required}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                value={value ?? field.value ?? ""}
                onChange={(e) => {
                  onChange?.(e);
                  if (type === "number") {
                    field.onChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    );
                  } else {
                    field.onChange(e);
                  }
                }}
                onPaste={(e) => onPaste?.(e)}
                onCopy={(e) => onCopy?.(e)}
                className={cn(
                  (type === "password" || Icon) && "pr-10",
                  className
                )}
              />
            </FormControl>

            {type === "password" ? (
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 end-0 flex items-center pe-3"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : Icon ? (
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground/80">
                {Icon}
              </div>
            ) : null}
          </div>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-[12px]" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;