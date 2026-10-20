import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
     className={cn(
  "placeholder:font-poppins placeholder:text-[12px] placeholder:font-normal placeholder:leading-[100%] placeholder:text-[#585858] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 bg-[#DDDDDD] border-[#ACACAC] flex field-sizing-fixed min-h-16 w-full min-w-0 rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 text-[12px] md:text-[12px] [overflow-wrap:anywhere]",
  className
)}
      {...props}
    />
  )
}

export { Textarea }
