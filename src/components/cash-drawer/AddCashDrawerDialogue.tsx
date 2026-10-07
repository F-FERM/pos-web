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
  type: z.string().min(1, "Transaction type is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter an amount greater than 0"),
  reason: z.string().optional(),
});

export type CashDrawerFormData = z.infer<typeof formSchema>;

const EMPTY: CashDrawerFormData = {
  type: "Cash In",
  amount: "0",
  reason: "",
};

export const TRANSACTION_TYPE_OPTIONS = [
  { value: "Cash In", label: "Cash In (Float Addition)" },
  { value: "Cash Out", label: "Cash Out (Petty Cash / Expenses)" },
  { value: "Safe Drop", label: "Safe Drop (Locker)" },
];

interface AddCashDrawerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CashDrawerFormData) => void;
}

export function AddCashDrawerDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddCashDrawerDialogProps) {
  const form = useForm<CashDrawerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Clear the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (data: CashDrawerFormData) => {
    onSubmit?.(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[472px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black sm:text-[16px]">
            Record Cash Drawer Transaction
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <FormCombobox
              label="Transaction Type"
              name="type"
              placeholder="Select transaction type"
              options={TRANSACTION_TYPE_OPTIONS}
            />

            <FormInput
              type="number"
              label="Amount"
              name="amount"
              placeholder="0"
              value={form.watch("amount")}
              required
            />

            <FormInput
              type="text"
              label="Reason / Voucher Info"
              name="reason"
              placeholder="eg. Milk Delivery Payment, Additional Float Change"
              value={form.watch("reason")}
            />

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  CANCEL
                </Button>
                <LoadingButton type="submit" variant="save">
                  SAVE
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}