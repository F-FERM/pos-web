"use client";

import { IconLoader2 } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirmation",
  message = "Are you sure to delete",
  confirmText = "Delete",
  cancelText = "Cancel",
  isPending,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    if (isPending) return;
    onConfirm();
  };

  const text = /[?.!]$/.test(message.trim()) ? message : `${message}?`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[85dvh] max-w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-[10px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:max-w-[380px] sm:p-5"
      >
        <DialogHeader className="gap-3 text-left">
          <DialogTitle className="break-words text-[15px] font-semibold leading-[1.3] text-black sm:text-[16px]">
            {title}
          </DialogTitle>
          <DialogDescription className="break-words text-[12px] font-normal leading-[1.5] text-[#848484]">
            {text}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-9 w-full rounded-[8px] border border-[#BDBDBD] bg-[#E5E5E5] px-4 text-[12px] text-[#898989] transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-auto"
          >
            {cancelText}
          </button>

          <Button
            variant="deletecancel"
            onClick={handleConfirm}
            disabled={isPending}
            className="h-9 w-full rounded-[8px] px-4 text-[12px] font-normal normal-case sm:h-8 sm:w-auto sm:min-w-0"
          >
            {isPending ? (
              <>
                <IconLoader2 className="size-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}