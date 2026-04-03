import { generateOgImage } from "@/lib/og";

export const alt = "About | Drenova Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOgImage({
    title: "About Drenova Group",
    subtitle: "Built on integrity, innovation, and commitment to our clients",
  });
}
