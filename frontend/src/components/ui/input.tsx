import { type ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-12 px-4 bg-surface-alt border border-border rounded-lg text-base transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none placeholder:text-muted-foreground",
          error && "border-red-600 dark:border-red-400",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
