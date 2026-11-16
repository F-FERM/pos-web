import { TableCell, TableRow } from "@/src/components/ui/table";
import { Skeleton } from "@/src/components/ui/skeleton";

const widths = ["w-[90px]", "w-[160px]", "w-[90px]", "w-[60px]", "w-[60px]", "w-[50px]", "w-[60px]", "w-[90px]"];

const ProductTableSkeleton = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {widths.map((w, idx) => (
        <TableCell key={idx}>
          <Skeleton className={`h-4 ${w}`} />
        </TableCell>
      ))}
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="size-8 rounded" />
          <Skeleton className="size-8 rounded" />
          <Skeleton className="size-8 rounded" />
        </div>
      </TableCell>
    </TableRow>
  ));

export default ProductTableSkeleton;