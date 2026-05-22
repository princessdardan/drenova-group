import { Reveal } from "@/components/ui/reveal";
import { LeadForm, type LeadSource } from "@/components/sections/lead-form";
import { ContactForm } from "@/components/sections/contact-form";

interface PageContactSectionProps {
  heading?: string;
  subtitle?: string;
  formType?: "lead" | "contact";
  leadSource?: LeadSource;
  showPhone?: boolean;
  prefilledSubject?: string;
  templateKey?: "contact" | "team-profile";
  sourcePath?: string;
  agentName?: string;
  agentRole?: string;
  agentSlug?: string;
}

export function PageContactSection({
  heading = "Start Your Home Journey Today",
  subtitle,
  formType = "lead",
  leadSource = "homepage",
  showPhone = true,
  prefilledSubject,
  templateKey,
  sourcePath,
  agentName,
  agentRole,
  agentSlug,
}: PageContactSectionProps) {
  return (
    <section
      id="contact"
      className="bg-footer-bg py-16 px-6 lg:py-24 lg:px-8"
      style={
        {
          "--background": "var(--footer-bg)",
          "--foreground": "var(--footer-text)",
          "--surface-alt": "var(--footer-bg)",
          "--border": "var(--footer-border)",
          "--muted": "var(--footer-muted)",
          "--muted-foreground": "var(--footer-dim)",
        } as React.CSSProperties
      }
    >
      <Reveal className="max-w-2xl lg:max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight text-footer-text mb-4">
          {heading}
        </h2>
        {subtitle && (
          <p className="text-lg text-footer-muted leading-8 mb-8">
            {subtitle}
          </p>
        )}
        <div className="text-left text-footer-text">
          {formType === "lead" ? (
            <LeadForm source={leadSource} showPhone={showPhone} sourcePath={sourcePath} />
          ) : (
            <ContactForm
              prefilledSubject={prefilledSubject}
              templateKey={templateKey}
              sourcePath={sourcePath}
              agentName={agentName}
              agentRole={agentRole}
              agentSlug={agentSlug}
            />
          )}
        </div>
      </Reveal>
    </section>
  );
}
