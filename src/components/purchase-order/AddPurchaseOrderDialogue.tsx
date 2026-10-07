"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";

const itemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  cost: z.number(),
  qty: z.number().min(1),
});

const formSchema = z.object({
  supplier: z.string().min(1, "Supplier is required"),
  productPick: z.string().optional(), // only used to pick a product, not submitted
  items: z.array(itemSchema).min(1, "Add at least one product to the order"),
});

export type PurchaseOrderFormData = z.infer<typeof formSchema>;
export type PurchaseOrderItem = z.infer<typeof itemSchema>;

const EMPTY: PurchaseOrderFormData = { supplier: "", productPick: "", items: [] };

// Demo options (replace with API data)
const SUPPLIER_OPTIONS = [
  { value: "ITC Product (ITC Wholesale Ltd)", label: "ITC Product (ITC Wholesale Ltd)" },
  { value: "Adani Wilmar", label: "Adani Wilmar" },
  { value: "Tata Consumer", label: "Tata Consumer" },
  { value: "Royal Traders", label: "Royal Traders" },
  { value: "Amul Dairy", label: "Amul Dairy" },
];

const PRODUCTS = [
  { value: "1", label: "Fortune Sunlight Sunflower Oil 1L", cost: 98 },
  { value: "2", label: "Aashirvaad Shudh Chakki Atta", cost: 262 },
  { value: "3", label: "Tata Salt Vacuum 1 kg", cost: 24 },
  { value: "4", label: "Royal Sona Masoori Rice", cost: 340 },
  { value: "5", label: "Toor Dal Premium 1kg", cost: 96 },
  { value: "6", label: "Tata Tea Premium 250", cost: 118 },
];
const PRODUCT_OPTIONS = PRODUCTS.map(({ value, label }) => ({ value, label }));

interface AddPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  orderId?: string;
  order?: PurchaseOrderFormData;
  onSubmit?: (data: PurchaseOrderFormData) => void;
}

export function AddPurchaseOrderDialog({
  open,
  onOpenChange,
  isEdit = false,
  order,
  onSubmit,
}: AddPurchaseOrderDialogProps) {
  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Fill (edit) or clear (create) the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(isEdit && order ? order : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // picking a product adds it to the order (or adds 1 to its quantity)
  const handlePick = (productId: string) => {
    const product = PRODUCTS.find((p) => p.value === productId);
    if (!product) return;
    const index = fields.findIndex((f) => f.productId === productId);
    if (index >= 0) {
      update(index, { ...fields[index], qty: fields[index].qty + 1 });
    } else {
      append({ productId, name: product.label, cost: product.cost, qty: 1 });
    }
    form.setValue("productPick", ""); // show "--Choose Product--" again
    form.clearErrors("items");
  };

  const total = fields.reduce((sum, f) => sum + f.cost * f.qty, 0);
  const itemsError = (form.formState.errors.items as { message?: string; root?: { message?: string } } | undefined);
  const itemsMessage = itemsError?.root?.message ?? itemsError?.message;

  const handleSubmit = (data: PurchaseOrderFormData) => {
    // TODO: call your create / update purchase order API here
    onSubmit?.(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[520px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black sm:text-[16px]">
            {isEdit ? "Edit Purchase Order Voucher" : "New Purchase Order Voucher"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <FormCombobox
              label="Select Distributer / Supplier"
              name="supplier"
              placeholder="Select supplier"
              options={SUPPLIER_OPTIONS}
              required
            />

            <FormCombobox
              label="Add Product To Order"
              name="productPick"
              placeholder="--Choose Product--"
              options={PRODUCT_OPTIONS}
              searchable
              onChange={handlePick}
            />

            {/* Products added to this order (hidden until the first one is picked) */}
            {fields.length > 0 && (
              <div className="flex flex-col gap-2">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-[10px] border border-[#D5D5D5] bg-[#E5E5E5] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-black" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#848484]">
                        ₹ {item.cost} x {item.qty} = ₹ {item.cost * item.qty}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={item.qty <= 1}
                        onClick={() => update(index, { ...item, qty: item.qty - 1 })}
                        className="flex size-6 items-center justify-center rounded-[6px] border border-[#C0C0C0] bg-[#EDEDED] disabled:opacity-40"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-5 text-center text-[12px] text-black">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => update(index, { ...item, qty: item.qty + 1 })}
                        className="flex size-6 items-center justify-center rounded-[6px] border border-[#C0C0C0] bg-[#EDEDED]"
                      >
                        <Plus className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove product"
                        onClick={() => remove(index)}
                        className="ml-1 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <p className="text-right text-[12px] font-medium text-black">
                  Total Payable: ₹ {total}
                </p>
              </div>
            )}

            {itemsMessage && <p className="text-[12px] text-red-500">{itemsMessage}</p>}

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save">
                  {isEdit ? "Update Purchase Order" : "Issue Purchase Order"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}