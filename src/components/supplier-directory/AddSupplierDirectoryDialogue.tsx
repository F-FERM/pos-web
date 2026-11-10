"use client";

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormPhoneNumberInput from "../common/form/FormPhoneNumberInput";
import FormCombobox from "../common/form/FormCombobox";
import { LoadingButton } from "../ui/loading-button";
import { buildPhone, splitPhone } from "../helpers/SplitPhone";
import { ListSupplierByIdApi } from "@/src/api/supplier/api/getById";
import { ListPaymentTermsApi } from "@/src/api/payment-terms/api/getAll";
import { useAddSupplier } from "@/src/api/supplier/hooks/create.hook";
import { useEditSupplier } from "@/src/api/supplier/hooks/update.hook";
import { PaymentTermsDialog } from "../payment-terms/AddPaymentTermsDialogue";

export const DEFAULT_COUNTRY_CODE = "+91";

const amount = z.union([z.number().min(0, "Cannot be negative"), z.literal("")]);
const percent = z.union([
  z.number().min(0, "Cannot be negative").max(100, "Cannot exceed 100"),
  z.literal(""),
]);

const formSchema = z
  .object({
    contactPerson: z.string().trim().max(100).optional(),
    company: z.string().trim().min(2, "Company name must be at least 2 characters").max(100),
    countryCode: z.string(),
    phone: z.string().min(1, "Mobile / Phone is required"),
    email: z
      .string()
      .optional()
      .refine((v) => !v || z.string().email().safeParse(v).success, "Enter a valid email"),
    gstin: z.string().trim().max(20, "Too long").optional(),
    taxPercentage: percent,
    paymentTermsId: z.string().min(1, "Select payment terms"),
    address: z.string().optional(),
    balanceDue: amount,
    isActive: z.boolean(),
  })
  .superRefine((d, ctx) => {
    if (!d.phone) return;
    const valid =
      d.countryCode === "+91" ? d.phone.length === 10 : d.phone.length >= 6 && d.phone.length <= 15;
    if (!valid) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: d.countryCode === "+91" ? "Enter a valid 10-digit mobile number" : "Enter a valid mobile number",
      });
    }
  });

export type SupplierFormData = z.infer<typeof formSchema>;

const EMPTY: SupplierFormData = {
  contactPerson: "",
  company: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  phone: "",
  email: "",
  gstin: "",
  taxPercentage: "",
  paymentTermsId: "",
  address: "",
  balanceDue: "", 
  isActive: true,
};



interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  supplierId?: string;
}

export function AddSupplierDialog({ open, onOpenChange, isEdit = false, supplierId }: AddSupplierDialogProps) {
  const [termsOpen, setTermsOpen] = useState(false);
const[termSearch,setTermSearch]=useState("")
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: supplierData, isLoading: supplierLoading } = useQuery({
    queryKey: ["supplierById", supplierId],
    queryFn: () => ListSupplierByIdApi(String(supplierId)),
    enabled: open && isEdit && !!supplierId,
  });

  const { data: termsData } = useQuery({
    queryKey: ["paymentTermList",termSearch],
    queryFn: () => ListPaymentTermsApi({ page: 1, limit: 100,search:termSearch }),
    enabled: open,
  });

  const termOptions = useMemo(
    () =>
      (termsData?.data ?? [])
        .filter((t) => t.isActive)
        .map((t) => ({ value: t._id, label: t.name })),
    [termsData],
  );

  const { mutate: AddSupplier, isPending } = useAddSupplier({ form, onOpenChange });
  const { mutate: EditSupplier, isPending: EditPending } = useEditSupplier({ form, onOpenChange });

  const isActive = form.watch("isActive");
  const countryCode = form.watch("countryCode");
  const paymentTermsId = form.watch("paymentTermsId");

  const handleSubmit = (data: SupplierFormData) => {
    const payload = {
      name: data.company.trim(),
      contactPerson: (data.contactPerson ?? "").trim(),
      phone: buildPhone(data.countryCode, data.phone),
      email: (data.email ?? "").trim(),
      taxPercentage: String(Number(data.taxPercentage || 0)),
      address: (data.address ?? "").trim(),
      ...(data.balanceDue !== "" ? { balanceDue: Number(data.balanceDue) } : {}),
      gstinNumber: (data.gstin ?? "").trim().toUpperCase(),
      paymentTermsId: data.paymentTermsId,
      isActive: data.isActive,
    };
    if (isEdit) EditSupplier({ id: String(supplierId), value: payload });
    else AddSupplier(payload);
  };

  function onclose(value: boolean) {
    onOpenChange(value);
    form.reset(EMPTY);
  }

  // Fill the form when editing
  useEffect(() => {
    if (open && isEdit && supplierData?.data) {
      const s = supplierData.data;
      const { countryCode, phone } = splitPhone(s.phone ?? "");
      form.reset({
        contactPerson: s.contactPerson ?? "",
        company: s.name ?? "",
        countryCode,
        phone,
        email: s.email ?? "",
        gstin: s.gstinNumber ?? "",
        taxPercentage: s.taxPercentage ?? "",
        paymentTermsId: s.paymentTermsId?._id ?? "",
        address: s.address ?? "",
        balanceDue: s.balanceDue ?? "",
        isActive: s.isActive,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, supplierData]);


  return (
    <>
      <Dialog open={open} onOpenChange={onclose}>
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
                  label="Company / Distributer Name"
                  name="company"
                  placeholder="Distributer Name"
                  value={form.watch("company")}
                  required
                />
                <FormInput
                  type="text"
                  label="Contact Person Name"
                  name="contactPerson"
                  placeholder="Full Name"
                  value={form.watch("contactPerson")}
                />

              

                <FormPhoneNumberInput
                  name="phone"
                  label="Mobile / Phone"
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
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    type="text"
                    label="GST / TRN"
                    name="gstin"
                    placeholder="GSTIN"
                    value={form.watch("gstin")}
                  />
                  <FormInput
                    type="number"
                    label="Tax Percentage (%)"
                    name="taxPercentage"
                    placeholder="0"
                    min={0}
                    value={form.watch("taxPercentage")}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormCombobox
                    label="Payment terms"
                    name="paymentTermsId"
                    placeholder="Select payment terms"
                    options={termOptions}
                    value={paymentTermsId}
                    valueLabel={termOptions.find((t) => t.value === paymentTermsId)?.label}
                    onChange={(val) => form.setValue("paymentTermsId", val, { shouldValidate: true })}
                    onAdd={() => setTermsOpen(true)}
                    setSearch={setTermSearch}
                    required
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

                <FormInput
                  type="text"
                  label="Warehouse Address"
                  name="address"
                  placeholder="Street / Address Details"
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
                    Active supplier
                  </label>
                </div>

                <DialogFooter className="mt-2">
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                    <Button type="button" variant="cancel" onClick={() => onclose(false)}>
                      Cancel
                    </Button>
                    <LoadingButton type="submit" variant="save" loading={isEdit ? EditPending : isPending}>
                      {isEdit ? "Update Supplier" : "Save Supplier"}
                    </LoadingButton>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          
        </DialogContent>
      </Dialog>

      <PaymentTermsDialog
        open={termsOpen}
        onOpenChange={setTermsOpen}
        onDeleted={(id) => {
          if (form.getValues("paymentTermsId") === id) form.setValue("paymentTermsId", "");
        }}
      />
    </>
  );
}