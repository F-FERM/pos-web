import { TableCell, TableRow } from "@/src/components/ui/table";
import { Skeleton } from "@/src/components/ui/skeleton";

const widths = [
  "w-[160px]", 
  "w-[100px]", 
  "w-[60px]",  
  "w-[70px]",  
  "w-[70px]",  
  "w-[70px]",  
  "w-[80px]", 
];

const CustomerTableSkeleton = () =>
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

export default CustomerTableSkeleton;