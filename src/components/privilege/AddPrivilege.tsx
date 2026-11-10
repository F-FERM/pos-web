import { Button } from "@/src/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddPrivilegeDialog } from "./AddPrivilegeDialogue";

interface AddPrivilegeProps {
  isEdit: boolean;
  id?: string;
}

const AddPrivilege = ({ isEdit, id }: AddPrivilegeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="editicon"
                size="icon"
                aria-label="Edit"
                onClick={() => setIsDialogOpen(true)}
              >
                <Pencil className="size-4" />
              </Button>
            }
          />
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          type="button"
          variant="create"
          className="w-full sm:w-[247px]"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus />
          Add Privilege
        </Button>
      )}

      <AddPrivilegeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        privilegeId={id}
      />
    </>
  );
};

export default AddPrivilege;