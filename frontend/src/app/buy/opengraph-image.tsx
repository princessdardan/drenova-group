import { generateOgImage } from "@/lib/og";

export const alt = "Buy | Drenova Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOgImage({
    title: "Find Your Next Home",
    subtitle: "Expert guidance through every step of the buying process",
  });
}
