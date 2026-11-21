"use client";

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Settings, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";

import { NumberSettingDocType } from "@/src/interfaces/enums/NumberSettings";
import { ListNumberSettingsApi } from "@/src/api/number-settings/api/getAll";
import { ListSupplierApi } from "@/src/api/supplier/api/getAll";
import { ListProductApi } from "@/src/api/product/api/getAll";
import { ListPurchaseByIdApi } from "@/src/api/purchase/api/getById";
import { useAddPurchase } from "@/src/api/purchase/hooks/create.hook";
import { useEditPurchase } from "@/src/api/purchase/hooks/update.hook";
import { AddPurchasePayload } from "@/src/interfaces/purchase/create.type";
import BillNumberSettingsModal from "./BillNumberSettingModal";
import FormTextArea from "../common/form/FormTextArea";

const CURRENCY = "AED";
const LOOKUP_PAGE = 1;
const LOOKUP_LIMIT = 100;

const num = (v: unknown) => Number(v) || 0;
const idOf = (v: any) => (typeof v === "string" ? v : v?._id ?? "");

// local date as YYYY-MM-DD (toISOString would shift the day near midnight)
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const requiredAmount = (label: string) =>
  z
    .number({ error: () => `${label} is required` })
    .min(0, `${label} cannot be negative`);

const itemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().min(1, "Min 1"),
  costPrice: z.number().min(0, "Cannot be negative"),
});


const formSchema = z.object({
  billNumber: z.string().optional(),
  supplierId: z.string().min(1, "Supplier is required"),
  productPick: z.string().optional(), 
  items: z.array(itemSchema).min(1, "Add at least one product to the order"),
  purchaseDate: z.string().optional(),
  paidAmount: requiredAmount("Paid amount"),
  notes: z.string().optional(),
});

export type PurchaseOrderFormData = z.infer<typeof formSchema>;

const makeEmpty = (): PurchaseOrderFormData => ({
  billNumber: "",
  supplierId: "",
  productPick: "",
  items: [],
  purchaseDate: todayStr(),
  paidAmount: 0,
  notes: "",
});

const nativeInputCls =
  "h-10 w-full rounded-[8px] border border-[#C4C4C4] bg-[#DEDEDE] px-3 text-[13px] text-black outline-none placeholder:text-[#8d8d8d] focus-visible:ring-2 focus-visible:ring-[#B726B7]/50";

const textareaCls =
  "w-full resize-none rounded-[8px] border border-[#C4C4C4] bg-[#DEDEDE] px-3 py-2.5 text-[13px] text-black outline-none placeholder:text-[#8d8d8d] focus-visible:ring-2 focus-visible:ring-[#B726B7]/50";

interface AddPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  orderId?: string;
}

export function AddPurchaseOrderDialog({
  open,
  onOpenChange,
  isEdit = false,
  orderId,
}: AddPurchaseOrderDialogProps) {
  const [supplierSearch, setSupplierSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: makeEmpty(),
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  // ---- lookups ----
  const { data: supplierData } = useQuery({
    queryKey: ["supplierList", supplierSearch],
    queryFn: () => ListSupplierApi({ page: LOOKUP_PAGE, limit: LOOKUP_LIMIT, search: supplierSearch }),
    enabled: open,
  });
  const { data: productData } = useQuery({
    queryKey: ["productList", "dropdown", productSearch],
    queryFn: () => ListProductApi({ page: LOOKUP_PAGE, limit: LOOKUP_LIMIT, search: productSearch }),
    enabled: open,
  });

  // ---- order for edit ----
  const { data: orderData } = useQuery({
    queryKey: ["purchaseOrderById", orderId],
    queryFn: () => ListPurchaseByIdApi(String(orderId)),
    enabled: open && isEdit && !!orderId,
  });

  // ---- bill number settings (used to prefill a new order) ----
  const { data: billSettings } = useQuery({
    queryKey: ["numberSettings", NumberSettingDocType.BILL],
    queryFn: () => ListNumberSettingsApi(NumberSettingDocType.BILL),
    enabled: open && !isEdit,
  });

  const { mutate: addOrder, isPending } = useAddPurchase({ form, onOpenChange });
  const { mutate: editOrder, isPending: editPending } = useEditPurchase({ form, onOpenChange });

  // every time the dialog opens: fresh form
  useEffect(() => {
    if (open) {
      setSupplierSearch("");
      setProductSearch("");
      setSettingsOpen(false);
      form.reset(makeEmpty());
    }
   
  }, [open]);

  useEffect(() => {
    if (!open || isEdit || !billSettings?.data) return;
    if (form.getValues("billNumber")) return;
    const s = billSettings.data;
    if (s.mode === "Manual") return;
    form.setValue("billNumber", `${s.prefix ?? ""}${String(s.nextNumberRaw ?? "")}`);
  }, [open, isEdit, billSettings]);

  // fill form when editing
  useEffect(() => {
    if (open && isEdit && orderData?.data) {
      const p = orderData.data;
      form.reset({
        billNumber: p.billNumber ?? "",
        supplierId: idOf(p.supplierId),
        items: (p.items ?? []).map((x) => ({
          productId: idOf(x.productId),
          name: x.productName ?? "",
          quantity: num(x.quantity) || 1,
          costPrice: num(x.costPrice),
        })),
        purchaseDate: p.purchaseDate ? String(p.purchaseDate).slice(0, 10) : todayStr(),
        paidAmount: num(p.paidAmount),
        notes: p.notes ?? "",
      });
    }
  }, [open, isEdit, orderData]);

  // ---- picking a product adds it (or adds 1 to its quantity) ----
  const handlePick = (productId: string) => {
    const product = (productData?.data ?? []).find((p) => p._id === productId);
    if (!product) return;

    const current = form.getValues("items");
    const index = current.findIndex((i) => i.productId === productId);
    if (index >= 0) {
      form.setValue(`items.${index}.quantity`, num(current[index].quantity) + 1, { shouldDirty: true });
    } else {
      append({
        productId,
        name: product.basicInfo.name,
        quantity: 1,
        costPrice: num(product.pricingAndTax?.purchasePrice),
      });
    }
    form.setValue("productPick", ""); 
    form.clearErrors("items");
  };

  // ---- live totals ----
  const items = form.watch("items");
  const total = items.reduce((sum, i) => sum + num(i.quantity) * num(i.costPrice), 0);
  const paid = num(form.watch("paidAmount"));
  const due = Math.max(total - paid, 0);
  const overpaid = paid > total && total > 0;

  const itemsError = form.formState.errors.items as
    | { message?: string; root?: { message?: string } }
    | undefined;
  const itemsMessage = itemsError?.root?.message ?? itemsError?.message;

 
  const handleSubmit = (d: PurchaseOrderFormData) => {
    const bill = (d.billNumber ?? "").trim();
    const notes = (d.notes ?? "").trim();
    const payload: AddPurchasePayload = {
      supplierId: d.supplierId,
      items: d.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        costPrice: i.costPrice,
      })),
      paidAmount: num(d.paidAmount),
      ...(bill ? { billNumber: bill } : {}),
      ...(d.purchaseDate ? { purchaseDate: d.purchaseDate } : {}),
      ...(notes ? { notes } : {}),
    };

    if (isEdit) editOrder({ id: String(orderId), value: payload });
    else addOrder(payload);
  };

  // ---- options + labels ----
  const supplierOptions = (supplierData?.data || []).map((d) => ({ value: d._id, label: d.name }));
  const productOptions = (productData?.data || []).map((d) => ({
    value: d._id,
    label: d.basicInfo.name,
  }));

  const supplierLabel = isEdit ? orderData?.data?.supplierId?.name : undefined;
  const pickedProductId = form.watch("productPick");
  const productLabel = pickedProductId
    ? productOptions.find((o) => o.value === pickedProductId)?.label ??
      items.find((i) => i.productId === pickedProductId)?.name
    : undefined;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          className="flex max-h-[92dvh] w-[calc(100%-1rem)] max-w-[640px] flex-col gap-0 overflow-hidden rounded-[16px] border-0 bg-[#EFEFEF] p-0 font-poppins sm:max-h-[90dvh] sm:w-[calc(100%-2rem)] sm:rounded-[20px]"
        >
          {/* HEADER */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#D5D5D5] px-3 py-3 sm:px-6 sm:py-4">
            <DialogTitle className="text-[14px] font-semibold text-black sm:text-[16px]">
              {isEdit ? "Edit Purchase Order Voucher" : "New Purchase Order Voucher"}
            </DialogTitle>
            <DialogClose
              aria-label="Close"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6b6b6b] transition-colors hover:bg-[#DEDEDE] hover:text-black"
            >
              <X className="size-4 sm:size-5" />
            </DialogClose>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex min-h-0 flex-1 flex-col"
              noValidate
            >
              {/* BODY */}
              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6">
                <div className="flex flex-col gap-4">
                  {/* Bill number + settings link (optional) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSettingsOpen(true)}
                      className="absolute right-0 top-0 z-10 flex items-center gap-1 text-[12px] text-primary hover:underline"
                    >
                      <Settings className="size-3.5" />
                      Settings
                    </button>
                    <FormInput
                      type="text"
                      label="Bill Number"
                      name="billNumber"
                      placeholder="BILL-0001"
                      value={form.watch("billNumber")}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormCombobox
                      label="Select Distributer / Supplier"
                      name="supplierId"
                      placeholder="Select supplier"
                      required
                      options={supplierOptions}
                      value={form.watch("supplierId")}
                      onChange={(val) => form.setValue("supplierId", val, { shouldValidate: true })}
                      valueLabel={supplierLabel}
                      setSearch={setSupplierSearch}
                    />

                    <FormInput
                      type="date"
                      label="Purchase Date"
                      name="purchaseDate"
                      value={form.watch("purchaseDate")}
                    />
                  </div>

                  <FormCombobox
                    label="Add Product To Order"
                    name="productPick"
                    placeholder="--Choose Product--"
                    options={productOptions}
                    value={form.watch("productPick")}
                    onChange={handlePick}
                    valueLabel={productLabel}
                    setSearch={setProductSearch}
                  />

                  {/* Products added to this order */}
                  {fields.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {fields.map((f, i) => {
                        const rowErrors = form.formState.errors.items?.[i];
                        const lineTotal = num(items[i]?.quantity) * num(items[i]?.costPrice);
                        return (
                          <div
                            key={f.id}
                            className="flex flex-col gap-3 rounded-[10px] border border-[#D5D5D5] bg-[#E5E5E5] p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="min-w-0 break-words text-[13px] font-medium text-black">
                                {items[i]?.name ?? f.name}
                              </p>
                              <button
                                type="button"
                                aria-label={`Remove ${items[i]?.name ?? "product"}`}
                                onClick={() => remove(i)}
                                className="shrink-0 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-[#6b6b6b]">Quantity</label>
                                <input
                                  type="number"
                                  min={1}
                                  className={nativeInputCls}
                                  {...form.register(`items.${i}.quantity`, {
                                    setValueAs: (v) => (v === "" || v == null ? 0 : Number(v)),
                                  })}
                                />
                                {rowErrors?.quantity?.message && (
                                  <p className="text-[11px] text-red-600">{rowErrors.quantity.message}</p>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-[#6b6b6b]">
                                  Cost Price ({CURRENCY})
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  step="any"
                                  className={nativeInputCls}
                                  {...form.register(`items.${i}.costPrice`, {
                                    setValueAs: (v) => (v === "" || v == null ? 0 : Number(v)),
                                  })}
                                />
                                {rowErrors?.costPrice?.message && (
                                  <p className="text-[11px] text-red-600">{rowErrors.costPrice.message}</p>
                                )}
                              </div>

                              <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:flex-col sm:items-start sm:justify-end sm:gap-1">
                                <span className="text-[11px] font-medium text-[#6b6b6b]">Line Total</span>
                                <span className="text-[13px] font-semibold text-black sm:pb-2.5">
                                  {CURRENCY} {lineTotal.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {itemsMessage && <p className="text-[12px] text-red-500">{itemsMessage}</p>}

                  {/* Payment */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput
                      type="number"
                      label={`Paid Amount (${CURRENCY})`}
                      name="paidAmount"
                      placeholder="0"
                      value={form.watch("paidAmount")}
                      required
                    />
                    <dl className="flex flex-col justify-end gap-1.5 text-[13px] sm:pb-2 sm:text-[14px]">
                      <div className="flex items-center justify-between gap-3 text-[#6b6b6b]">
                        <dt>Total Payable</dt>
                        <dd className="font-semibold text-black">
                          {CURRENCY} {total.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[#6b6b6b]">
                        <dt>Due Amount</dt>
                        <dd className={`font-semibold ${due > 0 ? "text-orange-500" : "text-green-600"}`}>
                          {CURRENCY} {due.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  {overpaid && (
                    <p className="-mt-2 text-[12px] text-orange-500">
                      Paid amount is more than the total payable.
                    </p>
                  )}

                  {/* Notes (optional) */}
                  <div className="flex flex-col gap-1.5">
                    

 <FormTextArea
               placeholder="Additional notes" 
                 {...form.register("notes")}
                  label="Notes"
              name="notes"
             
              value={form.watch("notes")}
              onChange={(e) => form.setValue("notes", e.target.value)}
            />
                  </div>
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
                <LoadingButton
                  type="submit"
                  variant="save"
                  className="w-full sm:w-auto"
                  loading={isEdit ? editPending : isPending}
                >
                  {isEdit ? "Update Purchase Order" : "Issue Purchase Order"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Bill number preferences */}
      <BillNumberSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaveSuccess={(newNumber) => {
          form.setValue("billNumber", newNumber, { shouldValidate: true, shouldDirty: true });
          setSettingsOpen(false);
        }}
      />
    </>
  );
}