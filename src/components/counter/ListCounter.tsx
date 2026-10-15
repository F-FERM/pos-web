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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import AddCounter from "./AddCounter";
import { Counter, CounterFormData } from "./AddCounterDialogue";


// Dummy data (replace with API data later)
const COUNTERS: Counter[] = [
  { id: "1", name: "Counter 1", code: "CNT0001", isDefault: true, isActive: true },
  { id: "2", name: "Counter 2", code: "CNT0002", isDefault: false, isActive: true },
  { id: "3", name: "Counter 3", code: "CNT0003", isDefault: false, isActive: false },
];

const toFormData = (c: Counter): CounterFormData => ({
  name: c.name,
  code: c.code,
  isDefault: c.isDefault,
  isActive: c.isActive,
});

export default function CounterSettings() {
  const [counters, setCounters] = useState<Counter[]>(COUNTERS);

  // delete confirmation
  const [toDelete, setToDelete] = useState<Counter | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSave = (data: CounterFormData, editId?: string) => {
    // TODO: call your add / edit counter API here
    setCounters((prev) => {
      // only one counter can be the default
      const base = data.isDefault ? prev.map((c) => ({ ...c, isDefault: false })) : prev;
      return editId
        ? base.map((c) => (c.id === editId ? { ...c, ...data } : c))
        : [...base, { ...data, id: crypto.randomUUID() }];
    });
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      setIsPending(true);
      // TODO: await your delete-counter API call here
      setCounters((prev) => prev.filter((c) => c.id !== toDelete.id));
      setToDelete(null);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <AddCounter isEdit={false} onSubmit={(data) => handleSave(data)} />
      </div>

      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Counter Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {counters.length === 0 ? (
            <TableEmpty colSpan={5}>No counters found</TableEmpty>
          ) : (
            counters.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="max-w-[220px] truncate" title={c.name}>
                  {c.name}
                </TableCell>
                <TableCell>{c.code}</TableCell>
                <TableCell>
                  {c.isDefault ? (
                    <span className="inline-flex rounded-full border border-[#0EA300] bg-[#B0F5973D] px-2 py-[2px] text-[10px] font-medium text-[#0EA300]">
                      Default
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <span className={c.isActive ? "text-green-600" : "text-[#848484]"}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <AddCounter
                      isEdit
                      id={c.id}
                      counter={toFormData(c)}
                      onSubmit={(data) => handleSave(data, c.id)}
                    />
                    <Button
                      type="button"
                      variant="deleteicon"
                      aria-label="Delete"
                      onClick={() => setToDelete(c)}
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
        message={`Are you sure you want to delete counter "${toDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}