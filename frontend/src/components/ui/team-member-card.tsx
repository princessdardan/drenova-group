import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "@/types/team";
import { isSanityImage } from "@/types/sanity";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { ButtonLink } from "@/components/ui/button";
import { MediaCard } from "@/components/ui/media-card";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <MediaCard
      variant="team"
      image={
        <Link href={`/team/${member.slug}`} className="block">
          <div className="aspect-[3/4] relative">
            <Image
              src={resolveSanityImageUrl(member.image, { width: 600, height: 800, fallback: typeof member.image === "string" ? member.image : "", fit: "crop" })}
              alt={
                isSanityImage(member.image) && member.image.alt
                  ? member.image.alt
                  : member.name
              }
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      }
      contentClassName="p-4 lg:p-6"
      badge={<p className="text-xs uppercase tracking-widest text-muted mb-1">{member.role}</p>}
      title={member.name}
      footer={
        <ButtonLink href={`/team/${member.slug}`} variant="primary" size="sm">
          Contact
        </ButtonLink>
      }
    />
  );
}
