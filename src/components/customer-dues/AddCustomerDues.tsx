import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddCustomerDialog, CustomerFormData } from "./AddCustomeDuesDialog";

interface AddCustomerProps {
  isEdit: boolean;
  id?: string;
  customer?: CustomerFormData;
  onSubmit?: (data: CustomerFormData) => void;
}

const AddCustomer = ({ isEdit, id, customer, onSubmit }: AddCustomerProps) => {
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
        <Button type="button" variant="create" onClick={() => setIsDialogOpen(true)}>
          <Plus />
          Add New customer
        </Button>
      )}

      <AddCustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        customerId={id}
        customer={customer}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddCustomer;