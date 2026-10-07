"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

// Card (#EFEFEF) + horizontal scroll area
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="w-full rounded-[10px] bg-[#EFEFEF] p-3 sm:p-[20px_18px]"
    >
      <div className="w-full overflow-x-auto">
        <table
          data-slot="table"
          className={cn(
            "w-full min-w-[640px] border-separate border-spacing-0 font-poppins",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead data-slot="table-header" className={cn(className)} {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child_td]:border-b-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot data-slot="table-footer" className={cn(className)} {...props} />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("transition-colors hover:bg-[#E6E6E6]", className)}
      {...props}
    />
  );
}

// Header cell: the grey bar (#D9D9D9) is built from the cells so the
// 5px rounded corners work with border-separate.
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-[38px] bg-[#D9D9D9] px-[15px] py-1 text-center align-middle",
        "font-poppins text-[12px] font-normal uppercase leading-[100%] tracking-[0%] text-[#848484]",
        "first:rounded-l-[5px] last:rounded-r-[5px]",
        className
      )}
      {...props}
    />
  );
}
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "border-b border-[#D9D9D9] px-[15px] py-2.5 text-center align-middle",
        "font-poppins text-[12px] font-normal leading-[100%] text-[#484848]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-[10px] text-[#848484]", className)}
      {...props}
    />
  );
}

// Empty state row, e.g. "No customer management & dues ledger"
function TableEmpty({
  colSpan,
  children,
  className,
}: {
  colSpan: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr data-slot="table-empty">
      <td
        colSpan={colSpan}
        className={cn(
          "h-[100px] px-[15px] text-center align-middle font-poppins text-[12px] font-normal text-[#919191]",
          className
        )}
      >
        {children}
      </td>
    </tr>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmpty,
};