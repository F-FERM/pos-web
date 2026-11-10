import { TableCell, TableRow } from "@/src/components/ui/table";
import { Skeleton } from "@/src/components/ui/skeleton";

const PrivilegeSkeletonLoading = () =>
  Array.from({ length: 3 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>

      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="size-8 rounded" />
          <Skeleton className="size-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  ));

export default PrivilegeSkeletonLoading;