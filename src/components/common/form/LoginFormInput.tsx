"use client";

import { ReactElement } from "react";
import { cn } from "@/src/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { loginFieldInput, loginFieldLabel, loginFieldWrap } from "../../auth/login/LoginStyles";

interface LoginFormInputProps {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  Icon?: ReactElement;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  autoComplete?: string;
  maxLength?: number;
}

const LoginFormInput = ({
  name,
  type = "text",
  label,
  placeholder,
  onChange,
  Icon,
  required = false,
  disabled = false,
  className,
  labelClassName,
  autoComplete,
  maxLength,
}: LoginFormInputProps) => {
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
            {Icon}
            <FormControl>
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                value={field.value ?? ""}
                disabled={disabled}
                autoComplete={autoComplete}
                maxLength={maxLength}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  onChange?.(e.target.value);
                }}
                className={loginFieldInput}
              />
            </FormControl>
          </div>

          <FormMessage className="font-poppins text-[12px] text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default LoginFormInput;