import { PrinterFormData } from "@/src/components/printer/AddPrinterDialogue";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddPrinterPayload } from "@/src/interfaces/printer/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EditPrinterApi } from "../api/update";

export const useEditPrinter = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<PrinterFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; value: AddPrinterPayload }) => {
      return await EditPrinterApi(data.id, data.value);
    },

    onSuccess: (_data, variables) => {
      toast.success("Printer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["printerList"] });
      queryClient.invalidateQueries({
        queryKey: ["printerById", variables.id],
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
