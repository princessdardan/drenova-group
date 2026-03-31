import { cn } from "@/lib/cn";

interface CtaSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  bg?: "surface" | "background";
}

export function CtaSection({ title, subtitle, children, bg = "surface" }: CtaSectionProps) {
  return (
    <section
      className={cn(
        "py-16 px-6 lg:py-24 lg:px-8",
        bg === "surface" ? "bg-surface" : "bg-background"
      )}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-muted leading-8 mb-8">{subtitle}</p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {children}
        </div>
      </div>
    </section>
  );
}
