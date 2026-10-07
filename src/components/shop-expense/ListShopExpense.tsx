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
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import expenseIcon from "../../../public/icons/shop-expense.png"; // add your icon file
// stat card icons (add these image files, or change the file names)
import todayExpensesIcon from "../../../public/icons/shop2.png";
import totalExpensesIcon from "../../../public/icons/customer-2.png";
import expenseEntriesIcon from "../../../public/icons/shop1.png";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { AddExpenseDialog, EXPENSE_CATEGORIES, ExpenseFormData } from "./AddShopExpenseDialogue";
import AddExpense from "./AddShopExpense";


type Expense = {
  id: string;
  title: string;
  category: string;
  date: string; // yyyy-mm-dd
  paymentMode: string;
  amount: number;
  notes: string;
};

// yyyy-mm-dd in local time, n days before today
const dateAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

// Dummy data (replace with API data later)
const EXPENSES: Expense[] = [
  { id: "1", title: "Shop rent for October", category: "Rent", date: dateAgo(0), paymentMode: "Bank Transfer", amount: 18000, notes: "Voucher 1024" },
  { id: "2", title: "Electricity bill (KSEB)", category: "Electricity", date: dateAgo(0), paymentMode: "UPI", amount: 3250, notes: "" },
  { id: "3", title: "Staff salary - Anu & Ravi", category: "Salary", date: dateAgo(2), paymentMode: "Bank Transfer", amount: 24000, notes: "September" },
  { id: "4", title: "Broadband recharge", category: "Internet", date: dateAgo(4), paymentMode: "Card", amount: 799, notes: "" },
  { id: "5", title: "Delivery van fuel", category: "Transport", date: dateAgo(5), paymentMode: "Cash", amount: 1500, notes: "" },
  { id: "6", title: "Cleaning supplies", category: "Miscellaneous", date: dateAgo(7), paymentMode: "Cash", amount: 420, notes: "Voucher 1019" },
];

const CATEGORY_FILTERS = ["All", ...EXPENSE_CATEGORIES.map((c) => c.value)];

const CURRENCY = "₹";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const toFormData = (e: Expense): ExpenseFormData => ({
  title: e.title,
  category: e.category,
  amount: String(e.amount),
  paymentMethod: e.paymentMode,
  notes: e.notes,
});

function ExpensePage() {
  const [category, setCategory] = useState("All");
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES);
  const [addOpen, setAddOpen] = useState(false);

  // delete confirmation
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isPending, setIsPending] = useState(false);

  const filtered = useMemo(
    () => expenses.filter((e) => category === "All" || e.category === category),
    [expenses, category],
  );

  // summary cards
  const today = dateAgo(0);
  const stats = [
    {
      label: "Today’s Expenses",
      value: `${CURRENCY} ${expenses.filter((e) => e.date === today).reduce((s, e) => s + e.amount, 0)}`,
      icon: todayExpensesIcon,
      card: "border-[#F24DEB] bg-[#FF00F50D]",
      text: "text-[#BD29B7]",
      iconBox: "bg-[#F24DEB33]",
    },
    {
      label: "Total Record Expenses",
      value: `${CURRENCY} ${expenses.reduce((s, e) => s + e.amount, 0)}`,
      icon: totalExpensesIcon,
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
      iconBox: "bg-[#B0F597]",
    },
    {
      label: "Expenses Entries",
      value: `${expenses.length} Records`,
      icon: expenseEntriesIcon,
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
      iconBox: "bg-[#A9D8FF]",
    },
  ];

  const handleCreate = (data: ExpenseFormData) =>
    setExpenses((prev) => [
      {
        id: crypto.randomUUID(),
        title: data.title,
        category: data.category,
        date: dateAgo(0),
        paymentMode: data.paymentMethod,
        amount: Number(data.amount) || 0,
        notes: data.notes ?? "",
      },
      ...prev,
    ]);

  const handleUpdate = (id: string, data: ExpenseFormData) =>
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              title: data.title,
              category: data.category,
              paymentMode: data.paymentMethod,
              amount: Number(data.amount) || 0,
              notes: data.notes ?? "",
            }
          : e,
      ),
    );

  // called by the dialog when it closes (Cancel, overlay click, Escape)
  const handleConfirmDialogClose = (open: boolean) => {
    if (!open && !isPending) setExpenseToDelete(null);
  };

  const handleConfirmDelete = async (remark: string) => {
    if (!expenseToDelete) return;
    try {
      setIsPending(true);
      // TODO: await your delete-expense API call here (send `remark` with it)
      setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete.id));
      setExpenseToDelete(null);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Shop Expense Management & Ledger"
        subtitle="Log shop rent, electricity, employee salaries, and operating expenses, automatically calculates net profit!"
        icon={expenseIcon}
        actions={[
          {
            label: "Record Expense",
            icon: <Plus />,
            onClick: () => setAddOpen(true),
          },
        ]}
      />

      {/* Summary cards: 1 column on phones, 2 on sm, 3 from lg */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <span className={`flex  shrink-0 items-center justify-center rounded-[5px] p-[5px] `}>
              <Image src={s.icon} alt="" width={19} height={19} className="size-full object-contain" />
            </span>
          </div>
        ))}
      </section>

      {/* Category tabs (wrap onto more rows when there are many) */}
      <section className="rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        <Tabs value={category} onValueChange={setCategory} className="min-w-0">
          <TabsList
            variant="pills"
            className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0"
          >
            {CATEGORY_FILTERS.map((c) => (
              <TabsTrigger key={c} variant="category" value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Table (scrolls sideways on small screens) */}
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title And Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment Mode</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableEmpty colSpan={6}>No expense records found</TableEmpty>
          ) : (
            filtered.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="max-w-[260px]">
                  <p className="truncate" title={e.title}>{e.title}</p>
                  {e.notes && (
                    <p className="truncate text-[10px] text-[#848484]" title={e.notes}>
                      {e.notes}
                    </p>
                  )}
                </TableCell>
                <TableCell>{e.category}</TableCell>
                <TableCell>{formatDate(e.date)}</TableCell>
                <TableCell>{e.paymentMode}</TableCell>
                <TableCell>{CURRENCY} {e.amount}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <AddExpense
                      isEdit
                      id={e.id}
                      expense={toFormData(e)}
                      onSubmit={(data) => handleUpdate(e.id, data)}
                    />
                    <Button
                      type="button"
                      aria-label="Delete"
                      variant={"deleteicon"}
                      onClick={() => setExpenseToDelete(e)}
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

      <AddExpenseDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} />

      <ConfirmationDialog
        open={!!expenseToDelete}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete expense "${expenseToDelete?.title}"`}
        isPending={isPending}
      />
    </div>
  );
}

export default ExpensePage;