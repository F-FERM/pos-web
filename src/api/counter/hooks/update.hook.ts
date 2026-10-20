import { CounterFormData } from "@/src/components/counter/AddCounterDialogue";
import { AddCounterPayload } from "@/src/interfaces/counter/create.type";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditCounterApi } from "../api/update";


export const useEditCounter = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<CounterFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddCounterPayload }) => {
      return await EditCounterApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Counter updated successfully");
      queryClient.invalidateQueries({ queryKey: ["counterList"] });
      queryClient.invalidateQueries({
        queryKey: ["counterById", variables.id],
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
