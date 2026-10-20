import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddStaffPayload } from "@/src/interfaces/staff/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditStaffApi } from "../api/update";

export const useEditStaff = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<StaffFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddStaffPayload }) => {
      return await EditStaffApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Staff updated successfully");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({
        queryKey: ["staffById", variables.id],
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
