import type { SanityImage } from "./sanity";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  image: string | SanityImage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text blocks from Sanity; plain string for dummy data
  bio: string | any[];
  phone: string;
  email: string;
}
