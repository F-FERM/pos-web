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
import { Monitor, PrinterIcon, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import ErrorHandling from "../Error/ErrorHandling";
import AddPrinter from "./AddPrinter";
import { ListPrinterApi } from "@/src/api/printer/api/getAll";
import { useDeletePrinter } from "@/src/api/printer/hooks/delete.hook";
import PrinterTableSkeleton from "./PrinterSkeletonLoading";
import { PaginationComponent } from "../common/PaginationComponent";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
  const stats = [
    {
      label: "Total Printers",
      value: 30,
      icon: PrinterIcon,
      card: "border-[#F24DEB] bg-[#FF00F50D]",
      text: "text-primary",
      iconBox: "bg-[#F24DEB33] text-[#C026D3]",
    },
    {
      label: "Default Printer",
      value: 12,
      icon: Star,
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
      iconBox: "bg-[#B0F597] text-[#0EA300]",
    },
    {
      label: "Assigned Counters",
      value: 50,
      icon: Monitor,
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
      iconBox: "bg-[#A9D8FF] text-[#0078DA]",
    },
  ];

export default function PrinterSettings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [printerToDelete, setPrinterToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["printerList", currentPage, pageSize],
    queryFn: () => ListPrinterApi({ page: currentPage, limit: pageSize }),
  });

  // response shape: data.data (array) + data.pagination
  const printers = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

  const openDeleteDialog = (id: string, name: string) => {
    setIsConfirmDialogOpen(true);
    setPrinterToDelete({ id, name });
  };

  const { mutate: DeletePrinter, isPending } = useDeletePrinter();

  const handleConfirmDelete = () => {
    if (printerToDelete) {
      DeletePrinter(
        { id: printerToDelete.id, printerName: printerToDelete.name },
        {
          onSuccess: () => {
            setIsConfirmDialogOpen(false);
            setPrinterToDelete(null);
          },
        },
      );
    }
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setPrinterToDelete(null);
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
            {/* Summary cards: 1 column on phones, 3 from sm */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex min-h-[91px] w-full items-center justify-between gap-[10px] rounded-[10px] border px-5 pb-[13px] pt-[14px] ${s.card}`}
          >
            <div className="flex min-w-0 flex-col gap-[10px]">
              <p className={`font-poppins text-[12px] font-normal uppercase leading-[1.3] tracking-[0%] ${s.text}`}>
                {s.label}
              </p>
              <p className="font-poppins text-[16px] font-semibold leading-[1.2] text-black">
                {s.value}
              </p>
            </div>
            <span className={`flex size-[29px] shrink-0 items-center justify-center rounded-[5px] ${s.iconBox}`}>
              <s.icon className="size-4" />
            </span>
          </div>
        ))}
      </section>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <AddPrinter isEdit={false} />
      </div>

      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Printer Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Counter</TableHead>
              <TableHead>Paper Width</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <PrinterTableSkeleton />
            ) : printers.length === 0 ? (
              <TableEmpty colSpan={6}>No printers found</TableEmpty>
            ) : (
              printers.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.printerName}</TableCell>
                  <TableCell>{p.printerIp}</TableCell>
                  <TableCell>
                    {p.counterId
                      ? `${p.counterId.code} - ${p.counterId.name}`
                      : "-"}
                  </TableCell>
                  <TableCell>{p.paperWidth}</TableCell>
                  <TableCell>
                    <span
                      className={
                        p.isDefault
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-[12px] font-medium text-green-700"
                          : "rounded-full bg-red-100 px-2 py-0.5 text-[12px] font-medium text-red-700"
                      }
                    >
                     {p.isDefault ? "Yes" : "No"}
                    </span>
                    </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <AddPrinter isEdit id={p._id} />
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <Button
                            type="button"
                            variant="deleteicon"
                            aria-label="Delete"
                            onClick={() => openDeleteDialog(p._id, p.printerName)}
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
        message={`Are you sure you want to delete printer "${printerToDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}