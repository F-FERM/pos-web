"use client";

import PageHeader from "@/src/components/common/PageHeader";
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
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import ErrorHandling from "../Error/ErrorHandling";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AddPrivilege from "./AddPrivilege";

import User from "../../../public/icons/user.png";

import { ListPrivilegeApi } from "@/src/api/privilege/api/getAll";
import { useDeletePrivilege } from "@/src/api/privilege/hooks/delete.hook";
import PrivilegeSkeletonLoading from "./PrivilegeSkeletonLoading";

interface PrivilegeItem {
  _id: string;
  name: string;
  description?: string;
  roles?: string[];
}


export default function ListPrivilege() {
 
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [privilegeToDelete, setPrivilegeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);


  /* ------------------------------- privileges ------------------------------- */

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["privilegeList"],
    queryFn: () => ListPrivilegeApi({}),
  });
  const privileges: PrivilegeItem[] = data?.data ?? [];




  /* -------------------------------- delete --------------------------------- */

  const { mutate: DeletePrivilege, isPending } = useDeletePrivilege();

  const openDeleteDialog = (id: string, name: string) => {
    setPrivilegeToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!privilegeToDelete) return;
    DeletePrivilege(
      { id: privilegeToDelete.id, privilegeName: privilegeToDelete.name },
      {
        onSuccess: () => {
          setIsConfirmDialogOpen(false);
          setPrivilegeToDelete(null);
        },
      },
    );
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setPrivilegeToDelete(null);
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <ErrorHandling message={error.message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 font-poppins">
      <PageHeader
        title="User Role & Permissions"
        subtitle="Configure User Roles & Permissions"
        icon={User}
        rightContent={<AddPrivilege isEdit={false} />}
      />

      {/* summary for the selected role */}
      {/* <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] p-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold capitalize leading-[100%] text-black">
            Configure access for {active?.name ?? "—"}
          </h2>
          <span className="shrink-0 text-[10px] font-normal leading-[100%] text-[#848484]">
            {allowed} / {total} allowed
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D0D0D0]">
          <div
            className="h-full rounded-full bg-[#F24DEB] transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex min-h-[99px] flex-col justify-between rounded-[10px] border border-[#0EA300] bg-[#B0F5973D] pb-[13px] pl-[15px] pr-[14px] pt-[14px]">
            <div className="flex items-center gap-2">
              <Image src={Allowed} alt="" className="size-8" />
              <span className="text-[12px] font-normal uppercase leading-[100%] text-[#0EA300]">
                Allowed
              </span>
            </div>
            <span className="text-[18px] font-semibold leading-[100%] text-black">{allowed}</span>
          </div>

          <div className="flex min-h-[99px] flex-col justify-between rounded-[10px] border border-[#FF0000] bg-[#FF00001A] pb-[13px] pl-[15px] pr-[14px] pt-[14px]">
            <div className="flex items-center gap-2">
              <Image src={Restricted} alt="" className="size-8" />
              <span className="text-[12px] font-normal uppercase leading-[100%] text-[#FF0000]">
                Restricted
              </span>
            </div>
            <span className="text-[18px] font-semibold leading-[100%] text-black">{restricted}</span>
          </div>
        </div>
      </section> */}

      {/* roles table: name + role only */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <PrivilegeSkeletonLoading />
            ) : privileges.length === 0 ? (
              <TableEmpty colSpan={3}>No privileges found</TableEmpty>
            ) : (
              privileges.map((p) => (
                <TableRow
                  key={p._id}
                
               
                >
                  <TableCell>{p.name}</TableCell>
                  <TableCell className="capitalize">
                    {p.roles?.length ? p.roles.join(", ") : "-"}
                  </TableCell>
                  <TableCell>
                    {/* stop the row click from firing when using the action buttons */}
                    <div
                      className="flex items-center justify-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <AddPrivilege isEdit id={p._id} />
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex" />}>
                          <Button
                            type="button"
                            variant="deleteicon"
                            aria-label="Delete"
                            onClick={() => openDeleteDialog(p._id, p.name)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete role "${privilegeToDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}