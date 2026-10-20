"use client";

import BrandSettings from "@/src/components/brand/ListBrand";
import CategorySettings from "@/src/components/category/ListCategory";
import CompanySettings from "@/src/components/company/ListCompany";
import CounterSettings from "@/src/components/counter/ListCounter";
import PrinterSettings from "@/src/components/printer/ListPrinter";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import UnitSettings from "@/src/components/unit/ListUnit";
import { useState } from "react";


const SETTINGS_TABS = [
  "Company",
  "Category",
  "Unit",
  "Printer",
  "Counter",
  "Brand",
] as const;
type SettingsTab = (typeof SETTINGS_TABS)[number];

const HEADERS: Record<SettingsTab, { title: string; subtitle: string }> = {
  Company: {
    title: "Company Management",
    subtitle:
      "Select your industry and business type to configure the system according to your supermarket’s retail operations.",
  },
  Category: {
    title: "Category Management",
    subtitle: "Manage product categories for your grocery store",
  },
  Unit: { title: "Unit", subtitle: "Create and manage units used for products and inventory." },
  Printer: {
    title: "Printer Management",
    subtitle: "Configure receipt printers and assign them to counters.",
  },
  Counter: {
    title: "Counter Management",
    subtitle: "Manage billing counters and choose your default counter.",
  },
  Brand: { title: "Brand Management", subtitle: "Organize and manage brands assigned to your products." },
};

function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("Company");
  const { title, subtitle } = HEADERS[tab];

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
          onValueChange={(v) => setTab(v as SettingsTab)}
          className="min-w-0 lg:flex-none"
        >
          <TabsList
            variant="pills"
            className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0 lg:justify-end"
          >
            {SETTINGS_TABS.map((t) => (
              <TabsTrigger key={t} variant="filter" value={t}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {tab === "Company" && <CompanySettings />}
      {tab === "Category" && <CategorySettings />}
      {tab === "Unit" && <UnitSettings />}
      {tab === "Printer" && <PrinterSettings />}
      {tab === "Counter" && <CounterSettings />}
      {tab === "Brand" && <BrandSettings />}
    </div>
  );
}

export default SettingsPage;