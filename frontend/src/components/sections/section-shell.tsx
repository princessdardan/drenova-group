import { cn } from "@/lib/cn";

interface SectionShellProps {
  id?: string;
  bg?: "background" | "surface" | "footer";
  container?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export function SectionShell({
  id,
  bg = "background",
  container = "lg",
  className,
  containerClassName,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 px-6 lg:py-24 lg:px-8",
        bg === "background" ? "bg-background" : bg === "surface" ? "bg-surface" : "bg-footer-bg",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto",
          container === "sm" ? "max-w-3xl" : container === "md" ? "max-w-5xl" : container === "lg" ? "max-w-7xl" : container === "xl" ? "max-w-[1440px]" : "w-full",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
