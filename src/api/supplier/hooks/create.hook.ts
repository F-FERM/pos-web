
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddSupplierPayload } from "@/src/interfaces/supplier/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddSupplierApi } from "../api/create";
import { SupplierFormData } from "@/src/components/supplier-directory/AddSupplierDirectoryDialogue";


export const useAddSupplier = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<SupplierFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddSupplierPayload) => {
      return await AddSupplierApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Supplier created successfully");
      queryClient.invalidateQueries({ queryKey: ["supplierList"] });
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
