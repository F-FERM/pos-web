"use client";

import PageHeader from "@/src/components/common/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Clock, FileText, IndianRupee, Lock, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import cashDrawerIcon from "../../../public/icons/sales-invoice.png";
import { AddCashDrawerDialog, CashDrawerFormData } from "./AddCashDrawerDialogue";

// import { CloseShiftDialog } from "./CloseShiftDialog";

type EntryType = "Cash Sale" | "Cash In" | "Cash Out" | "Safe Drop";

type DrawerEntry = {
  id: string;
  time: string;
  type: EntryType;
  amount: number;
  reason: string;
  cashier: string;
};

type ShiftHistory = {
  id: string;
  startTime: string;
  endTime: string;
  openingFloat: number;
  expectedCash: number;
  difference: number;
  status: "Balanced" | "Over" | "Short";
};

const CURRENCY = "₹";
const CASHIER = "Admin"; 

// Dummy data (replace with API data later)
const INITIAL_FLOAT = 2000;
const INITIAL_ENTRIES: DrawerEntry[] = [
  { id: "e1", time: "09:42 AM", type: "Cash Sale", amount: 450, reason: "Invoice #INV-1042", cashier: "Admin" },
  { id: "e2", time: "11:15 AM", type: "Cash Sale", amount: 253, reason: "Invoice #INV-1047", cashier: "Admin" },
  { id: "e3", time: "01:30 PM", type: "Cash Sale", amount: 150, reason: "Invoice #INV-1053", cashier: "Admin" },
];

const INITIAL_HISTORY: ShiftHistory[] = [
  { id: "SH-003", startTime: "06 Oct, 09:00 AM", endTime: "06 Oct, 09:05 PM", openingFloat: 2000, expectedCash: 6350, difference: 0, status: "Balanced" },
  { id: "SH-002", startTime: "05 Oct, 09:00 AM", endTime: "05 Oct, 09:10 PM", openingFloat: 2000, expectedCash: 5120, difference: 80, status: "Over" },
  { id: "SH-001", startTime: "04 Oct, 09:00 AM", endTime: "04 Oct, 08:55 PM", openingFloat: 2000, expectedCash: 4780, difference: -120, status: "Short" },
];

const formatTime = (d = new Date()) =>
  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const STATUS_STYLE: Record<ShiftHistory["status"], string> = {
  Balanced: "bg-[#B0F5973D] text-[#0EA300] border-[#0EA300]",
  Over: "bg-[#A9D8FF40] text-[#0078DA] border-[#0078DA]",
  Short: "bg-[#FF0F0F1A] text-[#FF0F0F] border-[#FF0F0F]",
};

const AMOUNT_STYLE: Record<EntryType, string> = {
  "Cash Sale": "text-[#0EA300]",
  "Cash In": "text-[#0EA300]",
  "Cash Out": "text-red-600",
  "Safe Drop": "text-red-600",
};

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-[22px] items-center justify-center rounded-[5px] bg-[#F24DEB33] text-[#F24DEB]">
        {icon}
      </span>
      <h2 className="font-poppins text-[16px] font-semibold text-black">{title}</h2>
    </div>
  );
}

function CashDrawerPage() {
  const [openingFloat, setOpeningFloat] = useState(INITIAL_FLOAT);
  const [shiftStart, setShiftStart] = useState(() => formatTime());
  const [entries, setEntries] = useState<DrawerEntry[]>(INITIAL_ENTRIES);
  const [history, setHistory] = useState<ShiftHistory[]>(INITIAL_HISTORY);

  const [addOpen, setAddOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);

  const totals = useMemo(() => {
    const sum = (t: EntryType) =>
      entries.filter((e) => e.type === t).reduce((s, e) => s + e.amount, 0);
    const cashSales = sum("Cash Sale");
    const cashIn = sum("Cash In");
    const cashOut = sum("Cash Out");
    const safeDrops = sum("Safe Drop");
    return {
      cashSales,
      cashIn,
      cashOut,
      safeDrops,
      expected: openingFloat + cashSales + cashIn - cashOut - safeDrops,
    };
  }, [entries, openingFloat]);

  // summary cards
  const stats = [
    {
      label: "Opening Float",
      value: `${CURRENCY} ${openingFloat}`,
      sub: (
        <span className="flex items-center gap-1">
          <Clock className="size-3" /> {shiftStart}
        </span>
      ),
      card: "border-[#F24DEB] bg-[#FF00F50D]",
      text: "text-[#BD29B7]",
      subText: "text-[#BD29B7]",
    },
    {
      label: "Cash Sales",
      value: `+ ${CURRENCY} ${totals.cashSales}`,
      sub: "Shift Cash Sales",
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
      subText: "text-[#585858]",
    },
    {
      label: "Cash Added",
      value: `+ ${CURRENCY} ${totals.cashIn}`,
      sub: "Float Addition",
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
      subText: "text-[#585858]",
    },
    {
      label: "Cash Out",
      value: `- ${CURRENCY} ${totals.cashOut}`,
      sub: "Petty Cash/Expenses",
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
      subText: "text-[#585858]",
    },
    {
      label: "Safe Drops",
      value: `- ${CURRENCY} ${totals.safeDrops}`,
      sub: "Locker Drops",
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
      subText: "text-[#585858]",
    },
    {
      label: "Expected Drawer",
      value: `${CURRENCY} ${totals.expected}`,
      sub: "Live Drawer Balance",
      card: "border-[#3100A3] bg-[#AB5DFF1A]",
      text: "text-[#3100A3]",
      subText: "text-[#585858]",
    },
  ];

  const handleAddEntry = (data: CashDrawerFormData) =>
    setEntries((prev) => [
      {
        id: crypto.randomUUID(),
        time: formatTime(),
        type: data.type as EntryType,
        amount: Number(data.amount),
        reason: data.reason ?? "",
        cashier: CASHIER,
      },
      ...prev,
    ]);

  const handleCloseShift = (countedCash: number) => {
    const difference = countedCash - totals.expected;
    setHistory((prev) => [
      {
        id: `SH-${String(prev.length + 1).padStart(3, "0")}`,
        startTime: shiftStart,
        endTime: formatTime(),
        openingFloat,
        expectedCash: totals.expected,
        difference,
        status: difference === 0 ? "Balanced" : difference > 0 ? "Over" : "Short",
      },
      ...prev,
    ]);
    // Start a fresh shift: the counted cash becomes the next opening float
    setEntries([]);
    setOpeningFloat(countedCash);
    setShiftStart(formatTime());
  };

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Cash Register Drawer & Shift Management"
        subtitle="Track daily opening floats, cash sales, manual cash in, payouts, safe drops, and shift reconciliation."
        icon={cashDrawerIcon}
        actions={[
          {
            label: "Add Cash In/Out",
            icon: <PlusCircle />,
            variant: "create",
            onClick: () => setAddOpen(true),
          },
          {
            label: "Close Register Shift",
            icon: <Lock />,
            variant: "closeRegisterShift", 
            onClick: () => setCloseOpen(true),
          },
        ]}
      />

      {/* Summary cards: 1 col on phones, 2 on sm, 3 on lg, 6 from 2xl */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex min-h-[91px] w-full flex-col justify-center gap-[6px] rounded-[10px] border px-4 py-3 font-poppins ${s.card}`}
          >
            <p className={`text-[12px] font-normal uppercase leading-[1.3] ${s.text}`}>{s.label}</p>
            <p className="text-[16px] font-semibold leading-[1.2] text-black">{s.value}</p>
            <div className={`text-[10px] leading-[1.3] ${s.subText}`}>{s.sub}</div>
          </div>
        ))}
      </section>

      {/* Cash drawer activity log */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 sm:px-5">
        <SectionTitle icon={<IndianRupee className="size-3.5" />} title="Cash Drawer Activity Log" />
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason/Description</TableHead>
              <TableHead>Cashier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableEmpty colSpan={5}>No transactions logged in drawer today</TableEmpty>
            ) : (
              entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.time}</TableCell>
                  <TableCell>{e.type}</TableCell>
                  <TableCell>
                    <span className={AMOUNT_STYLE[e.type]}>
                      {e.type === "Cash Sale" || e.type === "Cash In" ? "+" : "-"} {CURRENCY} {e.amount}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[260px]">
                    <p className="truncate" title={e.reason}>{e.reason || "-"}</p>
                  </TableCell>
                  <TableCell>{e.cashier}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      {/* Previous shifts history */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 sm:px-5">
        <SectionTitle icon={<FileText className="size-3.5" />} title="Previous Register Shifts History" />
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Shift ID</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Opening Float</TableHead>
              <TableHead>Expected Cash</TableHead>
              <TableHead>Difference</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableEmpty colSpan={7}>No previous shifts found</TableEmpty>
            ) : (
              history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.id}</TableCell>
                  <TableCell>{h.startTime}</TableCell>
                  <TableCell>{h.endTime}</TableCell>
                  <TableCell>{CURRENCY} {h.openingFloat}</TableCell>
                  <TableCell>{CURRENCY} {h.expectedCash}</TableCell>
                  <TableCell>
                    <span className={h.difference < 0 ? "text-red-600" : undefined}>
                      {CURRENCY} {h.difference}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2 py-[2px] text-[10px] font-medium ${STATUS_STYLE[h.status]}`}
                    >
                      {h.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      <AddCashDrawerDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAddEntry} />

      {/* <CloseShiftDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        expectedCash={totals.expected}
        onSubmit={handleCloseShift}
      /> */}
    </div>
  );
}

export default CashDrawerPage;