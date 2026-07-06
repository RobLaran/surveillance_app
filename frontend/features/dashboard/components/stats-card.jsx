"use client";

import { cn } from "@/lib/utils";

export function StatsCard({ title, value, subtitle, icon: Icon, trend, trendUp }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold text-foreground mt-0.5">{value}</p>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trendUp ? "text-green-500" : "text-red-500"
              )}>
                {trendUp ? "↑" : "↓"} {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
