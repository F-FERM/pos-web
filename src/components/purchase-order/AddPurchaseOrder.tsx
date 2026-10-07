import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { AddPurchaseOrderDialog, PurchaseOrderFormData } from "./AddPurchaseOrderDialogue";


interface AddPurchaseOrderProps {
  isEdit: boolean;
  id?: string;
  order?: PurchaseOrderFormData;
  onSubmit?: (data: PurchaseOrderFormData) => void;
}

const AddPurchaseOrder = ({ isEdit, id, order, onSubmit }: AddPurchaseOrderProps) => {
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
          Create Purchase Order
        </Button>
      )}

      <AddPurchaseOrderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={isEdit}
        orderId={id}
        order={order}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default AddPurchaseOrder;