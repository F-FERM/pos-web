import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteProductApi } from "../api/delete";


export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | undefined;

      productName?: string;
    }) => {
      return await DeleteProductApi(
        String(data.id),

      );
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.productName} Deleted Successfully`);
      queryClient.invalidateQueries({ queryKey: ["productList"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
