import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border w-[133px] h-[35px] gap-[10px] rounded-[12px] px-0 py-0 text-[14px] bg-background font-semibold uppercase hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",

        create: [
        
          "font-poppins min-w-[140px] sm:min-w-[174px] h-[33px] gap-[5px] rounded-[8px] px-2 py-[5px]",
          "bg-primary text-white shadow-[0px_0px_4px_0px_#00000040]",
          "text-[12px] font-normal leading-[100%] tracking-[0%]",
          "hover:bg-[#A823A2] focus-visible:ring-2 focus-visible:ring-[#F24DEB]/40",
          "[&_svg:not([class*='size-'])]:size-[15px]",
        ],
         closeRegisterShift: [
        
          "font-poppins min-w-[140px] sm:min-w-[174px] h-[33px] gap-[5px] rounded-[8px] px-2 py-[5px]",
          "bg-[#0078DA] text-white shadow-[0px_0px_4px_0px_#00000040]",
          "text-[12px] font-normal leading-[100%] tracking-[0%]",
          "hover:bg-[#0078DA]/80 focus-visible:ring-2 focus-visible:ring-[#0078DA]/40",
          "[&_svg:not([class*='size-'])]:size-[15px]",
        ],
        savePdf: [
  "font-poppins h-[48px] w-full rounded-[15px] px-6 sm:w-[200px]",
  "bg-[#0EA300] text-white",
  "text-[15px] font-semibold uppercase leading-[100%] tracking-[0%]",
  "hover:bg-[#0C8C00] focus-visible:ring-2 focus-visible:ring-[#0EA300]/40",
],
print: [
  "font-poppins h-[48px] w-full rounded-[15px] px-6 sm:w-[200px]",
  "bg-[#BD26B8] text-white",
  "text-[15px] font-semibold uppercase leading-[100%] tracking-[0%]",
  "hover:bg-[#A220A0] focus-visible:ring-2 focus-visible:ring-[#BD26B8]/40",
],
      cancel: [
  "font-poppins w-full h-10 sm:h-[35px] sm:w-auto sm:min-w-[100px] md:min-w-[110px] lg:min-w-[120px]",
  "gap-[10px] rounded-[12px] px-4 sm:px-4 md:px-5",
  "bg-[#ACACAC] text-white",
  "text-[13px] sm:text-[14px] font-semibold uppercase leading-[100%] tracking-[0%]",
  "hover:bg-[#9A9A9A] focus-visible:ring-2 focus-visible:ring-[#ACACAC]/40",
],
save: [
  "font-poppins w-full h-10 sm:h-[35px] sm:w-auto sm:min-w-[110px] md:min-w-[120px] lg:min-w-[130px]",
  "gap-[10px] rounded-[12px] px-4 sm:px-4 md:px-5",
  "bg-primary text-white",
  "text-[13px] sm:text-[14px] font-semibold uppercase leading-[100%] tracking-[0%]",
  "hover:bg-[#A823A2] focus-visible:ring-2 focus-visible:ring-[#F24DEB]/40",
],
        cameraBackup: [
          "font-poppins h-[33px] w-[33px] px-0 sm:w-auto sm:min-w-[148px] sm:px-[10px] gap-[10px] rounded-[25px] py-[5px]",
          "border border-[#D5D5D5] bg-[#EFEFEF] text-[#484848]",
          "text-[12px] font-normal leading-[100%] tracking-[0%]",
          "hover:bg-[#E6E6E6] focus-visible:ring-2 focus-visible:ring-[#D5D5D5]",
          "[&_img]:size-[17px] [&_img]:shrink-0",
        ],
        completeBill: [
          "flex h-9 w-full items-center justify-center gap-2 rounded-[10px] px-3",
          "bg-[#F24DEB] text-[13px] font-semibold text-white",
          "transition-opacity hover:opacity-90",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&_svg:not([class*='size-'])]:size-[18px]",
        ],
         deletecancel:
          "w-[138px] h-[42px]  py-8  rounded-[5px] p-[10px] gap-[8px]  text-base text-white bg-red-600",
         deleteicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer flex-shrink-0 text-red-600 hover:bg-red-100 hover:text-red-600 transition-colors",
        editicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer flex-shrink-0 hover:bg-[#F24DEB]/10 transition-colors text-primary",
        viewicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer hover:bg-gray-300",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const designVariants = ["create", "cancel", "save", "cameraBackup", "completeBill", "savePdf",
  "print",];

function Button({
  className,
  variant = "default",
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const resolvedSize =
    size ?? (designVariants.includes(variant ?? "") ? "none" : "default");

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size: resolvedSize }), className)}
      {...props}
    />
  );
}

export type ButtonProps = import("@base-ui/react/button").Button.Props &
  VariantProps<typeof buttonVariants>;
export { Button, buttonVariants };