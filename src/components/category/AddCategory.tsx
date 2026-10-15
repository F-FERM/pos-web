import { Button } from "@/src/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddCategoryDialog } from "./AddCategoryDialogue";

interface AddCategoryProps {
  isEdit: boolean;
  id?: string;
}

const AddCategory = ({ isEdit, id }: AddCategoryProps) => {
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
          Add Category
        </Button>
      )}

      <AddCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        categoryId={id}
      />
    </>
  );
};

export default AddCategory;