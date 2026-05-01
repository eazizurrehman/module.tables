import { AppHeaderSkeleton } from "@/app/_components/header";
import { AppTableHeaderSkeleton } from "@/app/_components/tables/horizontal/_header";
import { TablePaginationSkeleton } from "@/app/_components/tables/horizontal/_pagination/_skeleton";
import { Skeleton } from "@/app/_shadcn/skeleton";
import { constructArrayFromLength } from "@/lib";
import { cn } from "@/lib/utils";

const POSSIBLE_CELL_WIDTHS = ["w-16", "w-20", "w-24", "w-28", "w-32", "w-72"];

export function Row({
  className,
  widths,
}: {
  className?: string;
  widths: string[];
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between gap-5 border-b border-dashed",
        className,
      )}
    >
      {constructArrayFromLength(10).map((index) => {
        if (index === 0)
          return <Skeleton className="ml-1 h-4 w-4 rounded" key="row-start" />;

        if (index === 10 - 1)
          return <Skeleton className="h-6 w-20 rounded" key="row-end" />;

        return (
          <Skeleton
            className={cn("h-6 rounded", widths[index] || "w-20")}
            key={`row-col-${index}`}
          />
        );
      })}
    </div>
  );
}

export function HorizontalTableSkeleton() {
  function pseudoRandom(idx: number) {
    return (idx * 31 + 7) % POSSIBLE_CELL_WIDTHS.length;
  }

  const widths = Array.from({ length: 10 }, (_, index) => {
    if (index === 0 || index === 9) return "w-20";

    return POSSIBLE_CELL_WIDTHS[pseudoRandom(index)];
  });

  return (
    <div className="flex w-full animate-pulse flex-col">
      <Row className="h-10" key="row-header" widths={widths} />
      {constructArrayFromLength(20).map((index) => (
        <Row className="border-solid" key={`row-${index}`} widths={widths} />
      ))}
    </div>
  );
}

export function AppTableSkeleton() {
  return (
    <div className="relative flex h-dvh w-full flex-col rounded-none">
      <AppHeaderSkeleton className="h-12.25 border-x border-b border-dashed" />
      <div className="flex h-full w-full grow flex-col overflow-hidden border-x border-dashed px-2">
        <AppTableHeaderSkeleton />
        <HorizontalTableSkeleton />
      </div>
      <TablePaginationSkeleton />
    </div>
  );
}
