import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Plus, SquarePen } from "lucide-react";
import { useState } from "react";
import { AddEmployeeDialog, EmployeeFormData } from "./AddStaffSecurityDialogue";

interface AddEmployeeProps {
  isEdit: boolean;
  id?: string;
  employee?: EmployeeFormData;
  onSubmit?: (data: EmployeeFormData) => void;
}

const AddEmployee = ({ isEdit, id, employee, onSubmit }: AddEmployeeProps) => {
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
          Add New Staff Member
        </Button>
      )}

      <AddEmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        employeeId={id}
        employee={employee}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddEmployee;