"use client";

import { NumberSettingDocType } from "@/src/interfaces/enums/NumberSettings";
import SharedNumberSettingModal from "../../components/number-settings/NumberSettingModal";


interface BillNumberSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSaveSuccess?: (newNumber: string) => void;
}

export default function BillNumberSettingsModal({
  open,
  onClose,
  onSaveSuccess,
}: BillNumberSettingsModalProps) {
  return (
    <SharedNumberSettingModal
      open={open}
      onClose={onClose}
      onSaveSuccess={onSaveSuccess}
      docType={NumberSettingDocType.BILL}
      title="Configure Bill Number Preferences"
      description="Your bill numbers are auto-generated. Change this only if needed."
      radioName="billMode"
      autoLabel="Auto-generate bill number"
      prefixPlaceholder="BILL-"
    />
  );
}
