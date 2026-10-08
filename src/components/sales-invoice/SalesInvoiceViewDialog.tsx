"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { CircleCheck } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";

type PrintSize = "thermal" | "a4";

// Only the fields the dialog needs (your Invoice type already matches)
export type InvoiceViewData = {
  invoiceNo: string;
  dateTime: string;
  customerName: string;
  customerPhone: string;
  items: number;
  subtotal: number;
  discount: number;
  grandTotal: number;
  payment: string;
};

type InvoiceLine = { name: string; qty: number; price: number; total: number };

// TODO: take these from your shop settings
const SHOP = {
  logoText: "FP",
  name: "Green Grocery & Supermarket",
  phone: "XXXXXXXXXX",
  taxId: "XXXXXXXXXXXXXX",
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) => n.toFixed(2);

// Dummy lines built from the invoice totals (replace with the real invoice items from your API)
function buildLines(inv: InvoiceViewData): InvoiceLine[] {
  const count = Math.max(inv.items, 1);
  const each = round2(inv.subtotal / count);
  return Array.from({ length: count }, (_, i) => {
    const total = i === count - 1 ? round2(inv.subtotal - each * (count - 1)) : each;
    return { name: `Item ${i + 1}`, qty: 1, price: total, total };
  });
}

interface InvoiceViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceViewData | null;
}

export function InvoiceViewDialog({ open, onOpenChange, invoice }: InvoiceViewDialogProps) {
  const [size, setSize] = useState<PrintSize>("thermal");
  const receiptRef = useRef<HTMLDivElement>(null);

  const calc = useMemo(() => {
    if (!invoice) return null;
    const taxable = round2(invoice.subtotal - invoice.discount);
    const tax = Math.max(0, round2(invoice.grandTotal - taxable));
    const rate = taxable > 0 ? Math.round((tax / taxable) * 1000) / 10 : 0;
    return {
      lines: buildLines(invoice),
      taxable,
      tax,
      cgst: round2(tax / 2),
      sgst: round2(tax / 2),
      halfRate: rate / 2,
    };
  }, [invoice]);

  // Prints only the receipt through a hidden iframe (no dialog/page chrome).
  // "Save PDF" uses the same flow: choose "Save as PDF" as the destination.
  const printReceipt = () => {
    const node = receiptRef.current;
    if (!node || !invoice) return;

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) {
      iframe.remove();
      return;
    }

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((n) => n.outerHTML)
      .join("");
    const page = size === "thermal" ? "80mm auto" : "A4";
    const margin = size === "thermal" ? "4mm" : "12mm";

    doc.open();
    doc.write(`<!doctype html>
<html class="${document.documentElement.className}">
<head>
  <title>${invoice.invoiceNo}</title>
  ${styles}
  <style>
    @page { size: ${page}; margin: ${margin}; }
    html, body { margin: 0; background: #fff; }
    #invoice-print { width: 100% !important; max-width: none !important; border-radius: 0 !important; padding: 0 !important; }
  </style>
</head>
<body class="${document.body.className}">${node.outerHTML}</body>
</html>`);
    doc.close();

    // give the stylesheets a moment to apply before printing
    setTimeout(() => {
      win.focus();
      win.print();
      setTimeout(() => iframe.remove(), 1000);
    }, 400);
  };

  if (!invoice || !calc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[92dvh] w-[calc(100%-2rem)] max-w-[860px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:max-w-[860px] sm:p-6"
      >
        {/* Header: title + size toggle */}
        <DialogHeader className="flex flex-col gap-3 border-b border-[#D5D5D5] pb-3 text-left sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-black sm:text-[20px]">
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-[5px] bg-[#F24DEB33] text-primary">
                <CircleCheck className="size-4" />
              </span>
              Invoice {invoice.invoiceNo}
            </DialogTitle>
            <p className="mt-2 text-[12px] font-normal leading-[1.4] text-[#848484] sm:max-w-[320px]">
              View past invoice, reprint thermal/A4, or process customer returns
            </p>
          </div>

          <div className="flex shrink-0 gap-1 rounded-[10px] bg-[#D5D5D5] p-1 sm:mr-8">
            {(
              [
                { value: "thermal", label: "Thermal (80mm)" },
                { value: "a4", label: "A4 Standard" },
              ] as const
            ).map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setSize(o.value)}
                className={`rounded-[8px] px-4 py-[6px] text-[13px] transition-colors ${
                  size === o.value ? "bg-white text-[#585858]" : "text-[#848484] hover:text-[#585858]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </DialogHeader>

        {/* Receipt preview */}
        <div className="my-4 max-h-[52dvh] overflow-y-auto rounded-[10px] [scrollbar-width:thin]">
          <div
            id="invoice-print"
            ref={receiptRef}
            className={`mx-auto w-full rounded-[10px] bg-white px-6 py-8 font-poppins text-[11px] leading-[1.5] text-black sm:px-8 ${
              size === "thermal" ? "max-w-[448px]" : "max-w-none"
            }`}
          >
            {/* Shop info */}
            <div className="flex flex-col items-center gap-[2px] text-center text-[13px] font-medium">
              <span className="mb-2 flex size-[62px] items-center justify-center rounded-full border border-black text-[20px] font-medium">
                {SHOP.logoText}
              </span>
              <p>{SHOP.name}</p>
              <p>Phone: {SHOP.phone}</p>
              <p>Tax ID: {SHOP.taxId}</p>
              <p className="mt-3">GST INVOICE</p>
              <p>Invoice No: {invoice.invoiceNo}</p>
            </div>

            <div className="my-4 border-t border-dashed border-[#585858]" />

            {/* Invoice meta */}
            <div className="flex justify-between gap-3 text-[11px]">
              <div className="flex flex-col gap-[2px]">
                <p>Invoice No: {invoice.invoiceNo}</p>
                <p>Date: {invoice.dateTime}</p>
                <p>Settled By: {invoice.payment}</p>
              </div>
              <div className="shrink-0 text-right">
                <p>
                  Customer: <span className="font-semibold">{invoice.customerName || "Walk-in Customer"}</span>
                </p>
                {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
              </div>
            </div>

            {/* Items */}
            <table className="mt-4 w-full border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-dashed border-[#585858]">
                  <th className="py-[2px] text-left font-normal">Item</th>
                  <th className="w-[44px] py-[2px] text-center font-normal">QTY</th>
                  <th className="w-[64px] py-[2px] text-right font-normal">Price</th>
                  <th className="w-[72px] py-[2px] text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {calc.lines.map((l, i) => (
                  <tr key={i} className="align-top">
                    <td className="pt-[6px]">
                      <p className="font-medium">{l.name}</p>
                      <p className="text-[8px] text-[#585858]">
                        TAX: CGST({calc.halfRate}%) &amp; SGST({calc.halfRate}%)
                      </p>
                    </td>
                    <td className="pt-[6px] text-center">{l.qty}</td>
                    <td className="pt-[6px] text-right">{money(l.price)}</td>
                    <td className="pt-[6px] text-right">{money(l.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-4 flex flex-col text-[11px] font-medium">
              {[
                ["Taxable Amount:", calc.taxable],
                ["Discount:", invoice.discount],
                ["Total Tax:", calc.tax],
                ["CGST:", calc.cgst],
                ["SGST:", calc.sgst],
              ].map(([label, value]) => (
                <div
                  key={label as string}
                  className="flex justify-between border-b border-dashed border-[#585858] py-[3px]"
                >
                  <span>{label}</span>
                  <span>{money(value as number)}</span>
                </div>
              ))}
              <div className="flex justify-between py-[6px] text-[13px] font-semibold">
                <span>Grand Total:</span>
                <span>₹ {money(invoice.grandTotal)}</span>
              </div>
            </div>

            <p className="mt-3 text-center text-[10px] text-[#585858]">Thank you, visit again!</p>
          </div>
        </div>

        {/* Footer actions */}
      <div className="flex flex-col gap-3 border-t border-[#D5D5D5] pt-4 sm:flex-row sm:justify-end">
  <Button type="button" variant="savePdf" onClick={printReceipt}>
    Save PDF
  </Button>
  <Button type="button" variant="print" onClick={printReceipt}>
    Print
  </Button>
</div>
      </DialogContent>
    </Dialog>
  );
}