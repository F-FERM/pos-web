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
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";
import { ListStaffByIdApi } from "@/src/api/staff/api/getById";
import { useAddStaff } from "@/src/api/staff/hooks/create.hook";
import { useEditStaff } from "@/src/api/staff/hooks/update.hook";
import { ListPrivilegeApi } from "@/src/api/privilege/api/getAll";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(/^[+\d][\d\s-]{6,17}$/, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .regex(/^\S+@\S+\.\S+$/, "Enter a valid email"),
  designation: z.string().trim().min(1, "Designation is required"),
  pin: z
    .string()
    .min(1, "PIN is required")
    .regex(/^\d{4,6}$/, "PIN must be 4 to 6 digits"),
  privilegeId: z.string().min(1, "Privilege is required"),
});

export type StaffFormData = z.infer<typeof formSchema>;

const EMPTY: StaffFormData = {
  name: "",
  phone: "",
  email: "",
  designation: "",
  pin: "",
  privilegeId: "",
};

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  staffId?: string;
}

export function AddStaffDialog({
  open,
  onOpenChange,
  isEdit = false,
  staffId,
}: AddStaffDialogProps) {
  const [search, setSearch] = useState("");
  const form = useForm<StaffFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: staffData } = useQuery({
    queryKey: ["staffById", staffId],
    queryFn: () => ListStaffByIdApi(String(staffId)),
    enabled: open && isEdit && !!staffId,
  });

  const { data: allPrivileges } = useQuery({
    queryKey: ["privilegeList", search],
    queryFn: () => ListPrivilegeApi({ page: 1, limit: 100, search }),
    enabled: open,
  });

  const { mutate: AddStaff, isPending } = useAddStaff({
    form,
    onOpenChange,
  });
  const { mutate: EditStaff, isPending: EditPending } = useEditStaff({
    form,
    onOpenChange,
  });

const handleSubmit = (data: StaffFormData) => {
  const payload = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    designation: data.designation,
    privilegeId: data.privilegeId,
    pin: data.pin,
  };

  if (isEdit) {
    EditStaff({ id: String(staffId), value: payload });
  } else {
    AddStaff(payload);
  }
};

  function onclose(value: boolean) {
    onOpenChange(value);
    form.reset(EMPTY);
  }

  useEffect(() => {
    if (open && isEdit && staffData?.data) {
      const s = staffData.data;
      form.reset({
        name: s.name,
        phone: s.phone ?? "",
        email: s.email ?? "",
        designation: s.designation ?? "",
        pin: s.pin, 
        privilegeId: s.privilegeId?._id ?? "",
      });
    }
  }, [open, isEdit, staffData]);

  const privilegeOptions = (allPrivileges?.data || []).map((d) => ({
    value: d?._id,
    label: d?.name,
  }));

  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[493px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black">
            {isEdit ? "Edit Staff" : "Add New Staff"}
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
                label="Staff Name"
                name="name"
                placeholder="eg. John Doe"
                value={form.watch("name")}
                required
              />
              <FormInput
                type="text"
                label="Phone"
                name="phone"
                placeholder="eg. +91 98765 43210"
                value={form.watch("phone")}
                required
               
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                type="text"
                label="Email"
                name="email"
                placeholder="eg. john@example.com"
                value={form.watch("email")}
                required
               
              />
              <FormInput
                type="text"
                label="Designation"
                name="designation"
                placeholder="eg. Cashier"
                value={form.watch("designation")}
                required
                
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                type="password"
                label="PIN"
                name="pin"
                placeholder={"Set Staff PIN"}
                value={form.watch("pin")}
                required
              />
              <FormCombobox
                label="Privilege"
                name="privilegeId"
                placeholder="Select privilege"
                options={privilegeOptions}
                value={form.watch("privilegeId")}
                onChange={(val) => form.setValue("privilegeId", val)}
                valueLabel={staffData?.data?.privilegeId?.name}
                setSearch={setSearch}
                required
              />
            </div>

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
                  {isEdit ? "Update Staff" : "Save Staff"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}