import { generateOgImage } from "@/lib/og";

export const alt = "Our Team | Drenova Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOgImage({
    title: "Our Team",
    subtitle: "Experienced professionals dedicated to your real estate goals",
  });
}
