"use client";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Textarea } from "../../ui/textarea";
import { cn } from "@/src/lib/utils";

interface FormTextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  required?: boolean;
  optional?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

const FormTextArea = ({
  name,
  label,
  placeholder,
  className,
  labelClassName = "",
  value,
  onChange,
  maxLength = 255,
  required = false,
  optional = false,
  readOnly = false,
  disabled = false,
}: FormTextAreaProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        const currentValue = value ?? field.value ?? "";

        return (
          <FormItem className="flex w-full min-w-0 max-w-full flex-col gap-[10px] space-y-0 sm:max-w-[508px]">
            {label && (
              <FormLabel
                className={cn(
                  "flex flex-wrap gap-1 font-poppins text-[12px] font-medium leading-[100%] tracking-[0%] text-black",
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

            <FormControl>
              <Textarea
                {...field}
                value={currentValue}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                maxLength={maxLength}
                onChange={(e) => {
                  field.onChange(e);
                  onChange?.(e);
                }}
                className={cn(
                  "min-h-[80px] max-h-[160px] w-full min-w-0 resize-none overflow-y-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere] sm:min-h-[100px] sm:max-h-[220px]",
                  className
                )}
              />
            </FormControl>

            {/* Error message on the left, counter on the right */}
            <div className="flex items-start justify-between gap-2">
              <FormMessage className="min-w-0 flex-1 text-[12px]" />
              <span className="ml-auto shrink-0 font-poppins text-[11px] text-[#585858]">
                {String(currentValue).length} / {maxLength}
              </span>
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default FormTextArea;