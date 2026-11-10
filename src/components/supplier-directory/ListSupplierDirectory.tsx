"use client";

import { ListSupplierApi } from "@/src/api/supplier/api/getAll";
import { useDeleteSupplier } from "@/src/api/supplier/hooks/delete.hook";
import PageHeader from "@/src/components/common/PageHeader";
import SearchBar from "@/src/components/common/PosSearchBar";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Supplier } from "@/src/interfaces/supplier/getAll.type";
import { useQuery } from "@tanstack/react-query";
import { Contact, FileText, Mail, MapPin, Phone, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { default as activeSuppliesIcon, default as supplierIcon } from "../../../public/icons/supplier1.png";
import vendorPayableIcon from "../../../public/icons/supplier2.png";
import pendingCreditIcon from "../../../public/icons/supplier3.png";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { PaginationComponent } from "../common/PaginationComponent";
import ErrorHandling from "../Error/ErrorHandling";
import AddSupplier from "./AddSupplierDirectory";
import { AddSupplierDialog } from "./AddSupplierDirectoryDialogue";

const CURRENCY = "₹";

const formatPhone = (p?: string) => (!p ? "-" : p.startsWith("+") ? p : `+${p}`);
const supplierCode = (id: string) => `SUP-${id.slice(-4).toUpperCase()}`;

function SupplierPage() {
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["supplierList", currentPage, pageSize, query],
    queryFn: () => ListSupplierApi({ page: currentPage, limit: pageSize, search: query }),
  });

  const suppliers = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

  const { mutate: DeleteSupplier, isPending } = useDeleteSupplier();

  const stats = [
    {
      label: "Total Active Supplies",
      value: String(totalCount),
      icon: activeSuppliesIcon,
      card: "border-[#F24DEB] bg-[#FF00F50D]",
      text: "text-primary",
    },
    {
      label: "Total Vendor Payable Balance",
      value: `${CURRENCY} ${suppliers.reduce((sum, s) => sum + (s.balanceDue ?? 0), 0)}`,
      icon: vendorPayableIcon,
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
    },
    {
      label: "Suppliers With Pending Credit",
      value: String(suppliers.filter((s) => s.balanceDue > 0).length),
      icon: pendingCreditIcon,
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
    },
  ];

  const handleConfirmDialogClose = (open: boolean) => {
    if (!open && !isPending) setSupplierToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!supplierToDelete) return;
    DeleteSupplier(
      { id: supplierToDelete._id, supplierName: supplierToDelete.name },
      { onSuccess: () => setSupplierToDelete(null) },
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
        title="Supplier Directory & Vendor Activity"
        subtitle="Manage wholesale distribution, payment terms, contact details, and outstanding balances"
        icon={supplierIcon}
        actions={[{ label: "Add New Supplier", icon: <Plus />, onClick: () => setAddOpen(true) }]}
      />

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
              <p className="font-poppins text-[16px] font-semibold leading-[1.2] text-black">{s.value}</p>
            </div>
            <span className="flex shrink-0 items-center justify-center rounded-[5px] p-[5px]">
              <Image src={s.icon} alt="" width={19} height={19} className="size-full object-contain" />
            </span>
          </div>
        ))}
      </section>

      <section className="rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        <SearchBar
          icon={Search}
          placeholder="Search supplier or company name..."
          value={query}
          onSearch={(v) => {
            setQuery(v);
            setCurrentPage(1);
          }}
          className="w-full max-w-none sm:w-[321px]"
        />
      </section>

      {isLoading ? (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[198px] rounded-[10px]" />
          ))}
        </section>
      ) : suppliers.length === 0 ? (
        <div className="rounded-[10px] bg-[#EFEFEF] py-12 text-center font-poppins text-[12px] text-[#848484]">
          No suppliers found
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((s) => (
            <article
              key={s._id}
              className="flex min-h-[198px] min-w-0 flex-col gap-[5px] rounded-[10px] border border-[#A8A8A8] bg-[#EFEFEF] pb-[13px] pl-[15px] pr-[14px] pt-[14px] font-poppins"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-[5px]">
                  <span className="inline-flex h-[13px] w-fit items-center rounded-full border border-[#ACACAC] bg-[#BFBFBF40] px-2 text-[10px] leading-none text-[#585858]">
                    {supplierCode(s._id)}
                  </span>
                  <h3 className="truncate text-[14px] font-semibold leading-[1.3] text-black" title={s.name}>
                    {s.name}
                  </h3>
                  <p className="flex items-center gap-[6px] text-[11px] uppercase leading-[1.3] text-[#F24DEB]">
                    <Contact className="size-[13px] shrink-0" />
                    <span className="truncate" title={s.contactPerson}>{s.contactPerson}</span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <AddSupplier isEdit id={s._id} />
                  <Button type="button" aria-label="Delete" variant="deleteicon" onClick={() => setSupplierToDelete(s)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <ul className="flex flex-col gap-[6px] border-t border-[#BDBDBD] pt-[6px] text-[12px] leading-[1.3] text-[#6B6B6B]">
                <li className="flex items-center gap-2">
                  <Phone className="size-[13px] shrink-0" />
                  <span className="truncate">{formatPhone(s.phone)}</span>
                </li>
                
                  <li className="flex items-center gap-2">
                    <Mail className="size-[13px] shrink-0" />
                    <span className="truncate" title={s.email}>{s.email || "-"}</span>
                  </li>
               
                <li className="flex items-center gap-2">
                  <FileText className="size-[13px] shrink-0" />
                  <span className="truncate">GSTIN: {s.gstinNumber || "-"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-[1px] size-[13px] shrink-0" />
                  <span className="line-clamp-2 break-words" title={s.address}>{s.address || "-"}</span>
                </li>
              </ul>

              <div className="mt-auto flex justify-between gap-2 border-t border-[#BDBDBD] pt-[6px] text-[12px]">
                <p className="min-w-0 truncate text-black">
                  Credit Terms: {s.paymentTermsId?.name ?? "-"}
                </p>
                <div className="shrink-0 text-right">
                  <p className="text-[12px] uppercase leading-[1.3] text-[#848484]">Outstanding</p>
                  <p className={`text-[12px] font-semibold leading-[1.3] text-black`}>
                   {s.balanceDue}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <PaginationComponent
        currentPage={currentPage}
        totalItems={totalCount}
        pageSizeOptions={[6, 12, 24, 48]}
        showItemsInfo
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      <AddSupplierDialog open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmationDialog
        open={!!supplierToDelete}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete supplier "${supplierToDelete?.contactPerson}"?`}
        isPending={isPending}
      />
    </div>
  );
}

export default SupplierPage;