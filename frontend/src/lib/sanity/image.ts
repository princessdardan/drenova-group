import imageUrlBuilder, {
  type ImageUrlBuilder,
} from "@sanity/image-url";
import { client } from "./client";

type SanityImageSource = Parameters<ImageUrlBuilder["image"]>[0];

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
