import { TableCell, TableRow } from "@/src/components/ui/table";
import { Skeleton } from "@/src/components/ui/skeleton";

const LoyaltyTableSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[70px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell>
      <div className="flex items-center justify-center">
        <Skeleton className="size-8 rounded" />
      </div>
    </TableCell>
  </TableRow>
);

export default LoyaltyTableSkeleton;