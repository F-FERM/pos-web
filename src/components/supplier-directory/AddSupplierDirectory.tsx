import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Plus, SquarePen } from "lucide-react";
import { useState } from "react";
import { AddSupplierDialog, SupplierFormData } from "./AddSupplierDirectoryDialogue";

interface AddSupplierProps {
  isEdit: boolean;
  id?: string;
  supplier?: SupplierFormData;
  onSubmit?: (data: SupplierFormData) => void;
}

const AddSupplier = ({ isEdit, id, supplier, onSubmit }: AddSupplierProps) => {
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
          Add New Supplier
        </Button>
      )}

      <AddSupplierDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        supplierId={id}
        supplier={supplier}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddSupplier;