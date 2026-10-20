import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteCategoryApi } from "../api/delete";
import { CustomError } from "@/src/interfaces/error/customError.type";


export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | undefined;

      categoryName?: string;
    }) => {
      return await DeleteCategoryApi(
        String(data.id),

      );
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.categoryName} Deleted Successfully`);
      queryClient.invalidateQueries({ queryKey: ["categoryList"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
