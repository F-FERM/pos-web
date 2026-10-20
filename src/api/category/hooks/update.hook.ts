import { AddCategoryPayload } from "@/src/interfaces/category/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditCategoryApi } from "../api/update";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { CategoryFormData } from "@/src/components/category/AddCategoryDialogue";

export const useEditCategory = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<CategoryFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddCategoryPayload }) => {
      return await EditCategoryApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categoryList"] });
      queryClient.invalidateQueries({
        queryKey: ["categoryById", variables.id],
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
