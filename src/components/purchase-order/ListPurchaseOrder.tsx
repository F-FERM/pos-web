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
import { PackageCheck, Plus, Printer } from "lucide-react";
import { useState } from "react";
import purchaseOrderIcon from "../../../public/icons/purchase-order.png"; // add your icon file
import AddPurchaseOrder from "./AddPurchaseOrder";
import { AddPurchaseOrderDialog, PurchaseOrderFormData } from "./AddPurchaseOrderDialogue";


type OrderStatus = "Pending" | "Received";

type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  items: PurchaseOrderFormData["items"];
  status: OrderStatus;
};

const CURRENCY = "₹";

const STATUS_STYLE: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Received: "bg-green-100 text-green-700",
};

const totalOf = (o: PurchaseOrder) =>
  o.items.reduce((sum, i) => sum + i.cost * i.qty, 0);

// table row -> values shown in the edit dialog
const toFormData = (o: PurchaseOrder): PurchaseOrderFormData => ({
  supplier: o.supplier,
  productPick: "",
  items: o.items,
});

// Dummy data (replace with API data later)
const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-0001",
    supplier: "ITC Product (ITC Wholesale Ltd)",
    orderDate: "02 Oct 2026",
    status: "Pending",
    items: [
      { productId: "2", name: "Aashirvaad Shudh Chakki Atta", cost: 262, qty: 20 },
      { productId: "5", name: "Toor Dal Premium 1kg", cost: 96, qty: 30 },
    ],
  },
  {
    id: "2",
    poNumber: "PO-0002",
    supplier: "Adani Wilmar",
    orderDate: "29 Sep 2026",
    status: "Received",
    items: [{ productId: "1", name: "Fortune Sunlight Sunflower Oil 1L", cost: 98, qty: 50 }],
  },
  {
    id: "3",
    poNumber: "PO-0003",
    supplier: "Tata Consumer",
    orderDate: "25 Sep 2026",
    status: "Received",
    items: [
      { productId: "3", name: "Tata Salt Vacuum 1 kg", cost: 24, qty: 100 },
      { productId: "6", name: "Tata Tea Premium 250", cost: 118, qty: 40 },
      { productId: "4", name: "Royal Sona Masoori Rice", cost: 340, qty: 10 },
    ],
  },
  {
    id: "4",
    poNumber: "PO-0004",
    supplier: "Royal Traders",
    orderDate: "05 Oct 2026",
    status: "Pending",
    items: [{ productId: "4", name: "Royal Sona Masoori Rice", cost: 340, qty: 15 }],
  },
];

function PurchaseOrderPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(PURCHASE_ORDERS);
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreate = (data: PurchaseOrderFormData) =>
    setOrders((prev) => [
      {
        id: crypto.randomUUID(),
        poNumber: `PO-${String(prev.length + 1).padStart(4, "0")}`,
        supplier: data.supplier,
        orderDate: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        items: data.items,
        status: "Pending",
      },
      ...prev,
    ]);

  const handleUpdate = (id: string, data: PurchaseOrderFormData) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, supplier: data.supplier, items: data.items } : o)),
    );

  const handleReceive = (id: string) =>
    // TODO: call your API here. Receiving an order increases the inventory stock.
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Received" } : o)));

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Purchase Order & wholesale Restoking"
        subtitle="Creator vendor Purchase orders. When received, Inventory Stock quantities increase automatically!"
        icon={purchaseOrderIcon}
        actions={[
          {
            label: "Create Purchase Order",
            icon: <Plus />,
            onClick: () => setCreateOpen(true),
          },
        ]}
      />

      {/* Table (scrolls sideways on small screens) */}
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>PO Details</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Items Count</TableHead>
            <TableHead>Total Payable</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableEmpty colSpan={7}>No Purchase Order &amp; wholesale Restoking</TableEmpty>
          ) : (
            orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.poNumber}</TableCell>
                <TableCell className="max-w-[220px] truncate" title={o.supplier}>
                  {o.supplier}
                </TableCell>
                <TableCell>{o.orderDate}</TableCell>
                <TableCell>{o.items.length}</TableCell>
                <TableCell>{CURRENCY} {totalOf(o)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-[2px] text-[10px] font-medium ${STATUS_STYLE[o.status]}`}
                  >
                    {o.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    
                      <>
                      <Button type="button" aria-label="Print" variant={"editicon"}>
        <Printer className="size-4" />
      </Button>
                        <Button
                          type="button"
                          aria-label="Mark as received"
                          title="Mark as received"
                          variant="viewicon"
                          onClick={() => handleReceive(o.id)}
                        >
                          <PackageCheck className="size-4" />
                        </Button>
                      </>
                    
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AddPurchaseOrderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
}

export default PurchaseOrderPage;