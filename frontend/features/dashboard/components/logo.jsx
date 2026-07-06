"use client";

import { Shield } from "lucide-react";

export function Logo({
    title="AI Sentinel", 
    subtext="Surveillance", 
    showBottomBorder=false, 
    isCollapsed=false, 
    isColumn=false, 
    isGreen=false
    }) {
    return (
        <div className={`flex h-16 items-center gap-3 px-4 ${isColumn && "flex-col"} ${showBottomBorder && "border-b border-border"}`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isGreen ? "bg-primary" : "bg-accent"}`}>
                <Shield className="h-10 w-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
            <div className={`flex flex-col ${isColumn && "items-center"}`}>
                <span className="text-sm font-semibold text-foreground">{title}</span>
                <span className="text-xs text-muted-foreground">{subtext}</span>
            </div>
            )}
        </div>
    );
}