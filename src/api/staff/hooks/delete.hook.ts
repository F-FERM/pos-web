import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteStaffApi } from "../api/delete";


export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | undefined;

      staffName?: string;
    }) => {
      return await DeleteStaffApi(
        String(data.id),

      );
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.staffName} Deleted Successfully`);
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
