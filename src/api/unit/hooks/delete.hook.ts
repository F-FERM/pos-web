import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteUnitApi } from "../api/delete";
import { CustomError } from "@/src/interfaces/error/customError.type";


export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | undefined;

      unitName?: string;
    }) => {
      return await DeleteUnitApi(
        String(data.id),

      );
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.unitName} Deleted Successfully`);
      queryClient.invalidateQueries({ queryKey: ["unitList"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
