import type { ComponentProps } from "react";
import type * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type MediaCardVariant = "default" | "overlay" | "listing" | "team";

export interface MediaCardProps {
  href?: ComponentProps<typeof Link>["href"];
  image?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: MediaCardVariant;
  className?: string;
  mediaClassName?: string;
  contentClassName?: string;
  linkClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const variants: Record<MediaCardVariant, string> = {
  default: "bg-surface-alt overflow-hidden",
  overlay:
    "group flex flex-col overflow-hidden dimensional-card",
  listing: "group dimensional-card overflow-hidden cursor-pointer",
  team: "bg-surface-alt overflow-hidden group",
};

export function MediaCard({
  href,
  image,
  title,
  subtitle,
  badge,
  footer,
  variant = "default",
  className,
  mediaClassName,
  contentClassName,
  linkClassName,
  titleClassName,
  subtitleClassName,
}: MediaCardProps) {
  const isOverlay = variant === "overlay";

  const defaultOverlayTitleClass = "font-display text-2xl lg:text-3xl font-bold tracking-tight mb-2";
  const defaultOverlaySubtitleClass = "text-sm text-white/80 mb-4";
  
  const defaultStandardTitleClass = "text-lg font-semibold font-display";
  const defaultStandardSubtitleClass = "mt-1 text-sm text-muted-foreground";

  const cardContent = isOverlay ? (
    <>
      <div className={cn("relative", mediaClassName)}>
        {image}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className={cn("hidden lg:block absolute bottom-0 left-0 right-0 p-8 text-white", contentClassName)}>
          {badge ? <div>{badge}</div> : null}
          <h3 className={titleClassName ?? defaultOverlayTitleClass}>{title}</h3>
          {subtitle ? <div className={subtitleClassName ?? defaultOverlaySubtitleClass}>{subtitle}</div> : null}
          {footer ? <div>{footer}</div> : null}
        </div>
      </div>
      <div className={cn("lg:hidden p-6 bg-surface-alt flex flex-col flex-1", contentClassName)}>
        {badge ? <div>{badge}</div> : null}
        <h3 className={titleClassName ?? "font-display text-2xl font-bold tracking-tight mb-2 text-foreground"}>{title}</h3>
        {subtitle ? <div className={subtitleClassName ?? "text-sm text-muted-foreground mb-4"}>{subtitle}</div> : null}
        {footer ? <div className="mt-auto pt-4">{footer}</div> : null}
      </div>
    </>
  ) : (
    <>
      {image ? <div className={cn("relative", mediaClassName)}>{image}</div> : null}
      <div className={cn("p-5 lg:p-6", contentClassName)}>
        {badge ? <div>{badge}</div> : null}
        <h3 className={titleClassName ?? defaultStandardTitleClass}>{title}</h3>
        {subtitle ? <div className={subtitleClassName ?? defaultStandardSubtitleClass}>{subtitle}</div> : null}
        {footer ? <div className="mt-4">{footer}</div> : null}
      </div>
    </>
  );

  return (
    <article className={cn(variants[variant], className)}>
      {href ? (
        <Link
          href={href}
          className={cn(
            isOverlay ? "flex flex-col h-full" : "block h-full",
            isOverlay && "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            linkClassName
          )}
        >
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </article>
  );
}
