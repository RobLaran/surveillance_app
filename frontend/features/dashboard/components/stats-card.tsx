import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendUp,
}: StatsCardProps) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card/80">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{title}</p>

                <p className="mt-0.5 text-2xl font-semibold text-foreground">
                    {value}
                </p>

                {(subtitle || trend) && (
                    <div className="mt-1 flex items-center gap-2">
                        {trend && (
                            <span
                                className={cn(
                                    "text-xs font-medium",
                                    trendUp ? "text-green-500" : "text-red-500",
                                )}
                            >
                                {trendUp ? "↑" : "↓"} {trend}
                            </span>
                        )}

                        {subtitle && (
                            <span className="text-xs text-muted-foreground">
                                {subtitle}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
