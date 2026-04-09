import { type ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-foreground tracking-wide"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-14 px-4 bg-surface-alt border-2 border-border rounded-lg text-base",
          "transition-all duration-200 ease-out",
          "placeholder:text-muted-foreground",
          "hover:border-muted-foreground/50",
          "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
          "focus-visible:bg-surface",
          error && "border-red-600 dark:border-red-400 focus-visible:ring-red-500/50",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
