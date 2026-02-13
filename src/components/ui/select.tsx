import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";
