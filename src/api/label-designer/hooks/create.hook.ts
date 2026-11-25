import { CustomError } from "@/src/interfaces/error/customError.type";
import {
  AddLabelDesignerPayload,
  
} from "@/src/interfaces/label-designer/create.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddLabelDesignerApi } from "../api/create";
import { ListLabelDesignerSuccessResponse } from "@/src/interfaces/label-designer/successresponse.type";

export const useAddLabelDesigner = ({
  onSuccess,
}: {
  onSuccess?: (res: ListLabelDesignerSuccessResponse) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (
      value: AddLabelDesignerPayload,
    ): Promise<ListLabelDesignerSuccessResponse> => AddLabelDesignerApi(value),

    onSuccess: (res) => {
      toast.success(res.message ?? "Labels generated successfully");
      onSuccess?.(res);
    },
    onError: (error: unknown) => {
      toast.error((error as CustomError).message);
    },
  });
};