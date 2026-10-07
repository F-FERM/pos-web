"use client";

import PageHeader from "@/src/components/common/PageHeader";
import SearchBar from "@/src/components/common/PosSearchBar";
import { Button } from "@/src/components/ui/button";
import { Building2, FileText, Mail, MapPin, Phone, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import supplierIcon from "../../../public/icons/supplier1.png"; // add your icon file
// stat card icons (add these image files, or change the file names)
import activeSuppliesIcon from "../../../public/icons/supplier1.png";
import vendorPayableIcon from "../../../public/icons/supplier2.png";
import pendingCreditIcon from "../../../public/icons/supplier3.png";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { AddSupplierDialog, SupplierFormData } from "./AddSupplierDirectoryDialogue";
import AddSupplier from "./AddSupplierDirectory";

type Supplier = {
  id: string;
  code: string;
  contactPerson: string;
  company: string;
  phone: string;
  email?: string;
  gstin: string;
  address: string;
  paymentTerms: string;
  outstanding: number;
};

// Dummy data (replace with API data later)
const SUPPLIERS: Supplier[] = [
  { id: "1", code: "SUP-001", contactPerson: "ITC Wholesale Ltd", company: "ITC Argo Products", phone: "9876543210", email: "sales@itcwholesale.com", gstin: "32AAACI1681G1ZY", address: "Industrial Area, Kakkanad, Kochi", paymentTerms: "15 days credit", outstanding: 0 },
  { id: "2", code: "SUP-002", contactPerson: "Adani Wilmar", company: "Fortune Foods Distribution", phone: "9895012345", email: "orders@adaniwilmar.com", gstin: "32AABCA1234F1Z5", address: "Warehouse 4, Willingdon Island, Kochi", paymentTerms: "30 days credit", outstanding: 12400 },
  { id: "3", code: "SUP-003", contactPerson: "Tata Consumer", company: "Tata Consumer Products", phone: "9447788990", email: "supply@tataconsumer.com", gstin: "32AAACT2803M1Z6", address: "Aluva Distribution Hub", paymentTerms: "Immediate payment", outstanding: 0 },
  { id: "4", code: "SUP-004", contactPerson: "Royal Traders", company: "Royal Rice & Pulses", phone: "9961234567", gstin: "", address: "Market Road, Edappally", paymentTerms: "7 days credit", outstanding: 3250 },
  { id: "5", code: "SUP-005", contactPerson: "Amul Dairy", company: "Amul Dairy Distributors", phone: "9846098460", email: "kerala@amul.coop", gstin: "32AAAAG0000A1Z1", address: "Cold Storage Complex, Palarivattom", paymentTerms: "15 days credit", outstanding: 860 },
];

const CURRENCY = "₹";

const toFormData = (s: Supplier): SupplierFormData => ({
  contactPerson: s.contactPerson,
  company: s.company,
  phone: s.phone,
  gstin: s.gstin,
  paymentTerms: s.paymentTerms,
  address: s.address,
});

function SupplierPage() {
  const [query, setQuery] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);
  const [addOpen, setAddOpen] = useState(false);

  // delete confirmation
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isPending, setIsPending] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suppliers.filter(
      (s) =>
        !q ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.phone.includes(q),
    );
  }, [suppliers, query]);

  // summary cards
  const stats = [
    {
      label: "Total Active Supplies",
      value: String(suppliers.length),
      icon: activeSuppliesIcon,
      card: "border-[#F24DEB] bg-[#FF00F50D]",
      text: "text-[#BD29B7]",
      iconBox: "bg-[#F24DEB33]",
    },
    {
      label: "Total Vendor Payable Balance",
      value: `${CURRENCY} ${suppliers.reduce((sum, s) => sum + s.outstanding, 0)}`,
      icon: vendorPayableIcon,
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
      iconBox: "bg-[#B0F597]",
    },
    {
      label: "Suppliers With Pending Credit",
      value: String(suppliers.filter((s) => s.outstanding > 0).length),
      icon: pendingCreditIcon,
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
      iconBox: "bg-[#A9D8FF]",
    },
  ];

  const handleCreate = (data: SupplierFormData) =>
    setSuppliers((prev) => {
      const next = prev.reduce((max, s) => Math.max(max, Number(s.code.replace(/\D/g, "")) || 0), 0) + 1;
      return [
        {
          id: crypto.randomUUID(),
          code: `SUP-${String(next).padStart(3, "0")}`,
          contactPerson: data.contactPerson,
          company: data.company,
          phone: data.phone,
          gstin: data.gstin ?? "",
          address: data.address ?? "",
          paymentTerms: data.paymentTerms || "15 days credit",
          outstanding: 0,
        },
        ...prev,
      ];
    });

  const handleUpdate = (id: string, data: SupplierFormData) =>
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              contactPerson: data.contactPerson,
              company: data.company,
              phone: data.phone,
              gstin: data.gstin ?? "",
              address: data.address ?? "",
              paymentTerms: data.paymentTerms || s.paymentTerms,
            }
          : s,
      ),
    );

  // called by the dialog when it closes (Cancel, overlay click, Escape)
  const handleConfirmDialogClose = (open: boolean) => {
    if (!open && !isPending) setSupplierToDelete(null);
  };

  const handleConfirmDelete = async (remark: string) => {
    if (!supplierToDelete) return;
    try {
      setIsPending(true);
      // TODO: await your delete-supplier API call here (send `remark` with it)
      setSuppliers((prev) => prev.filter((s) => s.id !== supplierToDelete.id));
      setSupplierToDelete(null);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Supplier Directory & Vendor Activity"
        subtitle="Manage wholesale distribution, payment terms, contact details, and outstanding balances"
        icon={supplierIcon}
        actions={[
          {
            label: "Add New Supplier",
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

      {/* Search */}
      <section className="rounded-[10px] bg-[#EFEFEF] px-4 py-3 sm:px-5">
        <SearchBar
          icon={Search}
          placeholder="Search supplier or company name..."
          value={query}
          onSearch={setQuery}
          className="w-full max-w-none sm:w-[321px]"
        />
      </section>

      {/* Supplier cards: 1 column on phones, 2 from sm, 3 from xl */}
      {filtered.length === 0 ? (
        <div className="rounded-[10px] bg-[#EFEFEF] py-12 text-center font-poppins text-[12px] text-[#848484]">
          No suppliers found
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <article
              key={s.id}
              className="flex min-h-[198px] min-w-0 flex-col gap-[5px] rounded-[10px] border border-[#A8A8A8] bg-[#EFEFEF] pb-[13px] pl-[15px] pr-[14px] pt-[14px] font-poppins"
            >
              {/* Code + name + company, with edit / delete on the right */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-[5px]">
                  <span className="inline-flex h-[13px] w-fit items-center rounded-full border border-[#ACACAC] bg-[#BFBFBF40] px-2 text-[10px] leading-none text-[#585858]">
                    {s.code}
                  </span>
                  <h3 className="truncate text-[14px] font-semibold leading-[1.3] text-black" title={s.contactPerson}>
                    {s.contactPerson}
                  </h3>
                  <p className="flex items-center gap-[6px] text-[11px] uppercase leading-[1.3] text-[#F24DEB]">
                    <Building2 className="size-[13px] shrink-0" />
                    <span className="truncate" title={s.company}>{s.company}</span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <AddSupplier
                    isEdit
                    id={s.id}
                    supplier={toFormData(s)}
                    onSubmit={(data) => handleUpdate(s.id, data)}
                  />
                  <Button
                    type="button"
                    aria-label="Delete"
                    variant={"deleteicon"}
                    onClick={() => setSupplierToDelete(s)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Contact details */}
              <ul className="flex flex-col gap-[6px] border-t border-[#BDBDBD] pt-[6px] text-[12px] leading-[1.3] text-[#6B6B6B]">
                <li className="flex items-center gap-2">
                  <Phone className="size-[13px] shrink-0" />
                  <span className="truncate">+91 {s.phone}</span>
                </li>
                {s.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="size-[13px] shrink-0" />
                    <span className="truncate" title={s.email}>{s.email}</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <FileText className="size-[13px] shrink-0" />
                  <span className="truncate">GSTIN: {s.gstin || "-"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-[1px] size-[13px] shrink-0" />
                  <span className="line-clamp-2 break-words" title={s.address}>
                    {s.address || "-"}
                  </span>
                </li>
              </ul>

              {/* Credit terms + outstanding (pinned to the bottom so all cards line up) */}
              <div className="mt-auto flex text-[12px] justify-between gap-2 border-t border-[#BDBDBD] pt-[6px]">
                <p className="min-w-0 truncate  text-black">
                  Credit Terms: {s.paymentTerms}
                </p>
                <div className="shrink-0 text-right">
                  <p className="text-[12px] uppercase leading-[1.3] text-[#848484]">Outstanding</p>
                  <p className={`text-[12px] font-semibold leading-[1.3] ${s.outstanding > 0 ? "text-red-600" : "text-black"}`}>
                    {CURRENCY} {s.outstanding}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <AddSupplierDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} />

      <ConfirmationDialog
        open={!!supplierToDelete}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete supplier "${supplierToDelete?.contactPerson}"`}
        isPending={isPending}
      />
    </div>
  );
}

export default SupplierPage;