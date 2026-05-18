import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-none bg-muted border-[2px] border-black shadow-[2px_2px_0px_0px_var(--shadow-color)]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
