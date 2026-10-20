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
import { LoadingButton } from "../ui/loading-button";
import { ListCounterByIdApi } from "@/src/api/counter/api/getById";
import { useAddCounter } from "@/src/api/counter/hooks/create.hook";
import { useEditCounter } from "@/src/api/counter/hooks/update.hook";

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
 
});

export type CounterFormData = z.infer<typeof formSchema>;

const EMPTY: CounterFormData = {
  name: "",
  code: "",
  isDefault: false,
};

interface AddCounterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  counterId?: string;
}

export function AddCounterDialog({
  open,
  onOpenChange,
  isEdit = false,
  counterId,
}: AddCounterDialogProps) {
  const form = useForm<CounterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: counterData } = useQuery({
    queryKey: ["counterById", counterId],
    queryFn: () => ListCounterByIdApi(String(counterId)),
    enabled: open && isEdit && !!counterId,
  });

  const { mutate: AddCounter, isPending } = useAddCounter({
    form,
    onOpenChange,
  });
  const { mutate: EditCounter, isPending: EditPending } = useEditCounter({
    form,
    onOpenChange,
  });

  const isDefault = form.watch("isDefault");

  const handleSubmit = (data: CounterFormData) => {
    const payload = {
      name: data.name,
      code: data.code,
      isDefault: data.isDefault,
    };

    if (isEdit) {
      EditCounter({ id: String(counterId), value: payload });
    } else {
      AddCounter(payload);
    }
  };

  function onclose(value: boolean) {
    onOpenChange(value);
    form.reset(EMPTY);
  }

  useEffect(() => {
    if (open && isEdit && counterData?.data) {
      const c = counterData.data;
      form.reset({
        name: c.name,
        code: c.code ?? "",
        isDefault: c.isDefault,
       
      });
    }
  }, [open, isEdit, counterData]);

  return (
    <Dialog open={open} onOpenChange={onclose}>
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
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <FormInput
                type="text"
                label="Counter Code"
                name="code"
                placeholder="eg. CNT0001"
                value={form.watch("code")}
                required
              />
              <FormInput
                type="text"
                label="Counter Name"
                name="name"
                placeholder="eg. Counter 1"
                value={form.watch("name")}
                required
              />
             
            </div>

            <div className="rounded-[10px] border border-[#ACACAC] px-3 py-3">
              <label className="flex cursor-pointer items-center gap-2 text-[14px] text-black">
                <input
                  type="radio"
                  name="isDefault"
                  checked={isDefault}
                  onChange={() => {}}
                  onClick={() => form.setValue("isDefault", !isDefault)}
                  className="size-4 cursor-pointer accent-black"
                />
                Set as default counter
              </label>
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