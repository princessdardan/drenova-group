import { type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import {
  ButtonLink,
  type ButtonLinkSize,
  type ButtonLinkVariant,
} from "@/components/ui/button";

type ActionGroupTone = "default" | "hero" | "footer";
type ActionGroupAlign = "left" | "center";

export interface ActionGroupAction {
  href: ComponentProps<typeof ButtonLink>["href"];
  label: string;
  variant?: ButtonLinkVariant;
  size?: ButtonLinkSize;
  className?: string;
}

export interface ActionGroupProps {
  actions: ActionGroupAction[];
  tone?: ActionGroupTone;
  align?: ActionGroupAlign;
  className?: string;
}

const rowClasses: Record<ActionGroupTone, Record<ActionGroupAlign, string>> = {
  default: {
    center: "flex flex-col sm:flex-row items-center justify-center gap-4",
    left: "flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4",
  },
  hero: {
    center: "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8",
    left: "flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-3 sm:gap-4 mt-8",
  },
  footer: {
    center: "flex flex-col sm:flex-row items-center justify-center gap-4",
    left: "flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4",
  },
};

export function ActionGroup({
  actions,
  tone = "default",
  align = "center",
  className,
}: ActionGroupProps) {
  return (
    <div className={cn(rowClasses[tone][align], className)}>
      {actions.map((action) => (
        <ButtonLink
          key={`${action.href}-${action.label}`}
          href={action.href}
          variant={action.variant}
          size={action.size}
          className={action.className}
        >
          {action.label}
        </ButtonLink>
      ))}
    </div>
  );
}
