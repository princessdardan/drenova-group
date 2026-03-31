import { type ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "minimal";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center uppercase tracking-wider font-semibold transition-colors duration-200 cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
  accent:
    "bg-accent text-accent-foreground hover:bg-accent-hover",
  minimal:
    "underline underline-offset-4 font-medium normal-case tracking-normal hover:text-accent",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-3 text-xs sm:h-11 sm:px-4",
  md: "h-11 px-5 text-xs sm:h-12 sm:px-8 sm:text-sm",
  lg: "h-12 px-6 text-xs sm:h-14 sm:px-10 sm:text-sm",
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
