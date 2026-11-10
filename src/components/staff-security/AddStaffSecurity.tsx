import { Button } from "@/src/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Pencil, Plus, SquarePen } from "lucide-react";
import { useState } from "react";
import { AddStaffDialog } from "./AddStaffSecurityDialogue";

interface AddStaffProps {
  isEdit: boolean;
  id?: string;
}

const AddStaff = ({ isEdit, id }: AddStaffProps) => {
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
                <SquarePen className="size-4" />
              </Button>
            }
          />
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button type="button" variant="create" onClick={() => setIsDialogOpen(true)}>
          <Plus />
          Add Staff
        </Button>
      )}

      <AddStaffDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        staffId={id}
      />
    </>
  );
};

export default AddStaff;