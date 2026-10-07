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
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters"),
  category: z.string().min(1, "Category is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter a valid amount"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof formSchema>;

const EMPTY: ExpenseFormData = {
  title: "",
  category: "Rent",
  amount: "0",
  paymentMethod: "Cash",
  notes: "",
};

export const EXPENSE_CATEGORIES = [
  { value: "Rent", label: "Shop Rent" },
  { value: "Electricity", label: "Electricity" },
  { value: "Salary", label: "Salary" },
  { value: "Internet", label: "Internet" },
  { value: "Transport", label: "Transport" },
  { value: "Miscellaneous", label: "Miscellaneous" },
];

const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "Card", label: "Card" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  expenseId?: string;
  expense?: ExpenseFormData;
  onSubmit?: (data: ExpenseFormData) => void;
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  isEdit = false,
  expense,
  onSubmit,
}: AddExpenseDialogProps) {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Fill (edit) or clear (add) the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(isEdit && expense ? expense : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (data: ExpenseFormData) => {
    // TODO: call your add / edit expense API here
    onSubmit?.(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[540px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black sm:text-[16px]">
            {isEdit ? "Edit Shop Expense" : "Record Shop Expense"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <FormInput
              type="text"
              label="Expense title / Description"
              name="title"
              placeholder="eg. Shop rent for October"
              value={form.watch("title")}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormCombobox
                label="Category"
                name="category"
                placeholder="Select category"
                options={EXPENSE_CATEGORIES}
              />
              <FormInput
                type="number"
                label="Amount"
                name="amount"
                placeholder="0"
                value={form.watch("amount")}
                required
              />
            </div>

            <FormCombobox
              label="Payment Method"
              name="paymentMethod"
              placeholder="Select payment method"
              options={PAYMENT_METHODS}
            />

            <FormInput
              type="text"
              label="Notes / Voucher Reference"
              name="notes"
              placeholder="eg. Voucher no. 1024"
              value={form.watch("notes")}
            />

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save">
                  {isEdit ? "Update Expense" : "Save Expense"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}