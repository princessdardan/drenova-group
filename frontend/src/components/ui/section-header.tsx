import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  overline?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  overline,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        className
      )}
    >
      {overline && (
        <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
          {overline}
        </p>
      )}
      <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-lg text-muted leading-8",
            align === "center" && "max-w-2xl mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
