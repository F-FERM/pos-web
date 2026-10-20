import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddUnitPayload } from "@/src/interfaces/unit/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditUnitApi } from "../api/update";
import { UnitFormData } from "@/src/components/unit/AddUnitDialogue";

export const useEditUnit = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<UnitFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddUnitPayload }) => {
      return await EditUnitApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Unit updated successfully");
      queryClient.invalidateQueries({ queryKey: ["unitList"] });
      queryClient.invalidateQueries({
        queryKey: ["unitById", variables.id],
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
