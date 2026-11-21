import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ListBarcodeApi } from "../api/getAllBarcode";
import type { ProductFormData } from "@/src/components/product-inventory/AddProductInventoryDialogue";

export const useGenerateBarcode = ({
  form,
  onGenerated,
}: {
  form: UseFormReturn<ProductFormData>;
  onGenerated?: () => void;
}) => {
  return useMutation({
    mutationFn: async () => {
      return await ListBarcodeApi();
    },

    onSuccess: (res) => {
      const code = res?.data?.barcode;
      if (!code) {
        form.setError("barcode", { message: "Could not generate barcode" });
        return;
      }
      form.clearErrors("barcode");
      form.setValue("barcode", code, { shouldValidate: true, shouldDirty: true });
      onGenerated?.();
    },

    onError: (error: unknown) => {
      const errorData = error as CustomError;
      form.setError("barcode", { message: "Failed to generate barcode. Try again." });
      toast.error(errorData?.message ?? "Failed to generate barcode");
    },
  });
};