
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddStaffPayload } from "@/src/interfaces/staff/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddStaffApi } from "../api/create";
import { StaffFormData } from "@/src/components/staff-security/AddStaffSecurityDialogue";


export const useAddStaff = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<StaffFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddStaffPayload) => {
      return await AddStaffApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Staff created successfully");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
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
