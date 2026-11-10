import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddPaymentTermPayload } from "@/src/interfaces/payment-terms/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditPaymentTermsApi } from "../api/update";
import { PaymentTermFormData } from "@/src/components/payment-terms/AddPaymentTermsDialogue";

export const useEditPaymentTerms = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<PaymentTermFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddPaymentTermPayload }) => {
      return await EditPaymentTermsApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Payment Terms updated successfully");
      queryClient.invalidateQueries({ queryKey: ["paymentTermList"] });
      queryClient.invalidateQueries({
        queryKey: ["paymentTermById", variables.id],
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
