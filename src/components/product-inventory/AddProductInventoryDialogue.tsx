"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ImagePlus, Loader2, WandSparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";
import { ListProductByIdApi } from "@/src/api/product/api/getById";

import { useAddProduct } from "@/src/api/product/hooks/create.hook";
import { useEditProduct } from "@/src/api/product/hooks/update.hook";
import { ListCategoryApi } from "@/src/api/category/api/getAll";
import { ListBrandApi } from "@/src/api/brand/api/getAll";
import { ListUnitApi } from "@/src/api/unit/api/getAll";
import { ListSupplierApi } from "@/src/api/supplier/api/getAll";
import { ListBarcodeApi } from "@/src/api/product/api/getAllBarcode";
import { AddProductPayload } from "@/src/interfaces/product/create.type";

const CURRENCY = "AED";
const LOOKUP_PAGE = 1;
const LOOKUP_LIMIT = 100;

// image upload limits
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_MB = 5;
const MAX_IMAGE_SIDE = 800; // px, longest side after resize

const round = (n: number, digits = 2) => {
  const f = 10 ** digits;
  return Math.round((n + Number.EPSILON) * f) / f;
};

// Resizes the picked file and returns a compressed JPEG data URL (keeps the payload small)
const fileToCompressedDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas not supported"));
        return;
      }
      // white background so transparent PNGs don't turn black as JPEG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image"));
    };

    img.src = objectUrl;
  });0;
const requiredAmount = (label: string) =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? `${label} is required`
          : "Enter a valid number",
    })
    .min(0, `${label} cannot be negative`);
const optionalAmount = z.union([
  z.number().min(0, "Cannot be negative"),
  z.literal(""),
]);

// Required: productName, unitId, sellingPrice
const formSchema = z.object({
  // Step 1
  image: z.string().optional(),
  productName: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be at most 100 characters"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  unitId: z.string().min(1, "Unit is required"),
  supplierId: z.string().optional(),

  // Step 2
  purchasePrice: optionalAmount,
  sellingPrice: requiredAmount("Selling price"),
  vatRate: z.string(),

  // Step 3
  trackStock: z.boolean(),
  openingStock: optionalAmount,
  lowStockAlert: optionalAmount,
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type ProductFormData = z.infer<typeof formSchema>;

const EMPTY: ProductFormData = {
  image: "",
  productName: "",
  sku: "",
  barcode: "",
  categoryId: "",
  brandId: "",
  unitId: "",
  supplierId: "",
  purchasePrice: 0,
  sellingPrice:   0,
  vatRate: "0",
  trackStock: true,
  openingStock: 0,
  lowStockAlert: 10,
  description: "",
  isActive: true,
};

const VAT_OPTIONS = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
];

const STEPS = [
  {
    id: "basic",
    label: "Basic Info",
    short: "Basic",
    fields: [
      "image",
      "productName",
      "sku",
      "barcode",
      "categoryId",
      "brandId",
      "unitId",
      "supplierId",
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Tax",
    short: "Pricing",
    fields: ["purchasePrice", "sellingPrice", "vatRate"],
  },
  {
    id: "inventory",
    label: "Inventory Management",
    short: "Inventory",
    fields: ["trackStock", "openingStock", "lowStockAlert", "description", "isActive"],
  },
] as const;

const LAST_STEP = STEPS.length - 1;

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  productId?: string;
}

export function AddProductDialog({
  open,
  onOpenChange,
  isEdit = false,
  productId,
}: AddProductDialogProps) {
  const [step, setStep] = useState(0);

  // true when the barcode came from the API -> input is locked
  const [barcodeLocked, setBarcodeLocked] = useState(false);

  // image processing state + hidden file input
  const [imageLoading, setImageLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // search text for each lookup combobox
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Re-validate a field as soon as the user edits it, but only if it currently shows an error.
  // (With the default mode, errors raised by form.trigger() on "Next" would stay on screen
  // after the user fixed the value, because re-validation only starts after a real submit.)
  useEffect(() => {
    const sub = form.watch((_, { name }) => {
      if (name && form.getFieldState(name).error) {
        void form.trigger(name);
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // ---- lookups ----
  const { data: categoryData } = useQuery({
    queryKey: ["categoryList", categorySearch],
    queryFn: () =>
      ListCategoryApi({ page: LOOKUP_PAGE, limit: LOOKUP_LIMIT, search: categorySearch }),
    enabled: open,
  });
  const { data: brandData } = useQuery({
    queryKey: ["brandList", brandSearch],
    queryFn: () => ListBrandApi({ page: LOOKUP_PAGE, limit: LOOKUP_LIMIT, search: brandSearch }),
    enabled: open,
  });
  const { data: unitData } = useQuery({
    queryKey: ["unitList", unitSearch],
    queryFn: () => ListUnitApi({ page: LOOKUP_PAGE, limit: LOOKUP_LIMIT, search: unitSearch }),
    enabled: open,
  });
  const { data: supplierData } = useQuery({
    queryKey: ["supplierList", supplierSearch],
    queryFn: () =>
      ListSupplierApi({ page: LOOKUP_PAGE, limit: LOOKUP_LIMIT, search: supplierSearch }),
    enabled: open,
  });

  // ---- product for edit ----
  const { data: productData } = useQuery({
    queryKey: ["productById", productId],
    queryFn: () => ListProductByIdApi(String(productId)),
    enabled: open && isEdit && !!productId,
  });

  // ---- barcode generation (runs only when the button is clicked) ----
  const { mutate: generateBarcode, isPending: barcodePending } = useMutation({
    mutationFn: () => ListBarcodeApi({}),
    onSuccess: (res) => {
      const code = res?.data?.barcode;
      if (!code) {
        form.setError("barcode", { message: "Could not generate barcode" });
        return;
      }
      form.clearErrors("barcode");
      form.setValue("barcode", code, { shouldValidate: true, shouldDirty: true });
      setBarcodeLocked(true);
    },
    onError: () => {
      form.setError("barcode", { message: "Failed to generate barcode. Try again." });
    },
  });

  const clearBarcode = () => {
    form.setValue("barcode", "", { shouldDirty: true });
    form.clearErrors("barcode");
    setBarcodeLocked(false);
  };

  // ---- image upload ----
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allows picking the same file again after removing it
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      form.setError("image", { message: "Only JPG, PNG or WEBP images are allowed" });
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      form.setError("image", { message: `Image must be smaller than ${MAX_IMAGE_MB} MB` });
      return;
    }

    try {
      setImageLoading(true);
      const dataUrl = await fileToCompressedDataUrl(file);
      form.clearErrors("image");
      form.setValue("image", dataUrl, { shouldDirty: true });
    } catch {
      form.setError("image", { message: "Could not process this image. Try another one." });
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = () => {
    form.setValue("image", "", { shouldDirty: true });
    form.clearErrors("image");
  };

  const { mutate: AddProduct, isPending } = useAddProduct({ form, onOpenChange });
  const { mutate: EditProduct, isPending: EditPending } = useEditProduct({ form, onOpenChange });

  // Every time the dialog opens: back to step 1, wipe old values + errors + search text.
  // (Doing it on open, not on close, means it also works when the parent closes the dialog
  // after a successful save, and there is no empty-form flash during the close animation.)
  useEffect(() => {
    if (open) {
      setStep(0);
      setBarcodeLocked(false);
      setImageLoading(false);
      setCategorySearch("");
      setBrandSearch("");
      setUnitSearch("");
      setSupplierSearch("");
      form.reset(EMPTY); // reset also clears all errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // fill form when editing (getById returns populated objects for category/brand/supplier)
  useEffect(() => {
    if (open && isEdit && productData?.data) {
      const p = productData.data;
      form.reset({
        image: p.basicInfo.image ?? "",
        productName: p.basicInfo.name ?? "",
        sku: p.basicInfo.sku ?? "",
        barcode: p.basicInfo.barcode ?? "",
        categoryId: p.basicInfo.categoryId?._id ?? "",
        brandId: p.basicInfo.brandId?._id ?? "",
        unitId: p.basicInfo.unitId ?? "", // string in getById
        supplierId: p.basicInfo.supplierId?._id ?? "",
        purchasePrice: Number(p.pricingAndTax.purchasePrice || 0),
        sellingPrice: Number(p.pricingAndTax.sellingPrice ?? 0),
        vatRate: String(p.pricingAndTax.vatRate ?? 0),
        trackStock: p.inventoryManagement.enableStockTracking,
        openingStock: Number(p.inventoryManagement.openingStock ?? 0),
        lowStockAlert: Number(p.inventoryManagement.lowStockAlert ?? 0),
        description: p.inventoryManagement.description ?? "",
        isActive: p.isActive,
      });
      setBarcodeLocked(false); // saved barcode stays editable until user regenerates
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, productData]);

  // live values for the pricing summary
  const purchase = Number(form.watch("purchasePrice")) || 0;
  const selling = Number(form.watch("sellingPrice")) || 0;
  const vatRate = Number(form.watch("vatRate")) || 0;
  const vatAmount = (selling * vatRate) / 100;
  const marginPct = selling > 0 ? round(((selling - purchase) / selling) * 100, 1) : 0;

  const trackStock = form.watch("trackStock");
  const isActive = form.watch("isActive");
  const image = form.watch("image");
  const imageError = form.formState.errors.image?.message;

  // Go to a step. Going back is always allowed; going forward validates every step in between
  // and stops on the first step that has errors.
  const goToStep = async (target: number) => {
    if (target <= step) {
      setStep(target);
      return;
    }
    for (let i = step; i < target; i++) {
      const ok = await form.trigger([...STEPS[i].fields]);
      if (!ok) {
        setStep(i);
        return;
      }
    }
    setStep(target);
  };

  const goNext = () => goToStep(Math.min(step + 1, LAST_STEP));

  const handleInvalid = (errors: FieldErrors<ProductFormData>) => {
    const bad = STEPS.findIndex((s) =>
      s.fields.some((f) => errors[f as keyof ProductFormData]),
    );
    if (bad >= 0) setStep(bad);
  };

  const handleSubmit = (d: ProductFormData) => {
    const sell = Number(d.sellingPrice) || 0;
    const buy = Number(d.purchasePrice) || 0;
    const vat = Number(d.vatRate) || 0;
    const vatAmt = (sell * vat) / 100;

    const payload: AddProductPayload = {
      basicInfo: {
        name: d.productName.trim(),
        unitId: d.unitId,
        ...(d.image ? { image: d.image } : isEdit ? { image: "" } : {}),
        ...(d.sku?.trim() ? { sku: d.sku.trim() } : {}),
        ...(d.barcode?.trim() ? { barcode: d.barcode.trim() } : {}),
        ...(d.categoryId ? { categoryId: d.categoryId } : {}),
        ...(d.brandId ? { brandId: d.brandId } : {}),
        ...(d.supplierId ? { supplierId: d.supplierId } : {}),
      },
      pricingAndTax: {
        purchasePrice: buy,
        sellingPrice: sell,
        vatRate: vat,
        profitMargin: sell > 0 ? round(((sell - buy) / sell) * 100, 1) : 0,
        sellingPriceBeforeVat: sell,
        vatAmount: round(vatAmt),
        priceIncludingVat: round(sell + vatAmt),
      },
      inventoryManagement: {
        enableStockTracking: d.trackStock,
        openingStock: d.trackStock ? Number(d.openingStock) || 0 : 0,
        lowStockAlert: d.trackStock ? Number(d.lowStockAlert) || 0 : 0,
        description: (d.description ?? "").trim(),
      },
      isActive: d.isActive,
    };

    if (isEdit) EditProduct({ id: String(productId), value: payload });
    else AddProduct(payload);
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Enter on steps 1 and 2 moves forward instead of saving
    if (step < LAST_STEP) {
      void goNext();
      return;
    }
    void form.handleSubmit(handleSubmit, handleInvalid)(e);
  };

  // used by the X icon, Escape, overlay click and the Cancel button
  // (state/form reset happens in the "open" effect above)
  const handleDialogChange = (value: boolean) => {
    onOpenChange(value);
  };

  // ---- options ----
  const categoryOptions = (categoryData?.data || []).map((d) => ({
    value: d._id,
    label: `${d.code} - ${d.name}`,
  }));
  const brandOptions = (brandData?.data || []).map((d) => ({
    value: d._id,
    label: d.name,
  }));
  const unitOptions = (unitData?.data?.units || []).map((d) => ({
    value: d._id,
    label: d.name,
  }));
  const supplierOptions = (supplierData?.data || []).map((d) => ({
    value: d._id,
    label: d.name,
  }));

  // labels for the saved values in edit mode (the selected item may not be in the search results)
  const basic = productData?.data?.basicInfo;
  const categoryLabel =
    isEdit && basic?.categoryId ? `${basic.categoryId.code} - ${basic.categoryId.name}` : undefined;
  const brandLabel = isEdit && basic?.brandId ? basic.brandId.name : undefined;
  const supplierLabel = isEdit && basic?.supplierId ? basic.supplierId.name : undefined;
  // unitId is only a string in getById, so take the label from the loaded unit list
  const unitLabel = unitOptions.find((o) => o.value === form.watch("unitId"))?.label;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-[760px] flex-col gap-0 overflow-hidden rounded-[16px] border-0 bg-[#EFEFEF] p-0 font-poppins sm:max-h-[90dvh] sm:w-[calc(100%-2rem)] sm:max-w-[760px] sm:rounded-[20px]"
      >
        <DialogTitle className="sr-only">
          {isEdit ? "Edit Product" : "Add New Product To Inventory"}
        </DialogTitle>

        {/* HEADER: step tabs + close icon sit on ONE row, so they can never overlap */}
        <div className="shrink-0 border-b border-[#D5D5D5] bg-[#EFEFEF] px-3 pb-3 pt-3 sm:px-6 sm:pb-4 sm:pt-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              role="tablist"
              aria-label="Product form steps"
              className="grid min-w-0 flex-1 grid-cols-3 gap-1.5 sm:gap-3"
            >
              {STEPS.map((s, i) => {
                const active = i === step;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => void goToStep(i)}
                    className={`flex min-h-9 min-w-0 items-center justify-center rounded-full px-1.5 py-1.5 text-center text-[10px] font-semibold uppercase leading-tight transition-colors sm:min-h-11 sm:px-4 sm:py-2 sm:text-[13px] ${
                      active
                        ? "bg-[#B726B7] text-white"
                        : "bg-[#A9A9A9] text-white hover:bg-[#9a9a9a]"
                    }`}
                  >
                    {/* short label on phones, full label from sm up */}
                    <span className="truncate sm:hidden">{s.short}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>

            <DialogClose
              aria-label="Close"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6b6b6b] transition-colors hover:bg-[#DEDEDE] hover:text-black sm:size-9"
            >
              <X className="size-4 sm:size-5" />
            </DialogClose>
          </div>
        </div>

        <Form {...form}>
          {/* form = scrollable body + fixed footer, so the buttons are always visible */}
          <form
            onSubmit={onFormSubmit}
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6">
              <div className="flex flex-col gap-4">
                {/* STEP 1: BASIC INFO */}
                {step === 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Product image upload */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <span className="text-[13px] font-medium text-black">Product Image</span>

                      <div className="flex items-center gap-3 sm:gap-4">
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          className="hidden"
                          onChange={handleImageChange}
                        />

                        {image ? (
                          <div className="relative size-24 shrink-0 overflow-hidden rounded-[12px] border border-[#C4C4C4] bg-white sm:size-28">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt="Product preview"
                              className="size-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              aria-label="Remove image"
                              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            disabled={imageLoading}
                            className="flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] border-2 border-dashed border-[#B0B0B0] bg-[#DEDEDE] text-[11px] text-[#6b6b6b] transition-colors hover:border-[#B726B7] hover:text-[#B726B7] disabled:cursor-not-allowed disabled:opacity-60 sm:size-28"
                          >
                            {imageLoading ? (
                              <Loader2 className="size-6 animate-spin" />
                            ) : (
                              <ImagePlus className="size-6" />
                            )}
                            {imageLoading ? "Processing..." : "Upload"}
                          </button>
                        )}

                        <div className="flex min-w-0 flex-col gap-1 text-[12px] text-[#6b6b6b]">
                          {image && (
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              disabled={imageLoading}
                              className="w-fit text-[13px] font-medium text-primary hover:underline disabled:opacity-60"
                            >
                              {imageLoading ? "Processing..." : "Change image"}
                            </button>
                          )}
                          <span>JPG, PNG or WEBP, up to {MAX_IMAGE_MB} MB.</span>
                        </div>
                      </div>

                      {imageError && <p className="text-[12px] text-red-600">{imageError}</p>}
                    </div>

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
                      label="SKU / Item Code"
                      name="sku"
                      placeholder="PRD-001"
                      value={form.watch("sku")}
                    />

                    {/* Barcode: generated from API, locked once generated */}
                    <div className="relative">
                      {barcodeLocked ? (
                        <button
                          type="button"
                          onClick={clearBarcode}
                          className="absolute right-0 top-0 z-10 flex items-center gap-1 text-[12px] text-red-600 hover:underline"
                        >
                          <X className="size-3.5" />
                          Clear
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => generateBarcode()}
                          disabled={barcodePending}
                          className="absolute right-0 top-0 z-10 flex items-center gap-1 text-[12px] text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {barcodePending ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <WandSparkles className="size-3.5" />
                          )}
                          {barcodePending ? "Generating..." : "Auto generate"}
                        </button>
                      )}
                      <FormInput
                        type="text"
                        label="Barcode"
                        name="barcode"
                        placeholder="Scan or enter"
                        value={form.watch("barcode")}
                        disabled={barcodeLocked}
                      />
                    </div>

                    <FormCombobox
                      label="Category"
                      name="categoryId"
                      placeholder="Select Category"
                      options={categoryOptions}
                      value={form.watch("categoryId")}
                      onChange={(val) => form.setValue("categoryId", val)}
                      valueLabel={categoryLabel}
                      setSearch={setCategorySearch}
                    />
                    <FormCombobox
                      label="Brand"
                      name="brandId"
                      placeholder="Select Brand"
                      options={brandOptions}
                      value={form.watch("brandId")}
                      onChange={(val) => form.setValue("brandId", val)}
                      valueLabel={brandLabel}
                      setSearch={setBrandSearch}
                    />
                    <FormCombobox
                      label="Unit"
                      name="unitId"
                      placeholder="Select Unit"
                      required
                      options={unitOptions}
                      value={form.watch("unitId")}
                      onChange={(val) => form.setValue("unitId", val, { shouldValidate: true })}
                      valueLabel={unitLabel}
                      setSearch={setUnitSearch}
                    />
                    <FormCombobox
                      label="Supplier"
                      name="supplierId"
                      placeholder="Select Supplier"
                      options={supplierOptions}
                      value={form.watch("supplierId")}
                      onChange={(val) => form.setValue("supplierId", val)}
                      valueLabel={supplierLabel}
                      setSearch={setSupplierSearch}
                    />
                  </div>
                )}

                {/* STEP 2: PRICING & TAX */}
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
                        value={form.watch("vatRate")}
                        onChange={(val) => form.setValue("vatRate", val)}
                        valueLabel={
                          VAT_OPTIONS.find((o) => o.value === form.watch("vatRate"))?.label
                        }
                      />
                      <div className="flex flex-col justify-end gap-1 sm:pb-2">
                        <span className="text-[13px] font-medium text-black">Profit Margin</span>
                        <span
                          className={`text-[14px] font-semibold ${
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
                        <dd className="shrink-0 font-semibold text-black">
                          {CURRENCY} {selling.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[#6b6b6b]">
                        <dt>VAT ({vatRate}%)</dt>
                        <dd className="shrink-0 font-semibold text-black">
                          {CURRENCY} {vatAmount.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-3 font-semibold text-black">
                        <dt>Price including VAT</dt>
                        <dd className="shrink-0">
                          {CURRENCY} {(selling + vatAmount).toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </>
                )}

                {/* STEP 3: INVENTORY */}
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
              </div>
            </div>

            {/* FOOTER: fixed at the bottom, outside the scroll area */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#D5D5D5] bg-[#EFEFEF] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:flex-row sm:justify-end sm:px-6 sm:pb-4">
              <Button
                type="button"
                variant="cancel"
                className="w-full sm:w-auto"
                onClick={() => handleDialogChange(false)}
              >
                Cancel
              </Button>

              {step < LAST_STEP ? (
                <Button
                  type="button"
                  variant="save"
                  className="w-full sm:w-auto"
                  onClick={() => void goNext()}
                >
                  Next
                </Button>
              ) : (
                <LoadingButton
                  type="submit"
                  variant="save"
                  className="w-full sm:w-auto"
                  loading={isEdit ? EditPending : isPending}
                  disabled={imageLoading}
                >
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