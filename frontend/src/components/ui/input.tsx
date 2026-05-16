import { type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FormFieldShell } from "./form-field-shell";

type InputProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
};

export function Input({ label, error, id, className, required, ...props }: InputProps) {
  return (
    <FormFieldShell id={id} label={label} error={error} required={required}>
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
        required={required}
        {...props}
      />
    </FormFieldShell>
  );
}
