import { generateOgImage } from "@/lib/og";

export const alt = "Sell | Drenova Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOgImage({
    title: "Sell with Confidence",
    subtitle: "Expert pricing, professional marketing, and skilled negotiation",
  });
}
