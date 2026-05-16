import { type ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "minimal" | "glass";
type Size = "sm" | "md" | "lg";

export type ButtonLinkVariant = Variant;
export type ButtonLinkSize = Size;

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
  accent:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-md hover:shadow-lg hover:-translate-y-0.5",
  minimal:
    "underline underline-offset-4 font-medium normal-case tracking-normal hover:text-accent",
  glass:
    "glass border-white/30 text-white hover:bg-white/20 hover:border-white/50",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-xs tracking-wider",
  md: "h-12 px-6 text-xs tracking-wider sm:h-14 sm:px-8 sm:text-sm",
  lg: "h-14 px-8 text-sm tracking-wider sm:h-16 sm:px-12",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        variant !== "minimal" && sizes[size],
        className
      )}
      {...props}
    />
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        base,
        variants[variant],
        variant !== "minimal" && sizes[size],
        className
      )}
      {...props}
    />
  );
}
