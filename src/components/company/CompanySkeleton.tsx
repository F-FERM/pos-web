const CompanySkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col gap-6 md:flex-row md:items-start">
      {/* Logo + name */}
      <div className="flex shrink-0 flex-col gap-3">
        <div className="size-[153px] rounded-full bg-[#EFEFEF]" />
        <div className="h-5 w-32 rounded bg-[#EFEFEF]" />
        <div className="size-9 rounded-md bg-[#EFEFEF]" />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[93px] rounded-[10px] bg-[#EFEFEF]" />
          ))}
        </div>

        <div className="mt-2 h-4 w-40 rounded bg-[#EFEFEF]" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[93px] rounded-[10px] bg-[#EFEFEF]" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySkeleton;