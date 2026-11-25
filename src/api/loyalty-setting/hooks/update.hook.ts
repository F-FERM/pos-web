import { CustomError } from "@/src/interfaces/error/customError.type";
import { UpdateLoyaltySetting } from "@/src/interfaces/loyalty-settings/update.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditLoyaltySettingApi } from "../api/update";
import { LoyaltyFormData } from "@/src/components/loyalty-setting/UpdateLoyaltySettingDialogue";

export const useEditLoyaltySettings = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<LoyaltyFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {  value: UpdateLoyaltySetting }) => {
      return await EditLoyaltySettingApi( data.value);
    },

    onSuccess: (_data) => {
      toast.success("LoyalitySettings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["loyaltysettingList"] });
     
    
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
