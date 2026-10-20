import { CustomError } from "@/src/interfaces/error/customError.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteCounterApi } from "../api/delete";


export const useDeleteCounter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string | undefined;

      counterName?: string;
    }) => {
      return await DeleteCounterApi(
        String(data.id),

      );
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.counterName} Deleted Successfully`);
      queryClient.invalidateQueries({ queryKey: ["counterList"] });
    },
    onError: (error: unknown) => {
      const errorData = error as CustomError;
      const errorMessage =  errorData.message;
      toast.error(errorMessage);
    },
  });
};
