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
  name: z
    .string()
    .min(1, "Counter name is required")
    .max(50, "Counter name must be at most 50 characters"),
  code: z
    .string()
    .min(1, "Counter code is required")
    .max(20, "Counter code must be at most 20 characters"),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export type CounterFormData = z.infer<typeof formSchema>;

export type Counter = CounterFormData & { id: string };

const EMPTY: CounterFormData = {
  name: "",
  code: "",
  isDefault: false,
  isActive: true,
};

interface AddCounterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  counterId?: string;
  counter?: CounterFormData;
  onSubmit?: (data: CounterFormData) => void;
}

export function AddCounterDialog({
  open,
  onOpenChange,
  isEdit = false,
  counter,
  onSubmit,
}: AddCounterDialogProps) {
  const form = useForm<CounterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  // Fill (edit) or clear (add) the form each time the dialog opens
  useEffect(() => {
    if (open) form.reset(isEdit && counter ? counter : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isDefault = form.watch("isDefault");
  const isActive = form.watch("isActive");

  const handleSubmit = (data: CounterFormData) => {
    // TODO: call your add / edit counter API here
    console.log(isEdit ? "update counter" : "add counter", data);
    onSubmit?.(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[493px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black">
            {isEdit ? "Edit Counter" : "Add New Counter"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                type="text"
                label="Counter Name"
                name="name"
                placeholder="eg. Counter 1"
                value={form.watch("name")}
                required
              />
              <FormInput
                type="text"
                label="Counter Code"
                name="code"
                placeholder="eg. CNT0001"
                value={form.watch("code")}
                required
              />
            </div>

            <div className="flex flex-col gap-2 rounded-[10px] border border-[#ACACAC] px-3 py-3">
              <label className="flex cursor-pointer items-center gap-2 text-[14px] text-black">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => form.setValue("isDefault", e.target.checked)}
                  className="size-4 cursor-pointer accent-black"
                />
                Set as default counter
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[14px] text-black">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => form.setValue("isActive", e.target.checked)}
                  className="size-4 cursor-pointer accent-black"
                />
                Counter is active
              </label>
            </div>

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save">
                  {isEdit ? "Update Counter" : "Save Counter"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}