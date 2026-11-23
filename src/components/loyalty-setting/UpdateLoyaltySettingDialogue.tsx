"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { Switch } from "@/src/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import { LoadingButton } from "../ui/loading-button";
import { LoyaltySettings } from "@/src/interfaces/loyalty-settings/getAll.type";
import { useEditLoyaltySettings } from "@/src/api/loyalty-setting/hooks/update.hook";

const formSchema = z.object({
  loyaltyAmountPerPoint: z.coerce
    .number({ message: "Enter a valid number" })
    .min(1, "Must be at least 1"),
  minLoyaltyPointsToRedeem: z.coerce
    .number({ message: "Enter a valid number" })
    .min(0, "Cannot be negative"),
  loyaltyPointMonetaryValue: z.coerce
    .number({ message: "Enter a valid number" })
    .min(0.01, "Must be greater than 0"),
  isEnabled: z.boolean(),
});

export type LoyaltyFormData = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings?: LoyaltySettings;
}

export function LoyaltyEditDialog({ open, onOpenChange, settings }: Props) {
  const form = useForm<LoyaltyFormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      loyaltyAmountPerPoint: 0,
      minLoyaltyPointsToRedeem: 0,
      loyaltyPointMonetaryValue: 0,
      isEnabled: true,
    },
  });

  const { mutate: updateSettings, isPending } = useEditLoyaltySettings({
    form,
    onOpenChange,
  });

  useEffect(() => {
    if (open && settings) {
      form.reset({
        loyaltyAmountPerPoint: settings.loyaltyAmountPerPoint,
        minLoyaltyPointsToRedeem: settings.minLoyaltyPointsToRedeem,
        loyaltyPointMonetaryValue: settings.loyaltyPointMonetaryValue,
        isEnabled: settings.isEnabled,
      });
    }
  }, [open, settings]);

  const handleSubmit = (data: LoyaltyFormData) => {
    const payload = {
      loyaltyAmountPerPoint: data.loyaltyAmountPerPoint,
      minLoyaltyPointsToRedeem: data.minLoyaltyPointsToRedeem,
      loyaltyPointMonetaryValue: data.loyaltyPointMonetaryValue,
      isEnabled: data.isEnabled,
    };
    updateSettings({ value: payload });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[493px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="border-b border-[#D5D5D5] pb-3 text-left">
          <DialogTitle className="text-[14px] font-semibold text-black">
            Edit Loyalty Settings
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <FormInput
              type="number"
              label="Amount Per Point"
              name="loyaltyAmountPerPoint"
              placeholder="eg. 100"
              value={form.watch("loyaltyAmountPerPoint")}
              required
            />

            <FormInput
              type="number"
              label="Minimum Points To Redeem"
              name="minLoyaltyPointsToRedeem"
              placeholder="eg. 50"
              value={form.watch("minLoyaltyPointsToRedeem")}
              required
            />

            <FormInput
              type="number"
              label="Point Monetary Value"
              name="loyaltyPointMonetaryValue"
              placeholder="eg. 1"
              value={form.watch("loyaltyPointMonetaryValue")}
              required
            />

            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-[13px] font-medium text-black">
                Enable Loyalty Program
              </span>

              <Controller
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked: boolean) =>
                      field.onChange(checked)
                    }
                    className="
                      data-[state=checked]:bg-primary data-[checked]:bg-primary
                      data-[state=unchecked]:bg-[#C4C4C4] data-[unchecked]:bg-[#C4C4C4]
                    "
                  />
                )}
              />
            </div>

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-2">
                <Button
                  type="button"
                  variant="cancel"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <LoadingButton type="submit" variant="save" loading={isPending}>
                  Update Settings
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}