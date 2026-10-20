
import { AddBrandPayload } from "@/src/interfaces/brand/create.type";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddBrandApi } from "../api/create";
import { BrandFormData } from "@/src/components/brand/AddBrandDialogue";


export const useAddBrand = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<BrandFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddBrandPayload) => {
      return await AddBrandApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Brand created successfully");
      queryClient.invalidateQueries({ queryKey: ["brandList"] });
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
