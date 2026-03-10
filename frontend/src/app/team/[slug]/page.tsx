import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/sections/contact-form";
import { teamMembers } from "@/lib/dummy-data";

export function generateStaticParams() {
  return teamMembers.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);
  if (!member) return {};
  return {
    title: member.name,
    description: `${member.name} — ${member.role} at Drenova Group. ${member.bio.slice(0, 140)}...`,
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) notFound();

  return (
    <>
      {/* ─── Agent Profile ─── */}
      <section className="pt-20 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16 bg-surface">
            <p className="text-xs uppercase tracking-widest font-medium text-accent mb-2">
              {member.role}
            </p>
            <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              {member.name}
            </h1>
            <p className="text-muted leading-7 mb-8">{member.bio}</p>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Phone:</span>{" "}
                <a href={`tel:${member.phone}`} className="text-accent hover:underline">
                  {member.phone}
                </a>
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href={`mailto:${member.email}`} className="text-accent hover:underline">
                  {member.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Contact Form ─── */}
      <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl lg:text-4xl font-bold tracking-tight mb-2 text-center">
            Contact {member.name.split(" ")[0]}
          </h2>
          <p className="text-muted text-center mb-8">
            Send a message and {member.name.split(" ")[0]} will get back to you shortly.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
