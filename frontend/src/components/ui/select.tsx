import { type ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface SelectProps extends ComponentProps<"select"> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  id,
  options,
  placeholder,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-foreground tracking-wide"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "w-full h-14 px-4 pr-12 bg-surface-alt border-2 border-border rounded-lg text-base",
            "transition-all duration-200 ease-out",
            "appearance-none cursor-pointer",
            "hover:border-muted-foreground/50",
            "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
            "focus-visible:bg-surface",
            error && "border-red-600 dark:border-red-400 focus-visible:ring-red-500/50",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
