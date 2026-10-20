import { Skeleton } from "../ui/skeleton";

    export function StaffCardSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-[10px] border border-[#A8A8A8] bg-[#EFEFEF] px-[15px] py-[14px]"
        >
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[160px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      ))}
    </>
  );
}