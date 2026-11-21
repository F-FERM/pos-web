import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddSubCategoryPayload } from "@/src/interfaces/sub-category/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditSubCategoryApi } from "../api/update";
import { SubCategoryFormData } from "@/src/components/sub-category/AddSubCategoryDialogue";

export const useEditSubCategory = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<SubCategoryFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddSubCategoryPayload }) => {
      return await EditSubCategoryApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("SubCategory updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subCategoryList"] });
      queryClient.invalidateQueries({
        queryKey: ["subCategoryById", variables.id],
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
