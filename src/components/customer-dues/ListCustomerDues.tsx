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
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Eye, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import customerIcon from "../../../public/icons/customer-dues.png";
import totalCustomerIcon from "../../../public/icons/customer-1.png";
import totalDuesIcon from "../../../public/icons/customer-2.png";
import activeCustomerIcon from "../../../public/icons/customer-3.png";
import loyaltyPointsIcon from "../../../public/icons/customer-4.png";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import ErrorHandling from "../Error/ErrorHandling";
import { PaginationComponent } from "../common/PaginationComponent";
import AddCustomer from "./AddCustomerDues";
import { AddCustomerDialog } from "./AddCustomeDuesDialog";
import { PurchaseLedgerDialog } from "./ViewCustomerDialogue";

import { ListCustomerApi } from "@/src/api/customer/api/getAll";
import { useDeleteCustomer } from "@/src/api/customer/hooks/delete.hook";
import { Customer } from "@/src/interfaces/customer/getAll.type";
import CustomerTableSkeleton from "./CustomerSkeletonLoading";
import { CustomerTag } from "@/src/interfaces/enums/CustomerTag";

type TagFilter = "All" | CustomerTag;

const TAG_FILTERS: { value: TagFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: CustomerTag.REGULAR, label: "Regular" },
  { value: CustomerTag.VIP, label: "VIP" },
  { value: CustomerTag.WHOLESALE, label: "Wholesale" },
];

const TAG_STYLE: Record<string, string> = {
  REGULAR: "bg-[#A9D8FF40] text-[#0078DA] border-[#0078DA]",
  VIP: "bg-[#FF00F50D] text-[#F24DEB] border-[#F24DEB]",
  WHOLESALE: "bg-[#AB5DFF1A] text-[#3100A3] border-[#3100A3]",
};

const CURRENCY = "₹";

const STATUS_STYLE = {
  active: "bg-[#B0F5973D] text-[#0EA300] border-[#0EA300]",
  inactive: "bg-[#FEE2E240] text-[#DC2626] border-[#FCA5A5]",
};

function CustomerPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<TagFilter>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [customerToView, setCustomerToView] = useState<Customer | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // delete confirmation
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customerList", currentPage, pageSize, query, tag],
    queryFn: () =>
      ListCustomerApi({
        page: currentPage,
        limit: pageSize,
        search: query,
        ...(tag !== "All" ? { tag } : {}), 
      }),
  });

  const customers = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

  const { mutate: DeleteCustomer, isPending } = useDeleteCustomer();

  // client-side safety net in case the API ignores the `tag` param
  const filtered = useMemo(
    () => customers.filter((c) => tag === "All" || c.tag === tag),
    [customers, tag],
  );

  const stats = [
    {
      label: "Total Customer",
      value: String(totalCount),
      icon: totalCustomerIcon,
      card: "border-[#F24DEB] bg-[#FF00F50D]",
      text: "text-primary",
    },
    {
      label: "Total Outstanding Dues",
      value: `${CURRENCY} ${customers.reduce((s, c) => s + (c.balanceDue ?? 0), 0)}`,
      icon: totalDuesIcon,
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
    },
    {
      label: "VIP Customers",
      value: String(customers.filter((c) => c.isActive).length),
      icon: activeCustomerIcon,
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
    },
    {
      label: "Loyalty Points Issued",
      value: `${customers.reduce((s, c) => s + (c.loyaltyPoints ?? 0), 0)} pts`,
      icon: loyaltyPointsIcon,
      card: "border-[#3100A3] bg-[#AB5DFF1A]",
      text: "text-[#3100A3]",
    },
  ];

  const handleConfirmDialogClose = (open: boolean) => {
    if (!open && !isPending) setCustomerToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!customerToDelete) return;
    DeleteCustomer(
      { id: customerToDelete._id, customerName: customerToDelete.name },
      { onSuccess: () => setCustomerToDelete(null) },
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

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
            <span className="flex shrink-0 items-center justify-center rounded-[5px] p-[5px]">
              <Image src={s.icon} alt="" width={29} height={29} className="size-full object-contain" />
            </span>
          </div>
        ))}
      </section>

      {/* Search + tag filters */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          icon={Search}
          placeholder="Search by name or mobile number..."
          value={query}
          onSearch={(v) => {
            setQuery(v);
            setCurrentPage(1);
          }}
          className="w-full max-w-none lg:w-[321px] lg:flex-none"
        />

        <Tabs
          value={tag}
          onValueChange={(v) => {
            setTag(v as TagFilter);
            setCurrentPage(1);
          }}
          className="min-w-0 lg:flex-none"
        >
          <TabsList
            variant="pills"
            className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0"
          >
            {TAG_FILTERS.map((t) => (
              <TabsTrigger key={t.value} variant="filter" value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer Info</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Credit Limit</TableHead>
              <TableHead>Loyalty Points</TableHead>
              <TableHead>Outstanding Dues</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <CustomerTableSkeleton />
            ) : filtered.length === 0 ? (
              <TableEmpty colSpan={8}>No customers found</TableEmpty>
            ) : (
              filtered.map((c) => (
                <TableRow key={c._id}>
                 <TableCell className="min-w-[180px] max-w-[260px] ">
  <p className="whitespace-normal break-words" title={c.name}>
    {c.name}
  </p>
  {c.address && (
    <p
      className="whitespace-normal break-words text-[10px] text-[#848484]"
      title={c.address}
    >
      {c.address}
    </p>
  )}
</TableCell>
                  <TableCell>
                    <p>{c.phone || "-"}</p>
                    {c.email && (
                      <p className="truncate text-[10px] text-[#848484]" title={c.email}>
                        {c.email}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2 py-[2px] text-[10px] font-medium capitalize ${
                        TAG_STYLE[c.tag] ?? TAG_STYLE.REGULAR
                      }`}
                    >
                      {String(c.tag ?? "REGULAR").toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2 py-[2px] text-[10px] font-medium ${
                        c.isActive ? STATUS_STYLE.active : STATUS_STYLE.inactive
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{c.creditLimit}</TableCell>
                  <TableCell>{c.loyaltyPoints} pts</TableCell>
                  <TableCell>
                    <span className={c.balanceDue > 0 ? "text-red-600" : undefined}>
                      {c.balanceDue}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        aria-label="View"
                        variant="viewicon"
                        onClick={() => setCustomerToView(c)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <AddCustomer isEdit id={c._id} />
                      <Button
                        type="button"
                        aria-label="Delete"
                        variant="deleteicon"
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

      <AddCustomerDialog open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmationDialog
        open={!!customerToDelete}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete customer "${customerToDelete?.name}"?`}
        isPending={isPending}
      />

      {/* View Customer */}
      <PurchaseLedgerDialog
        open={!!customerToView}
        onOpenChange={(open) => !open && setCustomerToView(null)}
        customerName={customerToView?.name}
        mobile={customerToView?.phone}
        purchases={[]}
      />
    </div>
  );
}

export default CustomerPage;