"use client";

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
import Image from "next/image";
import { Eye, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import customerIcon from "../../../public/icons/customer-dues.png";
// stat card icons (add these image files, or change the file names)
import totalCustomerIcon from "../../../public/icons/customer-1.png";
import totalDuesIcon from "../../../public/icons/customer-2.png";
import vipCustomerIcon from "../../../public/icons/customer-3.png";
import loyaltyPointsIcon from "../../../public/icons/customer-4.png";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import AddCustomer from "./AddCustomerDues";
import { AddCustomerDialog, CustomerFormData } from "./AddCustomeDuesDialog";

type Tag = "Regular" | "Vip" | "Wholesale";
type TagFilter = "All" | Tag;

type Customer = {
  id: string;
  name: string;
  mobile: string;
  tag: Tag;
  address: string;
  totalSpent: number;
  loyaltyPoints: number;
  dues: number;
};

// Dummy data (replace with API data later)
const CUSTOMERS: Customer[] = [
  { id: "1", name: "Rahul Sharma", mobile: "9876543210", tag: "Vip", address: "12, MG Road, Kochi", totalSpent: 18450, loyaltyPoints: 184, dues: 0 },
  { id: "2", name: "Anita Menon", mobile: "9895012345", tag: "Regular", address: "Flat 4B, Lake View Apartments", totalSpent: 6200, loyaltyPoints: 62, dues: 850 },
  { id: "3", name: "Fresh Mart Traders", mobile: "9447788990", tag: "Wholesale", address: "Market Road, Edappally", totalSpent: 92300, loyaltyPoints: 923, dues: 12400 },
  { id: "4", name: "Joseph Thomas", mobile: "9961234567", tag: "Regular", address: "Church Lane, Kakkanad", totalSpent: 2150, loyaltyPoints: 21, dues: 0 },
  { id: "5", name: "Meera Nair", mobile: "9846098460", tag: "Vip", address: "7/21, Palarivattom", totalSpent: 24780, loyaltyPoints: 247, dues: 320 },
];

const TAG_FILTERS: TagFilter[] = ["All", "Vip", "Regular", "Wholesale"];

const CURRENCY = "₹";

const TAG_STYLE: Record<Tag, string> = {
  Vip: "bg-[#AB5DFF1A] text-[#3100A3] border-[#3100A3]",
  Regular: "bg-[#BFBFBF40] text-[#585858] border-[#ACACAC]",
  Wholesale: "bg-[#A9D8FF40] text-[#0078DA] border-[#0078DA]",
};

const toFormData = (c: Customer): CustomerFormData => ({
  fullName: c.name,
  mobile: c.mobile,
  tag: c.tag,
  initialDues: String(c.dues),
  address: c.address,
});

function CustomerPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<TagFilter>("All");
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [addOpen, setAddOpen] = useState(false);

  // delete confirmation
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isPending, setIsPending] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter(
      (c) =>
        (tag === "All" || c.tag === tag) &&
        (!q || c.name.toLowerCase().includes(q) || c.mobile.includes(q)),
    );
  }, [customers, tag, query]);

  // summary cards
  const stats = [
    {
      label: "Total Customer",
      value: String(customers.length),
      icon: totalCustomerIcon,
      card: "border-[#F24DEB] bg-[#FF00F50D]",
      text: "text-[#BD29B7]",
      iconBox: "bg-[#F24DEB33]",
    },
    {
      label: "Total Outstanding Dues",
      value: `${CURRENCY} ${customers.reduce((s, c) => s + c.dues, 0)}`,
      icon: totalDuesIcon,
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
      iconBox: "bg-[#B0F597]",
    },
    {
      label: "VIP Customers",
      value: String(customers.filter((c) => c.tag === "Vip").length),
      icon: vipCustomerIcon,
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
      iconBox: "bg-[#A9D8FF]",
    },
    {
      label: "Loyalty Points Issued",
      value: `${customers.reduce((s, c) => s + c.loyaltyPoints, 0)} pts`,
      icon: loyaltyPointsIcon,
      card: "border-[#3100A3] bg-[#AB5DFF1A]",
      text: "text-[#3100A3]",
      iconBox: "bg-[#AB5DFF]",
    },
  ];

  const handleCreate = (data: CustomerFormData) =>
    setCustomers((prev) => [
      {
        id: crypto.randomUUID(),
        name: data.fullName,
        mobile: data.mobile ?? "",
        tag: data.tag as Tag,
        address: data.address ?? "",
        totalSpent: 0,
        loyaltyPoints: 0,
        dues: Number(data.initialDues) || 0,
      },
      ...prev,
    ]);

  const handleUpdate = (id: string, data: CustomerFormData) =>
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: data.fullName,
              mobile: data.mobile ?? "",
              tag: data.tag as Tag,
              address: data.address ?? "",
              dues: Number(data.initialDues) || 0,
            }
          : c,
      ),
    );

  // called by the dialog when it closes (Cancel, overlay click, Escape)
  const handleConfirmDialogClose = (open: boolean) => {
    if (!open && !isPending) setCustomerToDelete(null);
  };

  const handleConfirmDelete = async (remark: string) => {
    if (!customerToDelete) return;
    try {
      setIsPending(true);
      // TODO: await your delete-customer API call here (send `remark` with it)
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      setCustomerToDelete(null);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Customer Management & Dues Ledger"
        subtitle="Track customer purchase history, loyalty rewards, store credits, and outstanding dues."
        icon={customerIcon}
        actions={[
          {
            label: "Add New customer",
            icon: <Plus />,
            onClick: () => setAddOpen(true),
          },
        ]}
      />

      {/* Summary cards: 1 column on phones, 2 on sm, 4 from xl */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          return (
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
              <span className={`flex  shrink-0 items-center justify-center rounded-[5px] p-[5px]`}>
                <Image src={s.icon} alt="" width={29} height={29} className="size-full object-contain" />
              </span>
            </div>
          );
        })}
      </section>

      {/* Search + tag filters: stacked below lg, one row from lg. Filters wrap when many */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          icon={Search}
          placeholder="Search by name or mobile number..."
          value={query}
          onSearch={setQuery}
          className="w-full max-w-none lg:w-[321px] lg:flex-none"
        />

        <Tabs
          value={tag}
          onValueChange={(v) => setTag(v as TagFilter)}
          className="min-w-0 lg:flex-none"
        >
          <TabsList
            variant="pills"
            className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0"
          >
            {TAG_FILTERS.map((t) => (
              <TabsTrigger key={t} variant="filter" value={t}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Table (scrolls sideways on small screens) */}
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Customer Info</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Loyalty Points</TableHead>
            <TableHead>Outstanding Dues</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableEmpty colSpan={7}>No customer management &amp; dues ledger</TableEmpty>
          ) : (
            filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="max-w-[220px]">
                  <p className="truncate" title={c.name}>{c.name}</p>
                  {c.address && (
                    <p className="truncate text-[10px] text-[#848484]" title={c.address}>
                      {c.address}
                    </p>
                  )}
                </TableCell>
                <TableCell>{c.mobile || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full border px-2 py-[2px] text-[10px] font-medium ${TAG_STYLE[c.tag]}`}
                  >
                    {c.tag}
                  </span>
                </TableCell>
                <TableCell>{CURRENCY} {c.totalSpent}</TableCell>
                <TableCell>{c.loyaltyPoints} pts</TableCell>
                <TableCell>
                  <span className={c.dues > 0 ? "text-red-600" : undefined}>
                    {CURRENCY} {c.dues}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button type="button" aria-label="View" variant={"viewicon"}>
                      <Eye className="size-4" />
                    </Button>
                    <AddCustomer
                      isEdit
                      id={c.id}
                      customer={toFormData(c)}
                      onSubmit={(data) => handleUpdate(c.id, data)}
                    />
                    <Button
                      type="button"
                      aria-label="Delete"
                      variant={"deleteicon"}
                      onClick={() => setCustomerToDelete(c)}
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

      <AddCustomerDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} />

      <ConfirmationDialog
        open={!!customerToDelete}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete customer "${customerToDelete?.name}"`}
        isPending={isPending}
      />
    </div>
  );
}

export default CustomerPage;