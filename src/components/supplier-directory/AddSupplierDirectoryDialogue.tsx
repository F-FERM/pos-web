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
import { LoadingButton } from "../ui/loading-button";

const formSchema = z.object({
  contactPerson: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters"),
  phone: z
    .string()
    .min(1, "Mobile / Phone is required")
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  gstin: z.string().optional(),
  paymentTerms: z.string().optional(),
  address: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof formSchema>;

const EMPTY: SupplierFormData = {
  contactPerson: "",
  company: "",
  phone: "",
  gstin: "",
  paymentTerms: "15 Days Credit",
  address: "",
};

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  supplierId?: string;
  supplier?: SupplierFormData;
  onSubmit?: (data: SupplierFormData) => void;
}

export function AddSupplierDialog({
  open,
  onOpenChange,
  isEdit = false,
  supplier,
  onSubmit,
}: AddSupplierDialogProps) {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Fill (edit) or clear (add) the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(isEdit && supplier ? supplier : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (data: SupplierFormData) => {
    // TODO: call your add / edit supplier API here
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
            {isEdit ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <FormInput
              type="text"
              label="Contact Person Name"
              name="contactPerson"
              placeholder="Full Name"
              value={form.watch("contactPerson")}
              required
            />

            <FormInput
              type="text"
              label="Company / Distributer Name"
              name="company"
              placeholder="Distributer Name"
              value={form.watch("company")}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                type="text"
                label="Mobile / Phone"
                name="phone"
                placeholder="Mobile Number"
                value={form.watch("phone")}
                required
              />
              <FormInput
                type="text"
                label="GSTIN (Optional)"
                name="gstin"
                placeholder="GSTIN"
                value={form.watch("gstin")}
              />
            </div>

            <FormInput
              type="text"
              label="Payment terms"
              name="paymentTerms"
              placeholder="15 Days Credit"
              value={form.watch("paymentTerms")}
            />

            <FormInput
              type="text"
              label="Warehouse Address"
              name="address"
              placeholder="Street / Address Details"
              value={form.watch("address")}
            />

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save">
                  {isEdit ? "Update Supplier" : "Save Supplier"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}