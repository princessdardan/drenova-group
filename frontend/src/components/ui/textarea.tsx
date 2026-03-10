import { type ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends ComponentProps<"textarea"> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          "min-h-[120px] px-4 py-3 bg-surface-alt border border-border rounded-lg text-base transition-colors focus:border-accent focus:ring-1 focus:ring-ring outline-none resize-y placeholder:text-muted-foreground",
          error && "border-red-600 dark:border-red-400",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
