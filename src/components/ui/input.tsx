import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-none border-[3px] border-black bg-white px-3 py-1 text-sm font-bold text-black shadow-neobrutal-sm transition-[color,box-shadow,transform] outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-0 focus-visible:-translate-y-1 focus-visible:shadow-neobrutal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-card dark:text-foreground dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
