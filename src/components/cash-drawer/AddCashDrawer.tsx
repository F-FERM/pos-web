import { Button } from "@/src/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { AddCashDrawerDialog, CashDrawerFormData } from "./AddCashDrawerDialogue";

interface AddCashDrawerProps {
  onSubmit?: (data: CashDrawerFormData) => void;
}

const AddCashDrawer = ({ onSubmit }: AddCashDrawerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="create" onClick={() => setIsDialogOpen(true)}>
        <PlusCircle />
        Add Cash In/Out
      </Button>

      <AddCashDrawerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddCashDrawer;