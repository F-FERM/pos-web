"use client";

import PageHeader from "@/src/components/common/PageHeader";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CircleCheck,
  KeyRound,
  Mail,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import employeeIcon from "../../../public/icons/staff.png";

import { ListStaffApi } from "@/src/api/staff/api/getAll";
import { useDeleteStaff } from "@/src/api/staff/hooks/delete.hook";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { PaginationComponent } from "../common/PaginationComponent";
import ErrorHandling from "../Error/ErrorHandling";
import { formatDate } from "@/src/lib/date-utils";
import { StaffCardSkeleton } from "./StaffSecuritySkeletonLoading";
import AddStaff from "./AddStaffSecurity";
import { AddStaffDialog } from "./AddStaffSecurityDialogue";


function EmployeePage() {
  const [addOpen, setAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["staffList", currentPage, pageSize],
    queryFn: () => ListStaffApi({ page: currentPage, limit: pageSize }),
  });

  const staffList = data?.data ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;

// Take the first staff member as the current operator
const current = staffList[0];

  const { mutate: DeleteStaff, isPending } = useDeleteStaff();

  const openDeleteDialog = (id: string, name: string) => {
    setStaffToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!staffToDelete) return;
    DeleteStaff(
      { id: staffToDelete.id, staffName: staffToDelete.name },
      {
        onSuccess: () => {
          setIsConfirmDialogOpen(false);
          setStaffToDelete(null);
        },
      },
    );
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setStaffToDelete(null);
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <ErrorHandling message={error.message} />
      </div>
    );
  }
const maskPin = (pin?: string) => (pin ? "*".repeat(pin.length) : "-");
  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Employee Management & Role Security"
        subtitle="Configure Staff Roles, 4-digit security PIN access, and switch active thermal operators"
        icon={employeeIcon}
        actions={[
          {
            label: "Add New Staff Member",
            icon: <Plus />,
            onClick: () => setAddOpen(true),
          },
        ]}
      />

      {/* Current operator */}
      {isLoading ? (
        <Skeleton className="h-[75px] w-full rounded-[10px]" />
      ) : (
        current && (
          <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 font-poppins sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-[35px] shrink-0 items-center justify-center rounded-[5px] bg-[#F24DEB33] text-[16px] font-medium text-[#F24DEB]">
                {current.createdBy?.name.charAt(0).toUpperCase()}
              </span>
              <div className="flex min-w-0 flex-col gap-[4px]">
                <span className="inline-flex h-[16px] w-fit items-center rounded-full border border-[#F24DEB] bg-[#FF00F50D] px-4 text-[10px] uppercase leading-none text-[#F24DEB]">
                  Current Section
                </span>
                <h2 className="truncate text-[16px] font-semibold leading-[1.2] text-black">
                  {current.createdBy?.name}{" "}
                  <span className="font-normal text-[#585858]">
                   (Owner)
                  </span>
                </h2>
                <p className="flex items-center gap-1 text-[11px] leading-[1.3] text-[#6B6B6B]">
                  <CircleCheck className="size-[12px] shrink-0" />
                  Role: Owner
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <p className="text-[13px] text-[#848484]">PIN Protection Active</p>
              <span className="w-fit rounded-[5px] bg-[#D5D5D5] px-3 py-[2px] text-[11px] text-[#F24DEB]">
                PIN: ****
              </span>
            </div>
          </section>
        )
      )}

      {/* Staff cards: 1 column on phones, 2 from sm, 3 from xl */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <StaffCardSkeleton />
        ) : staffList.length === 0 ? (
          <p className="col-span-full py-10 text-center font-poppins text-[14px] text-[#848484]">
            No staff found
          </p>
        ) : (
          staffList.map((s) => (
            <article
              key={s._id}
              className="flex min-w-0 flex-col gap-[6px] rounded-[10px] border border-[#A8A8A8] bg-[#EFEFEF] px-[15px] pb-[13px] pt-[14px] font-poppins"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-[5px]">
                  <Tooltip>
  <TooltipTrigger
    render={
      <h3 className="min-w-0 max-w-full cursor-pointer truncate text-[14px] font-semibold leading-[1.3] text-black" />
    }
  >
    {s.name}
    {s.designation && (
      <span className="font-normal text-[#585858]"> ({s.designation})</span>
    )}
  </TooltipTrigger>
  <TooltipContent className="max-w-[260px] break-words">
    {s.name}
    {s.designation ? ` (${s.designation})` : ""}
  </TooltipContent>
</Tooltip>
                  <span className="inline-flex h-[17px] w-fit items-center rounded-[5px] border border-[#F24DEB] bg-[#FF00F50D] px-3 text-[10px] leading-none text-primary">
                    {s.privilegeId?.name ?? "No privilege"}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <AddStaff isEdit id={s._id} />

                  <Tooltip>
                    <TooltipTrigger render={<span className="inline-flex" />}>
                      <Button
                        type="button"
                        variant="deleteicon"
                        aria-label="Delete"
                        onClick={() => openDeleteDialog(s._id, s.name)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <ul className="flex flex-col gap-[6px] border-t border-[#BDBDBD] pt-[8px] text-[12px] leading-[1.3] text-[#6B6B6B]">
                <li className="flex items-center gap-2">
                  <Phone className="size-[13px] shrink-0" />
                  <span className="truncate">{s.phone || "-"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="size-[13px] shrink-0" />
                  <span className="truncate" title={s.email}>
                    {s.email || "-"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays className="size-[13px] shrink-0" />
                  <span className="truncate">Joined: {formatDate(s.createdAt)}</span>
                </li>
               <li className="flex items-center gap-2">
  <KeyRound className="size-[13px] shrink-0" />
  <span className="truncate">PIN: {maskPin(s.pin)}</span>
</li>
              </ul>
            </article>
          ))
        )}
      </section>

      <PaginationComponent
        currentPage={currentPage}
        totalItems={totalCount}
        pageSizeOptions={[5, 10, 20, 50]}
        showItemsInfo
        itemsPerPage={pageSize}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* Add dialog (edit dialogs live inside each AddStaff) */}
      <AddStaffDialog open={addOpen} onOpenChange={setAddOpen} />

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete staff "${staffToDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}

export default EmployeePage;