
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddPurchasePayload } from "@/src/interfaces/purchase/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddPurchaseApi } from "../api/create";
import { PurchaseOrderFormData } from "@/src/components/purchase-order/AddPurchaseOrderDialogue";


export const useAddPurchase = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<PurchaseOrderFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddPurchasePayload) => {
      return await AddPurchaseApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Purchase created successfully");
      queryClient.invalidateQueries({ queryKey: ["purchaseList"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
