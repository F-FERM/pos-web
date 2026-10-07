"use client";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
        // wrapping row of pills (payment / category / filter tabs)
        pills:
          "h-auto w-full max-w-full flex-wrap justify-start gap-2 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap border font-poppins leading-[100%] tracking-[0%] outline-none select-none cursor-pointer transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#F24DEB]/40",
  {
    variants: {
      variant: {
        // original shadcn look (Base UI uses data-active, not data-state)
        default:
          "h-[calc(100%-1px)] flex-1 gap-1.5 rounded-md border-transparent px-2 py-1 text-sm font-medium text-foreground data-active:bg-background data-active:shadow-sm dark:text-muted-foreground dark:data-active:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        payment:
          "h-[24px] min-w-[65px] gap-[10px] rounded-[20px] border-[#C0C0C0] bg-[#EDEDED] px-2 text-[12px] font-medium text-black hover:border-primary hover:bg-white hover:text-black data-active:border-primary data-active:bg-primary data-active:text-white",

        category:
          "h-[20px] min-w-[71px] gap-[10px] rounded-[20px] border-[#B2B2B2] bg-[#EFEFEF] px-2 text-[12px] font-normal text-[#898989] hover:border-[#571354] hover:bg-primary hover:text-white data-active:border-[#571354] data-active:bg-primary data-active:text-white",

        filter:
          "h-[28px] min-w-[54px] gap-[5px] rounded-[8px] border-[#BDBDBD] bg-[#E5E5E5] px-[10px] py-1 text-[12px] font-normal capitalize text-[#898989] hover:border-primary hover:bg-primary hover:text-white data-active:border-primary data-active:bg-primary data-active:text-white",

        filterPink:
          "h-[28px] min-w-[104px] gap-[5px] rounded-[8px] border-primary bg-[#FF00F50D] px-[20px] py-1 text-[12px] font-normal capitalize text-primary hover:bg-primary hover:text-white data-active:bg-primary data-active:text-white",

        filterBlue:
          "h-[28px] min-w-[104px] gap-[5px] rounded-[8px] border-[#0078DA] bg-[#A9D8FF40] px-[10px] py-1 text-[12px] font-normal capitalize text-[#0078DA] hover:bg-[#0078DA] hover:text-white data-active:bg-[#0078DA] data-active:text-white",

        filterGreen:
          "h-[28px] min-w-[104px] gap-[5px] rounded-[8px] border-[#0EA300] bg-[#B0F5973D] px-[10px] py-1 text-[12px] font-normal capitalize text-[#0EA300] hover:bg-[#0EA300] hover:text-white data-active:bg-[#0EA300] data-active:text-white",

        filterPurple:
          "h-[28px] min-w-[104px] gap-[5px] rounded-[8px] border-[#3100A3] bg-[#AB5DFF1A] px-[10px] py-1 text-[12px] font-normal capitalize text-[#3100A3] hover:bg-[#3100A3] hover:text-white data-active:bg-[#3100A3] data-active:text-white",

        filterRed:
          "h-[28px] min-w-[104px] gap-[5px] rounded-[8px] border-[#FF0000] bg-[#FF00001A] px-[10px] py-1 text-[12px] font-normal capitalize text-[#FF0000] hover:bg-[#FF0000] hover:text-white data-active:bg-[#FF0000] data-active:text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

type TabsTriggerProps = TabsPrimitive.Tab.Props &
  VariantProps<typeof tabsTriggerVariants> & {
    count?: number; // shows "(0)" after the label
    maxLabelWidth?: string; // label truncates after this width, e.g. "120px"
  };

function TabsTrigger({
  className,
  variant = "default",
  count,
  maxLabelWidth = "140px",
  children,
  ...props
}: TabsTriggerProps) {
  const isPill = variant !== "default";
  // full text on hover when the label gets cut off
  const title = typeof children === "string" ? children : undefined;

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    >
      {isPill ? (
        <>
          <span
            title={title}
            className="truncate"
            style={{ maxWidth: maxLabelWidth }}
          >
            {children}
          </span>
          {count !== undefined && (
            <span className="shrink-0">({count})</span>
          )}
        </>
      ) : (
        children
      )}
    </TabsPrimitive.Tab>
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
};