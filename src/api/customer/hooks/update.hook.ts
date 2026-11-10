import { AddCustomerPayload } from "@/src/interfaces/customer/create.type";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditCustomerApi } from "../api/update";
import { CustomerFormData } from "@/src/components/customer-dues/AddCustomeDuesDialog";

export const useEditCustomer = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<CustomerFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddCustomerPayload }) => {
      return await EditCustomerApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["customerList"] });
      queryClient.invalidateQueries({
        queryKey: ["customerById", variables.id],
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
