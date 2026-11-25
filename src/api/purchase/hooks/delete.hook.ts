import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeletePurchaseApi } from "../api/delete";


export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | undefined;

      purchaseName?: string;
    }) => {
      return await DeletePurchaseApi(
        String(data.id),

      );
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.purchaseName} Deleted Successfully`);
      queryClient.invalidateQueries({ queryKey: ["purchaseList"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
