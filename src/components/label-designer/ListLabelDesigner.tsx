"use client";

import PageHeader from "@/src/components/common/PageHeader";
import { ChevronDown, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import barcodeIcon from "../../../public/icons/labeldesigner.png"; // change to your barcode icon
import barcodeImage from "../../../public/images/barcode.png"; // the imported barcode image (195x45)
import BarcodeLabel from "./BarcodeLabel";


type Product = {
  id: string;
  name: string;
  barcode: string;
  price: number;
};

const STORE_NAME = "Green Grocery & Supermarket"; 

// Dummy data (replace with API data later)
const PRODUCTS: Product[] = [
  { id: "1", name: "Fortune Sunlight Sunflower Oil 1L", barcode: "2345678934567886558823456", price: 0 },
  { id: "2", name: "Aashirvaad Atta 5kg", barcode: "8901725181222", price: 285 },
  { id: "3", name: "Tata Tea Gold 250g", barcode: "8901052002333", price: 140 },
  { id: "4", name: "Amul Butter 500g", barcode: "8901262150149", price: 285 },
];

const SHEET_OPTIONS = [2, 6, 12, 24, 36];

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2 font-poppins">
      <span className="text-[12px] text-[#585858]">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[40px] w-full appearance-none truncate rounded-[10px] bg-[#E1E1E1] px-4 pr-10 text-[13px] text-[#585858] outline-none focus:ring-1 focus:ring-[#F24DEB]"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#585858]" />
      </span>
    </label>
  );
}

function BarcodeLabelPage() {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [copies, setCopies] = useState(12);

  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];
  const stickers = useMemo(() => Array.from({ length: copies }, (_, i) => i), [copies]);

  const productOptions = PRODUCTS.map((p) => ({
    value: p.id,
    label: `${p.name} (Barcode: ${p.barcode.slice(0, 4)}....)`,
  }));
  const copyOptions = SHEET_OPTIONS.map((n) => ({
    value: String(n),
    label: `${n} Stickers Per Sheet`,
  }));

  const labelProps = {
    storeName: STORE_NAME,
    productName: product.name,
    barcode: product.barcode,
    price: product.price,
    barcodeImage,
  };

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      {/* Print only the sticker sheet */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #sticker-print, #sticker-print * { visibility: visible; }
          #sticker-print { position: absolute; left: 0; top: 0; }
        }
      `}</style>

      <PageHeader
        title="Barcode Sticker Label Generator"
        subtitle="Generate and print barcode stickers for shop items without pre-printed barcode labels."
        icon={barcodeIcon}
        actions={[
          {
            label: "Print Sticker Sheet",
            icon: <Printer />,
            variant: "create",
            onClick: () => window.print(),
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Left: configuration + live single preview */}
        <section className="flex flex-col gap-4 rounded-[10px] bg-[#EFEFEF] p-4 sm:p-6">
          <h2 className="border-b border-[#BFBFBF] pb-3 font-poppins text-[16px] font-semibold text-black">
            Label Configuration
          </h2>

          <SelectField
            label="Select product from local inventory"
            value={productId}
            onChange={setProductId}
            options={productOptions}
          />

          <SelectField
            label="Number of label copies to print"
            value={String(copies)}
            onChange={(v) => setCopies(Number(v))}
            options={copyOptions}
          />

          <div className="flex flex-col items-center gap-3 rounded-[10px] border border-[#A8A8A8] bg-[#D2D2D2] px-4 py-5">
            <p className="font-poppins text-[14px] font-medium uppercase text-[#585858]">
              Live Single Preview
            </p>
            <BarcodeLabel {...labelProps} />
          </div>
        </section>

        {/* Right: sheet preview */}
        <section className="flex min-w-0 flex-col gap-4 rounded-[10px] bg-[#EFEFEF] p-4 sm:p-6">
          <h2 className="border-b border-[#BFBFBF] pb-3 font-poppins text-[16px] font-semibold text-black">
            Sheet Preview
          </h2>

          {/* Scrolls when many stickers (e.g. 24 / 36) are selected */}
          <div className="max-h-[520px] overflow-y-auto rounded-[10px] border border-[#A8A8A8] bg-[#D2D2D2] p-3">
            {/* zoom scales the real-size labels down so 3 fit per row */}
            <div
              className="grid justify-center gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, 234px)", zoom: 0.75 }}
            >
              {stickers.map((i) => (
                <BarcodeLabel key={i} {...labelProps} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Real-size sheet used only when printing */}
      <div
        id="sticker-print"
        className="hidden w-fit grid-cols-3 gap-2 bg-white p-4 print:grid"
      >
        {stickers.map((i) => (
          <BarcodeLabel key={i} {...labelProps} className="border border-dashed border-[#BFBFBF]" />
        ))}
      </div>
    </div>
  );
}

export default BarcodeLabelPage;