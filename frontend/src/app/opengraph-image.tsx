import { generateOgImage } from "@/lib/og";

export const alt = "Drenova Group | Real Estate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOgImage({
    title: "Here to Guide You On Your Home Journey",
    subtitle: "Modern real estate brokerage across Illinois, Arizona & Wisconsin",
  });
}
