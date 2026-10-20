"use client";

import { Button } from "@/src/components/ui/button";
import { Globe, IndianRupee, Mail, MapPin, Pencil, Phone, Store } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { EditCompanyDialog } from "./EditCompany";
import CompanySkeleton from "./CompanySkeleton";
import { ListCompanyApi } from "@/src/api/company/api/getAll";
import ErrorHandling from "../Error/ErrorHandling";

function InfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-[93px] w-full min-w-0 flex-col justify-center gap-[10px] rounded-[10px] bg-[#EFEFEF] px-5 py-[26px] font-poppins">
      <div className="flex items-center gap-2 text-[14px] font-semibold leading-[100%] text-black [&>svg]:size-4">
        {icon}
        {label}
      </div>
      <p className="break-words pl-6 text-[14px] font-normal leading-snug text-[#4D4D4D]">
        {value || "-"}
      </p>
    </div>
  );
}

export default function CompanySettings() {
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: ListCompany,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["companyList"],
    queryFn: () => ListCompanyApi(),
  });

  if (isLoading) return <CompanySkeleton />;

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <ErrorHandling message={error.message} />
      </div>
    );
  }

  const company = ListCompany?.data?.[0];

  if (!company) {
    return (
      <div className="flex items-center justify-center py-6">
        <ErrorHandling message="No company found" />
      </div>
    );
  }

  const { address } = company;
  const fullAddress = [address.line1, address.line2, address.city, address.state, address.postalCode]
    .filter(Boolean)
    .join(", ");

  const logo = company.branding?.logoUrl ?? "";

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      {/* Logo + name */}
      <div className="flex shrink-0 flex-col gap-3 font-poppins">
        <div className="relative size-[153px] overflow-hidden rounded-full border-4 border-[#9D9D9D] bg-[#EFEFEF]">
          {logo && (
            <Image src={logo} alt="Company logo" fill sizes="153px" unoptimized className="object-cover" />
          )}
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-[18px] font-semibold leading-[100%] text-black">
            <Store className="size-5" />
            {company.name}
          </h2>

          <Button
            type="button"
            variant="editicon"
            size="icon"
            aria-label="Edit company"
            className="mt-3"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <InfoCard icon={<Globe />} label="URL" value={company.contact.website ?? ""} />
          <InfoCard icon={<Phone />} label="Phone" value={company.contact.primaryPhone} />
          <InfoCard icon={<Mail />} label="Email" value={company.contact.primaryEmail} />
          <InfoCard icon={<MapPin />} label="Address" value={fullAddress} />
        </div>

        <h3 className="mt-2 font-poppins text-[16px] font-semibold leading-[100%] text-black">
          Regional Settings
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <InfoCard icon={<Globe />} label="Currency" value={company.regional.currency} />
          <InfoCard icon={<IndianRupee />} label="Currency Symbol" value={company.regional.currencySymbol} />
          <InfoCard icon={<Globe />} label="VAT" value={company.taxIdentifiers?.vatNumber ?? ""} />
        </div>
      </div>

      <EditCompanyDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        companyId={company._id}
        company={company}
        logoUrl={logo}
      />
    </div>
  );
}