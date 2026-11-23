"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import ErrorHandling from "../Error/ErrorHandling";
import { formatDate } from "@/src/lib/date-utils";
import { ListLoyaltySettingsApi } from "@/src/api/loyalty-setting/api/getAll";
import LoyaltyTableSkeleton from "./LoyaltySettingSkeletonLoading";
import EditLoyalty from "./EditLoyaltySetting";


export default function LoyaltySettings() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["loyaltysettingList"],
    queryFn:()=> ListLoyaltySettingsApi({}),
  });

  const settings = data?.data;

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        <ErrorHandling message={error.message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Amount Per Point</TableHead>
              <TableHead>Min Points To Redeem</TableHead>
              <TableHead>Point Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoyaltyTableSkeleton />
            ) : !settings ? (
              <TableEmpty colSpan={6}>No loyalty settings found</TableEmpty>
            ) : (
              <TableRow>
                <TableCell>{settings.loyaltyAmountPerPoint}</TableCell>
                <TableCell>{settings.minLoyaltyPointsToRedeem}</TableCell>
                <TableCell>{settings.loyaltyPointMonetaryValue}</TableCell>
                <TableCell>
                  <span
                    className={
                      settings.isEnabled ? "text-green-600" : "text-red-500"
                    }
                  >
                    {settings.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </TableCell>
                <TableCell>{formatDate(settings.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <EditLoyalty settings={settings} />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}