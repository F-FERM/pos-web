
import { AddCounterPayload } from "@/src/interfaces/counter/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { CounterFormData } from "@/src/components/counter/AddCounterDialogue";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddCounterApi } from "../api/create";


export const useAddCounter = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<CounterFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddCounterPayload) => {
      return await AddCounterApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Counter created successfully");
      queryClient.invalidateQueries({ queryKey: ["counterList"] });
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
