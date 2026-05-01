import { Skeleton } from "@/app/_shadcn/skeleton";

const firstColumnWidths = ["w-1/2", "w-2/3", "w-3/4", "w-1/3", "w-5/6"];

const getFirstColumnWidth = (index: number) =>
  firstColumnWidths[index % firstColumnWidths.length];

export function VerticalTableSkeleton() {
  return (
    <div className="w-full rounded-xl border p-5 sm:max-w-xl">
      <div className="*:py-3">
        <div className="flex items-center gap-6 border-b">
          <div className="w-1/3">
            <Skeleton className={`h-6 ${getFirstColumnWidth(0)}`} />
          </div>
          <div className="w-full">
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
        <div className="flex items-center gap-6 border-b">
          <div className="w-1/3">
            <Skeleton className={`h-6 ${getFirstColumnWidth(1)}`} />
          </div>
          <div className="w-full">
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
        <div className="flex items-center gap-6 border-b">
          <div className="w-1/3">
            <Skeleton className={`h-6 ${getFirstColumnWidth(2)}`} />
          </div>
          <div className="w-full">
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
        <div className="flex items-center gap-6 border-b">
          <div className="w-1/3">
            <Skeleton className={`h-6 ${getFirstColumnWidth(3)}`} />
          </div>
          <div className="w-full">
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
        <div className="flex items-center gap-6 border-b">
          <div className="w-1/3">
            <Skeleton className={`h-6 ${getFirstColumnWidth(4)}`} />
          </div>
          <div className="w-full">
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
        <div className="flex items-start gap-6 border-b">
          <div className="w-1/3">
            <Skeleton className={`h-6 ${getFirstColumnWidth(5)}`} />
          </div>
          <div className="w-full space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        </div>
        <div className="flex items-center gap-6 border-b">
          <div className="w-1/3">
            <Skeleton className="h-6 w-4/5" />
          </div>
          <div className="flex w-full items-center gap-2">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-6/10" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
