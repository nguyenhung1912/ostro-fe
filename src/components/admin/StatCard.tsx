import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <Card className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg shadow-black/5 transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 dark:bg-card dark:border-border/40 dark:shadow-none dark:liquid-glass dark:backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {(description || trend) && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs md:text-[13px]">
            {trend && (
              <span
                className={
                  trend.isPositive
                    ? "text-emerald-500 font-medium"
                    : "text-rose-500 font-medium"
                }
              >
                {trend.value}
              </span>
            )}
            {description && (
              <span className="text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
