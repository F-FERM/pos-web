import { AddBrandPayload } from "@/src/interfaces/brand/create.type";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditBrandApi } from "../api/update";
import { BrandFormData } from "@/src/components/brand/AddBrandDialogue";

export const useEditBrand = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<BrandFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddBrandPayload }) => {
      return await EditBrandApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Brand updated successfully");
      queryClient.invalidateQueries({ queryKey: ["brandList"] });
      queryClient.invalidateQueries({
        queryKey: ["brandById", variables.id],
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
