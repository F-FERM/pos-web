"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { LoadingButton } from "../ui/loading-button";
import { NumberSettingDocType } from "@/src/interfaces/enums/NumberSettings";
import { ListNumberSettingsApi } from "@/src/api/number-settings/api/getAll";
import { useAddNumberSettings } from "@/src/api/number-settings/hooks/create.hook";

const NumberSettingsSchema = z.object({
  prefix: z.string().trim().max(10, "Prefix is too long"),
  nextNumber: z
    .string()
    .trim()
    .min(1, "Next number is required")
    .regex(/^\d+$/, "Numbers only"),
});

export type NumberSettingsFormValues = z.infer<typeof NumberSettingsSchema>;

interface NumberSettingModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: (newNumber: string) => void;
  docType: NumberSettingDocType;
  title: string;
  description: string;
  radioName: string;
  autoLabel: string;
  prefixPlaceholder: string;
}

const DEFAULT_PREFIXES: Record<string, string> = {
  INVOICE: "INV-",
  PURCHASE_ORDER: "PO-",
  BILL: "BILL-",
  SALE_RETURN: "SR-",
  ACCOUNT_TRANSACTION: "AT-",
};

const inputClass =
  "h-10 w-full rounded-[10px] border border-[#D5D5D5] bg-white px-3 text-[13px] text-black placeholder:text-[#BCBCBC] focus:outline-none focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "text-[12px] font-medium text-black sm:w-28 shrink-0";

export default function NumberSettingModal({
  open,
  onClose,
  onSaveSuccess,
  docType,
  title,
  description,
  radioName,
  autoLabel,
  prefixPlaceholder,
}: NumberSettingModalProps) {
  const [localAuto, setLocalAuto] = useState(true);

  const form = useForm<NumberSettingsFormValues>({
    resolver: zodResolver(NumberSettingsSchema),
    defaultValues: { prefix: "", nextNumber: "" },
  });

  const { data: numbersettingsData } = useQuery({
    queryKey: ["numberSettings", docType],
    queryFn: () => ListNumberSettingsApi(docType),
    enabled: open,
  });

  const { mutate: addNumberSettings, isPending } = useAddNumberSettings({
    form,
    onOpenChange: (val) => {
      if (!val) onClose();
    },
  });

  // Sync form values & mode when settings load or modal opens
  useEffect(() => {
    if (!open) return;

    if (!numbersettingsData?.data) {
      form.setValue("prefix", DEFAULT_PREFIXES[docType] || "");
      form.setValue("nextNumber", "0001");
      setLocalAuto(true);
      return;
    }

    const s = numbersettingsData.data;
    setLocalAuto(s.mode !== "Manual");
    form.setValue("prefix", s.prefix ?? "");
    form.setValue("nextNumber", String(s.nextNumberRaw ?? ""));
  }, [open, numbersettingsData, form, docType]);

  const handleModeChange = (auto: boolean) => {
    setLocalAuto(auto);
    form.clearErrors();
    if (auto) {
      form.setValue("prefix", numbersettingsData?.data?.prefix ?? "");
      form.setValue(
        "nextNumber",
        String(numbersettingsData?.data?.nextNumberRaw ?? ""),
      );
    }
  };

  const handleSubmit = (values: NumberSettingsFormValues) => {
    addNumberSettings(
      {
        docType,
        prefix: values.prefix,
        nextNumber: Number(values.nextNumber),
        mode: localAuto ? "Auto" : "Manual",
      },
      {

        onSuccess: () => {
          onSaveSuccess?.(`${values.prefix}${values.nextNumber}`);
        },
      },
    );
  };

  const { errors } = form.formState;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[520px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black sm:text-[16px]">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <p className="text-[12px] text-[#848484]">{description}</p>

            {/* Auto option */}
            <div className="rounded-[10px] border border-[#D5D5D5] bg-[#E5E5E5] p-3">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-black">
                <input
                  type="radio"
                  name={radioName}
                  className="size-4 cursor-pointer accent-black"
                  checked={localAuto}
                  onChange={() => handleModeChange(true)}
                />
                {autoLabel}
              </label>

              <div className="mt-3 flex flex-col gap-3 pl-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <label className={labelClass}>Prefix</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      {...form.register("prefix")}
                      placeholder={prefixPlaceholder}
                      className={inputClass}
                    />
                    {errors.prefix && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.prefix.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <label className={labelClass}>Next Number</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      {...form.register("nextNumber")}
                      placeholder="0001"
                      className={inputClass}
                    />
                    {errors.nextNumber && (
                      <p className="mt-1 text-[11px] text-red-500">
                        {errors.nextNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Manual option */}
            <div className="rounded-[10px] border border-[#ACACAC] px-3 py-3">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-black">
                <input
                  type="radio"
                  name={radioName}
                  className="size-4 cursor-pointer accent-black"
                  checked={!localAuto}
                  onChange={() => handleModeChange(false)}
                />
                Enter number manually
              </label>
            </div>

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={onClose}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save" loading={isPending}>
                  Save
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}