import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddSupplierPayload } from "@/src/interfaces/supplier/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditSupplierApi } from "../api/update";
import { SupplierFormData } from "@/src/components/supplier-directory/AddSupplierDirectoryDialogue";

export const useEditSupplier = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<SupplierFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddSupplierPayload }) => {
      return await EditSupplierApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Supplier updated successfully");
      queryClient.invalidateQueries({ queryKey: ["supplierList"] });
      queryClient.invalidateQueries({
        queryKey: ["supplierById", variables.id],
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
