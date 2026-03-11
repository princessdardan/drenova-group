import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImage } from "./sanity";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  image: string | SanityImage;
  bio: string | PortableTextBlock[];
  phone: string;
  email: string;
}
