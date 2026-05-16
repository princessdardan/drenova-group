import type { Metadata } from "next";

export function makeMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
  };
}
