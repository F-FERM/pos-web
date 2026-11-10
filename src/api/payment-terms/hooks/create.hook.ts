
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddPaymentTermPayload } from "@/src/interfaces/payment-terms/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddPaymentTermsApi } from "../api/create";
import { PaymentTermFormData } from "@/src/components/payment-terms/AddPaymentTermsDialogue";


export const useAddPaymentTerms = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<PaymentTermFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddPaymentTermPayload) => {
      return await AddPaymentTermsApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Payment Term created successfully");
      queryClient.invalidateQueries({ queryKey: ["paymentTermList"] });
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
