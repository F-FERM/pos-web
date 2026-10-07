import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/src/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // layout + box
        "flex h-[35px] w-full min-w-0 rounded-[7px] border border-[#ACACAC] bg-[#DDDDDD] px-5 py-[6px] shadow-none outline-none transition-colors",
        // text (md: override is needed to beat any responsive size)
        "font-poppins text-[12px] md:text-[12px] font-normal leading-[100%] tracking-[0%] text-black",
        "placeholder:font-poppins placeholder:text-[12px] placeholder:font-normal placeholder:leading-[100%] placeholder:text-[#585858]",
        "selection:bg-primary selection:text-primary-foreground",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-[12px] file:font-medium",
        // focus
        "focus-visible:border-[#585858] focus-visible:ring-0",
        // error
        "aria-invalid:border-red-500 aria-invalid:ring-0",
        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

export { Input };