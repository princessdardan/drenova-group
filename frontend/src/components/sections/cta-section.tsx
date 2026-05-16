import { cn } from "@/lib/cn";
import { ActionGroup, type ActionGroupAction } from "./action-group";

interface CtaSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  bg?: "surface" | "background";
  actions?: ActionGroupAction[];
}

export function CtaSection({ title, subtitle, children, bg = "surface", actions }: CtaSectionProps) {
  return (
    <section
      className={cn(
        "section-lg",
        bg === "surface" ? "bg-surface" : "bg-background"
      )}
    >
      <div className="swiss-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-display-sm font-bold tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {actions && actions.length > 0 ? (
            <ActionGroup actions={actions} tone="default" align="center" />
          ) : children ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
