"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";

const CURRENCY = "AED";

const isNumber = (v: string) => !isNaN(Number(v)) && Number(v) >= 0;

const requiredAmount = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine(isNumber, "Enter a valid number");

const optionalAmount = z
  .string()
  .refine((v) => v === "" || isNumber(v), "Enter a valid number");

const formSchema = z.object({
  // Step 1 - Basic info
  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be at most 100 characters"),
  productNameAr: z.string().optional(),
  sku: z.string().min(1, "SKU / Item code is required"),
  barcode: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  unitType: z.string().min(1, "Unit is required"),
  supplierName: z.string().optional(),

  // Step 2 - Pricing & tax
  purchasePrice: optionalAmount,
  sellingPrice: requiredAmount("Selling price"),
  vatRate: z.string(),

  // Step 3 - Inventory
  trackStock: z.boolean(),
  openingStock: optionalAmount,
  lowStockAlert: optionalAmount,
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type ProductFormData = z.infer<typeof formSchema>;

const EMPTY: ProductFormData = {
  productName: "",
  productNameAr: "",
  sku: "",
  barcode: "",
  category: "",
  brand: "",
  unitType: "Pcs",
  supplierName: "",
  purchasePrice: "0",
  sellingPrice: "0",
  vatRate: "0",
  trackStock: true,
  openingStock: "0",
  lowStockAlert: "10",
  description: "",
  isActive: true,
};

const CATEGORY_OPTIONS = [
  { value: "Oil & Ghee", label: "Oil & Ghee" },
  { value: "Grains & Atta", label: "Grains & Atta" },
  { value: "Spices & Salt", label: "Spices & Salt" },
  { value: "Rice & Pulses", label: "Rice & Pulses" },
  { value: "Beverages", label: "Beverages" },
  { value: "Diary & Bakers", label: "Diary & Bakers" },
  { value: "Households", label: "Households" },
];

const UNIT_OPTIONS = [
  { value: "Pcs", label: "Pieces (pcs)" },
  { value: "Pac", label: "Packet (pac)" },
  { value: "Bag", label: "Bag" },
  { value: "Kg", label: "Kilogram (kg)" },
  { value: "Ltr", label: "Litre (ltr)" },
];

const VAT_OPTIONS = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
];

// Steps, and which fields belong to each (used for per-step validation)
const STEPS = [
  {
    id: "basic",
    label: "Basic Info",
    fields: [
      "productName",
      "productNameAr",
      "sku",
      "barcode",
      "category",
      "brand",
      "unitType",
      "supplierName",
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Tax",
    fields: ["purchasePrice", "sellingPrice", "vatRate"],
  },
  {
    id: "inventory",
    label: "Inventory Management",
    fields: [
      "trackStock",
      "openingStock",
      "lowStockAlert",
      "description",
      "isActive",
    ],
  },
] as const;

const LAST_STEP = STEPS.length - 1;

const money = (n: number) => `${CURRENCY} ${n.toFixed(2)}`;

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  productId?: string;
  product?: ProductFormData;
}

export function AddProductDialog({
  open,
  onOpenChange,
  isEdit = false,
  product,
}: AddProductDialogProps) {
  const [step, setStep] = useState(0);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Fill (edit) or clear (add) the form, and go back to step 1, each time the dialog opens
  useEffect(() => {
    if (open) {
      form.reset(isEdit && product ? product : EMPTY);
      setStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // live values for the pricing summary
  const purchase = Number(form.watch("purchasePrice")) || 0;
  const selling = Number(form.watch("sellingPrice")) || 0;
  const vatRate = Number(form.watch("vatRate")) || 0;
  const vatAmount = (selling * vatRate) / 100;
  const marginPct =
    selling > 0 ? Math.round(((selling - purchase) / selling) * 1000) / 10 : 0;

  const trackStock = form.watch("trackStock");
  const isActive = form.watch("isActive");

  const goNext = async () => {
    const ok = await form.trigger([...STEPS[step].fields]);
    if (ok) setStep((s) => Math.min(s + 1, LAST_STEP));
  };

  // if Save is pressed and a field on an earlier step is invalid, jump to that step
  const handleInvalid = (errors: FieldErrors<ProductFormData>) => {
    const bad = STEPS.findIndex((s) =>
      s.fields.some((f) => errors[f as keyof ProductFormData]),
    );
    if (bad >= 0) setStep(bad);
  };

  const generateBarcode = () =>
    form.setValue("barcode", String(Math.floor(1e11 + Math.random() * 9e11)), {
      shouldValidate: true,
      shouldDirty: true,
    });

  const handleSubmit = (data: ProductFormData) => {
    // TODO: call your add / edit product API here
    console.log(isEdit ? "update product" : "add product", data);
    onOpenChange(false);
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Enter key on steps 1 and 2 moves forward instead of saving
    if (step < LAST_STEP) {
      void goNext();
      return;
    }
    void form.handleSubmit(handleSubmit, handleInvalid)(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-[760px] gap-0 sm:max-w-[760px] overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-3 font-poppins sm:p-6"
      >
        <DialogTitle className="sr-only">
          {isEdit ? "Edit Product" : "Add New Product To Inventory"}
        </DialogTitle>

        {/* Step tabs - always one row, text shrinks on small screens */}
        <div
          role="tablist"
          aria-label="Product form steps"
          className="grid grid-cols-3 gap-1.5 border-b border-[#D5D5D5] pb-3 pr-6 sm:gap-3 sm:pr-0"
        >
          {STEPS.map((s, i) => {
            const active = i === step;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  // going back is always allowed; going forward needs the current step to be valid
                  if (i <= step) setStep(i);
                  else void goNext();
                }}
                className={`flex min-h-10 items-center justify-center rounded-full px-1.5 py-2 text-center text-[10px] font-semibold uppercase leading-tight transition-colors sm:min-h-12 sm:px-4 sm:text-[13px] ${
                  active
                    ? "bg-[#B726B7] text-white"
                    : "bg-[#A9A9A9] text-white hover:bg-[#9a9a9a]"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <Form {...form}>
          <form onSubmit={onFormSubmit} className="mt-4 flex flex-col gap-4" noValidate>
            {/* ---------- STEP 1: BASIC INFO ---------- */}
            {step === 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  type="text"
                  label="Product Name"
                  name="productName"
                  placeholder="eg. Fortune Sunflower Oil 1L"
                  value={form.watch("productName")}
                  required
                />
                <FormInput
                  type="text"
                  label="Product Name (Arabic)"
                  name="productNameAr"
                  placeholder="eg. Fortune Sunflower Oil 1L"
                  value={form.watch("productNameAr")}
                />
                <FormInput
                  type="text"
                  label="SKU / Item Code"
                  name="sku"
                  placeholder="PRD-001"
                  value={form.watch("sku")}
                  required
                />
                {/* "Auto generate" sits on the label row, top right of the barcode field */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={generateBarcode}
                    className="absolute right-0 top-0 z-10 flex items-center gap-1 text-[12px] text-primary hover:underline"
                  >
                    <WandSparkles className="size-3.5" />
                    Auto generate
                  </button>
                  <FormInput
                    type="text"
                    label="Barcode"
                    name="barcode"
                    placeholder="Scan or enter"
                    value={form.watch("barcode")}
                  />
                </div>
                <FormCombobox
                  label="Category"
                  name="category"
                  placeholder="Select Category"
                  options={CATEGORY_OPTIONS}
                  required
                />
                <FormInput
                  type="text"
                  label="Brand"
                  name="brand"
                  placeholder="Brand name"
                  value={form.watch("brand")}
                />
                <FormCombobox
                  label="Unit"
                  name="unitType"
                  placeholder="Select (pcs)"
                  options={UNIT_OPTIONS}
                />
                <FormInput
                  type="text"
                  label="Supplier"
                  name="supplierName"
                  placeholder="Supplier name"
                  value={form.watch("supplierName")}
                />
              </div>
            )}

            {/* ---------- STEP 2: PRICING & TAX ---------- */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    type="number"
                    label={`Purchase Price (${CURRENCY})`}
                    name="purchasePrice"
                    placeholder="0"
                    value={form.watch("purchasePrice")}
                  />
                  <FormInput
                    type="number"
                    label={`Selling Price (${CURRENCY})`}
                    name="sellingPrice"
                    placeholder="0"
                    value={form.watch("sellingPrice")}
                    required
                  />
                  <FormCombobox
                    label="VAT Rate"
                    name="vatRate"
                    placeholder="Select VAT"
                    options={VAT_OPTIONS}
                  />
                  <div className="flex flex-col justify-end gap-1 sm:pb-2">
                    <span className="text-[13px] font-medium text-black">
                      {marginPct}% Profit Margin
                    </span>
                    <span
                      className={`text-[14px] font-semibold sm:pl-6 ${
                        marginPct >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {marginPct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <dl className="flex flex-col gap-2 text-[13px] sm:text-[14px]">
                  <div className="flex items-center justify-between gap-3 text-[#6b6b6b]">
                    <dt>Selling price (before VAT)</dt>
                    <dd className="font-semibold text-black">{money(selling)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[#6b6b6b]">
                    <dt>VAT ({vatRate}%)</dt>
                    <dd className="font-semibold text-black">{money(vatAmount)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 font-semibold text-black">
                    <dt>Price including VAT</dt>
                    <dd>{money(selling + vatAmount)}</dd>
                  </div>
                </dl>
              </>
            )}

            {/* ---------- STEP 3: INVENTORY ---------- */}
            {step === 2 && (
              <>
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-black sm:text-[14px]">
                  <input
                    type="checkbox"
                    className="size-4 accent-[#B726B7]"
                    checked={trackStock}
                    onChange={(e) => form.setValue("trackStock", e.target.checked)}
                  />
                  Enable stock tracking
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    type="number"
                    label="Opening Stock"
                    name="openingStock"
                    placeholder="0"
                    value={form.watch("openingStock")}
                    disabled={!trackStock}
                  />
                  <FormInput
                    type="number"
                    label="Low Stock Alert"
                    name="lowStockAlert"
                    placeholder="10"
                    value={form.watch("lowStockAlert")}
                    disabled={!trackStock}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="product-description"
                    className="text-[13px] font-medium text-black"
                  >
                    Product Description
                  </label>
                  <textarea
                    id="product-description"
                    rows={4}
                    placeholder="Enter product details, specification, or compatibility..."
                    className="w-full resize-none rounded-[8px] border border-[#C4C4C4] bg-[#DEDEDE] px-3 py-2.5 text-[13px] text-black outline-none placeholder:text-[#8d8d8d] focus-visible:ring-2 focus-visible:ring-[#B726B7]/50"
                    {...form.register("description")}
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-black sm:text-[14px]">
                  <input
                    type="checkbox"
                    className="size-4 accent-[#B726B7]"
                    checked={isActive}
                    onChange={(e) => form.setValue("isActive", e.target.checked)}
                  />
                  Active product (available for billing)
                </label>
              </>
            )}

            {/* ---------- FOOTER ---------- */}
            <div className="mt-1 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-2">
              <Button
                type="button"
                variant="cancel"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              {step < LAST_STEP ? (
                <Button
                  type="button"
                  variant="save"
                  className="w-full sm:w-auto"
                  onClick={goNext}
                >
                  Next
                </Button>
              ) : (
                <LoadingButton type="submit" variant="save" className="w-full sm:w-auto">
                  {isEdit ? "Update Product" : "Save Product"}
                </LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}