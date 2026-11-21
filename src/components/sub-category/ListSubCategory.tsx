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
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import ErrorHandling from "../Error/ErrorHandling";
import { PaginationComponent } from "../common/PaginationComponent";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddSubCategory from "./AddSubCategory";
import SubCategoryTableSkeleton from "./SubCategorySkeletonLoading";
import { ListSubCategoryApi } from "@/src/api/sub-category/api/getAll";
import { useDeleteSubCategory } from "@/src/api/sub-category/hooks/delete.hook";


export default function SubCategorySettings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subCategoryList", currentPage, pageSize],
    queryFn: () => ListSubCategoryApi({ page: currentPage, limit: pageSize }),
  });

  const { mutate: deleteSubCategory, isPending } = useDeleteSubCategory();

  const subCategories = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

  const openDeleteDialog = (id: string, name: string) => {
    setToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteSubCategory(
      { id: toDelete.id, subcategoryName: toDelete.name },
      {
        onSuccess: () => {
          setIsConfirmDialogOpen(false);
          setToDelete(null);
        },
      },
    );
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setToDelete(null);
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
        <AddSubCategory isEdit={false} />
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Sub Category Code</TableHead>
              <TableHead>Sub Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SubCategoryTableSkeleton />
            ) : subCategories.length === 0 ? (
              <TableEmpty colSpan={5}>No sub categories found</TableEmpty>
            ) : (
              subCategories.map((s: any) => (
                <TableRow key={s._id}>
                  <TableCell>{s.code || "-"}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell className="max-w-[220px] truncate" title={s.description}>
                    {s.description || "-"}
                  </TableCell>
                  <TableCell>{s.categoryId?.name ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      {/* AddSubCategory already includes its own Edit tooltip */}
                      <AddSubCategory isEdit id={s._id} />

                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <Button
                            type="button"
                            variant="deleteicon"
                            aria-label="Delete"
                            onClick={() => openDeleteDialog(s._id, s.name)}
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
        message={`Are you sure you want to delete sub category "${toDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}