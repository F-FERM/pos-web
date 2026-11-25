import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteSubCategoryApi } from "../api/delete";


export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | undefined;

      subcategoryName?: string;
    }) => {
      return await DeleteSubCategoryApi(
        String(data.id),

      );
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.subcategoryName} Deleted Successfully`);
      queryClient.invalidateQueries({ queryKey: ["subCategoryList"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
