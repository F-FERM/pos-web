
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddNumberSettingsPayload } from "@/src/interfaces/number-settings/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddNumberSettingApi } from "../api/create";
import { NumberSettingsFormValues } from "@/src/components/number-settings/NumberSettingModal";



export const useAddNumberSettings = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<NumberSettingsFormValues>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddNumberSettingsPayload) => {
      return await AddNumberSettingApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Number Setting created successfully");
      queryClient.invalidateQueries({ queryKey: ["numberSettings"] });
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
