
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddPrivilegePayload } from "@/src/interfaces/privilege/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddPrivilegeApi } from "../api/create";
import { PrivilegeFormData } from "@/src/components/privilege/AddPrivilegeDialogue";


export const useAddPrivilege = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<PrivilegeFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddPrivilegePayload) => {
      return await AddPrivilegeApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Privilege created successfully");
      queryClient.invalidateQueries({ queryKey: ["privilegeList"] });
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
