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
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import { LoadingButton } from "../ui/loading-button";

export const ROLE_OPTIONS = [
  { value: "Owner", label: "Owner", hint: "Full Access" },
  { value: "Manager", label: "Manager", hint: "Reports & Inventory" },
  { value: "Cashier", label: "Cashier", hint: "POS & Billing" },
];

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  phone: z
    .string()
    .min(1, "Mobile / Phone is required")
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  pin: z
    .string()
    .min(1, "Security PIN is required")
    .regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  role: z.string().min(1, "Role is required"),
  salary: z.string().regex(/^\d*(\.\d+)?$/, "Enter a valid amount").optional(),
});

export type EmployeeFormData = z.infer<typeof formSchema>;

const EMPTY: EmployeeFormData = {
  fullName: "",
  phone: "",
  pin: "",
  role: "Cashier",
  salary: "0",
};

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  employeeId?: string;
  employee?: EmployeeFormData;
  onSubmit?: (data: EmployeeFormData) => void;
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
  isEdit = false,
  employee,
  onSubmit,
}: AddEmployeeDialogProps) {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Fill (edit) or clear (add) the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(isEdit && employee ? employee : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (data: EmployeeFormData) => {
    // TODO: call your add / edit employee API here
    onSubmit?.(data);
    onOpenChange(false);
  };

  const roleError = form.formState.errors.role?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[542px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black sm:text-[16px]">
            {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <FormInput
              type="text"
              label="Employee Full Name"
              name="fullName"
              placeholder="Full Name"
              value={form.watch("fullName")}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                type="text"
                label="Mobile Phone"
                name="phone"
                placeholder="Mobile Number"
                value={form.watch("phone")}
                required
              />
              <FormInput
                type="text"
                label="Security PIN (4 Digits)"
                name="pin"
                placeholder="XXXX"
                value={form.watch("pin")}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Role permission */}
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="role" className="text-[12px] font-medium text-black">
                  Role Permission
                </label>
                <div className="relative">
                  <select
                    id="role"
                    {...form.register("role")}
                    className="h-[34px] w-full appearance-none rounded-[6px] bg-[#E1E1E1] px-3 pr-9 text-[12px] text-black outline-none focus:ring-1 focus:ring-[#F24DEB]"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label} ({r.hint})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-black" />
                </div>
                {roleError && <p className="text-[11px] text-red-600">{roleError}</p>}
              </div>

              <FormInput
                type="text"
                label="Monthly Salary (₹)"
                name="salary"
                placeholder="0"
                value={form.watch("salary")}
              />
            </div>

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save">
                  {isEdit ? "Update Employee" : "Save Employee"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}