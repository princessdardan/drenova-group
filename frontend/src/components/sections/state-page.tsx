interface StatePageProps {
  overline: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function StatePage({
  overline,
  title,
  description,
  children,
}: StatePageProps) {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
        {overline}
      </p>
      <h1 className="font-display text-4xl lg:text-6xl font-bold tracking-tight mb-4">
        {title}
      </h1>
      <p className="text-muted leading-7 max-w-md mb-8">
        {description}
      </p>
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
        {children}
      </div>
    </section>
  );
}
