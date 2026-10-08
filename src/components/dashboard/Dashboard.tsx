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
import {
  AlertTriangle,
  ArrowUpRight,
  Box,
  Clock,
  Eye,
  IndianRupee,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import dashboardIcon from "../../../public/icons/shop2.png"; // change to your dashboard icon

type PaymentMode = "Cash" | "UPI" | "Card" | "Credit";

type RecentInvoice = {
  id: string;
  invoiceNo: string;
  time: string;
  customer: string;
  items: number;
  amount: number;
  mode: PaymentMode;
};

type LowStockItem = {
  id: string;
  name: string;
  supplier: string;
  left: number;
};

const CURRENCY = "₹";
const LOW_STOCK_THRESHOLD = 10;

// Dummy data (replace with API data later)
const TOTAL_SKUS = 13;
const AVAILABLE_STOCK_QTY = 479;
const TODAYS_NET_PROFIT = 109;
const COMPLETED_TRANSACTIONS = 2;

const PAYMENTS: Record<PaymentMode, number> = {
  Cash: 340,
  UPI: 400,
  Card: 0,
  Credit: 0,
};

const RECENT_INVOICES: RecentInvoice[] = [
  { id: "1", invoiceNo: "INV0001", time: "10:15 AM", customer: "Rahul Sharma", items: 3, amount: 340, mode: "Cash" },
  { id: "2", invoiceNo: "INV0002", time: "12:40 PM", customer: "Walk-in Customer", items: 2, amount: 400, mode: "UPI" },
];

const LOW_STOCK: LowStockItem[] = [
  { id: "1", name: "Fortune Sunflower Oil 1L", supplier: "Adani Wilmar", left: 8 },
  { id: "2", name: "Tata Salt 1kg", supplier: "Tata Consumer", left: 5 },
];

const MODE_BADGE: Record<PaymentMode, string> = {
  Cash: "border-[#0EA300] bg-[#B0F5973D] text-[#0EA300]",
  UPI: "border-[#F24DEB] bg-[#FF00F50D] text-primary",
  Card: "border-[#0078DA] bg-[#A9D8FF40] text-[#0078DA]",
  Credit: "border-[#3100A3] bg-[#AB5DFF1A] text-[#3100A3]",
};

const PAYMENT_CARDS: {
  mode: PaymentMode;
  label: string;
  sub: string;
  card: string;
  text: string;
  iconBox: string;
  icon: React.ReactNode;
}[] = [
  {
    mode: "Cash",
    label: "Today's Cash",
    sub: "In Cash Drawer",
    card: "border-[#F24DEB] bg-[#FF00F50D]",
    text: "text-primary",
    iconBox: "bg-[#F24DEB33] text-primary",
    icon: <Clock className="size-4" />,
  },
  {
    mode: "UPI",
    label: "Today's UPI",
    sub: "Dynamic QR Payments",
    card: "border-[#0EA300] bg-[#B0F5973D]",
    text: "text-[#0EA300]",
    iconBox: "bg-[#B0F597] text-[#0EA300]",
    icon: <TrendingUp className="size-4" />,
  },
  {
    mode: "Card",
    label: "Today's Card",
    sub: "POS Machine",
    card: "border-[#0078DA] bg-[#A9D8FF40]",
    text: "text-[#0078DA]",
    iconBox: "bg-[#A9D8FF] text-[#0078DA]",
    icon: <Box className="size-4" />,
  },
  {
    mode: "Credit",
    label: "Today's Credit",
    sub: "Customer Dues",
    card: "border-[#3100A3] bg-[#AB5DFF1A]",
    text: "text-[#3100A3]",
    iconBox: "bg-[#AB5DFF] text-white",
    icon: <TrendingUp className="size-4" />,
  },
];

function StatCard({
  label,
  icon,
  iconBox,
  value,
  unit,
  footer,
}: {
  label: string;
  icon: React.ReactNode;
  iconBox: string;
  value: string;
  unit?: string;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[140px] w-full flex-col justify-between gap-4 rounded-[10px] bg-[#EFEFEF] px-6 py-5 font-poppins">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-normal uppercase leading-[1.4] text-[#848484]">{label}</p>
        <span className={`flex size-[34px] shrink-0 items-center justify-center rounded-[8px] ${iconBox}`}>
          {icon}
        </span>
      </div>

      {/* Amount + footer sit together at the bottom (no gap between them) */}
      <div className="flex flex-col gap-[2px]">
        <div className="flex items-baseline gap-1">
          <p className="text-[18px] font-semibold leading-[1.3] text-black">{value}</p>
          {unit && <span className="text-[10px] text-[#848484]">{unit}</span>}
        </div>
        <div className="text-[11px] leading-[1.4] text-[#848484]">{footer}</div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const router = useRouter();

  const totalRevenue = useMemo(
    () => Object.values(PAYMENTS).reduce((s, v) => s + v, 0),
    [],
  );

  const lowStock = useMemo(() => LOW_STOCK.filter((i) => i.left < LOW_STOCK_THRESHOLD), []);

  // TODO: change these routes to match your app
  const goBilling = () => router.push("/pos");
  const goNewProduct = () => router.push("/products");
  const goInventory = () => router.push("/inventory");
  const goSalesHistory = () => router.push("/sales");

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      {/* 1. Page header */}
      <PageHeader
        title="Shop Overview & Performance"
        subtitle="Real time sales, inventory status, and profit tracking from local data base"
        icon={dashboardIcon}
        actions={[
          {
            label: "Open Billing Counter",
            icon: <ShoppingBag />,
            variant: "create",
            onClick: goBilling,
          },
          {
            label: "New Product Item",
            icon: <Package />,
            variant: "cancel", // grey button, change to your grey variant
            onClick: goNewProduct,
          },
        ]}
      />

      {/* 2. Summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Today's Revenue"
          icon={<IndianRupee className="size-4" />}
          iconBox="bg-[#F24DEB33] text-primary"
          value={`${CURRENCY} ${totalRevenue}`}
          footer={
            <span className="flex items-center gap-1.5">
              <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#F24DEB33] text-primary">
                <IndianRupee className="size-3" />
              </span>
              {COMPLETED_TRANSACTIONS} Completed transition today
            </span>
          }
        />
        <StatCard
          label="Today's Net Profit"
          icon={<TrendingUp className="size-4" />}
          iconBox="bg-[#B0F597] text-[#0EA300]"
          value={`${CURRENCY} ${TODAYS_NET_PROFIT}`}
          footer={
            <span>
              Overall Profit:{" "}
              <span className="font-semibold text-[#0EA300]">
                {CURRENCY} {TODAYS_NET_PROFIT}
              </span>
            </span>
          }
        />
        <StatCard
          label="Total Products / Items"
          icon={<Box className="size-4" />}
          iconBox="bg-[#A9D8FF] text-[#0078DA]"
          value={String(TOTAL_SKUS)}
          unit="SKUs"
          footer={
            <span className="flex items-center gap-1.5">
              <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#A9D8FF] text-[#0078DA]">
                <Box className="size-3" />
              </span>
              Available Stock Qty:{" "}
              <span className="font-semibold text-[#0078DA]">{AVAILABLE_STOCK_QTY} units</span>
            </span>
          }
        />
        <StatCard
          label="Low Stock Alert"
          icon={<AlertTriangle className="size-4" />}
          iconBox="bg-[#FF0F0F33] text-[#FF0F0F]"
          value={String(lowStock.length)}
          footer={
            <button
              type="button"
              onClick={goInventory}
              className="flex items-center gap-1 underline underline-offset-2 hover:text-primary"
            >
              View Inventory Table
              <ArrowUpRight className="size-3 text-[#F24DEB]" />
            </button>
          }
        />
      </section>

      {/* 3. Payment collection & distribution */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#BFBFBF] pb-3">
          <h2 className="flex items-center gap-2 font-poppins text-[14px] font-medium text-black">
            <Clock className="size-4 text-[#F24DEB]" />
            Today&apos;s Payment Collection &amp; Distribution
          </h2>
          <p className="font-poppins text-[12px] uppercase text-[#848484]">
            Total Revenue:{" "}
            <span className="font-semibold text-[#585858]">
              {CURRENCY} {totalRevenue}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PAYMENT_CARDS.map((p) => (
            <div
              key={p.mode}
              className={`flex min-h-[92px] w-full items-start justify-between gap-2 rounded-[10px] border px-5 py-3 font-poppins sm:px-6 ${p.card}`}
            >
              <div className="flex min-w-0 flex-col gap-[6px]">
                <p className={`text-[12px] font-normal uppercase leading-[1.4] ${p.text}`}>{p.label}</p>
                <p className="text-[16px] font-semibold leading-[1.3] text-black">
                  {CURRENCY} {PAYMENTS[p.mode]}
                </p>
                <p className="truncate text-[10px] leading-[1.4] text-[#585858]">{p.sub}</p>
              </div>
              <span className={`flex size-[26px] shrink-0 items-center justify-center rounded-[5px] ${p.iconBox}`}>
                {p.icon}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Recent invoices + low stock products */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Recent invoice & transaction */}
        <section className="flex min-w-0 flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-poppins text-[14px] font-medium text-black">
              <span className="flex size-[22px] items-center justify-center rounded-[5px] bg-[#F24DEB33] text-primary">
                <IndianRupee className="size-3.5" />
              </span>
              Recent Invoice &amp; Transaction
            </h2>
            <button
              type="button"
              onClick={goSalesHistory}
              className="flex items-center gap-1 font-poppins text-[11px] uppercase text-[#F24DEB] underline underline-offset-2"
            >
              View Full Sales History
              <ArrowUpRight className="size-3" />
            </button>
          </div>

          <Table className="min-w-[520px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice#</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_INVOICES.length === 0 ? (
                <TableEmpty colSpan={7}>No invoices today</TableEmpty>
              ) : (
                RECENT_INVOICES.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.invoiceNo}</TableCell>
                    <TableCell>{inv.time}</TableCell>
                    <TableCell className="max-w-[140px]">
                      <p className="truncate py-[2px] leading-[1.5]" title={inv.customer}>
                        {inv.customer}
                      </p>
                    </TableCell>
                    <TableCell>{inv.items}</TableCell>
                    <TableCell>
                      {CURRENCY} {inv.amount}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full border px-3 py-[2px] text-[10px] font-medium uppercase ${MODE_BADGE[inv.mode]}`}
                      >
                        {inv.mode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button type="button" aria-label="View" variant={"viewicon"}>
                          <Eye className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>

        {/* Low stock products */}
        <section className="flex min-w-0 flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-poppins text-[14px] font-medium text-black">
              <AlertTriangle className="size-4 text-[#FF0F0F]" />
              Low Stock Products
            </h2>
            <span className="rounded-full border border-[#FF0F0F] bg-[#FF0F0F1A] px-3 py-[2px] font-poppins text-[11px] font-medium uppercase text-[#FF0F0F]">
              {lowStock.length} Items
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {lowStock.length === 0 ? (
              <p className="py-6 text-center font-poppins text-[12px] text-[#848484]">
                All products are well stocked
              </p>
            ) : (
              lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-[10px] border border-[#FF0F0F66] bg-[#FF0F0F1A] px-4 py-3 font-poppins"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium leading-[1.5] text-black" title={item.name}>
                      {item.name}
                    </p>
                    <p className="truncate text-[10px] leading-[1.5] text-[#585858]" title={item.supplier}>
                      Supplier : {item.supplier}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[11px] font-semibold text-[#FF0F0F]">{item.left} Left</span>
                    <button
                      type="button"
                      // TODO: open your add stock flow
                      className="text-[10px] font-medium text-[#FF0F0F] hover:underline"
                    >
                      +Add Stock
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-[#BFBFBF] pt-3 font-poppins text-[10px] text-[#848484]">
            <span>Threshold: &lt;{LOW_STOCK_THRESHOLD} units</span>
            <button
              type="button"
              // TODO: open your configure-limit screen
              className="flex items-center gap-1 text-[#F24DEB] underline underline-offset-2"
            >
              Configure Limit
              <ArrowUpRight className="size-3" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;