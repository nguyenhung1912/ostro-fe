import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-none border-[3px] border-black bg-white px-3 py-2 font-bold text-black shadow-neobrutal-sm transition-[color,box-shadow,transform] outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-0 focus-visible:-translate-y-1 focus-visible:shadow-neobrutal disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-card dark:text-foreground dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
