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
import AddBrand from "./AddBrand";
import { ListBrandApi } from "@/src/api/brand/api/getAll";
import { useDeleteBrand } from "@/src/api/brand/hooks/delete.hook";
import BrandTableSkeleton from "./BrandSkeletonLoading";
import { PaginationComponent } from "../common/PaginationComponent";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { formatDate } from "@/src/lib/date-utils";

export default function BrandSettings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["brandList", currentPage, pageSize],
    queryFn: () => ListBrandApi({ page: currentPage, limit: pageSize }),
  });

  // response shape: data.data (array) + data.pagination
  const brands = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

  const openDeleteDialog = (id: string, name: string) => {
    setIsConfirmDialogOpen(true);
    setBrandToDelete({ id, name });
  };

  const { mutate: DeleteBrand, isPending } = useDeleteBrand();

  const handleConfirmDelete = () => {
    if (brandToDelete) {
      DeleteBrand(
        { id: brandToDelete.id, brandName: brandToDelete.name },
        {
          onSuccess: () => {
            setIsConfirmDialogOpen(false);
            setBrandToDelete(null);
          },
        },
      );
    }
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setBrandToDelete(null);
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
        <AddBrand isEdit={false} />
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Brand Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Create Date</TableHead>
              <TableHead>Update Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <BrandTableSkeleton />
            ) : brands.length === 0 ? (
              <TableEmpty colSpan={5}>No brands found</TableEmpty>
            ) : (
              brands.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>{b.name}</TableCell>
                  <TableCell
                    className="max-w-[220px] truncate"
                    title={b.description}
                  >
                    {b.description || "-"}
                  </TableCell>
                  <TableCell>{formatDate(b.createdAt)}</TableCell>
                  <TableCell>{formatDate(b.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <AddBrand isEdit id={b._id} />
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <Button
                            type="button"
                            variant="deleteicon"
                            aria-label="Delete"
                            onClick={() => openDeleteDialog(b._id, b.name)}
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
        message={`Are you sure you want to delete brand "${brandToDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}