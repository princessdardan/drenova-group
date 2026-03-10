import {
  PortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/types/sanity";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display text-xl font-bold text-foreground">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="font-sans text-base leading-relaxed text-muted lg:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-4 font-display text-lg italic text-muted lg:text-xl">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href ?? "#";
      const isExternal =
        href.startsWith("http") || href.startsWith("mailto:");
      return (
        <a
          href={href}
          className="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-6 text-muted">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-6 text-muted">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-base leading-relaxed lg:text-lg">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-base leading-relaxed lg:text-lg">{children}</li>
    ),
  },
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).fit("max").url();
      return (
        <figure>
          <Image
            src={src}
            alt={value.alt ?? ""}
            width={1200}
            height={675}
            className="rounded-lg"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableTextRenderer({
  value,
}: Pick<PortableTextProps, "value">) {
  if (!value) return null;
  return (
    <div className="space-y-6">
      <PortableText value={value} components={components} />
    </div>
  );
}
