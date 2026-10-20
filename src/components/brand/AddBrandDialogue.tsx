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
import FormTextArea from "../common/form/FormTextArea";
import { LoadingButton } from "../ui/loading-button";
import { ListBrandByIdApi } from "@/src/api/brand/api/getById";
import { useAddBrand } from "@/src/api/brand/hooks/create.hook";
import { useEditBrand } from "@/src/api/brand/hooks/update.hook";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters")
    .max(50, "Brand name must be at most 50 characters"),
  description: z.string().optional(),
});

export type BrandFormData = z.infer<typeof formSchema>;

const EMPTY: BrandFormData = {
  name: "",
  description: "",
};

interface AddBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  brandId?: string;
}

export function AddBrandDialog({
  open,
  onOpenChange,
  isEdit = false,
  brandId,
}: AddBrandDialogProps) {
  const form = useForm<BrandFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: brandData } = useQuery({
    queryKey: ["brandById", brandId],
    queryFn: () => ListBrandByIdApi(String(brandId)),
    enabled: open && isEdit && !!brandId,
  });

  const { mutate: AddBrand, isPending } = useAddBrand({
    form,
    onOpenChange,
  });
  const { mutate: EditBrand, isPending: EditPending } = useEditBrand({
    form,
    onOpenChange,
  });

  const handleSubmit = (data: BrandFormData) => {
    const payload = {
      name: data.name,
      description: data.description ?? "",
    };

    if (isEdit) {
      EditBrand({ id: String(brandId), value: payload });
    } else {
      AddBrand(payload);
    }
  };

  function onclose(value: boolean) {
    onOpenChange(value);
    form.reset(EMPTY);
  }

  useEffect(() => {
    if (open && isEdit && brandData?.data) {
      const b = brandData.data;
      form.reset({
        name: b.name,
        description: b.description ?? "",
      });
    }
  }, [open, isEdit, brandData]);

  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[493px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black">
            {isEdit ? "Edit Brand" : "Add New Brand"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <FormInput
              type="text"
              label="Brand Name"
              name="name"
              placeholder="eg. Nestle"
              value={form.watch("name")}
              required
            />

            <FormTextArea
              label="Description"
              name="description"
              placeholder="Enter brand description"
              value={form.watch("description")}
              onChange={(e) => form.setValue("description", e.target.value)}
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
                  {isEdit ? "Update Brand" : "Save Brand"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}