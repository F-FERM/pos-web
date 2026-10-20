import { TableCell, TableRow } from "@/src/components/ui/table";
import { Skeleton } from "@/src/components/ui/skeleton";

const CategoryTableSkeleton = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-[160px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[90px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[220px]" /></TableCell>

      <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="size-8 rounded" />
          <Skeleton className="size-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  ));

export default CategoryTableSkeleton;