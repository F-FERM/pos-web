
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddSubCategoryPayload } from "@/src/interfaces/sub-category/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddSubCategoryApi } from "../api/create";
import { SubCategoryFormData } from "@/src/components/sub-category/AddSubCategoryDialogue";


export const useAddSubCategory = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<SubCategoryFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddSubCategoryPayload) => {
      return await AddSubCategoryApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Sub Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["subCategoryList"] });
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
