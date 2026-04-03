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
