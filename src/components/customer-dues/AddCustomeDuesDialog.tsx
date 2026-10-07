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
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  mobile: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{10}$/.test(v), "Enter a valid 10-digit mobile number"),
  tag: z.string().min(1, "Tag / Tier is required"),
  initialDues: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0), "Enter a valid number"),
  address: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof formSchema>;

const EMPTY: CustomerFormData = {
  fullName: "",
  mobile: "",
  tag: "Regular",
  initialDues: "0",
  address: "",
};

export const TAG_OPTIONS = [
  { value: "Regular", label: "Regular" },
  { value: "Vip", label: "Vip" },
  { value: "Wholesale", label: "Wholesale" },
];

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  customerId?: string;
  customer?: CustomerFormData;
  onSubmit?: (data: CustomerFormData) => void;
}

export function AddCustomerDialog({
  open,
  onOpenChange,
  isEdit = false,
  customer,
  onSubmit,
}: AddCustomerDialogProps) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Fill (edit) or clear (add) the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(isEdit && customer ? customer : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (data: CustomerFormData) => {
    // TODO: call your add / edit customer API here
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
            {isEdit ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <FormInput
              type="text"
              label="Customer Full Name"
              name="fullName"
              placeholder="Full Name"
              value={form.watch("fullName")}
              required
            />

            <FormInput
              type="text"
              label="Mobile Phone Number"
              name="mobile"
              placeholder="Mobile Number"
              value={form.watch("mobile")}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormCombobox
                label="Tag / Tier"
                name="tag"
                placeholder="Select tag"
                options={TAG_OPTIONS}
              />
              <FormInput
                type="number"
                label="Initial Credit Dues"
                name="initialDues"
                placeholder="0"
                value={form.watch("initialDues")}
              />
            </div>

            <FormInput
              type="text"
              label="Address"
              name="address"
              placeholder="Street / Apartment Address"
              value={form.watch("address")}
            />

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save">
                  {isEdit ? "Update Customer" : "Save Customer"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}