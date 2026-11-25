import { Button } from "@/src/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
import { LoyaltySettings } from "@/src/interfaces/loyalty-settings/getAll.type";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { LoyaltyEditDialog } from "./UpdateLoyaltySettingDialogue";

interface EditLoyaltyProps {
  settings: LoyaltySettings;
}

const EditLoyalty = ({ settings }: EditLoyaltyProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
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

      <LoyaltyEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        settings={settings}
      />
    </>
  );
};

export default EditLoyalty;