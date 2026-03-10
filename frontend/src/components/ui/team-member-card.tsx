import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "@/types/team";
import { isSanityImage } from "@/types/sanity";
import { ButtonLink } from "@/components/ui/button";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-surface-alt overflow-hidden group">
      <Link href={`/team/${member.slug}`} className="block">
        <div className="aspect-[3/4] relative">
          <Image
            src={isSanityImage(member.image) ? "" : member.image}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-4 lg:p-6">
        <p className="text-xs uppercase tracking-widest text-muted mb-1">{member.role}</p>
        <p className="text-lg font-semibold font-display">{member.name}</p>
        <div className="mt-4">
          <ButtonLink href={`/team/${member.slug}`} variant="primary" size="sm">
            Contact
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
