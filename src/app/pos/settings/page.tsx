"use client";

import BrandSettings from "@/src/components/brand/ListBrand";
import CategorySettings from "@/src/components/category/ListCategory";
import CompanySettings from "@/src/components/company/ListCompany";
import CounterSettings from "@/src/components/counter/ListCounter";
import PrinterSettings from "@/src/components/printer/ListPrinter";
import PrivilegeSettings from "@/src/components/privilege/ListPrivilege";
import UnitSettings from "@/src/components/unit/ListUnit";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// One config for everything: label, header text and component per tab
const TABS = {
  company: {
    label: "Company",
    title: "Company Management",
    subtitle:
      "Select your industry and business type to configure the system according to your supermarket’s retail operations.",
    Component: CompanySettings,
  },
  category: {
    label: "Category",
    title: "Category Management",
    subtitle: "Manage product categories for your grocery store",
    Component: CategorySettings,
  },
  unit: {
    label: "Unit",
    title: "Unit",
    subtitle: "Create and manage units used for products and inventory.",
    Component: UnitSettings,
  },
  printer: {
    label: "Printer",
    title: "Printer Management",
    subtitle: "Configure receipt printers and assign them to counters.",
    Component: PrinterSettings,
  },
  counter: {
    label: "Counter",
    title: "Counter Management",
    subtitle: "Manage billing counters and choose your default counter.",
    Component: CounterSettings,
  },
  brand: {
    label: "Brand",
    title: "Brand Management",
    subtitle: "Organize and manage brands assigned to your products.",
    Component: BrandSettings,
  },
  privilege: {
    label: "Privilege",
    title: "Privilege Management",
    subtitle: "Manage user roles and permissions.",
    Component: PrivilegeSettings,
  },
} as const;

type TabKey = keyof typeof TABS;

const TAB_KEYS = Object.keys(TABS) as TabKey[];
const DEFAULT_TAB: TabKey = "company";

const isTabKey = (value: string | null): value is TabKey =>
  value !== null && value in TABS;

function SettingsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const param = searchParams.get("tab");
  const tab: TabKey = isTabKey(param) ? param : DEFAULT_TAB;
  const { title, subtitle, Component } = TABS[tab];

  const handleTabChange = (value: string) => {
    if (!isTabKey(value)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      {/* Title + tabs */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 lg:max-w-[360px]">
          <h1 className="font-poppins text-[18px] font-semibold leading-[100%] tracking-[0%] text-black">
            {title}
          </h1>
          <p className="mt-2 font-poppins text-[12px] font-normal leading-[150%] text-[#848484]">
            {subtitle}
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={handleTabChange}
          className="min-w-0 lg:flex-none"
        >
          <TabsList
            variant="pills"
            className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0 lg:justify-end"
          >
            {TAB_KEYS.map((key) => (
              <TabsTrigger key={key} variant="filter" value={key}>
                {TABS[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      <Component />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}