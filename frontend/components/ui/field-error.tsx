import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldErrorProps {
  message?: string | null;
  className?: string;
}

function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 mt-1.5 px-2.5 py-1.5 rounded-md text-xs",
        "bg-destructive/8 border border-destructive/20 text-destructive",
        "animate-in slide-in-from-top-1 fade-in-0 duration-200",
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export { FieldError };
export type { FieldErrorProps };