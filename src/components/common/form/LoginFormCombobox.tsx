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
import { loginFieldLabel, loginFieldWrap } from "../../auth/login/LoginStyles";

interface LoginFormInputProps {
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

const LoginFormInput = ({
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
  labelClassName,
  onPaste,
  onCopy,
  readOnly = false,
  max,
  min,
}: LoginFormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-[10px] space-y-0">
          {label && (
            <FormLabel className={cn(loginFieldLabel, labelClassName)}>
              {label}
              {required && <span className="text-red-500">*</span>}
              {optional && !required && (
                <span className="ml-1 text-black">(Optional)</span>
              )}
            </FormLabel>
          )}

          {/* same wrapper as the combobox trigger */}
          <div
            className={cn(
              loginFieldWrap,
              disabled && "cursor-not-allowed opacity-60",
              className,
            )}
          >
            {Icon}

            <FormControl>
              <input
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
                      e.target.value === "" ? "" : Number(e.target.value),
                    );
                  } else {
                    field.onChange(e);
                  }
                }}
                onPaste={(e) => onPaste?.(e)}
                onCopy={(e) => onCopy?.(e)}
                className={cn(
                  "min-w-0 flex-1 truncate border-0 bg-transparent p-0 outline-none",
                  "font-poppins text-[14px] leading-[1.5] text-black placeholder:text-[#BFBFBF]",
                  "disabled:cursor-not-allowed",
                )}
              />
            </FormControl>

            {type === "password" && (
              <button
                type="button"
                tabIndex={-1}
                disabled={disabled}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <EyeOff className="size-[18px] text-black" />
                ) : (
                  <Eye className="size-[18px] text-black" />
                )}
              </button>
            )}
          </div>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-[12px]" />
        </FormItem>
      )}
    />
  );
};

export default LoginFormInput;