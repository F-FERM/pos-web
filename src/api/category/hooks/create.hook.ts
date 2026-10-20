
import { AddCategoryPayload } from "@/src/interfaces/category/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddCategoryApi } from "../api/create";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { CategoryFormData } from "@/src/components/category/AddCategoryDialogue";


export const useAddCategory = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<CategoryFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddCategoryPayload) => {
      return await AddCategoryApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categoryList"] });
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
