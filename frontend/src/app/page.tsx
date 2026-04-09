import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { ButtonLink } from "@/components/ui/button";
import { LeadForm } from "@/components/sections/lead-form";
import { Reveal } from "@/components/ui/reveal";
import { StaggerChildren } from "@/components/ui/stagger-children";
import { getHomePage } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { isSanityImage } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Luxury Real Estate Across Illinois, Arizona & Wisconsin",
  description:
    "Drenova Group — a modern real estate brokerage offering expert buying and selling services with a personal approach. Start your home journey today.",
};

export default async function HomePage() {
  const homePage = await getHomePage();

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={
          homePage?.hero?.image ??
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
        }
        imageAlt="Modern luxury home"
        backgroundType={homePage?.hero?.backgroundType ?? "image"}
        videoUrl={homePage?.hero?.videoUrl}
        overline={homePage?.hero?.overline ?? "Drenova Group Real Estate"}
        title={
          homePage?.hero?.title ?? "Here to Guide You On Your Home Journey"
        }
        subtitle={
          homePage?.hero?.subtitle ??
          "Proud to be your trusted real estate expert, guiding you every step of the way."
        }
      >
        <ButtonLink
          href={homePage?.hero?.buttonHref ?? "#contact"}
          className="border-white text-white hover:bg-white hover:text-black"
        >
          {homePage?.hero?.buttonText ?? "Get Started"}
        </ButtonLink>
      </Hero>

      {/* ─── About Us CTA ─── */}
      <section className="bg-background py-16 px-6 lg:py-24 lg:px-8 relative overflow-hidden">
        {/* Background watermark */}
        <p
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[10rem] lg:text-[18rem] font-bold uppercase text-foreground/[0.03] select-none pointer-events-none leading-none whitespace-nowrap"
          aria-hidden="true"
        >
          ABOUT
        </p>

        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-xs uppercase tracking-widest font-medium text-accent mb-8 text-center lg:text-left">
            About Us
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-6">
                {homePage?.aboutSection?.title ??
                  "Proud to Be Your Real Estate Expert."}
              </h2>
              <p className="text-muted leading-7 mb-8">
                {homePage?.aboutSection?.description ??
                  "With years of experience and a deep understanding of the local market, we provide personalized service and expert guidance to help you achieve your real estate goals."}
              </p>
              <ButtonLink
                href={homePage?.aboutSection?.buttonHref ?? "/about"}
              >
                {homePage?.aboutSection?.buttonText ?? "Learn More"}
              </ButtonLink>
            </Reveal>

            <Reveal direction="right" delay={0.1}>
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 lg:ml-auto overflow-hidden rounded-lg">
              <Image
                src={
                  homePage?.aboutSection?.image &&
                  isSanityImage(homePage.aboutSection.image)
                    ? urlFor(homePage.aboutSection.image)
                        .width(800)
                        .height(1067)
                        .fit("crop")
                        .url()
                    : "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                }
                alt={
                  homePage?.aboutSection?.image?.alt ??
                  "Real estate agent portrait"
                }
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Work With Us ─── */}
      <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8 relative overflow-hidden">
        {/* Background watermark */}
        <p
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[10rem] lg:text-[18rem] font-bold uppercase text-foreground/[0.03] select-none pointer-events-none leading-none whitespace-nowrap"
          aria-hidden="true"
        >
          START
        </p>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight text-center mb-12">
            {homePage?.workWithUsHeading ?? "Work With Us"}
          </h2>

          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Card 1: Selling */}
            <a
              href={homePage?.ctaCard1?.buttonHref ?? "#contact"}
              className="group flex flex-col overflow-hidden dimensional-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={
                    homePage?.ctaCard1?.image &&
                    isSanityImage(homePage.ctaCard1.image)
                      ? urlFor(homePage.ctaCard1.image)
                          .width(900)
                          .height(675)
                          .fit("crop")
                          .url()
                      : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80"
                  }
                  alt={
                    homePage?.ctaCard1?.image?.alt ?? "Luxury home exterior"
                  }
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                  <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight mb-2">
                    {homePage?.ctaCard1?.title ??
                      "The best selling experience"}
                  </h3>
                  {homePage?.ctaCard1?.subtitle && (
                    <p className="text-sm text-white/80 mb-4">
                      {homePage.ctaCard1.subtitle}
                    </p>
                  )}
                  <span className="inline-flex items-center justify-center uppercase tracking-wider font-semibold border-2 border-white text-white h-12 px-8 text-sm transition-all duration-200 group-hover:bg-white group-hover:text-black">
                    {homePage?.ctaCard1?.buttonText ?? "Get Started"}
                  </span>
                </div>
              </div>
            </a>

            {/* Card 2: Buying */}
            <a
              href={homePage?.ctaCard2?.buttonHref ?? "#contact"}
              className="group flex flex-col overflow-hidden dimensional-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={
                    homePage?.ctaCard2?.image &&
                    isSanityImage(homePage.ctaCard2.image)
                      ? urlFor(homePage.ctaCard2.image)
                          .width(900)
                          .height(675)
                          .fit("crop")
                          .url()
                      : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80"
                  }
                  alt={
                    homePage?.ctaCard2?.image?.alt ?? "Luxury home interior"
                  }
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                  <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight mb-2">
                    {homePage?.ctaCard2?.title ??
                      "An unparalleled buying experience"}
                  </h3>
                  {homePage?.ctaCard2?.subtitle && (
                    <p className="text-sm text-white/80 mb-4">
                      {homePage.ctaCard2.subtitle}
                    </p>
                  )}
                  <span className="inline-flex items-center justify-center uppercase tracking-wider font-semibold border-2 border-white text-white h-12 px-8 text-sm transition-all duration-200 group-hover:bg-white group-hover:text-black">
                    {homePage?.ctaCard2?.buttonText ?? "Get Started"}
                  </span>
                </div>
              </div>
            </a>
          </StaggerChildren>
        </div>
      </section>

      {/* ─── Contact Form ─── */}
      <section
        id="contact"
        className="bg-footer-bg py-16 px-6 lg:py-24 lg:px-8"
        style={
          {
            "--background": "#030910",
            "--foreground": "#F0F3F5",
            "--surface-alt": "#172029",
            "--border": "#2A3440",
            "--muted": "#8B8E92",
            "--muted-foreground": "#6B6E72",
            "--ring": "#C4622A",
            "--accent": "#C4622A",
          } as React.CSSProperties
        }
      >
        <Reveal className="max-w-2xl lg:max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight text-footer-text mb-4">
            {homePage?.contactForm?.heading ??
              "Start Your Home Journey Today"}
          </h2>
          {(homePage?.contactForm?.subtitle) && (
            <p className="text-lg text-footer-muted leading-8 mb-8">
              {homePage.contactForm.subtitle}
            </p>
          )}
          <div className="text-left text-footer-text">
            <LeadForm source="homepage" showPhone />
          </div>
        </Reveal>
      </section>
    </>
  );
}
