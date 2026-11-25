"use client";

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";
import ProductBarcodeField from "./ProductBarcodeField";

import { ListProductByIdApi } from "@/src/api/product/api/getById";
import { useAddProduct } from "@/src/api/product/hooks/create.hook";
import { useEditProduct } from "@/src/api/product/hooks/update.hook";
import { ListCategoryApi } from "@/src/api/category/api/getAll";
import { ListSubCategoryApi } from "@/src/api/sub-category/api/getAll";
import { ListBrandApi } from "@/src/api/brand/api/getAll";
import { ListUnitApi } from "@/src/api/unit/api/getAll";
import { ListSupplierApi } from "@/src/api/supplier/api/getAll";
import { AddProductPayload } from "@/src/interfaces/product/create.type";
import ProductImageUpload from "./ProductImageField";

const CURRENCY = "AED";
const LOOKUP_PAGE = 1;
const LOOKUP_LIMIT = 100;

const EXPIRY_ALERT_OPTIONS = ["7 Days", "15 Days", "30 Days", "60 Days", "90 Days"];
const WARRANTY_OPTIONS = ["No Warranty", "3 Months", "6 Months", "1 Year", "2 Years"];
const RETURN_OPTIONS = ["No Return", "3 Days", "7 Days", "14 Days", "30 Days"];
const toOptions = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

const round = (n: number, digits = 2) => {
  const f = 10 ** digits;
  return Math.round((n + Number.EPSILON) * f) / f;
};
const num = (v: unknown) => Number(v) || 0;

const withCode = (x?: { code?: string; name?: string } | null) =>
  x ? `${x.code ? x.code + " - " : ""}${x.name ?? ""}` : undefined;

const optionalAmount = z.union([z.number().min(0, "Cannot be negative"), z.literal("")]);

const batchSchema = z.object({
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  batchQty: optionalAmount,
});

// Required: productName only
const formSchema = z.object({
  // Basic
  image: z.string().optional(),
  barcode: z.string().optional(),
  productName: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be at most 100 characters"),
  aliasName: z.string().optional(),
  sku: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
unitId: z.string().min(1, "Base unit is required"),
  supplierId: z.string().optional(),
  description: z.string().optional(),

  // Pricing
  purchasePrice: optionalAmount,
  sellingPrice: optionalAmount,
  vatRate: optionalAmount,
  mrp: optionalAmount,

  // Inventory
  trackStock: z.boolean(),
  openingStock: optionalAmount,
  lowStockAlert: optionalAmount,
  reorderQuantity: optionalAmount,
  allowSellingWhenOutOfStock: z.boolean(),

  // Expiry
  enableExpiry: z.boolean(),
  batches: z.array(batchSchema),
  expiryAlertBefore: z.string(),
  blockExpiredSales: z.boolean(),

  // Advanced
  serialNumber: z.string().optional(),
  warrantyPeriod: z.string(),
  returnPeriod: z.string(),
  isActive: z.boolean(),
  availableAtPos: z.boolean(),
  internalNotes: z.string().optional(),
});

export type ProductFormData = z.infer<typeof formSchema>;

const emptyBatch = () => ({ batchNumber: "", expiryDate: "", batchQty: 10 as number | "" });

const makeEmpty = (): ProductFormData => ({
  image: "",
  barcode: "",
  productName: "",
  aliasName: "",
  sku: "",
  brandId: "",
  categoryId: "",
  subCategoryId: "",
  unitId: "",
  supplierId: "",
  description: "",
  purchasePrice: 0,
  sellingPrice: 0,
  vatRate: 0,
  mrp: 0,
  trackStock: true,
  openingStock: 0,
  lowStockAlert: 10,
  reorderQuantity: 0,
  allowSellingWhenOutOfStock: false,
  enableExpiry: false,
  batches: [emptyBatch()],
  expiryAlertBefore: "15 Days",
  blockExpiredSales: false,
  serialNumber: "",
  warrantyPeriod: "No Warranty",
  returnPeriod: "7 Days",
  isActive: true,
  availableAtPos: true,
  internalNotes: "",
});

const STEPS = [
  {
    id: "basic",
    label: "Basic Info",
    fields: [
      "image", "barcode", "productName", "aliasName", "sku", "brandId",
      "categoryId", "subCategoryId", "unitId", "supplierId", "description",
    ],
  },
  { id: "pricing", label: "Pricing", fields: ["purchasePrice", "sellingPrice", "vatRate", "mrp"] },
  {
    id: "inventory",
    label: "Inventory",
    fields: ["trackStock", "openingStock", "lowStockAlert", "reorderQuantity", "allowSellingWhenOutOfStock"],
  },
  { id: "expiry", label: "Expiry", fields: ["enableExpiry", "batches", "expiryAlertBefore", "blockExpiredSales"] },
  {
    id: "advanced",
    label: "Advanced",
    fields: ["serialNumber", "warrantyPeriod", "returnPeriod", "isActive", "availableAtPos", "internalNotes"],
  },
] as const;

const LAST_STEP = STEPS.length - 1;

const nativeInputCls =
  "h-10 w-full rounded-[8px] border border-[#C4C4C4] bg-[#DEDEDE] px-3 text-[13px] text-black outline-none placeholder:text-[#8d8d8d] focus-visible:ring-2 focus-visible:ring-[#B726B7]/50 disabled:opacity-60";

const textareaCls =
  "w-full resize-none rounded-[8px] border border-[#C4C4C4] bg-[#DEDEDE] px-3 py-2.5 text-[13px] text-black outline-none placeholder:text-[#8d8d8d] focus-visible:ring-2 focus-visible:ring-[#B726B7]/50";

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2 text-[13px] text-black sm:text-[14px]">
      <input
        type="checkbox"
        className="size-4 shrink-0 accent-[#B726B7]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  productId?: string;
}

export function AddProductDialog({ open, onOpenChange, isEdit = false, productId }: AddProductDialogProps) {
  const [step, setStep] = useState(0);
  const [barcodeLocked, setBarcodeLocked] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: makeEmpty(),
  });

  const { fields: batchFields, append, remove } = useFieldArray({
    control: form.control,
    name: "batches",
  });

  // re-validate a field live, only if it currently shows an error
  useEffect(() => {
    const sub = form.watch((_, { name }) => {
      if (name && form.getFieldState(name).error) void form.trigger(name);
    });
    return () => sub.unsubscribe();
  }, [form]);

  const selectedCategoryId = form.watch("categoryId");

  // ---- lookups ----
  const { data: categoryData } = useQuery({
    queryKey: ["categoryList", categorySearch],
    queryFn: () => ListCategoryApi({ page: LOOKUP_PAGE, limit: LOOKUP_LIMIT, search: categorySearch }),
    enabled: open,
  });
  const { data: subCategoryData } = useQuery({
    queryKey: ["subCategoryList", "dropdown", selectedCategoryId, subCategorySearch],
    queryFn: () =>
      ListSubCategoryApi({
        page: LOOKUP_PAGE,
        limit: LOOKUP_LIMIT,
        search: subCategorySearch,
   categoryId:selectedCategoryId,     
      }),
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
    queryFn: () => ListSupplierApi({ page: LOOKUP_PAGE, limit: LOOKUP_LIMIT, search: supplierSearch }),
    enabled: open,
  });

  // ---- product for edit ----
  const { data: productData } = useQuery({
    queryKey: ["productById", productId],
    queryFn: () => ListProductByIdApi(String(productId)),
    enabled: open && isEdit && !!productId,
  });

  const { mutate: AddProduct, isPending } = useAddProduct({ form, onOpenChange });
  const { mutate: EditProduct, isPending: EditPending } = useEditProduct({ form, onOpenChange });

  // every time the dialog opens: fresh form, step 1
  useEffect(() => {
    if (open) {
      setStep(0);
      setBarcodeLocked(false);
      setImageLoading(false);
      setCategorySearch("");
      setSubCategorySearch("");
      setBrandSearch("");
      setUnitSearch("");
      setSupplierSearch("");
      form.reset(makeEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // fill form when editing
  useEffect(() => {
    if (open && isEdit && productData?.data) {
      const p = productData.data;
      const b = p.basicInfo;
      const idOf = (v: any) => (typeof v === "string" ? v : v?._id ?? "");
      const e = p.expiryTracking;
      form.reset({
        image: b.image ?? "",
        barcode: b.barcode ?? "",
        productName: b.name ?? "",
        aliasName: b.aliasName ?? "",
        sku: b.sku ?? "",
        brandId: idOf(b.brandId),
        categoryId: idOf(b.categoryId),
        subCategoryId: idOf(b.subCategoryId),
        unitId: idOf(b.unitId),
        supplierId: idOf(b.supplierId),
        description: b.description ?? "",
        purchasePrice: num(p.pricingAndTax?.purchasePrice),
        sellingPrice: num(p.pricingAndTax?.sellingPrice),
        vatRate: num(p.pricingAndTax?.vatRate),
        mrp: num(p.pricingAndTax?.mrp),
        trackStock: p.inventoryManagement?.enableStockTracking ?? true,
        openingStock: num(p.inventoryManagement?.openingStock),
        lowStockAlert: num(p.inventoryManagement?.lowStockAlert),
        reorderQuantity: num(p.inventoryManagement?.reorderQuantity),
        allowSellingWhenOutOfStock: p.inventoryManagement?.allowSellingWhenOutOfStock ?? false,
        enableExpiry: e?.enableExpiryTracking ?? false,
        batches: e?.batches?.length
          ? e.batches.map((x) => ({
              batchNumber: x.batchNumber ?? "",
              expiryDate: x.expiryDate ? String(x.expiryDate).slice(0, 10) : "",
              batchQty: num(x.batchQty),
            }))
          : [emptyBatch()],
        expiryAlertBefore: e?.expiryAlertBefore ?? "15 Days",
        blockExpiredSales: e?.blockExpiredSales ?? false,
        serialNumber: p.advancedInfo?.serialNumber ?? "",
        warrantyPeriod: p.advancedInfo?.warrantyPeriod ?? "No Warranty",
        returnPeriod: p.advancedInfo?.returnPeriod ?? "7 Days",
        isActive: p.isActive ?? true,
        availableAtPos: p.advancedInfo?.availableAtPos ?? true,
        internalNotes: p.advancedInfo?.internalNotes ?? "",
      });
      setBarcodeLocked(false); // saved barcode stays editable until the user regenerates
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, productData]);

  // live pricing summary
  const purchase = num(form.watch("purchasePrice"));
  const selling = num(form.watch("sellingPrice"));
  const vatRate = num(form.watch("vatRate"));
  const vatAmount = (selling * vatRate) / 100;
  const marginPct = selling > 0 ? round(((selling - purchase) / selling) * 100, 1) : 0;

  const trackStock = form.watch("trackStock");
  const enableExpiry = form.watch("enableExpiry");

  // ---- step navigation ----
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
    const bad = STEPS.findIndex((s) => s.fields.some((f) => errors[f as keyof ProductFormData]));
    if (bad >= 0) setStep(bad);
  };

  // ---- submit ----
  const handleSubmit = (d: ProductFormData) => {
    const sell = num(d.sellingPrice);
    const buy = num(d.purchasePrice);
    const vat = num(d.vatRate);
    const vatAmt = (sell * vat) / 100;
    const desc = (d.description ?? "").trim();

    const batches = d.enableExpiry
      ? d.batches
          .filter((x) => x.expiryDate)
          .map((x) => ({
            batchNumber: (x.batchNumber ?? "").trim(),
            expiryDate: x.expiryDate as string,
            batchQty: num(x.batchQty),
          }))
      : [];

    const payload: AddProductPayload = {
      basicInfo: {
        name: d.productName.trim(),
        ...(d.image ? { image: d.image } : isEdit ? { image: "" } : {}),
        ...(d.aliasName?.trim() ? { aliasName: d.aliasName.trim() } : {}),
        ...(d.sku?.trim() ? { sku: d.sku.trim() } : {}),
        ...(d.barcode?.trim() ? { barcode: d.barcode.trim() } : {}),
        ...(d.categoryId ? { categoryId: d.categoryId } : {}),
        ...(d.subCategoryId ? { subCategoryId: d.subCategoryId } : {}),
        ...(d.brandId ? { brandId: d.brandId } : {}),
       unitId: d.unitId,
        ...(d.supplierId ? { supplierId: d.supplierId } : {}),
        description: desc,
      },
      pricingAndTax: {
        purchasePrice: buy,
        sellingPrice: sell,
        vatRate: vat,
        mrp: num(d.mrp),
        profitMargin: sell > 0 ? round(((sell - buy) / sell) * 100, 1) : 0,
        sellingPriceBeforeVat: sell,
        vatAmount: round(vatAmt),
        priceIncludingVat: round(sell + vatAmt),
      },
      inventoryManagement: {
        enableStockTracking: d.trackStock,
        openingStock: d.trackStock ? num(d.openingStock) : 0,
        lowStockAlert: d.trackStock ? num(d.lowStockAlert) : 0,
        reorderQuantity: d.trackStock ? num(d.reorderQuantity) : 0,
        allowSellingWhenOutOfStock: d.allowSellingWhenOutOfStock,
        description: desc,
      },
      expiryTracking: {
        enableExpiryTracking: d.enableExpiry,
        batches,
        expiryAlertBefore: d.expiryAlertBefore,
        blockExpiredSales: d.blockExpiredSales,
      },
      advancedInfo: {
        serialNumber: (d.serialNumber ?? "").trim(),
        warrantyPeriod: d.warrantyPeriod,
        returnPeriod: d.returnPeriod,
        availableAtPos: d.availableAtPos,
        internalNotes: (d.internalNotes ?? "").trim(),
      },
      isActive: d.isActive,
    };

    if (isEdit) EditProduct({ id: String(productId), value: payload });
    else AddProduct(payload);
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < LAST_STEP) {
      void goNext(); 
      return;
    }
    void form.handleSubmit(handleSubmit, handleInvalid)(e);
  };

  // ---- options ----
  const categoryOptions = (categoryData?.data || []).map((d) => ({
    value: d._id,
    label: withCode(d) ?? d.name,
  }));
  const subCategoryOptions = (subCategoryData?.data || []).map((d) => ({
    value: d._id,
    label: withCode(d) ?? d.name,
  }));
  const brandOptions = (brandData?.data || []).map((d) => ({ value: d._id, label: d.name }));
  const unitOptions = (unitData?.data?.units || []).map((d) => ({ value: d._id, label: d.name }));
  const supplierOptions = (supplierData?.data || []).map((d) => ({ value: d._id, label: d.name }));

  // labels for saved values in edit mode (the selected item may not be in the search results)
const selectedCategory = productData?.data?.basicInfo?.categoryId;
  const categoryLabel =
    isEdit && selectedCategory
      ? `${selectedCategory.code} - ${selectedCategory.name}`
      : undefined;

          const selectedSubCategory = productData?.data?.basicInfo?.subCategoryId;
  const subCategoryLabel =
    isEdit && selectedSubCategory
      ? `${selectedSubCategory.code} - ${selectedSubCategory.name}`
      : undefined;

      const selectedBrand = productData?.data?.basicInfo?.brandId;
  const brandLabel =
    isEdit && selectedBrand
      ? `${selectedBrand.name}`
      : undefined;

        const selectedSupplier = productData?.data?.basicInfo?.supplierId;
  const supplierLabel =
    isEdit && selectedSupplier
      ? ` ${selectedSupplier.name}`
      : undefined;

      
        const selectedUnit = productData?.data?.basicInfo?.unitId;
  const unitLabel =
    isEdit && selectedUnit
      ? ` ${selectedUnit.name}`
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-[820px] flex-col gap-0 overflow-hidden rounded-[16px] border-0 bg-[#EFEFEF] p-0 font-poppins sm:max-h-[90dvh] sm:w-[calc(100%-2rem)] sm:max-w-[820px] sm:rounded-[20px]"
      >
        <DialogTitle className="sr-only">
          {isEdit ? "Edit Product" : "Add New Product To Inventory"}
        </DialogTitle>

        {/* HEADER: scrollable step tabs + close icon */}
        <div className="shrink-0 border-b border-[#D5D5D5] bg-[#EFEFEF] px-3 pb-3 pt-3 sm:px-6 sm:pb-4 sm:pt-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              role="tablist"
              aria-label="Product form steps"
              className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden"
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
                    className={`flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase leading-tight transition-colors sm:min-h-11 sm:flex-1 sm:px-4 sm:py-2 sm:text-[13px] ${
                      active ? "bg-[#B726B7] text-white" : "bg-[#A9A9A9] text-white hover:bg-[#9a9a9a]"
                    }`}
                  >
                    {s.label}
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
          <form onSubmit={onFormSubmit} className="flex min-h-0 flex-1 flex-col" noValidate>
            {/* BODY */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6">
              <div className="flex flex-col gap-4">
                {/* STEP 1: BASIC INFO */}
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
                      label="Alias Name"
                      name="aliasName"
                      placeholder="eg. Fortune Oil 1L"
                      value={form.watch("aliasName")}
                    />
                    <FormInput
                      type="text"
                      label="SKU / Item Code"
                      name="sku"
                      placeholder="PRD-001"
                      value={form.watch("sku")}
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
                      label="Category"
                      name="categoryId"
                      placeholder="Select Category"
                      options={categoryOptions}
                      value={form.watch("categoryId")}
                      onChange={(val) => {
                        form.setValue("categoryId", val);
                        form.setValue("subCategoryId", ""); 
                        setSubCategorySearch("");
                      }}
                      valueLabel={categoryLabel}
                      setSearch={setCategorySearch}
                    />
                    <FormCombobox
                      label="Sub Category"
                      name="subCategoryId"
                      placeholder={selectedCategoryId ? "Select Sub Category" : "Select a category first"}
                      options={subCategoryOptions}
                      value={form.watch("subCategoryId")}
                      onChange={(val) => form.setValue("subCategoryId", val)}
                      valueLabel={subCategoryLabel}
                      setSearch={setSubCategorySearch}
                      disabled={!selectedCategoryId}
                    />
                    <FormCombobox
                      label="Base Unit"
                      name="unitId"
                      placeholder="Select Unit"
                        required
                      options={unitOptions}
                      value={form.watch("unitId")}
                      onChange={(val) => form.setValue("unitId", val)}
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

                    <ProductImageUpload form={form} onLoadingChange={setImageLoading} />
                     <ProductBarcodeField
                      form={form}
                      locked={barcodeLocked}
                      onLockedChange={setBarcodeLocked}
                      className="sm:col-span-2"
                    />

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label htmlFor="product-description" className="text-[13px] font-medium text-black">
                        Product Description
                      </label>
                      <textarea
                        id="product-description"
                        rows={3}
                        placeholder="Enter product description.."
                        className={textareaCls}
                        {...form.register("description")}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: PRICING */}
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
                      />
                      <FormInput
                        type="number"
                        label="VAT Rate (%)"
                        name="vatRate"
                        placeholder="0"
                        value={form.watch("vatRate")}
                      />
                      <FormInput
                        type="number"
                        label={`MRP (${CURRENCY})`}
                        name="mrp"
                        placeholder="0"
                        value={form.watch("mrp")}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-medium text-black">Profit Margin</span>
                      <span
                        className={`text-[14px] font-semibold ${marginPct >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {marginPct.toFixed(1)}%
                      </span>
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
                    <CheckRow
                      checked={trackStock}
                      onChange={(v) => form.setValue("trackStock", v)}
                      label="Enable stock tracking"
                    />
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
                      <FormInput
                        type="number"
                        label="Reorder Quantity"
                        name="reorderQuantity"
                        placeholder="0"
                        value={form.watch("reorderQuantity")}
                        disabled={!trackStock}
                      />
                    </div>
                    <CheckRow
                      checked={form.watch("allowSellingWhenOutOfStock")}
                      onChange={(v) => form.setValue("allowSellingWhenOutOfStock", v)}
                      label="Allow Selling When Out of Stock"
                    />
                  </>
                )}

                {/* STEP 4: EXPIRY */}
                {step === 3 && (
                  <>
                    <CheckRow
                      checked={enableExpiry}
                      onChange={(v) => form.setValue("enableExpiry", v)}
                      label="Enable Expiry Date Tracking"
                    />

                    {enableExpiry && (
                      <>
                        <div className="flex flex-col gap-3">
                          {batchFields.map((f, i) => (
                            <div
                              key={f.id}
                              className="flex flex-col gap-3 rounded-[10px] border border-[#C4C4C4] p-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[13px] font-semibold text-black">Batch {i + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => remove(i)}
                                  aria-label={`Remove batch ${i + 1}`}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>

                              <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-medium text-black">Batch / Lot Number</label>
                                <input
                                  type="text"
                                  placeholder="eg. 500ml"
                                  className={nativeInputCls}
                                  {...form.register(`batches.${i}.batchNumber`)}
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[13px] font-medium text-black">Expiry Date</label>
                                  <input
                                    type="date"
                                    className={nativeInputCls}
                                    {...form.register(`batches.${i}.expiryDate`)}
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[13px] font-medium text-black">Batch Qty</label>
                                  <input
                                    type="number"
                                    min={0}
                                    placeholder="10"
                                    className={nativeInputCls}
                                    {...form.register(`batches.${i}.batchQty`, {
                                      setValueAs: (v) => (v === "" || v == null ? "" : Number(v)),
                                    })}
                                  />
                                  {form.formState.errors.batches?.[i]?.batchQty?.message && (
                                    <p className="text-[12px] text-red-600">
                                      {form.formState.errors.batches[i]?.batchQty?.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => append(emptyBatch())}
                          className="flex w-fit items-center gap-1.5 text-[13px] font-medium uppercase text-[#B726B7] hover:underline"
                        >
                          <Plus className="size-4" /> Add another batch
                        </button>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormCombobox
                            label="Expiry Alert Before"
                            name="expiryAlertBefore"
                            placeholder="Select"
                            options={toOptions(EXPIRY_ALERT_OPTIONS)}
                            value={form.watch("expiryAlertBefore")}
                            onChange={(val) => form.setValue("expiryAlertBefore", val)}
                            valueLabel={form.watch("expiryAlertBefore")}
                          />
                        </div>

                        <CheckRow
                          checked={form.watch("blockExpiredSales")}
                          onChange={(v) => form.setValue("blockExpiredSales", v)}
                          label="Block Sales of Expired Products"
                        />
                      </>
                    )}
                  </>
                )}

                {/* STEP 5: ADVANCED */}
                {step === 4 && (
                  <>
                    <FormInput
                      type="text"
                      label="Serial Number / IMEI"
                      name="serialNumber"
                      placeholder="Optional"
                      value={form.watch("serialNumber")}
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormCombobox
                        label="Warranty Period"
                        name="warrantyPeriod"
                        placeholder="Select"
                        options={toOptions(WARRANTY_OPTIONS)}
                        value={form.watch("warrantyPeriod")}
                        onChange={(val) => form.setValue("warrantyPeriod", val)}
                        valueLabel={form.watch("warrantyPeriod")}
                      />
                      <FormCombobox
                        label="Return Period"
                        name="returnPeriod"
                        placeholder="Select"
                        options={toOptions(RETURN_OPTIONS)}
                        value={form.watch("returnPeriod")}
                        onChange={(val) => form.setValue("returnPeriod", val)}
                        valueLabel={form.watch("returnPeriod")}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <CheckRow
                        checked={form.watch("isActive")}
                        onChange={(v) => form.setValue("isActive", v)}
                        label="Active Product"
                      />
                      <CheckRow
                        checked={form.watch("availableAtPos")}
                        onChange={(v) => form.setValue("availableAtPos", v)}
                        label="Available at POS Billing"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="internal-notes" className="text-[13px] font-medium text-black">
                        Internal Notes
                      </label>
                      <textarea
                        id="internal-notes"
                        rows={3}
                        placeholder="Additional Product Notes"
                        className={textareaCls}
                        {...form.register("internalNotes")}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#D5D5D5] bg-[#EFEFEF] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:flex-row sm:justify-end sm:px-6 sm:pb-4">
              <Button
                type="button"
                variant="cancel"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              {step < LAST_STEP ? (
                <Button type="button" variant="save" className="w-full sm:w-auto" onClick={() => void goNext()}>
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