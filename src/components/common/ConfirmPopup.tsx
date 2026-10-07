"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Okay",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[85dvh] max-w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-[10px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:max-w-[380px] sm:p-5"
      >
        <DialogHeader className="gap-3 text-left">
          <DialogTitle className="break-words text-[15px] font-semibold leading-[1.3] text-black sm:text-[16px]">
            {title}
          </DialogTitle>
          <DialogDescription className="break-words text-[12px] font-normal leading-[1.5] text-[#848484]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 w-full rounded-[8px] border border-[#BDBDBD] bg-[#E5E5E5] px-4 text-[12px] text-[#898989] transition-colors hover:border-primary sm:h-8 sm:w-auto"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 w-full rounded-[8px] bg-primary px-4 text-[12px] text-white transition-opacity hover:opacity-90 sm:h-8 sm:w-auto"
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}