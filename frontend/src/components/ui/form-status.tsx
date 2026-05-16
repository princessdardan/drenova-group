import { cn } from "@/lib/cn";

interface FormStatusProps {
  title?: string;
  message: string;
  error?: boolean;
  className?: string;
}

export function FormStatus({ title, message, error, className }: FormStatusProps) {
  if (error) {
    return <p className={cn("text-sm text-red-600 dark:text-red-400", className)}>{message}</p>;
  }

  return (
    <div className={cn("text-center py-12", className)}>
      {title && <h3 className="font-display text-2xl font-bold tracking-tight mb-2">{title}</h3>}
      <p className="text-muted leading-7">{message}</p>
    </div>
  );
}
