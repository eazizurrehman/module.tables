import { Skeleton } from "@/app/_shadcn/skeleton";

export function TablePaginationSkeleton() {
  return (
    <div className="bottom-0 flex h-12.25 w-full shrink-0 items-center justify-between gap-5 border-x border-t border-dashed px-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-52 rounded" />
        <Skeleton className="h-6 w-32 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-17 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-21 rounded-md" />
        </div>
      </div>
    </div>
  );
}
