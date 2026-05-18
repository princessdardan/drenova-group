import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImage } from "./sanity";

export interface TeamMember {
  _key: string;
  _type: "teamMember";
  slug: string;
  name: string;
  role: string;
  image: string | SanityImage;
  bio: string | PortableTextBlock[];
  phone: string;
  email: string;
}
