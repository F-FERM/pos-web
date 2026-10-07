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
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  ChevronDown,
  Eye,
  Mic,
  Printer,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import returnsIcon from "../../../public/icons/returns-refunds.png"; // change to your returns icon

type PaymentMode = "Cash" | "UPI" | "Card";
type SaleStatus = "Completed" | "Returned" | "Cancelled";
type QuickFilter = "" | "today" | "recent" | "high" | "lastCustomer" | "lastBill";

type Invoice = {
  id: string;
  invoiceNo: string;
  date: string; // local ISO, e.g. 2026-10-07T16:20:00
  customer: string;
  mobile: string;
  cashier: string;
  role: string;
  total: number;
  payment: PaymentMode;
  status: SaleStatus;
  items: { name: string; barcode: string }[];
};

type ReturnVoucher = {
  id: string;
  returnNo: string;
  originalInvoice: string;
  customer: string;
  reason: string;
  refundAmount: number;
};

const CURRENCY = "₹";
const WALK_IN = "Walk in customer";
const HIGH_VALUE = 1000;

// Dummy data (replace with API data later)
const INVOICES: Invoice[] = [
  { id: "1", invoiceNo: "INV-2026-0008", date: "2026-10-07T16:20:00", customer: WALK_IN, mobile: "", cashier: "Admin", role: "Owner", total: 21, payment: "Cash", status: "Completed", items: [{ name: "Milk 500ml", barcode: "8901234500011" }] },
  { id: "2", invoiceNo: "INV-2026-0007", date: "2026-10-07T14:05:00", customer: "Anita Menon", mobile: "9895012345", cashier: "Admin", role: "Owner", total: 1850, payment: "UPI", status: "Completed", items: [{ name: "Basmati Rice 5kg", barcode: "8901234500028" }, { name: "Sunflower Oil 1L", barcode: "8901234500035" }, { name: "Sugar 1kg", barcode: "8901234500042" }] },
  { id: "3", invoiceNo: "INV-2026-0006", date: "2026-10-07T11:40:00", customer: WALK_IN, mobile: "", cashier: "Rahul", role: "Staff", total: 135, payment: "Card", status: "Completed", items: [{ name: "Biscuits", barcode: "8901234500059" }, { name: "Tea Powder 250g", barcode: "8901234500066" }] },
  { id: "4", invoiceNo: "INV-2026-0005", date: "2026-10-06T18:30:00", customer: "Fresh Mart Traders", mobile: "9447788990", cashier: "Admin", role: "Owner", total: 12400, payment: "UPI", status: "Completed", items: [{ name: "Wheat Flour 10kg", barcode: "8901234500073" }, { name: "Lentils 5kg", barcode: "8901234500080" }] },
  { id: "5", invoiceNo: "INV-2026-0004", date: "2026-10-05T10:15:00", customer: "Joseph Thomas", mobile: "9961234567", cashier: "Rahul", role: "Staff", total: 320, payment: "Cash", status: "Returned", items: [{ name: "Shampoo 340ml", barcode: "8901234500097" }] },
  { id: "6", invoiceNo: "INV-2026-0003", date: "2026-10-03T19:50:00", customer: "Meera Nair", mobile: "9846098460", cashier: "Admin", role: "Owner", total: 2450, payment: "Card", status: "Completed", items: [{ name: "Cooking Oil 5L", barcode: "8901234500103" }, { name: "Detergent 2kg", barcode: "8901234500110" }] },
  { id: "7", invoiceNo: "INV-2026-0002", date: "2026-09-28T12:25:00", customer: WALK_IN, mobile: "", cashier: "Rahul", role: "Staff", total: 60, payment: "Cash", status: "Cancelled", items: [{ name: "Bread", barcode: "8901234500127" }] },
  { id: "8", invoiceNo: "INV-2026-0001", date: "2026-09-15T09:10:00", customer: "Rahul Sharma", mobile: "9876543210", cashier: "Admin", role: "Owner", total: 780, payment: "UPI", status: "Completed", items: [{ name: "Notebook Pack", barcode: "8901234500134" }, { name: "Pen Box", barcode: "8901234500141" }] },
];

const RETURN_VOUCHERS: ReturnVoucher[] = [
  { id: "r1", returnNo: "RET-2026-0002", originalInvoice: "INV-2026-0004", customer: "Joseph Thomas", reason: "Damaged product", refundAmount: 320 },
  { id: "r2", returnNo: "RET-2026-0001", originalInvoice: "INV-2026-0003", customer: "Meera Nair", reason: "Wrong item delivered", refundAmount: 450 },
];

const TIME_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
];
const PAYMENT_OPTIONS = [
  { value: "all", label: "All Payment Modes" },
  { value: "Cash", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "Card", label: "Card" },
];
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Completed", label: "Completed" },
  { value: "Returned", label: "Returned" },
  { value: "Cancelled", label: "Cancelled" },
];

const STATUS_STYLE: Record<SaleStatus, string> = {
  Completed: "border-[#F24DEB] bg-[#FF00F50D] text-[#BD29B7]",
  Returned: "border-[#0078DA] bg-[#A9D8FF40] text-[#0078DA]",
  Cancelled: "border-[#FF0F0F] bg-[#FF0F0F1A] text-[#FF0F0F]",
};

const pad = (n: number) => String(n).padStart(2, "0");

// Manual formatting (no locale APIs) so server and client render the same text
const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const h = d.getHours();
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(h % 12 || 12)}:${pad(d.getMinutes())} ${h >= 12 ? "PM" : "AM"}`;
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

function SectionHeader({
  icon,
  title,
  hint,
}: {
  icon?: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <div className="flex items-center gap-2">
        {icon && <span className="flex size-[20px] items-center justify-center text-[#F24DEB]">{icon}</span>}
        <h2 className="font-poppins text-[16px] font-semibold text-black">{title}</h2>
      </div>
      {hint && <p className="font-poppins text-[11px] text-[#848484]">{hint}</p>}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1 font-poppins">
      <span className="text-[12px] text-[#848484]">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[36px] w-full appearance-none rounded-[10px] border border-[#D5D5D5] bg-[#E1E1E1] px-3 pr-9 text-[13px] text-[#585858] outline-none focus:border-[#F24DEB]"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#585858]" />
      </span>
    </label>
  );
}

function ReturnsPage() {
  const [quick, setQuick] = useState<QuickFilter>("");
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState("all");
  const [payment, setPayment] = useState("all");
  const [status, setStatus] = useState("all");
  const [vouchers] = useState<ReturnVoucher[]>(RETURN_VOUCHERS); // set to [] to see the empty state

  const now = useMemo(() => new Date(), []);

  // newest first
  const latest = useMemo(
    () => [...INVOICES].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [],
  );

  const recentPurchases = latest.slice(0, 4);

  const results = useMemo(() => {
    // 1. quick filter tabs
    let list = latest;
    if (quick === "today") list = latest.filter((i) => isSameDay(new Date(i.date), now));
    else if (quick === "recent") list = latest.slice(0, 5);
    else if (quick === "high") list = latest.filter((i) => i.total >= HIGH_VALUE);
    else if (quick === "lastBill") list = latest.slice(0, 1);
    else if (quick === "lastCustomer") {
      const last = latest.find((i) => i.customer !== WALK_IN);
      list = last ? latest.filter((i) => i.customer === last.customer) : [];
    }

    // 2. search (invoice#, customer, mobile, item name, barcode, amount)
    const q = appliedQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((i) =>
        [
          i.invoiceNo,
          i.customer,
          i.mobile,
          String(i.total),
          ...i.items.flatMap((it) => [it.name, it.barcode]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    // 3. refine filters
    return list.filter((i) => {
      const d = new Date(i.date);
      const timeOk =
        timePeriod === "all" ||
        (timePeriod === "today" && isSameDay(d, now)) ||
        (timePeriod === "week" && now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000) ||
        (timePeriod === "month" &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear());
      return (
        timeOk &&
        (payment === "all" || i.payment === payment) &&
        (status === "all" || i.status === status)
      );
    });
  }, [latest, quick, appliedQuery, timePeriod, payment, status, now]);

  const handleSearch = () => setAppliedQuery(query);

  // TODO: wire these to your view / print / return flows
  const handleView = (inv: Invoice) => void inv;
  const handlePrint = (inv: Invoice) => void inv;
  const handleReturn = (inv: Invoice) => void inv;
  const handlePrintVoucher = (v: ReturnVoucher) => void v;

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      {/* 1. Page header */}
      <PageHeader
        title="Returns, Exchanges & Refund Center"
        subtitle="Universal multi-search by invoice#, Customer, Phone, Barcode, Item Or Amount, Fast 1-click returns & automatic stock restock!"
        icon={returnsIcon}
      />

      {/* 2. Quick filter tabs */}
      <Tabs value={quick} onValueChange={(v) => setQuick(v as QuickFilter)} className="min-w-0">
        <TabsList variant="pills" className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger variant="filterPink" value="today">Today&apos;s Sales</TabsTrigger>
          <TabsTrigger variant="filterBlue" value="recent">Recent Invoice</TabsTrigger>
          <TabsTrigger variant="filterGreen" value="high">High Value Bills</TabsTrigger>
          <TabsTrigger variant="filterPurple" value="lastCustomer">Last Customer</TabsTrigger>
          <TabsTrigger variant="filterRed" value="lastBill">View Last Bill</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 3. Search bar */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        <SectionHeader
          icon={<Search className="size-4" />}
          title="Returns, Exchanges & Refund Center"
          hint="Supports Barcode Scanner, voice Input, customer phone & item names"
        />
        <div className="flex items-center gap-2 rounded-full border border-[#D5D5D5] bg-[#E1E1E1] py-[5px] pl-3 pr-[6px]">
          <Search className="size-4 shrink-0 text-[#585858]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Scan Barcode, Type Invoice#, Customer Name, Mobile#, Or Product..."
            className="min-w-0 flex-1 bg-transparent font-poppins text-[13px] text-black outline-none placeholder:text-[#848484]"
          />
          <button
            type="button"
            aria-label="Voice input"
            // TODO: hook up voice input
            className="flex size-[26px] shrink-0 items-center justify-center rounded-[6px] bg-[#BFBFBF] text-[#585858]"
          >
            <Mic className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="flex h-[26px] shrink-0 items-center gap-1 rounded-full border border-[#F24DEB] bg-[#FF00F50D] px-3 font-poppins text-[12px] text-[#BD29B7]"
          >
            <Search className="size-3.5" />
            Search
          </button>
        </div>
      </section>

      {/* 4. Refine filters */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        <SectionHeader
          icon={<SlidersHorizontal className="size-4" />}
          title="Refine Invoices Filter"
          hint="Supports Barcode Scanner, voice Input, customer phone & item names"
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FilterSelect label="Time Period" value={timePeriod} onChange={setTimePeriod} options={TIME_OPTIONS} />
          <FilterSelect label="Payment Method" value={payment} onChange={setPayment} options={PAYMENT_OPTIONS} />
          <FilterSelect label="Sale Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        </div>
      </section>

      {/* 5. Recent purchases (205 x 91 cards) */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        <SectionHeader
          icon={<SlidersHorizontal className="size-4" />}
          title="Recent Purchases & Invoices"
          hint="Click any bill to return or view"
        />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(205px,1fr))] gap-3">
          {recentPurchases.map((inv) => (
            <button
              key={inv.id}
              type="button"
              onClick={() => handleView(inv)}
              className="flex min-h-[91px] w-full flex-col gap-[10px] rounded-[10px] border border-[#A8A8A8] bg-[#4646460D] pb-[13px] pl-[15px] pr-[14px] pt-[14px] text-left font-poppins"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="truncate text-[13px] text-[#BD29B7]">{inv.invoiceNo}</span>
                <span className="shrink-0 rounded-[5px] bg-[#BFBFBF] px-2 py-[1px] text-[10px] text-[#585858]">
                  {inv.payment}
                </span>
              </div>
              <p className="truncate text-[11px] text-[#585858]">{inv.customer}</p>
              <div className="flex items-center justify-between border-t border-[#A8A8A8] pt-[6px]">
                <span className="text-[12px] font-semibold text-black">
                  {CURRENCY} {inv.total}
                </span>
                <span className="text-[9px] text-[#848484]">{inv.items.length} Items</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Search results (285 x 162 cards) */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        <SectionHeader
          title={`Search Results & Sales Invoice (${results.length})`}
          hint="Click any bill to return or view"
        />
        {results.length === 0 ? (
          <p className="py-6 text-center font-poppins text-[12px] text-[#848484]">No invoices found</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-3">
            {results.map((inv) => (
              <div
                key={inv.id}
                className="flex min-h-[162px] w-full flex-col gap-[5px] rounded-[10px] border border-[#A8A8A8] bg-[#4646460D] pb-[13px] pl-[15px] pr-[14px] pt-[14px] font-poppins"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] text-[#BD29B7]">{inv.invoiceNo}</p>
                    <p className="text-[10px] text-[#585858]">{formatDateTime(inv.date)}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-[5px] border px-2 py-[1px] text-[10px] ${STATUS_STYLE[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </div>

                <div className="flex flex-col gap-[3px] border-t border-[#A8A8A8] pt-[6px] text-[11px] text-[#585858]">
                  <div className="flex justify-between gap-2">
                    <span>Customer:</span>
                    <span className="truncate text-black">{inv.customer}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Cashier:</span>
                    <span className="truncate text-black">
                      {inv.cashier} <span className="text-[#585858]">({inv.role})</span>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-[#A8A8A8] pt-[6px] text-[11px] font-semibold text-black">
                  <span>Total Amount</span>
                  <span>
                    {CURRENCY} {inv.total}
                  </span>
                </div>

                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-[#A8A8A8] pt-[6px]">
                  <button
                    type="button"
                    onClick={() => handleView(inv)}
                    className="flex h-[22px] items-center justify-center gap-1 rounded-[5px] bg-[#BFBFBF] text-[10px] text-[#585858]"
                  >
                    <Eye className="size-3" /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrint(inv)}
                    className="flex h-[22px] items-center justify-center gap-1 rounded-[5px] border border-[#F24DEB] bg-[#FF00F50D] text-[10px] text-[#BD29B7]"
                  >
                    <Printer className="size-3" /> Print
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReturn(inv)}
                    className="flex h-[22px] items-center justify-center gap-1 rounded-[5px] border border-[#FF0F0F] bg-[#FF0F0F1A] text-[10px] text-[#FF0F0F]"
                  >
                    <RotateCcw className="size-3" /> Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Processed returns vouchers history log */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 sm:px-5">
        <h2 className="font-poppins text-[16px] font-semibold text-black">
          Processed Returns Vouchers History Log
        </h2>
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Return Invoice#</TableHead>
              <TableHead>Original Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Refund Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.length === 0 ? (
              <TableEmpty colSpan={6}>No return vouchers recorded yet</TableEmpty>
            ) : (
              vouchers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{v.returnNo}</TableCell>
                  <TableCell>{v.originalInvoice}</TableCell>
                  <TableCell>{v.customer}</TableCell>
                 <TableCell className="max-w-[240px]">
  <p className="truncate py-[2px] text-center leading-[1.6]" title={v.reason}>
    {v.reason}
  </p>
</TableCell>
                  <TableCell>
                    {CURRENCY} {v.refundAmount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Button
                        type="button"
                        aria-label="Print"
                        variant={"editicon"}
                        onClick={() => handlePrintVoucher(v)}
                      >
                        <Printer className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

export default ReturnsPage;