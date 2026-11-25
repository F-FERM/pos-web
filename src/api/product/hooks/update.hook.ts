import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddProductPayload } from "@/src/interfaces/product/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditProductApi } from "../api/update";
import { ProductFormData } from "@/src/components/product-inventory/AddProductInventoryDialogue";

export const useEditProduct = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<ProductFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddProductPayload }) => {
      return await EditProductApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      queryClient.invalidateQueries({
        queryKey: ["productById", variables.id],
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
