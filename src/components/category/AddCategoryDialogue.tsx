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
import { ListCategoryByIdApi } from "@/src/api/category/api/getById";
import { ListCategoryApi } from "@/src/api/category/api/getAll";
import { useAddCategory } from "@/src/api/category/hooks/create.hook";
import { useEditCategory } from "@/src/api/category/hooks/update.hook";
import FormTextArea from "../common/form/FormTextArea";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters"),
  code: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(), 
});

export type CategoryFormData = z.infer<typeof formSchema>;

const EMPTY: CategoryFormData = {
  name: "",
  code: "",
  description: "",
  parentId: "",
};

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  categoryId?: string;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  isEdit = false,
  categoryId,
}: AddCategoryDialogProps) {
  const [search, setSearch] = useState("");
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categoryById", categoryId],
    queryFn: () => ListCategoryByIdApi(String(categoryId)),
    enabled: open && isEdit && !!categoryId,
  });

  const { data: allCategories } = useQuery({
    queryKey: ["categoryList",search],
    queryFn: () => ListCategoryApi({ page: 1, limit: 100, search: search }),
    enabled: open,
  });

  const { mutate: AddCategory, isPending } = useAddCategory({
    form,
    onOpenChange,
  });
  const { mutate: EditCategory, isPending: EditPending } = useEditCategory({
    form,
    onOpenChange,
  });

  const handleSubmit = (data: CategoryFormData) => {
    if (isEdit) {
      EditCategory({
        id: String(categoryId),
        value: {
          name: data.name,
          code: data.code ?? "",
          description: data.description ?? "",
           ...(data.parentId ? { parentId: data.parentId } : {}),
        },
      });
    } else {
      AddCategory({
        name: data.name,
        code: data.code ?? "",
        description: data.description ?? "",
         ...(data.parentId ? { parentId: data.parentId } : {}),
      
      });
    }
  };

  function onclose(value: boolean) {
    onOpenChange(value);
  form.reset();
  }

  useEffect(() => {
    if (open && isEdit && categoryData?.data) {
      const c = categoryData.data;
      form.reset({
        name: c.name,
        code: c.code ?? "",
        description: c.description ?? "",
        parentId: c.parentId?._id ?? "",
      });
    }
  }, [open, isEdit, categoryData]);

  const parentOptions = (allCategories?.data || []).map(
    (d) => ({
      value: d?._id,
      label: `${d?.code} - ${d?.name}`,
    }),
  );

 
  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[493px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black">
            {isEdit ? "Edit Category" : "Add New Category"}
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
                label="Category Code"
                name="code"
                placeholder="eg. CAT0001"
                value={form.watch("code")}
              />
              <FormInput
                type="text"
                label="Category Name"
                name="name"
                placeholder="eg. Spices & Salt"
                value={form.watch("name")}
                required
              />
            </div>

           

            <FormCombobox
              label="Parent Category"
              name="parentId"
              placeholder="Select parent category"
              options={parentOptions}
              value={form.watch("parentId")}
              onChange={(val) => form.setValue("parentId", val)}
              valueLabel={`${categoryData?.data?.code} -${categoryData?.data?.name}`}  
              setSearch={setSearch}   
                   />
 <FormTextArea
            
              label="Description"
              name="description"
              placeholder="Enter category description"
              value={form.watch("description")}
               onChange={(e) =>
                form.setValue("description", e.target.value)
              }
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
                  {isEdit ? "Update Category" : "Save Category"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}