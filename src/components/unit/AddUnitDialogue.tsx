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
import { ListUnitByIdApi } from "@/src/api/unit/api/getById";
import { useAddUnit } from "@/src/api/unit/hooks/create.hook";
import { useEditUnit } from "@/src/api/unit/hooks/update.hook";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Unit name is required")
    .max(50, "Unit name must be at most 50 characters"),
  symbol: z
    .string()
    .trim()
    .min(1, "Unit symbol is required")
    .max(10, "Unit symbol must be at most 10 characters"),
});

export type UnitFormData = z.infer<typeof formSchema>;

const EMPTY: UnitFormData = { name: "", symbol: "" };

interface AddUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  unitId?: string;
}

export function AddUnitDialog({
  open,
  onOpenChange,
  isEdit = false,
  unitId,
}: AddUnitDialogProps) {
  const form = useForm<UnitFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: unitData } = useQuery({
    queryKey: ["unitById", unitId],
    queryFn: () => ListUnitByIdApi(String(unitId)),
    enabled: open && isEdit && !!unitId,
  });

  const { mutate: AddUnit, isPending } = useAddUnit({ form, onOpenChange });
  const { mutate: EditUnit, isPending: EditPending } = useEditUnit({
    form,
    onOpenChange,
  });

  const handleSubmit = (data: UnitFormData) => {
    if (isEdit) {
      EditUnit({
        id: String(unitId),
        value: { name: data.name, symbol: data.symbol },
      });
    } else {
      AddUnit({ name: data.name, symbol: data.symbol });
    }
  };

  function onclose(value: boolean) {
    onOpenChange(value);
    form.reset();
  }

  useEffect(() => {
    if (open && isEdit && unitData?.data) {
      const u = unitData.data;
      form.reset({ name: u.name, symbol: u.symbol ?? "" });
    }
  }, [open, isEdit, unitData]);

  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[493px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black">
            {isEdit ? "Edit Unit" : "Add New Unit"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <FormInput
              type="text"
              label="Unit Name"
              name="name"
              placeholder="Enter unit name"
              value={form.watch("name")}
              required
            />
            <FormInput
              type="text"
              label="Unit Symbol"
              name="symbol"
              placeholder="eg. kg, ltr, pcs"
              value={form.watch("symbol")}
              required
            />

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
                  {isEdit ? "Update Unit" : "Save Unit"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}