"use client";

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
import { Monitor, Printer as PrinterIcon, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import AddPrinter from "./AddPrinter";
import { Printer, PrinterFormData } from "./AddPrinterDialogue";

// Dummy data (replace with API data later)
const PRINTERS: Printer[] = [
  { id: "1", name: "Counter Printer", ip: "192.168.1.50", counter: "Counter 1", paperWidth: "80", isDefault: true },
  { id: "2", name: "Billing Printer", ip: "192.168.1.51", counter: "Counter 2", paperWidth: "58", isDefault: false },
];

const toFormData = (p: Printer): PrinterFormData => ({
  name: p.name,
  ip: p.ip,
  counter: p.counter,
  paperWidth: p.paperWidth,
  isDefault: p.isDefault,
});

export default function PrinterSettings() {
  const [printers, setPrinters] = useState<Printer[]>(PRINTERS);

  // delete confirmation
  const [toDelete, setToDelete] = useState<Printer | null>(null);
  const [isPending, setIsPending] = useState(false);

  // summary cards
  const stats = [
    {
      label: "Total Printers",
      value: String(printers.length),
      icon: PrinterIcon,
      card: "border-[#F24DEB] bg-[#FF00F50D]",
      text: "text-primary",
      iconBox: "bg-[#F24DEB33] text-[#C026D3]",
    },
    {
      label: "Default Printer",
      value: String(printers.filter((p) => p.isDefault).length),
      icon: Star,
      card: "border-[#0EA300] bg-[#B0F5973D]",
      text: "text-[#0EA300]",
      iconBox: "bg-[#B0F597] text-[#0EA300]",
    },
    {
      label: "Assigned Counters",
      value: String(new Set(printers.map((p) => p.counter).filter(Boolean)).size),
      icon: Monitor,
      card: "border-[#0078DA] bg-[#A9D8FF40]",
      text: "text-[#0078DA]",
      iconBox: "bg-[#A9D8FF] text-[#0078DA]",
    },
  ];

  const handleSave = (data: PrinterFormData, editId?: string) => {
    // TODO: call your add / edit printer API here
    setPrinters((prev) => {
      // only one printer can be the default
      const base = data.isDefault ? prev.map((p) => ({ ...p, isDefault: false })) : prev;
      const values = { ...data, counter: data.counter ?? "" };
      return editId
        ? base.map((p) => (p.id === editId ? { ...p, ...values } : p))
        : [...base, { ...values, id: crypto.randomUUID() }];
    });
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      setIsPending(true);
      // TODO: await your delete-printer API call here
      setPrinters((prev) => prev.filter((p) => p.id !== toDelete.id));
      setToDelete(null);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Summary cards: 1 column on phones, 3 from sm */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
            <span className={`flex size-[29px] shrink-0 items-center justify-center rounded-[5px] ${s.iconBox}`}>
              <s.icon className="size-4" />
            </span>
          </div>
        ))}
      </section>

      <div className="flex justify-end">
        <AddPrinter isEdit={false} onSubmit={(data) => handleSave(data)} />
      </div>

      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Printer Name</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Counter</TableHead>
            <TableHead>Paper</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {printers.length === 0 ? (
            <TableEmpty colSpan={6}>No printers found</TableEmpty>
          ) : (
            printers.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="max-w-[220px] truncate" title={p.name}>
                  {p.name}
                </TableCell>
                <TableCell>{p.ip}</TableCell>
                <TableCell>{p.counter || "-"}</TableCell>
                <TableCell>{p.paperWidth} mm</TableCell>
                <TableCell>
                  {p.isDefault ? (
                    <span className="inline-flex rounded-full border border-[#0EA300] bg-[#B0F5973D] px-2 py-[2px] text-[10px] font-medium text-[#0EA300]">
                      Default
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <AddPrinter
                      isEdit
                      id={p.id}
                      printer={toFormData(p)}
                      onSubmit={(data) => handleSave(data, p.id)}
                    />
                    <Button
                      type="button"
                      variant="deleteicon"
                      aria-label="Delete"
                      onClick={() => setToDelete(p)}
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

      <ConfirmationDialog
        open={!!toDelete}
        onOpenChange={(open) => {
          if (!open && !isPending) setToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete printer "${toDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}