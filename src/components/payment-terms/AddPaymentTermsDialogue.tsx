"use client";

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import FormCombobox from "../common/form/FormCombobox";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { LoadingButton } from "../ui/loading-button";
import { PaymentTermType } from "@/src/interfaces/enums/PaymentTermsType";
import { PaymentTerms } from "@/src/interfaces/payment-terms/getAll.type";
import { AddPaymentTermPayload } from "@/src/interfaces/payment-terms/create.type";
import { ListPaymentTermsApi } from "@/src/api/payment-terms/api/getAll";
import { useAddPaymentTerms } from "@/src/api/payment-terms/hooks/create.hook";
import { useEditPaymentTerms } from "@/src/api/payment-terms/hooks/update.hook";
import { useDeletePaymentTerm } from "@/src/api/payment-terms/hooks/delete.hook";

const TYPE_OPTIONS = [
  { value: PaymentTermType.FIXED, label: "Fixed (Net days)" },
  { value: PaymentTermType.END_OF_MONTH, label: "End of month" },
  { value: PaymentTermType.END_OF_NEXT_MONTH, label: "End of next month" },
  { value: PaymentTermType.CUSTOM, label: "Custom" },
];

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name must be at most 50 characters"),
  type: z.nativeEnum(PaymentTermType, { message: "Select a type" }),
   numberOfDays: z
    .union([z.string(), z.number()])
    .optional()
    .refine(
      (v) => v === undefined || v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 1),
      "Must be at least 1",
    ),
});

export type PaymentTermFormData = z.infer<typeof formSchema>;

const EMPTY = {
  name: "",
  type: "",
  numberOfDays: "",
} as unknown as PaymentTermFormData;

const TermsSkeleton = () => (
  <div className="flex flex-col gap-2">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="flex animate-pulse items-center justify-between gap-3 rounded-[10px] bg-[#DEDEDE] px-3 py-2"
      >
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-3 w-1/2 rounded bg-[#C4C4C4]" />
          <div className="h-2 w-1/3 rounded bg-[#CFCFCF]" />
        </div>
        <div className="flex gap-1">
          <div className="size-8 rounded-md bg-[#C4C4C4]" />
          <div className="size-8 rounded-md bg-[#C4C4C4]" />
        </div>
      </div>
    ))}
  </div>
);

interface PaymentTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: (id: string) => void;
}

export function PaymentTermsDialog({ open, onOpenChange, onDeleted }: PaymentTermsDialogProps) {
  const [editing, setEditing] = useState<PaymentTerms | null>(null);
  const [toDelete, setToDelete] = useState<PaymentTerms | null>(null);

  const form = useForm<PaymentTermFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["paymentTermList"],
    queryFn: () => ListPaymentTermsApi({ page: 1, limit: 100 }),
    enabled: open,
  });
  const terms = data?.data ?? [];

const afterSave = (value: boolean) => onclose(value);

  const { mutate: AddTerm, isPending } = useAddPaymentTerms({ form, onOpenChange: afterSave });
  const { mutate: EditTerm, isPending: EditPending } = useEditPaymentTerms({ form, onOpenChange: afterSave });
  const { mutate: deleteTerm, isPending: deleting } = useDeletePaymentTerm();

  const type = form.watch("type");

  const handleSubmit = (d: PaymentTermFormData) => {
    const payload: AddPaymentTermPayload = {
      name: d.name,
      type: d.type,
      ...(d.numberOfDays ? { numberOfDays: Number(d.numberOfDays) } : {}),
    };

    if (editing) EditTerm({ id: editing._id, value: payload });
    else AddTerm(payload);
  };

  const startEdit = (t: PaymentTerms) => {
    setEditing(t);
    form.reset({
      name: t.name,
      type: t.type as PaymentTermType,
      numberOfDays: t.numberOfDays != null ? String(t.numberOfDays) : "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    form.reset(EMPTY);
  };

  function onclose(value: boolean) {
    if (!value) cancelEdit();
    onOpenChange(value);
  }

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteTerm(
      { id: toDelete._id, paymentTermName: toDelete.name },
      {
        onSuccess: () => {
          onDeleted?.(toDelete._id);
          if (editing?._id === toDelete._id) cancelEdit();
          setToDelete(null);
        },
      },
    );
  };

  return (
    <>
    <Dialog open={open && !toDelete} onOpenChange={onclose}>
       <DialogContent
  aria-describedby={undefined}
  showCloseButton={false}
  className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[640px] sm:max-w-[640px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
>
          <DialogHeader className="flex flex-row items-center justify-between border-b border-[#D5D5D5] pb-3 text-left">
            <DialogTitle className="text-[14px] font-semibold text-black">Payment Terms</DialogTitle>
            <button
              type="button"
              aria-label="Close"
              onClick={() => onclose(false)}
              className="flex size-[32px] items-center justify-center cursor-pointer rounded-[8px] bg-[#8B8B8B] text-white hover:bg-[#767676]"
            >
              <X className="size-4" />
            </button>
          </DialogHeader>

          {/* 1. Add / Edit form: 3 fields + submit */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-3 py-3">
              

              <FormInput
                type="text"
                label="Name"
                name="name"
                placeholder="eg. 15 Days Credit"
                value={form.watch("name")}
                required
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormCombobox
                  label="Type"
                  name="type"
                  placeholder="Select type"
                  options={TYPE_OPTIONS}
                  value={type}
                  valueLabel={TYPE_OPTIONS.find((o) => o.value === type)?.label}
                  onChange={(v) => form.setValue("type", v as PaymentTermType, { shouldValidate: true })}
                  required
                />
                <FormInput
                  type="number"
                  label="Number of Days"
                  name="numberOfDays"
                  placeholder="15"
                  min={1}
                  value={form.watch("numberOfDays")}
                />
              </div>

              <div className="flex justify-end gap-2">
                {editing && (
                  <Button type="button" variant="cancel" onClick={cancelEdit}>
                    Cancel edit
                  </Button>
                )}
                <LoadingButton type="submit" variant="save" loading={editing ? EditPending : isPending}>
                  {editing ? "Update Term" : "Add Term"}
                </LoadingButton>
              </div>
            </form>
          </Form>

          {/* 2. List below the form, with edit / delete icons */}
          <div className="flex max-h-[240px] flex-col gap-2 overflow-y-auto border-t border-[#D5D5D5] pt-3 [scrollbar-width:thin]">
            {isLoading ? (
              <TermsSkeleton />
            ) : terms.length === 0 ? (
              <p className="py-4 text-center text-[12px] text-[#848484]">No payment terms yet</p>
            ) : (
              terms.map((t) => (
                <div
                  key={t._id}
                  className={`flex items-center justify-between gap-3 rounded-[10px] px-3 py-2 ${
                    editing?._id === t._id ? "bg-[#C4C4C4]" : "bg-[#DEDEDE]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-black">{t.name}</p>
                    <p className="text-[10px] text-[#585858]">
                      {TYPE_OPTIONS.find((o) => o.value === t.type)?.label ?? t.type}
                      {t.numberOfDays ? ` · ${t.numberOfDays} days` : ""}
                    
                    </p>
                  </div>
                  {!t.isSystemGenerated && (
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="editicon"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => startEdit(t)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="deleteicon"
                        aria-label="Delete"
                        onClick={() => setToDelete(t)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && !deleting && setToDelete(null)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete payment term "${toDelete?.name}"?`}
        isPending={deleting}
      />
    </>
  );
}