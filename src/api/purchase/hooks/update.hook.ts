import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddPurchasePayload } from "@/src/interfaces/purchase/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditPurchaseApi } from "../api/update";
import { PurchaseOrderFormData } from "@/src/components/purchase-order/AddPurchaseOrderDialogue";

export const useEditPurchase = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<PurchaseOrderFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddPurchasePayload }) => {
      return await EditPurchaseApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Purchase updated successfully");
      queryClient.invalidateQueries({ queryKey: ["purchaseList"] });
      queryClient.invalidateQueries({
        queryKey: ["purchaseOrderById", variables.id],
      });
    
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
