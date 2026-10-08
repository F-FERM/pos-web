"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { CircleCheck, X } from "lucide-react";

export type PurchaseEntry = {
  id: string;
  invoiceNo: string;
  dateTime: string;
  amount: number;
  items: number;
};

const CURRENCY = "₹";

interface PurchaseLedgerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName?: string;
  mobile?: string;
  purchases: PurchaseEntry[];
}

export function PurchaseLedgerDialog({
  open,
  onOpenChange,
  customerName,
  mobile,
  purchases,
}: PurchaseLedgerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        showCloseButton={false} // we draw our own X button; remove this line if your DialogContent has no such prop
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[667px] gap-0 overflow-hidden rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:max-w-[667px] sm:p-6"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-start justify-between gap-3 border-b border-[#D5D5D5] pb-3 text-left">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2 text-[16px] font-semibold text-black sm:text-[18px]">
              <span className="flex size-[24px] shrink-0 items-center justify-center rounded-[5px] bg-[#F24DEB33] text-primary">
                <CircleCheck className="size-4" />
              </span>
              <span className="truncate">Purchase Ledger</span>
            </DialogTitle>
            <p className="mt-1 truncate text-[11px] leading-[1.5] text-[#848484]">
           Phone: {mobile || "-"}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-[#8B8B8B] text-white transition-colors hover:bg-[#767676]"
          >
            <X className="size-4" />
          </button>
        </DialogHeader>

        {/* Purchase list (scrolls when long) */}
        <div className="flex max-h-[55dvh] flex-col gap-3 overflow-y-auto border-b border-[#D5D5D5] py-4 [scrollbar-width:thin]">
          {purchases.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-[#848484]">
              No purchases recorded for this customer yet
            </p>
          ) : (
            purchases.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-[10px] bg-[#DEDEDE] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-medium leading-[1.4] text-black">
                    {p.invoiceNo}
                  </p>
                  <p className="text-[12px] leading-[1.5] text-[#585858]">{p.dateTime}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[16px] font-semibold leading-[1.4] text-black">
                    {CURRENCY} {p.amount}
                  </p>
                  <p className="text-[12px] leading-[1.5] text-[#585858]">Items({p.items})</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}