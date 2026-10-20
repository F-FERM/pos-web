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
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";
import { ListPrinterByIdApi } from "@/src/api/printer/api/getById";
import { useAddPrinter } from "@/src/api/printer/hooks/create.hook";
import { useEditPrinter } from "@/src/api/printer/hooks/update.hook";
import { ListCounterApi } from "@/src/api/counter/api/getAll";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Printer name must be at least 2 characters")
    .max(50, "Printer name must be at most 50 characters"),
  ip: z
    .string()
    .min(1, "IP address is required")
 ,
  counterId: z.string().min(1, "Counter is required"),
  paperWidth: z.enum(["58mm", "80mm"]),
  isDefault: z.boolean(),
});

export type PrinterFormData = z.infer<typeof formSchema>;

const EMPTY: PrinterFormData = {
  name: "",
  ip: "",
  counterId: "",
  paperWidth: "80mm",
  isDefault: false,
};

interface AddPrinterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  printerId?: string;
}

export function AddPrinterDialog({
  open,
  onOpenChange,
  isEdit = false,
  printerId,
}: AddPrinterDialogProps) {
  const [search, setSearch] = useState("");
  const form = useForm<PrinterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: printerData } = useQuery({
    queryKey: ["printerById", printerId],
    queryFn: () => ListPrinterByIdApi(String(printerId)),
    enabled: open && isEdit && !!printerId,
  });

  const { data: allCounters } = useQuery({
    queryKey: ["counterList", search],
    queryFn: () => ListCounterApi({ page: 1, limit: 100, search }),
    enabled: open,
  });

  const { mutate: AddPrinter, isPending } = useAddPrinter({
    form,
    onOpenChange,
  });
  const { mutate: EditPrinter, isPending: EditPending } = useEditPrinter({
    form,
    onOpenChange,
  });

 const paperWidth =
  useWatch({ control: form.control, name: "paperWidth" }) ?? "80mm";

  const isDefault = form.watch("isDefault");

  const handleSubmit = (data: PrinterFormData) => {
    const payload = {
      printerName: data.name,
      printerIp: data.ip,
      counterId: data.counterId,
      paperWidth: data.paperWidth,
      isDefault: data.isDefault,
    };

    if (isEdit) {
      EditPrinter({ id: String(printerId), value: payload });
    } else {
      AddPrinter(payload);
    }
  };

  function onclose(value: boolean) {
    onOpenChange(value);
    form.reset(EMPTY);
  }
useEffect(() => {
  if (open && !isEdit) {
    form.reset(EMPTY); 
  }
}, [open, isEdit]);
  useEffect(() => {
    if (open && isEdit && printerData?.data) {
      const p = printerData.data;
      form.reset({
        name: p.printerName,
        ip: p.printerIp,
        counterId: p.counterId?._id ?? "",
        paperWidth: p.paperWidth === "58mm" ? "58mm" : "80mm",
        isDefault: p.isDefault,
      });
    }
  }, [open, isEdit, printerData]);

  const counterOptions = (allCounters?.data || []).map((d) => ({
    value: d?._id,
    label: `${d?.code} - ${d?.name}`,
  }));

  const selectedCounter = printerData?.data?.counterId;
  const counterLabel =
    isEdit && selectedCounter
      ? `${selectedCounter.code} - ${selectedCounter.name}`
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onclose}>
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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
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
              name="counterId"
              placeholder="Select counter"
              options={counterOptions}
              value={form.watch("counterId")}
              onChange={(val) => form.setValue("counterId", val)}
              valueLabel={counterLabel}
              setSearch={setSearch}
            />

            {/* Paper width */}
            {/* Paper width */}
<fieldset className="flex flex-col gap-2">
  <legend className="mb-2 text-[12px] font-medium text-black sm:text-[14px]">
    Paper Width
  </legend>
  <div className="flex items-center gap-5">
    {(["58mm", "80mm"] as const).map((w) => (
      <label
        key={w}
        className="flex cursor-pointer items-center gap-2 text-[12px] text-black sm:text-[14px]"
      >
        <input
          type="radio"
          name={`paperWidth-${printerId ?? "new"}`}
          value={w}
          checked={paperWidth === w}
          onChange={() =>
            form.setValue("paperWidth", w, { shouldDirty: true })
          }
          className="size-4 cursor-pointer accent-black"
        />
        {w.replace("mm", " mm")}
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
                <Button
                  type="button"
                  variant="cancel"
                  onClick={() => onclose(false)}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="save"
                  loading={isEdit ? EditPending : isPending}
                >
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