import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import { PageContactSection } from "@/components/sections/page-contact-section";
import { isSanityImage } from "@/types/sanity";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { getTeamMembers, getTeamMemberBySlug } from "@/lib/sanity/fetch";
import { PortableTextRenderer } from "@/components/ui/portable-text";
import { canonicalUrl } from "@/lib/seo";

export async function generateStaticParams() {
  const members = await getTeamMembers();
  return members.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) return {};
  const name = stegaClean(member.name);
  const role = stegaClean(member.role);
  const imageFallback = typeof member.image === "string" ? member.image : "";
  const ogImage = resolveSanityImageUrl(member.image, {
    width: 1200,
    height: 630,
    fallback: imageFallback,
    fit: "crop",
  });

  return {
    title: name,
    description: `${name} — ${role} at Drenova Group.`,
    alternates: {
      canonical: canonicalUrl(`/team/${member.slug}`),
    },
    openGraph: ogImage
      ? {
          url: canonicalUrl(`/team/${member.slug}`),
          images: [{ url: ogImage, alt: name }],
        }
      : { url: canonicalUrl(`/team/${member.slug}`) },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) notFound();

  const profileImage = resolveSanityImageUrl(member.image, {
    width: 800,
    height: 1000,
    fallback: typeof member.image === "string" ? member.image : "",
    fit: "crop",
  });

  return (
    <>
      {/* ─── Agent Profile ─── */}
      <section className="pt-20 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              src={profileImage}
              alt={
                isSanityImage(member.image) && member.image.alt
                  ? member.image.alt
                  : member.name
              }
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
            {typeof member.bio === "string" ? (
              <p className="text-muted leading-7 mb-8">{member.bio}</p>
            ) : (
              <div className="text-muted leading-7 mb-8">
                <PortableTextRenderer value={member.bio} />
              </div>
            )}
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
      <PageContactSection
        heading={`Contact ${member.name.split(" ")[0]}`}
        subtitle={`Send a message and ${member.name.split(" ")[0]} will get back to you shortly.`}
        formType="contact"
        templateKey="team-profile"
        sourcePath={`/team/${member.slug}`}
        agentName={member.name}
        agentRole={member.role}
        agentSlug={member.slug}
      />
    </>
  );
}
