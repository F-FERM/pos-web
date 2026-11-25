"use client";

import { Loader2, WandSparkles, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import FormInput from "../common/form/FormInput";
import { useGenerateBarcode } from "@/src/api/product/hooks/barcode.hook";
import type { ProductFormData } from "./AddProductInventoryDialogue";

interface ProductBarcodeFieldProps {
  form: UseFormReturn<ProductFormData>;
  /** true when the barcode came from the API, so the input is read-only */
  locked: boolean;
  onLockedChange: (locked: boolean) => void;
  className?: string;
}

export default function ProductBarcodeField({
  form,
  locked,
  onLockedChange,
  className = "",
}: ProductBarcodeFieldProps) {
  const { mutate: generateBarcode, isPending } = useGenerateBarcode({
    form,
    onGenerated: () => onLockedChange(true),
  });

  const clearBarcode = () => {
    form.setValue("barcode", "", { shouldDirty: true });
    form.clearErrors("barcode");
    onLockedChange(false);
  };

  return (
    <div className={`relative ${className}`}>
      {locked ? (
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
          disabled={isPending}
          className="absolute right-0 top-0 z-10 flex items-center gap-1 text-[12px] text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <WandSparkles className="size-3.5" />
          )}
          {isPending ? "Generating..." : "Auto generate"}
        </button>
      )}

      <FormInput
        type="text"
        label="Barcode"
        name="barcode"
        placeholder="Scan or enter"
        value={form.watch("barcode")}
        disabled={locked}
      />
    </div>
  );
}