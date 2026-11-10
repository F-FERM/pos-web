import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeletePaymentTermsApi } from "../api/delete";


export const useDeletePaymentTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | undefined;

      paymentTermName?: string;
    }) => {
      return await DeletePaymentTermsApi(
        String(data.id),

      );
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.paymentTermName} Deleted Successfully`);
      queryClient.invalidateQueries({ queryKey: ["paymentTermList"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
