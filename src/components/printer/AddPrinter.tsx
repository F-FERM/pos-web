import { Button } from "@/src/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddPrinterDialog } from "./AddPrinterDialogue";

interface AddPrinterProps {
  isEdit: boolean;
  id?: string;
}

const AddPrinter = ({ isEdit, id }: AddPrinterProps) => {
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
          Add Printer
        </Button>
      )}

      <AddPrinterDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        printerId={id}
      />
    </>
  );
};

export default AddPrinter;