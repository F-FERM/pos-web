import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddCounterDialog, CounterFormData } from "./AddCounterDialogue";


interface AddCounterProps {
  isEdit: boolean;
  id?: string;
  counter?: CounterFormData;
  onSubmit?: (data: CounterFormData) => void;
}

const AddCounter = ({ isEdit, id, counter, onSubmit }: AddCounterProps) => {
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
          Add Counter
        </Button>
      )}

      <AddCounterDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        counterId={id}
        counter={counter}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddCounter;