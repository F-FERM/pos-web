
import { PrinterFormData } from "@/src/components/printer/AddPrinterDialogue";
import { CustomError } from "@/src/interfaces/error/customError.type";
import { AddPrinterPayload } from "@/src/interfaces/printer/create.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { AddPrinterApi } from "../api/create";


export const useAddPrinter = ({
  form,
  onOpenChange,
}: {
  form: UseFormReturn<PrinterFormData>;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: AddPrinterPayload) => {
      return await AddPrinterApi(value);
    },

    onSuccess: (_data: { api_id: number }) => {
      toast.success("Printer created successfully");
      queryClient.invalidateQueries({ queryKey: ["printerList"] });
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
