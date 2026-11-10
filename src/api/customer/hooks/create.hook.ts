
import { CustomerFormData } from "@/src/components/customer-dues/AddCustomeDuesDialog";
import { AddCustomerPayload } from "@/src/interfaces/customer/create.type";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddCustomerApi } from "../api/create";


export const useAddCustomer = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<CustomerFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddCustomerPayload) => {
      return await AddCustomerApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: ["customerList"] });
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
