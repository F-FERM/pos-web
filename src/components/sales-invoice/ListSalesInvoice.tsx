"use client";

import ConfirmDialog from "@/src/components/common/ConfirmPopup";
import PageHeader from "@/src/components/common/PageHeader";
import SearchBar from "@/src/components/common/PosSearchBar";
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
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { CircleX, Eye, Printer, Search } from "lucide-react";
import { useMemo, useState } from "react";
import salesIcon from "../../../public/icons/sales-invoice.png"
import { InvoiceViewDialog } from "./SalesInvoiceViewDialog";
type Invoice = {
  id: string;
  invoiceNo: string;
  dateTime: string;
  customerName: string;
  customerPhone: string;
  items: number;
  subtotal: number;
  discount: number;
  grandTotal: number;
  payment: "Cash" | "UPI" | "Card" | "Credit";
  status: "Paid" | "Pending" | "Returned";
};

// Dummy data (replace with API data later)
const INVOICES: Invoice[] = [
  { id: "1", invoiceNo: "INV-0001", dateTime: "06 Oct 2026, 10:12 AM", customerName: "Rahul Menon", customerPhone: "98470 11223", items: 4, subtotal: 620, discount: 20, grandTotal: 630, payment: "Cash", status: "Paid" },
  { id: "2", invoiceNo: "INV-0002", dateTime: "06 Oct 2026, 10:45 AM", customerName: "", customerPhone: "", items: 2, subtotal: 244, discount: 0, grandTotal: 256, payment: "UPI", status: "Paid" },
  { id: "3", invoiceNo: "INV-0003", dateTime: "06 Oct 2026, 11:30 AM", customerName: "Anjali Nair", customerPhone: "99461 55820", items: 7, subtotal: 1480, discount: 80, grandTotal: 1470, payment: "Card", status: "Paid" },
  { id: "4", invoiceNo: "INV-0004", dateTime: "06 Oct 2026, 12:05 PM", customerName: "Suresh Kumar", customerPhone: "94000 78123", items: 3, subtotal: 512, discount: 12, grandTotal: 525, payment: "Credit", status: "Pending" },
  { id: "5", invoiceNo: "INV-0005", dateTime: "06 Oct 2026, 01:18 PM", customerName: "Fathima Beevi", customerPhone: "90370 44109", items: 1, subtotal: 135, discount: 0, grandTotal: 142, payment: "Cash", status: "Returned" },
  { id: "6", invoiceNo: "INV-0006", dateTime: "06 Oct 2026, 02:40 PM", customerName: "Joseph Thomas", customerPhone: "85920 67731", items: 5, subtotal: 905, discount: 55, grandTotal: 892, payment: "UPI", status: "Paid" },
];

const PAYMENT_FILTERS = ["All", "Cash", "UPI", "Card", "Credit"] as const;
type PaymentFilter = (typeof PAYMENT_FILTERS)[number];

const CURRENCY = "₹";
const EMPTY_TEXT = "No transactions logged in drawer today";

const STATUS_STYLE: Record<Invoice["status"], string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Returned: "bg-red-100 text-red-600",
};

function SalesInvoicePage() {
  const [query, setQuery] = useState("");
  const [payment, setPayment] = useState<PaymentFilter>("All");
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [invoiceToClose, setInvoiceToClose] = useState<Invoice | null>(null);
const [invoiceToView, setInvoiceToView] = useState<Invoice | null>(null);
  const handleConfirmClose = () => {
    if (!invoiceToClose) return;
    setInvoices((prev) => prev.filter((i) => i.id !== invoiceToClose.id));
    setInvoiceToClose(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter(
      (i) =>
        (payment === "All" || i.payment === payment) &&
        (!q ||
          i.invoiceNo.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          i.customerPhone.includes(q)),
    );
  }, [invoices, payment, query]);

  // action buttons for each table row
  const renderActions = (i: Invoice) => (
    <div className="flex items-center justify-center gap-2">
      <Button
  type="button"
  aria-label="View"
  variant={"viewicon"}
  onClick={() => setInvoiceToView(i)}
>
  <Eye className="size-4" />
</Button>
      <Button type="button" aria-label="Print" variant={"editicon"}>
        <Printer className="size-4" />
      </Button>
      <Button
        type="button"
        aria-label="Close"
        variant={"deleteicon"}
        onClick={() => setInvoiceToClose(i)}
      >
        <CircleX className="size-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Sales & Invoice History"
        subtitle="View past invoice, reprint thermal/A4, or process customer returns"
        icon={salesIcon}
      />

      {/* Search + payment filters: stacked below lg, one row from lg. Filters wrap when many */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          icon={Search}
          placeholder="Search"
          value={query}
          onSearch={setQuery}
          className="w-full max-w-none lg:w-[321px] lg:flex-none"
        />

        <div className="flex w-full min-w-0 items-start gap-3 lg:w-auto">
          <span className="flex h-7 shrink-0 items-center font-poppins text-[12px] font-normal uppercase leading-[100%] text-[#848484]">
            Payment:
          </span>

          <Tabs
            value={payment}
            onValueChange={(v) => setPayment(v as PaymentFilter)}
            className="min-w-0 flex-1 lg:flex-none"
          >
            <TabsList
              variant="pills"
              className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0"
            >
              {PAYMENT_FILTERS.map((p) => (
                <TabsTrigger key={p} variant="filter" value={p}>
                  {p}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Table on every screen size (scrolls sideways on small screens) */}
      <Table className="min-w-[960px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Invoice#</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer Details</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Grand Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableEmpty colSpan={10}>{EMPTY_TEXT}</TableEmpty>
          ) : (
            filtered.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.invoiceNo}</TableCell>
                <TableCell>{i.dateTime}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-black">{i.customerName || "Walk-in Customer"}</span>
                    {i.customerPhone && (
                      <span className="text-[10px] text-[#848484]">{i.customerPhone}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{i.items}</TableCell>
                <TableCell>{CURRENCY} {i.subtotal}</TableCell>
                <TableCell>{CURRENCY} {i.discount}</TableCell>
                <TableCell className="font-medium text-black">
                  {CURRENCY} {i.grandTotal}
                </TableCell>
                <TableCell>{i.payment}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-[20px] px-2 py-[2px] text-[10px] ${STATUS_STYLE[i.status]}`}
                  >
                    {i.status}
                  </span>
                </TableCell>
                <TableCell>{renderActions(i)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!invoiceToClose}
        title="Close Invoice"
        description={
          <>
            Are you sure you want to close invoice{" "}
            <span className="font-medium text-primary">{invoiceToClose?.invoiceNo}</span>? Items
            will be returned to stock inventory.
          </>
        }
        onConfirm={handleConfirmClose}
        onCancel={() => setInvoiceToClose(null)}
      />
      <InvoiceViewDialog
  open={!!invoiceToView}
  onOpenChange={(open) => !open && setInvoiceToView(null)}
  invoice={invoiceToView}
/>
    </div>
  );
}

export default SalesInvoicePage;