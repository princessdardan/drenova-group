import { generateOgImage } from "@/lib/og";

export const alt = "Listings | Drenova Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOgImage({
    title: "Property Listings",
    subtitle: "Browse available properties across our multi-state coverage area",
  });
}
