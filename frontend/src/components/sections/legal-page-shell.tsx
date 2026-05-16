interface LegalPageShellProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="bg-surface py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-sm text-muted">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="bg-background py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </section>
    </div>
  );
}
