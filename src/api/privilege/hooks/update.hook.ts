import { PrivilegeFormData } from "@/src/components/privilege/AddPrivilegeDialogue";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddPrivilegePayload } from "@/src/interfaces/privilege/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditPrivilegeApi } from "../api/update";

export const useEditPrivilege = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<PrivilegeFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddPrivilegePayload }) => {
      return await EditPrivilegeApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Privilege updated successfully");
      queryClient.invalidateQueries({ queryKey: ["privilegeList"] });
      queryClient.invalidateQueries({
        queryKey: ["privilegeById", variables.id],
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
