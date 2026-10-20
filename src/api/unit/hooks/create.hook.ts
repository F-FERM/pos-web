
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddUnitPayload } from "@/src/interfaces/unit/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddUnitApi } from "../api/create";
import { UnitFormData } from "@/src/components/unit/AddUnitDialogue";


export const useAddUnit = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<UnitFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddUnitPayload) => {
      return await AddUnitApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Unit created successfully");
      queryClient.invalidateQueries({ queryKey: ["unitList"] });
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
