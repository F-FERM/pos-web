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
import AddUnit from "./AddUnit";
import { ListUnitApi } from "@/src/api/unit/api/getAll";
import { useDeleteUnit } from "@/src/api/unit/hooks/delete.hook";
import UnitTableSkeleton from "./UnitSkeletonLoading";
import { PaginationComponent } from "../common/PaginationComponent";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { formatDate } from "@/src/lib/date-utils";



export default function UnitSettings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["unitList", currentPage, pageSize],
    queryFn: () => ListUnitApi({ page: currentPage, limit: pageSize }),
  });

  // response shape: data.data.units + data.data.pagination
  const units = data?.data?.units ?? [];
  const totalCount = data?.data?.pagination?.totalCount ?? 0;

  const openDeleteDialog = (id: string, name: string) => {
    setIsConfirmDialogOpen(true);
    setUnitToDelete({ id, name });
  };

  const { mutate: DeleteUnit, isPending } = useDeleteUnit();

  const handleConfirmDelete = () => {
    if (unitToDelete) {
      DeleteUnit(
        { id: unitToDelete.id, unitName: unitToDelete.name },
        {
          onSuccess: () => {
            setIsConfirmDialogOpen(false);
            setUnitToDelete(null);
          },
        },
      );
    }
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setUnitToDelete(null);
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
        <AddUnit isEdit={false} />
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Unit Name</TableHead>
              <TableHead>Create Date</TableHead>
              <TableHead>Update Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <UnitTableSkeleton />
            ) : units.length === 0 ? (
              <TableEmpty colSpan={4}>No units found</TableEmpty>
            ) : (
              units.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>
                    {u.name}
                    {u.symbol ? ` (${u.symbol})` : ""}
                  </TableCell>
                  <TableCell>{formatDate(u.createdAt)}</TableCell>
                  <TableCell>{formatDate(u.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <AddUnit isEdit id={u._id} />
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                        {!u.isSystemGenerated && (
      <Tooltip>
        <TooltipTrigger render={<span className="inline-flex" />}>
          <Button
            type="button"
            variant="deleteicon"
            aria-label="Delete"
            onClick={() => openDeleteDialog(u._id, u.name)}
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    )}
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
        message={`Are you sure you want to delete unit "${unitToDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}