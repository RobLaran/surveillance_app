import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "w-full min-w-0 rounded-md border outline-none",
    "transition-[color,box-shadow]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "placeholder:text-muted-foreground",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-destructive/20",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-input bg-transparent shadow-xs",

        filled:
          "border-input bg-muted shadow-xs",

        auth:
          "border-zinc-700 bg-zinc-900/80 text-white placeholder:text-zinc-500 shadow-sm",
        auth_blue:
          "border-zinc-700 bg-zinc-900/80 text-white placeholder:text-zinc-500 shadow-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/50 focus-visible:ring-[3px]",
        glass:
          "border-white/10 bg-white/5 backdrop-blur-sm",
      },

      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>;

function Input({
  className,
  variant,
  size,
  type,
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };