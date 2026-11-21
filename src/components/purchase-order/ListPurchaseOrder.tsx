"use client";

import PageHeader from "@/src/components/common/PageHeader";
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
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import purchaseOrderIcon from "../../../public/icons/purchase-order.png";
import AddPurchaseOrder from "./AddPurchaseOrder";
import { AddPurchaseOrderDialog } from "./AddPurchaseOrderDialogue";
import PurchaseOrderTableSkeleton from "./PurchaseOrderSkeletonLoading";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { PaginationComponent } from "../common/PaginationComponent";
import ErrorHandling from "../Error/ErrorHandling";
import { Purchase } from "@/src/interfaces/purchase/getAll.type";
import { ListPurchaseApi } from "@/src/api/purchase/api/getAll";
import { useDeletePurchase } from "@/src/api/purchase/hooks/delete.hook";


const CURRENCY = "AED";

const formatDate = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "-";

const money = (n: number) => `${CURRENCY} ${Number(n ?? 0).toFixed(2)}`;

function PurchaseOrderPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [orderToDelete, setOrderToDelete] = useState<Purchase | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["purchaseOrderList", currentPage, pageSize],
    queryFn: () => ListPurchaseApi({ page: currentPage, limit: pageSize }),
  });

  const orders = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

  const { mutate: deleteOrder, isPending } = useDeletePurchase();

  const handleConfirmDialogClose = (open: boolean) => {
    if (!open && !isPending) setOrderToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!orderToDelete) return;
    deleteOrder(
      { id: orderToDelete._id, purchaseName: orderToDelete.billNumber },
      { onSuccess: () => setOrderToDelete(null) },
    );
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <ErrorHandling message={error.message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Purchase Order & wholesale Restoking"
        subtitle="Creator vendor Purchase orders. When received, Inventory Stock quantities increase automatically!"
        icon={purchaseOrderIcon}
        actions={[
          { label: "Create Purchase Order", icon: <Plus />, onClick: () => setCreateOpen(true) },
        ]}
      />

      {/* Table (scrolls sideways on small screens) */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Bill No</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Payable</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <PurchaseOrderTableSkeleton />
            ) : orders.length === 0 ? (
              <TableEmpty colSpan={8}>No Purchase Order &amp; wholesale Restoking</TableEmpty>
            ) : (
              orders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>{o.billNumber}</TableCell>
                  <TableCell className="max-w-[220px] truncate" title={o.supplierId?.name}>
                    {o.supplierId?.name ?? "-"}
                  </TableCell>
                  <TableCell>{formatDate(o.purchaseDate)}</TableCell>
                  <TableCell>{o.items?.length ?? 0}</TableCell>
                  <TableCell>{money(o.totalAmount)}</TableCell>
                  <TableCell>{money(o.paidAmount)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2 py-[2px] text-[10px] font-medium ${
                        o.dueAmount > 0 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {o.dueAmount > 0 ? money(o.dueAmount) : "Paid"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <AddPurchaseOrder isEdit id={o._id} />
                      <Button
                        type="button"
                        aria-label="Delete"
                        variant="deleteicon"
                        onClick={() => setOrderToDelete(o)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
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

      <AddPurchaseOrderDialog open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmationDialog
        open={!!orderToDelete}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete purchase order "${orderToDelete?.billNumber}"?`}
        isPending={isPending}
      />
    </div>
  );
}

export default PurchaseOrderPage;