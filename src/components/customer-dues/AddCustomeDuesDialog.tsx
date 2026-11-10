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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormPhoneNumberInput from "../common/form/FormPhoneNumberInput";
import { LoadingButton } from "../ui/loading-button";
import { ListCustomerByIdApi } from "@/src/api/customer/api/getById";
import { useAddCustomer } from "@/src/api/customer/hooks/create.hook";
import { useEditCustomer } from "@/src/api/customer/hooks/update.hook";
import { CustomerTag } from "@/src/interfaces/enums/CustomerTag";
import FormCombobox from "../common/form/FormCombobox";
import { buildPhone, splitPhone } from "../helpers/SplitPhone";

export const DEFAULT_COUNTRY_CODE = "+91";
const optionalAmount = z.union([
  z.number().min(0, "Cannot be negative"),
  z.literal(""),
]);
const TAG_OPTIONS = [
  { value: CustomerTag.REGULAR, label: "Regular" },
  { value: CustomerTag.VIP, label: "VIP" },
  { value: CustomerTag.WHOLESALE, label: "Wholesale" },
];

// Only `name` and `phone` ,email are required
const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    countryCode: z.string(),
    phone: z.string().min(1, "Mobile number is required"),
    email: z
      .string()
      .optional()
      .refine((v) => !v || z.string().email().safeParse(v).success, "Enter a valid email"),
    address: z.string().optional(),
tag: z.nativeEnum(CustomerTag),

    creditLimit: optionalAmount,
    balanceDue: optionalAmount,
    loyaltyPoints: optionalAmount,
    isActive: z.boolean(),
  })
  .superRefine((d, ctx) => {
    if (!d.phone) return;
    const valid =
      d.countryCode === "+91"
        ? d.phone.length === 10
        : d.phone.length >= 6 && d.phone.length <= 15;
    if (!valid) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          d.countryCode === "+91"
            ? "Enter a valid 10-digit mobile number"
            : "Enter a valid mobile number",
      });
    }
  });

export type CustomerFormData = z.infer<typeof formSchema>;

const EMPTY: CustomerFormData = {
  name: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  phone: "",
  email: "",
  address: "",
  creditLimit: 0,
  balanceDue: 0,
  loyaltyPoints: 0,
  isActive: true,
  tag: CustomerTag.REGULAR,
};

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  customerId?: string;
}

export function AddCustomerDialog({
  open,
  onOpenChange,
  isEdit = false,
  customerId,
}: AddCustomerDialogProps) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: customerData } = useQuery({
    queryKey: ["customerById", customerId],
    queryFn: () => ListCustomerByIdApi(String(customerId)),
    enabled: open && isEdit && !!customerId,
  });

  const { mutate: AddCustomer, isPending } = useAddCustomer({ form, onOpenChange });
  const { mutate: EditCustomer, isPending: EditPending } = useEditCustomer({
    form,
    onOpenChange,
  });

  const isActive = form.watch("isActive");
  const countryCode = form.watch("countryCode");
const tag = form.watch("tag");
  const handleSubmit = (data: CustomerFormData) => {
    const payload = {
      name: data.name.trim(),
      phone: buildPhone(data.countryCode, data.phone),
      email: (data.email ?? "").trim(),
      address: (data.address ?? "").trim(),
      creditLimit: Number(data.creditLimit || 0),
      balanceDue: Number(data.balanceDue || 0),
      loyaltyPoints: Number(data.loyaltyPoints || 0),
       tag: data.tag,
      isActive: data.isActive,
    };

    if (isEdit) {
      EditCustomer({ id: String(customerId), value: payload });
    } else {
      AddCustomer(payload);
    }
  };

  function onclose(value: boolean) {
    onOpenChange(value);
    form.reset(EMPTY);
  }

  // Fill the form when editing (data loaded from getById)
  useEffect(() => {
    if (open && isEdit && customerData?.data) {
      const c = customerData.data;
          const { countryCode, phone } = splitPhone(c.phone ?? "");
      form.reset({
        name: c.name,
      countryCode,
      phone,
        email: c.email ?? "",
        address: c.address ?? "",
        creditLimit: c.creditLimit ?? 0,
        balanceDue: c.balanceDue ?? 0,
        loyaltyPoints: c.loyaltyPoints ?? 0,
        isActive: c.isActive,
        tag: (c.tag as CustomerTag) ?? CustomerTag.REGULAR,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, customerData]);

  return (
    <Dialog open={open} onOpenChange={onclose}>
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
              name="name"
              placeholder="Full Name"
              value={form.watch("name")}
              required
            />

            <FormPhoneNumberInput
              name="phone"
              label="Mobile Phone Number"
              placeholder="Mobile Number"
              required
              defaultCountryCode={countryCode}
              onChange={(_, code) => form.setValue("countryCode", code)}
            />

            <FormInput
              type="text"
              label="Email"
              name="email"
              placeholder="Email address"
              value={form.watch("email")}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                type="number"
                label="Credit Limit"
                name="creditLimit"
                placeholder="0"
                min={0}
                value={form.watch("creditLimit")}
              />
              <FormInput
                type="number"
                label="Outstanding Dues"
                name="balanceDue"
                placeholder="0"
                min={0}
                value={form.watch("balanceDue")}
              />
            </div>

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
       <FormInput
    type="number"
    label="Loyalty Points"
    name="loyaltyPoints"
    placeholder="0"
    min={0}
    value={form.watch("loyaltyPoints")}
  />
  <FormCombobox
    label="Tag/Tier"
    name="tag"
    placeholder="Select tag"
    options={TAG_OPTIONS}
    value={form.watch("tag")}
    onChange={(val) => form.setValue("tag", val as CustomerTag)}
    valueLabel={TAG_OPTIONS.find((t) => t.value === form.watch("tag"))?.label}
  />
</div>

            <FormInput
              type="text"
              label="Address"
              name="address"
              placeholder="Street / Apartment Address"
              value={form.watch("address")}
            />

            <div className="rounded-[10px] border border-[#ACACAC] px-3 py-3">
              <label className="flex cursor-pointer items-center gap-2 text-[14px] text-black">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => form.setValue("isActive", e.target.checked)}
                  className="size-4 cursor-pointer accent-black"
                />
                Active customer
              </label>
            </div>

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onclose(false)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="save"
                  loading={isEdit ? EditPending : isPending}
                >
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