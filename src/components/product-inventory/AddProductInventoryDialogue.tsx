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
import { WandSparkles } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";

const amount = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Enter a valid number");

const formSchema = z.object({
  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be at most 100 characters"),
  category: z.string().min(1, "Category is required"),
  unitType: z.string().min(1, "Unit type is required"),
  barcode: z.string().min(1, "Barcode is required"),
  purchasePrice: amount("Purchase price"),
  sellingPrice: amount("Selling price"),
  stockQty: amount("Stock qty"),
  supplierName: z.string().optional(),
  expiryDate: z.string().optional(),
});

export type ProductFormData = z.infer<typeof formSchema>;

const EMPTY: ProductFormData = {
  productName: "",
  category: "",
  unitType: "Pcs",
  barcode: "",
  purchasePrice: "",
  sellingPrice: "",
  stockQty: "",
  supplierName: "",
  expiryDate: "",
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
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Fill (edit) or clear (add) the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(isEdit && product ? product : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const generateBarcode = () =>
    form.setValue("barcode", String(Math.floor(1e11 + Math.random() * 9e11)), {
      shouldValidate: true,
    });

  const handleSubmit = (data: ProductFormData) => {
    // TODO: call your add / edit product API here
    console.log(isEdit ? "update product" : "add product", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[642px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black sm:text-[16px]">
            {isEdit ? "Edit Product" : "Add New Product To Inventory"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <FormInput
              type="text"
              label="Product Name"
              name="productName"
              placeholder="eg. Fortune Sunflower Oil 1L"
              value={form.watch("productName")}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormCombobox
                label="Category"
                name="category"
                placeholder="Select category"
                options={CATEGORY_OPTIONS}
                required
              />
              <FormCombobox
                label="Unit Type"
                name="unitType"
                placeholder="Select unit"
                options={UNIT_OPTIONS}
              />
            </div>

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
                label="Barcode Number"
                name="barcode"
                placeholder="00000000"
                value={form.watch("barcode")}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormInput
                type="number"
                label="Purchase Price"
                name="purchasePrice"
                placeholder="00"
                value={form.watch("purchasePrice")}
                required
              />
              <FormInput
                type="number"
                label="Selling Price"
                name="sellingPrice"
                placeholder="00"
                value={form.watch("sellingPrice")}
                required
              />
              <FormInput
                type="number"
                label="Stock QTY"
                name="stockQty"
                placeholder="00"
                value={form.watch("stockQty")}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                type="text"
                label="Supplier Name"
                name="supplierName"
                placeholder="eg. Fortune Wholesale"
                value={form.watch("supplierName")}
              />
              <FormInput
                type="date"
                label="Expiry Date"
                name="expiryDate"
                value={form.watch("expiryDate")}
              />
            </div>

            <DialogFooter className="mt-2 ">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto sm:justify-end">
              <Button
                type="button"
                variant="cancel"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <LoadingButton type="submit" variant="save" >
                {isEdit ? "Update Product" : "Save Product"}
              </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}