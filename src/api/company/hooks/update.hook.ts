import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { UpdateCompanyPayload } from "@/src/interfaces/company/update.type";
import { editCompanyApi } from "../api/update";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { CompanyFormData } from "@/src/components/company/EditCompany";

export const useEditCompany = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<CompanyFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: UpdateCompanyPayload }) => {
      return await editCompanyApi(data.id, data.value);
    },

    onSuccess: () => {
      toast.success("Company updated successfully");
      queryClient.invalidateQueries({ queryKey: ["companyList"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage = errorData.error || errorData.message;
      toast.error(errorMessage);
    },
  });
};
