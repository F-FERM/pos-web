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
import AddCounter from "./AddCounter";
import { ListCounterApi } from "@/src/api/counter/api/getAll";
import { useDeleteCounter } from "@/src/api/counter/hooks/delete.hook";
import CounterTableSkeleton from "./CounterSkeletonLoading";
import { PaginationComponent } from "../common/PaginationComponent";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CounterSettings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [counterToDelete, setCounterToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["counterList", currentPage, pageSize],
    queryFn: () => ListCounterApi({ page: currentPage, limit: pageSize }),
  });

  // response shape: data.data (array) + data.pagination
  const counters = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

  const openDeleteDialog = (id: string, name: string) => {
    setIsConfirmDialogOpen(true);
    setCounterToDelete({ id, name });
  };

  const { mutate: DeleteCounter, isPending } = useDeleteCounter();

  const handleConfirmDelete = () => {
    if (counterToDelete) {
      DeleteCounter(
        { id: counterToDelete.id, counterName: counterToDelete.name },
        {
          onSuccess: () => {
            setIsConfirmDialogOpen(false);
            setCounterToDelete(null);
          },
        },
      );
    }
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setCounterToDelete(null);
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
        <AddCounter isEdit={false} />
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Counter Code</TableHead>
              <TableHead>Counter Name</TableHead>
              <TableHead>Default</TableHead>
         
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <CounterTableSkeleton />
            ) : counters.length === 0 ? (
              <TableEmpty colSpan={4}>No counters found</TableEmpty>
            ) : (
              counters.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.code || "-"}</TableCell>
                  <TableCell>{c.name}</TableCell>
              
                    <TableCell>
                    <span
                      className={
                        c.isDefault
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-[12px] font-medium text-green-700"
                          : "rounded-full bg-red-100 px-2 py-0.5 text-[12px] font-medium text-red-700"
                      }
                    >
                     {c.isDefault ? "Yes" : "No"}
                    </span>
                    </TableCell>
                 
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <AddCounter isEdit id={c._id} />
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

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
        message={`Are you sure you want to delete counter "${counterToDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}