"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useEffect, useId, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (remark: string) => void;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  remarkPlaceholder?: string;
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
  remarkPlaceholder = "Eg: Deleted due to redundancy.",
  isPending,
}: ConfirmationDialogProps) {
  const [remark, setRemark] = useState("");
  const remarkId = useId();
  const remarkEmpty = !remark.trim();

  useEffect(() => {
    if (!open) setRemark("");
  }, [open]);

 
  const handleConfirm = () => {
    if (remarkEmpty || isPending) return;
    onConfirm(remark.trim());
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

        {/* Remark */}
        <div className="mt-4 space-y-2">
          <label
            htmlFor={remarkId}
            className="block text-[12px] font-medium text-[#484848]"
          >
            Remark <span className="ml-0.5 text-red-500">*</span>
          </label>
          <Textarea
            id={remarkId}
            placeholder={remarkPlaceholder}
            value={remark}
            required
            disabled={isPending}
            onChange={(e) => setRemark(e.target.value)}
            className="min-h-[80px] resize-none rounded-[8px] border border-[#BDBDBD] bg-[#E5E5E5] px-3 py-2 text-[12px] text-[#484848] shadow-none outline-none placeholder:text-[#ACACAC] focus:border-primary focus:ring-0 focus-visible:border-primary focus-visible:ring-0 sm:min-h-[96px]"
          />
        </div>

        <DialogFooter className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-9 w-full rounded-[8px] border border-[#BDBDBD] bg-[#E5E5E5] px-4 text-[12px] text-[#898989] transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-auto"
          >
            {cancelText}
          </button>

          <TooltipProvider>
            <Tooltip>
              
              <TooltipTrigger render={<span className="w-full sm:w-auto" />}>
                <Button
                  variant="deletecancel"
                  onClick={handleConfirm}
                  disabled={isPending || remarkEmpty}
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
              </TooltipTrigger>
              {remarkEmpty && !isPending && (
                <TooltipContent>Remark is required</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}