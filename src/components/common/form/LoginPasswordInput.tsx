"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { loginFieldInput, loginFieldLabel, loginFieldWrap } from "../../auth/login/LoginStyles";

interface LoginPasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const LoginPasswordInput = ({
  name,
  label,
  placeholder = "Enter your password",
  onChange,
  maxLength,
  required = false,
  disabled = false,
  className,
  labelClassName,
}: LoginPasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col gap-[10px] space-y-0">
          {label && (
            <FormLabel className={cn(loginFieldLabel, labelClassName)}>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}

          <div className={cn(loginFieldWrap, disabled && "opacity-60", className)}>
            <Lock className="size-[18px] shrink-0 text-black" />
            <FormControl>
              <input
                {...field}
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder={placeholder}
                value={field.value ?? ""}
                maxLength={maxLength}
                disabled={disabled}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  onChange?.(e.target.value);
                }}
                className={loginFieldInput}
              />
            </FormControl>
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((s) => !s)}
              className="shrink-0 text-black cursor-pointer"
            >
              {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          </div>

          <FormMessage className="font-poppins text-[12px] text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default LoginPasswordInput;