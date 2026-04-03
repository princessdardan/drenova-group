import { generateOgImage } from "@/lib/og";

export const alt = "Contact | Drenova Group";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOgImage({
    title: "Get in Touch",
    subtitle: "Have a question or ready to get started? We'd love to hear from you",
  });
}
