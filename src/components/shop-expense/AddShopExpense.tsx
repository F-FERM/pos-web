import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddExpenseDialog, ExpenseFormData } from "./AddShopExpenseDialogue";

interface AddExpenseProps {
  isEdit: boolean;
  id?: string;
  expense?: ExpenseFormData;
  onSubmit?: (data: ExpenseFormData) => void;
}

const AddExpense = ({ isEdit, id, expense, onSubmit }: AddExpenseProps) => {
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
          Record Expense
        </Button>
      )}

      <AddExpenseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        expenseId={id}
        expense={expense}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddExpense;