import {
  createImageUrlBuilder,
  type ImageUrlBuilder,
} from "@sanity/image-url";
import { client } from "./client";

type SanityImageSource = Parameters<ImageUrlBuilder["image"]>[0];

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function isSanityImage(image: unknown): image is SanityImageSource {
  return !!image && typeof image === "object" && "asset" in image;
}

export function resolveSanityImageUrl(
  image: SanityImageSource | string | null | undefined,
  options: { width: number; height: number; fallback: string; fit?: "crop" }
): string {
  if (!image) return options.fallback;
  if (typeof image === "string") return image;
  if (!isSanityImage(image)) return options.fallback;

  let urlBuilder = urlFor(image).width(options.width).height(options.height);
  if (options.fit === "crop") {
    urlBuilder = urlBuilder.fit("crop");
  }
  return urlBuilder.url();
}
