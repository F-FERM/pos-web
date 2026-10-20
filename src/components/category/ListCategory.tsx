"use client";

import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import ErrorHandling from "../Error/ErrorHandling";

import AddCategory from "./AddCategory";

import { ListCategoryApi } from "@/src/api/category/api/getAll";
import { useDeleteCategory } from "@/src/api/category/hooks/delete.hook";
import CategoryTableSkeleton from "./CategorySkeletonLoading";
import { PaginationComponent } from "../common/PaginationComponent";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CategorySettings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

   const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categoryList", currentPage, pageSize, ],
    queryFn: () => ListCategoryApi({  page: currentPage, limit: pageSize }),
    
  });


  const categories = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

 const openDeleteDialog = (id: string, name: string) => {
    setIsConfirmDialogOpen(true);
    setCategoryToDelete({ id: id, name: name });
  };

  const { mutate: DeleteCategory, isPending } = useDeleteCategory();

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      DeleteCategory(
        {
          id: categoryToDelete.id,
      
          categoryName: categoryToDelete.name,
        },
        {
          onSuccess: () => {
            setIsConfirmDialogOpen(false);
            setCategoryToDelete(null);
          },
        }
      );
    }
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setCategoryToDelete(null);
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <ErrorHandling message={error.message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <AddCategory isEdit={false} />
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Category ID</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Parent Category</TableHead>     
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <CategoryTableSkeleton />
            ) : categories.length === 0 ? (
              <TableEmpty colSpan={5}>No categories found</TableEmpty>
            ) : (
              categories.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.code || "-"}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell className="max-w-[220px] truncate" title={c.description}>
                    {c.description || "-"}
                  </TableCell>
                  <TableCell>{c.parentId?.name ?? "None"}</TableCell>
                
                <TableCell>
  <div className="flex items-center justify-center gap-2">
    {/* Edit */}
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        <AddCategory isEdit id={c._id} />
      </TooltipTrigger>
      <TooltipContent>Edit</TooltipContent>
    </Tooltip>

    {/* Delete */}
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex" />}>
        <Button
          type="button"
          variant="deleteicon"
          aria-label="Delete"
          onClick={() => openDeleteDialog(c._id, c.name)}
        >
          <Trash2 className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Delete</TooltipContent>
    </Tooltip>
  </div>
</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalItems={totalCount}
        pageSizeOptions={[5, 10, 20, 50]}
        showItemsInfo
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

       <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"`}
        isPending={isPending}
      />
    </div>
  );
} 