
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddProductPayload } from "@/src/interfaces/product/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddProductApi } from "../api/create";
import { ProductFormData } from "@/src/components/product-inventory/AddProductInventoryDialogue";


export const useAddProduct = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<ProductFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddProductPayload) => {
      return await AddProductApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["productList"] });
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
