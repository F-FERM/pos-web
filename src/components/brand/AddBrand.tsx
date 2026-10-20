import { Button } from "@/src/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddBrandDialog } from "./AddBrandDialogue";

interface AddBrandProps {
  isEdit: boolean;
  id?: string;
}

const AddBrand = ({ isEdit, id }: AddBrandProps) => {
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
          Add Brand
        </Button>
      )}

      <AddBrandDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        brandId={id}
      />
    </>
  );
};

export default AddBrand;