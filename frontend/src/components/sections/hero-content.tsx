"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface HeroContentProps {
  overline?: string;
  title: string;
  subtitle?: string;
  headingLevel?: "h1" | "h2";
  children?: ReactNode;
}

export function HeroContent({
  overline,
  title,
  subtitle,
  headingLevel = "h1",
  children,
}: HeroContentProps) {
  const Heading = headingLevel;
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <>
      {overline && (
        <p className="text-xs uppercase tracking-widest font-medium mb-4 text-white/80">
          {overline}
        </p>
      )}
      <Heading className="font-display text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
        {title}
      </Heading>
      {subtitle && (
        <p className="text-lg leading-8 mt-4 text-white/80">{subtitle}</p>
      )}
      {children && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
          {children}
        </div>
      )}
    </>
  );

  if (shouldReduceMotion) {
    return (
      <div className="relative z-10 text-center text-white max-w-3xl px-6 py-20">
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="relative z-10 text-center text-white max-w-3xl px-6 py-20"
    >
      {content}
    </motion.div>
  );
}
