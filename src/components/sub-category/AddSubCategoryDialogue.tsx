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
import FormTextArea from "../common/form/FormTextArea";
import { LoadingButton } from "../ui/loading-button";
import { ListCategoryApi } from "@/src/api/category/api/getAll";
import { ListSubCategoryByIdApi } from "@/src/api/sub-category/api/getById";
import { useAddSubCategory } from "@/src/api/sub-category/hooks/create.hook";
import { useEditSubCategory } from "@/src/api/sub-category/hooks/update.hook";


const formSchema = z.object({
  name: z
    .string()
    .min(2, "Sub-category name must be at least 2 characters")
    .max(50, "Sub-category name must be at most 50 characters"),
  categoryId: z.string().min(1, "Category is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type SubCategoryFormData = z.infer<typeof formSchema>;

const EMPTY: SubCategoryFormData = {
  name: "",
  categoryId: "",
  code: "",
  description: "",
  isActive: true,
};

interface AddSubCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  subCategoryId?: string;
}

export function AddSubCategoryDialog({
  open,
  onOpenChange,
  isEdit = false,
  subCategoryId,
}: AddSubCategoryDialogProps) {
  const [search, setSearch] = useState("");

  const form = useForm<SubCategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: subCategoryData } = useQuery({
    queryKey: ["subCategoryById", subCategoryId],
    queryFn: () => ListSubCategoryByIdApi(String(subCategoryId)),
    enabled: open && isEdit && !!subCategoryId,
  });

  const { data: allCategories } = useQuery({
    queryKey: ["categoryList", "dropdown", search],
    queryFn: () => ListCategoryApi({ page: 1, limit: 100, search }),
    enabled: open,
  });

  const { mutate: addSubCategory, isPending } = useAddSubCategory({ form, onOpenChange });
  const { mutate: editSubCategory, isPending: editPending } = useEditSubCategory({
    form,
    onOpenChange,
  });

  const handleSubmit = (data: SubCategoryFormData) => {
    const payload = {
      name: data.name,
      categoryId: data.categoryId,
      code: data.code ?? "",
      description: data.description ?? "",
      isActive: data.isActive,
    };
    if (isEdit) {
      editSubCategory({ id: String(subCategoryId), value: payload });
    } else {
      addSubCategory(payload);
    }
  };

  function onclose(value: boolean) {
    onOpenChange(value);
    if (!value) form.reset(EMPTY);
  }

  useEffect(() => {
    if (open && isEdit && subCategoryData?.data) {
      const s = subCategoryData.data;
      form.reset({
        name: s.name,
        code: s.code ?? "",
        description: s.description ?? "",
        categoryId: s.categoryId?._id ?? "",
        isActive: s.isActive ?? true,
      });
    }
  }, [open, isEdit, subCategoryData, form]);

  const categoryOptions = (allCategories?.data || []).map((d: any) => ({
    value: d._id,
    label: `${d.code ? d.code + " - " : ""}${d.name}`,
  }));

  // Label for the selected category (it may not be in the first 100 results)
  const selectedCategory = subCategoryData?.data?.categoryId;
  const valueLabel =
    isEdit && selectedCategory
      ? `${selectedCategory.code ? selectedCategory.code + " - " : ""}${selectedCategory.name}`
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[493px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black">
            {isEdit ? "Edit Sub Category" : "Add New Sub Category"}
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
                label="Sub Category Code"
                name="code"
                placeholder="eg. SUB-FLOUR-01"
                value={form.watch("code")}
              />
              <FormInput
                type="text"
                label="Sub Category Name"
                name="name"
                placeholder="eg. Wheat Flour"
                value={form.watch("name")}
                required
              />
            </div>

            <FormCombobox
              label="Category"
              name="categoryId"
              placeholder="Select category"
              options={categoryOptions}
              value={form.watch("categoryId")}
              onChange={(val) =>
                form.setValue("categoryId", val, { shouldValidate: true })
              }
              valueLabel={valueLabel}
              setSearch={setSearch}
              required
            />

            <FormTextArea
              label="Description"
              name="description"
              placeholder="Enter sub category description"
              value={form.watch("description")}
              onChange={(e) => form.setValue("description", e.target.value)}
            />

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button type="button" variant="cancel" onClick={() => onclose(false)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="save"
                  loading={isEdit ? editPending : isPending}
                >
                  {isEdit ? "Update Sub Category" : "Save Sub Category"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}