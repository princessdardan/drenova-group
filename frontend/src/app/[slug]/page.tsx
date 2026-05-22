import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGenericPageBySlug, getGenericPageSlugs } from "@/lib/sanity/fetch";
import { isReservedRootSlug } from "@/lib/routes";
import { HomePageTemplate } from "@/components/sections/home-page-template";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { makeMetadata } from "@/lib/seo";

interface GenericPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getGenericPageSlugs();
  return slugs
    .filter((slug) => !isReservedRootSlug(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GenericPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isReservedRootSlug(slug)) {
    return {};
  }

  const page = await getGenericPageBySlug(slug);

  if (!page) {
    return {};
  }

  const title = page.seo?.title || page.title || page.hero?.title || "Drenova Group";
  const description =
    page.seo?.description ||
    page.hero?.subtitle ||
    "Drenova Group is a modern real estate team serving buyers and sellers across Toronto, the GTA, York Region, and surrounding Ontario communities.";
  const image = page.seo?.image
    ? resolveSanityImageUrl(page.seo.image, {
        width: 1200,
        height: 630,
        fallback: "",
        fit: "crop",
      })
    : undefined;

  const baseMetadata = makeMetadata({
    title,
    description,
    path: `/${slug}`,
  });

  if (image) {
    baseMetadata.openGraph = {
      ...baseMetadata.openGraph,
      images: [{ url: image }],
    };
  }

  if (page.seo?.noIndex) {
    baseMetadata.robots = {
      index: false,
      follow: false,
    };
  }

  return baseMetadata;
}

export default async function GenericPage({ params }: GenericPageProps) {
  const { slug } = await params;

  if (isReservedRootSlug(slug)) {
    notFound();
  }

  const page = await getGenericPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <HomePageTemplate page={page} leadSource="generic-page" sourcePath={`/${slug}`} />;
}
