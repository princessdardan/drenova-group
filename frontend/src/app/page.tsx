import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { PropertyCard } from "@/components/ui/property-card";
import { ButtonLink } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import {
  getHomePage,
  getValuePropositions,
  getTestimonials,
} from "@/lib/sanity/fetch";
import { getAmpreListings } from "@/lib/ampre/fetch";
import { urlFor } from "@/lib/sanity/image";
import { isSanityImage } from "@/types/sanity";

export default async function HomePage() {
  const [homePage, valuePropositions, testimonials] = await Promise.all([
    getHomePage(),
    getValuePropositions(),
    getTestimonials(),
  ]);

  // Fetch latest listings from AMPRE (via KV)
  const { listings: featuredListings } = await getAmpreListings({ pageSize: 6 });

  const testimonial = testimonials[0] ?? null;

  const flh = homePage?.featuredListingsHeading;
  const vph = homePage?.valuePropsHeading;
  const cta = homePage?.cta;

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={homePage?.hero?.image ?? "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"}
        imageAlt="Modern luxury home with warm lighting"
        overline={homePage?.hero?.overline ?? "Drenova Group Real Estate"}
        title={homePage?.hero?.title ?? "Your Home's Story Starts Here"}
        subtitle={homePage?.hero?.subtitle ?? "Modern brokerage. Local expertise. Multi-state coverage across Illinois, Arizona, Wisconsin, Indiana, and Michigan."}
      >
        <ButtonLink href="/listings" className="border-white text-white hover:bg-white hover:text-black">
          Browse Listings
        </ButtonLink>
        <ButtonLink href="/sell" className="border-white text-white hover:bg-white hover:text-black">
          Sell Your Home
        </ButtonLink>
      </Hero>

      {/* ─── Featured Listings ─── */}
      <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            overline={flh?.overline ?? "Featured Properties"}
            title={flh?.title ?? "Explore Our Listings"}
            description={flh?.description ?? "Hand-picked properties across our coverage areas, ready for you to make them home."}
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredListings.slice(0, 6).map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="text-center mt-10">
            <ButtonLink href="/listings">View All Listings</ButtonLink>
          </div>
        </div>
      </section>

      {/* ─── About Split Panel ─── */}
      <section className="bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
            <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
              {homePage?.aboutSectionOverline ?? "About Us"}
            </p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              {homePage?.aboutSectionTitle ?? "An Elevated Approach to Real Estate"}
            </h2>
            <p className="text-muted leading-7 mb-8">
              {homePage?.aboutSectionContent ?? "At Drenova Group, we combine deep local knowledge with modern tools and a client-first philosophy. Whether you're buying your first home or selling a luxury property, our experienced team delivers personalized service and exceptional results."}
            </p>
            <div>
              <ButtonLink href="/about">Learn More</ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              src={
                homePage?.aboutSectionImage && isSanityImage(homePage.aboutSectionImage)
                  ? urlFor(homePage.aboutSectionImage).width(1200).height(800).fit("crop").url()
                  : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
              }
              alt={homePage?.aboutSectionImage?.alt ?? "Warm interior of a modern home"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ─── Value Propositions ─── */}
      <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            overline={vph?.overline ?? "Why Drenova Group"}
            title={vph?.title ?? "What Sets Us Apart"}
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {valuePropositions.map((prop, i) => (
              <div key={prop._id}>
                <span className="font-display text-6xl lg:text-8xl font-bold text-accent/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-px bg-border mt-4 mb-6" />
                <h3 className="text-lg font-semibold mb-2">{prop.title}</h3>
                <p className="text-base text-muted leading-7">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonial ─── */}
      {testimonial && (
        <section className="relative py-24 lg:py-32">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
            alt="Modern living room"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white">
            <p className="font-display text-xl lg:text-3xl italic leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p className="mt-6 text-sm font-medium">{testimonial.name}</p>
            <p className="text-sm text-white/60">{testimonial.detail}</p>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <CtaSection
        title={cta?.title ?? "Ready to Get Started?"}
        subtitle={cta?.subtitle ?? "Whether you're buying or selling, our team is here to guide you every step of the way."}
      >
        <ButtonLink href="/contact">Contact Us</ButtonLink>
        <ButtonLink href="/listings" variant="minimal">
          Browse Listings
        </ButtonLink>
      </CtaSection>
    </>
  );
}
