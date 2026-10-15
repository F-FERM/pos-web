"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Printer name must be at least 2 characters")
    .max(50, "Printer name must be at most 50 characters"),
  ip: z
    .string()
    .min(1, "IP address is required")
    .regex(/^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/, "Enter a valid IP address"),
  counter: z.string().optional(),
  paperWidth: z.enum(["58", "80"]),
  isDefault: z.boolean(),
});

export type PrinterFormData = z.infer<typeof formSchema>;

export type Printer = {
  id: string;
  name: string;
  ip: string;
  counter: string;
  paperWidth: "58" | "80";
  isDefault: boolean;
};

const EMPTY: PrinterFormData = {
  name: "",
  ip: "",
  counter: "Counter 1",
  paperWidth: "80",
  isDefault: false,
};

// Dummy data (replace with API data later)
export const COUNTER_OPTIONS = [
  { value: "Counter 1", label: "Counter 1" },
  { value: "Counter 2", label: "Counter 2" },
  { value: "Counter 3", label: "Counter 3" },
];

interface AddPrinterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  printerId?: string;
  printer?: PrinterFormData;
  onSubmit?: (data: PrinterFormData) => void;
}

export function AddPrinterDialog({
  open,
  onOpenChange,
  isEdit = false,
  printer,
  onSubmit,
}: AddPrinterDialogProps) {
  const form = useForm<PrinterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Fill (edit) or clear (add) the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(isEdit && printer ? printer : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const paperWidth = form.watch("paperWidth");
  const isDefault = form.watch("isDefault");

  const handleSubmit = (data: PrinterFormData) => {
    // TODO: call your add / edit printer API here
    console.log(isEdit ? "update printer" : "add printer", data);
    onSubmit?.(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[493px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black">
            {isEdit ? "Edit Printer" : "Add New Printer"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                type="text"
                label="Printer Name"
                name="name"
                placeholder="eg. Counter Printer"
                value={form.watch("name")}
                required
              />
              <FormInput
                type="text"
                label="Printer IP Address"
                name="ip"
                placeholder="eg. 192.168.1.50"
                value={form.watch("ip")}
                required
              />
            </div>

            <FormCombobox
              label="Counter"
              name="counter"
              placeholder="Select counter"
              options={COUNTER_OPTIONS}
            />

            {/* Paper width */}
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-[12px] font-medium text-black sm:text-[14px]">
                Paper Width
              </legend>
              <div className="flex items-center gap-5">
                {(["58", "80"] as const).map((w) => (
                  <label
                    key={w}
                    className="flex cursor-pointer items-center gap-2 text-[12px] text-black sm:text-[14px]"
                  >
                    <input
                      type="radio"
                      name="paperWidth"
                      value={w}
                      checked={paperWidth === w}
                      onChange={() => form.setValue("paperWidth", w)}
                      className="size-4 cursor-pointer accent-black"
                    />
                    {w} mm
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Set as default */}
            <label className="flex cursor-pointer items-start gap-2 rounded-[10px] border border-[#ACACAC] px-3 py-3">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => form.setValue("isDefault", e.target.checked)}
                className="mt-0.5 size-4 cursor-pointer accent-black"
              />
              <span className="flex flex-col gap-1">
                <span className="text-[14px] font-medium leading-[100%] text-black">
                  Set as default
                </span>
                <span className="text-[11px] leading-[120%] text-[#848484]">
                  The default printer will be selected automatically for receipts.
                </span>
              </span>
            </label>

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save">
                  {isEdit ? "Update Printer" : "Save Printer"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}