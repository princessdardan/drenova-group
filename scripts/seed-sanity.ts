/**
 * Seed script for Sanity CMS — migrates dummy data from frontend into Sanity documents.
 *
 * Usage: npm run seed
 *
 * Idempotent: uses createOrReplace with deterministic _id values.
 * Images are uploaded to Sanity's asset pipeline from Unsplash URLs.
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "apggi8zn",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function uploadImageFromUrl(
  url: string,
  filename: string
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string }; alt?: string }> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());

  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: "image/jpeg",
  });

  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

function textToPortableText(text: string) {
  return text.split("\n\n").map((paragraph, i) => ({
    _type: "block" as const,
    _key: `block-${i}`,
    style: "normal" as const,
    children: [{ _type: "span" as const, _key: `span-${i}`, text: paragraph, marks: [] }],
    markDefs: [],
  }));
}

function headingBlock(text: string, key: string, style: "h2" | "h3" = "h2") {
  return {
    _type: "block" as const,
    _key: key,
    style,
    children: [{ _type: "span" as const, _key: `${key}-span`, text, marks: [] }],
    markDefs: [],
  };
}

function paragraphBlock(text: string, key: string) {
  return {
    _type: "block" as const,
    _key: key,
    style: "normal" as const,
    children: [{ _type: "span" as const, _key: `${key}-span`, text, marks: [] }],
    markDefs: [],
  };
}

// ---------------------------------------------------------------------------
// Data (mirrors frontend/src/lib/dummy-data.ts)
// ---------------------------------------------------------------------------

const listings = [
  { id: "1", slug: "123-maple-drive-springfield-il", price: 425000, address: "123 Maple Drive", city: "Springfield", state: "IL", zip: "62701", beds: 4, baths: 3, sqft: 2850, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", status: "Active", propertyType: "Single Family" },
  { id: "2", slug: "456-oak-avenue-naperville-il", price: 675000, address: "456 Oak Avenue", city: "Naperville", state: "IL", zip: "60540", beds: 5, baths: 4, sqft: 3600, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", status: "Active", propertyType: "Single Family" },
  { id: "3", slug: "789-elm-street-chicago-il", price: 350000, address: "789 Elm Street", city: "Chicago", state: "IL", zip: "60614", beds: 2, baths: 2, sqft: 1200, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", status: "Active", propertyType: "Condo" },
  { id: "4", slug: "321-birch-lane-evanston-il", price: 520000, address: "321 Birch Lane", city: "Evanston", state: "IL", zip: "60201", beds: 3, baths: 2, sqft: 2100, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80", status: "Active", propertyType: "Townhouse" },
  { id: "5", slug: "555-cedar-court-scottsdale-az", price: 890000, address: "555 Cedar Court", city: "Scottsdale", state: "AZ", zip: "85251", beds: 5, baths: 5, sqft: 4200, image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80", status: "Active", propertyType: "Single Family" },
  { id: "6", slug: "102-desert-ridge-phoenix-az", price: 465000, address: "102 Desert Ridge", city: "Phoenix", state: "AZ", zip: "85054", beds: 3, baths: 2, sqft: 1950, image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80", status: "Active", propertyType: "Single Family" },
  { id: "7", slug: "88-lakeshore-drive-milwaukee-wi", price: 315000, address: "88 Lakeshore Drive", city: "Milwaukee", state: "WI", zip: "53202", beds: 2, baths: 1, sqft: 1100, image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80", status: "Active", propertyType: "Condo" },
  { id: "8", slug: "240-prairie-path-madison-wi", price: 398000, address: "240 Prairie Path", city: "Madison", state: "WI", zip: "53703", beds: 3, baths: 2, sqft: 1800, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80", status: "Pending", propertyType: "Single Family" },
  { id: "9", slug: "17-summit-place-indianapolis-in", price: 285000, address: "17 Summit Place", city: "Indianapolis", state: "IN", zip: "46204", beds: 3, baths: 2, sqft: 1650, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80", status: "Active", propertyType: "Single Family" },
  { id: "10", slug: "400-river-road-carmel-in", price: 575000, address: "400 River Road", city: "Carmel", state: "IN", zip: "46032", beds: 4, baths: 3, sqft: 3100, image: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80", status: "Active", propertyType: "Single Family" },
  { id: "11", slug: "62-harbor-view-grand-rapids-mi", price: 340000, address: "62 Harbor View", city: "Grand Rapids", state: "MI", zip: "49503", beds: 3, baths: 2, sqft: 1750, image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80", status: "Sold", propertyType: "Townhouse" },
  { id: "12", slug: "905-michigan-avenue-ann-arbor-mi", price: 490000, address: "905 Michigan Avenue", city: "Ann Arbor", state: "MI", zip: "48104", beds: 4, baths: 3, sqft: 2500, image: "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800&q=80", status: "Active", propertyType: "Single Family" },
];

const teamMembers = [
  { slug: "semir-drenova", name: "Semir Drenova", role: "Founder & Principal Broker", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", bio: "With over 15 years of experience in residential and commercial real estate, Semir founded Drenova Group with a vision to bring a modern, client-first approach to the Midwest market. His expertise spans luxury homes, investment properties, and new construction across multiple states. Semir is known for his market knowledge, negotiation skills, and dedication to achieving the best outcomes for every client.", phone: "(555) 100-0001", email: "semir@drenovagroup.com" },
  { slug: "elena-vasquez", name: "Elena Vasquez", role: "Senior Sales Agent", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", bio: "Elena brings a decade of experience and a passion for helping families find their perfect home. Specializing in the greater Chicago area and suburban markets, she has built a reputation for her attention to detail and commitment to client satisfaction. Elena consistently ranks among the top agents in her region.", phone: "(555) 100-0002", email: "elena@drenovagroup.com" },
  { slug: "marcus-chen", name: "Marcus Chen", role: "Buyer Specialist", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80", bio: "Marcus is dedicated to making the home-buying process seamless and stress-free. With deep knowledge of market trends and financing options, he guides first-time buyers and seasoned investors alike through every step of the transaction. His clients appreciate his patience, transparency, and data-driven approach.", phone: "(555) 100-0003", email: "marcus@drenovagroup.com" },
  { slug: "sarah-mitchell", name: "Sarah Mitchell", role: "Listing Specialist", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80", bio: "Sarah specializes in helping homeowners maximize the value of their properties. Her marketing expertise, staging recommendations, and pricing strategies consistently deliver above-asking results. With a background in interior design, Sarah brings a unique eye for presentation that sets her listings apart.", phone: "(555) 100-0004", email: "sarah@drenovagroup.com" },
  { slug: "david-okafor", name: "David Okafor", role: "Commercial & Investment Advisor", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80", bio: "David brings a strategic mindset to every real estate transaction. Specializing in commercial properties and investment portfolios, he helps clients build wealth through smart acquisitions and data-backed market analysis. His background in finance gives him a unique perspective on property valuation and ROI optimization.", phone: "(555) 100-0005", email: "david@drenovagroup.com" },
];

const testimonials = [
  { quote: "Drenova Group made selling our home an incredibly smooth experience. From staging advice to closing, every detail was handled with care and professionalism.", name: "Jennifer & Mark Thompson", detail: "Sold in Naperville, IL" },
  { quote: "As first-time buyers, we were nervous about the process. Marcus walked us through every step and found us the perfect home under budget. We couldn't be more grateful.", name: "Priya & Raj Patel", detail: "Purchased in Evanston, IL" },
  { quote: "The level of market knowledge and negotiation skill that Semir brought to our investment property purchase was exceptional. We've already seen significant appreciation.", name: "Robert Nguyen", detail: "Investment Property, Phoenix, AZ" },
  { quote: "Sarah's listing strategy was brilliant — professional photography, targeted marketing, and expert staging. We received multiple offers within the first weekend.", name: "Lisa & Tom Brennan", detail: "Sold in Chicago, IL" },
  { quote: "Working with Drenova Group felt like having a trusted partner, not just an agent. Their modern approach and genuine care for clients set them apart from everyone else.", name: "Angela Davis", detail: "Purchased in Scottsdale, AZ" },
];

const companyStats = [
  { label: "Years of Experience", value: "15+" },
  { label: "Homes Sold", value: "500+" },
  { label: "Expert Agents", value: "12" },
  { label: "States Covered", value: "5" },
];

const valuePropositions = [
  { title: "Multi-State Coverage", description: "Operating across Illinois, Arizona, Wisconsin, Indiana, and Michigan — we bring local expertise to every market we serve." },
  { title: "Modern Approach", description: "From data-driven pricing to digital marketing strategies, we leverage the latest tools and technology to deliver exceptional results." },
  { title: "Client-First Philosophy", description: "Every decision we make is guided by what's best for our clients. Your goals are our goals, and your success is our measure of performance." },
];

const buyerFaqs = [
  { question: "How do I get pre-approved for a mortgage?", answer: "We recommend connecting with a mortgage lender early in the process. Pre-approval involves submitting financial documents (income verification, credit check, assets) to determine your budget. We work with trusted lending partners and can provide referrals to get you started." },
  { question: "How long does the home buying process take?", answer: "On average, the buying process takes 30–60 days from accepted offer to closing. The timeline depends on factors like financing, inspections, and any negotiated repairs. We keep you informed at every step and work to resolve issues quickly." },
  { question: "What costs should I expect beyond the purchase price?", answer: "Buyers should budget for closing costs (typically 2–5% of the purchase price), which include lender fees, title insurance, appraisal, and prepaid taxes/insurance. Your agent will provide a detailed estimate early in the process so there are no surprises." },
  { question: "Do I need a buyer's agent?", answer: "Absolutely. A buyer's agent represents your interests exclusively, providing market expertise, negotiation support, and guidance through the entire transaction. Our services are typically compensated by the seller, so there's no direct cost to you." },
  { question: "What if I find a home I love but it's out of my budget?", answer: "We'll help you evaluate all options — from negotiating a lower price to exploring different financing structures. Sometimes sellers are flexible on terms even if the listing price seems firm. Our market knowledge helps identify opportunities others might miss." },
];

const sellerFaqs = [
  { question: "How do you determine my home's value?", answer: "We perform a Comparative Market Analysis (CMA) that examines recent sales of similar properties, current market conditions, your home's unique features, and neighborhood trends. This data-driven approach ensures your listing price is competitive and maximizes your return." },
  { question: "How long will it take to sell my home?", answer: "Market conditions, pricing, location, and presentation all influence timing. In a balanced market, well-priced homes typically sell within 30–90 days. Our marketing strategies and staging expertise are designed to reduce time on market while achieving top-dollar results." },
  { question: "What should I do to prepare my home for sale?", answer: "We provide a customized preparation checklist for every seller. Common recommendations include decluttering, minor repairs, fresh paint in neutral tones, and professional cleaning. Our staging consultation helps highlight your home's best features for maximum buyer appeal." },
  { question: "What are the costs of selling a home?", answer: "Typical selling costs include agent commissions, closing costs, title fees, and any agreed-upon buyer credits or repairs. We provide a detailed net proceeds estimate upfront so you know exactly what to expect. Our transparent approach means no hidden fees." },
  { question: "Should I make renovations before selling?", answer: "Not always — some renovations provide excellent ROI while others don't recoup their cost. We advise on which improvements will deliver the best return based on your specific market. Often, simple updates like fresh paint and landscaping have the biggest impact." },
];

const coverageAreas = [
  { state: "Illinois", cities: ["Chicago", "Naperville", "Evanston", "Springfield"] },
  { state: "Arizona", cities: ["Phoenix", "Scottsdale", "Tempe", "Mesa"] },
  { state: "Wisconsin", cities: ["Milwaukee", "Madison", "Green Bay"] },
  { state: "Indiana", cities: ["Indianapolis", "Carmel", "Fishers"] },
  { state: "Michigan", cities: ["Grand Rapids", "Ann Arbor", "Detroit"] },
];

const companyValues = [
  { title: "Integrity", description: "We operate with complete transparency. Every recommendation we make is grounded in honest market analysis and our clients' best interests." },
  { title: "Excellence", description: "From marketing materials to negotiation strategy, we hold ourselves to the highest standard in every aspect of the transaction." },
  { title: "Innovation", description: "We embrace modern technology and data-driven strategies to give our clients a competitive edge in today's real estate market." },
  { title: "Community", description: "We're invested in the neighborhoods we serve. Building lasting relationships with our clients and communities is at the heart of everything we do." },
];

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function seedListings() {
  console.log("Seeding listings...");
  for (const listing of listings) {
    const imageAsset = await uploadImageFromUrl(listing.image, `listing-${listing.id}.jpg`);
    imageAsset.alt = `${listing.address}, ${listing.city}, ${listing.state}`;

    await client.createOrReplace({
      _id: `listing-${listing.id}`,
      _type: "listing",
      title: listing.address,
      slug: { _type: "slug", current: listing.slug },
      price: listing.price,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      zip: listing.zip,
      beds: listing.beds,
      baths: listing.baths,
      sqft: listing.sqft,
      image: imageAsset,
      status: listing.status,
      propertyType: listing.propertyType,
    });
    console.log(`  listing-${listing.id}: ${listing.address}`);
  }
}

async function seedTeamMembers() {
  console.log("Seeding team members...");
  for (const member of teamMembers) {
    const imageAsset = await uploadImageFromUrl(member.image, `team-${member.slug}.jpg`);
    imageAsset.alt = member.name;

    await client.createOrReplace({
      _id: `team-${member.slug}`,
      _type: "teamMember",
      name: member.name,
      slug: { _type: "slug", current: member.slug },
      role: member.role,
      image: imageAsset,
      bio: textToPortableText(member.bio),
      phone: member.phone,
      email: member.email,
    });
    console.log(`  team-${member.slug}: ${member.name}`);
  }
}

async function seedTestimonials() {
  console.log("Seeding testimonials...");
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    await client.createOrReplace({
      _id: `testimonial-${i + 1}`,
      _type: "testimonial",
      quote: t.quote,
      name: t.name,
      detail: t.detail,
    });
    console.log(`  testimonial-${i + 1}: ${t.name}`);
  }
}

async function seedFaqs() {
  console.log("Seeding FAQs...");
  for (let i = 0; i < buyerFaqs.length; i++) {
    const faq = buyerFaqs[i];
    await client.createOrReplace({
      _id: `faq-buyer-${i + 1}`,
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      category: "buyer",
      order: i + 1,
    });
    console.log(`  faq-buyer-${i + 1}: ${faq.question.slice(0, 40)}...`);
  }
  for (let i = 0; i < sellerFaqs.length; i++) {
    const faq = sellerFaqs[i];
    await client.createOrReplace({
      _id: `faq-seller-${i + 1}`,
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      category: "seller",
      order: i + 1,
    });
    console.log(`  faq-seller-${i + 1}: ${faq.question.slice(0, 40)}...`);
  }
}

async function seedCoverageAreas() {
  console.log("Seeding coverage areas...");
  for (let i = 0; i < coverageAreas.length; i++) {
    const area = coverageAreas[i];
    await client.createOrReplace({
      _id: `coverage-area-${i + 1}`,
      _type: "coverageArea",
      state: area.state,
      cities: area.cities,
      order: i + 1,
    });
    console.log(`  coverage-area-${i + 1}: ${area.state}`);
  }
}

async function seedCompanyStats() {
  console.log("Seeding company stats...");
  for (let i = 0; i < companyStats.length; i++) {
    const stat = companyStats[i];
    await client.createOrReplace({
      _id: `company-stat-${i + 1}`,
      _type: "companyStat",
      label: stat.label,
      value: stat.value,
      order: i + 1,
    });
    console.log(`  company-stat-${i + 1}: ${stat.label}`);
  }
}

async function seedCompanyValues() {
  console.log("Seeding company values...");
  for (let i = 0; i < companyValues.length; i++) {
    const val = companyValues[i];
    await client.createOrReplace({
      _id: `company-value-${i + 1}`,
      _type: "companyValue",
      title: val.title,
      description: val.description,
      order: i + 1,
    });
    console.log(`  company-value-${i + 1}: ${val.title}`);
  }
}

async function seedValuePropositions() {
  console.log("Seeding value propositions...");
  for (let i = 0; i < valuePropositions.length; i++) {
    const vp = valuePropositions[i];
    await client.createOrReplace({
      _id: `value-proposition-${i + 1}`,
      _type: "valueProposition",
      title: vp.title,
      description: vp.description,
      order: i + 1,
    });
    console.log(`  value-proposition-${i + 1}: ${vp.title}`);
  }
}

// ---------------------------------------------------------------------------
// Singleton page data
// ---------------------------------------------------------------------------

const siteSettingsData = {
  companyName: "Drenova Group",
  tagline: "Modern brokerage. Local expertise. Multi-state coverage.",
  phone: "(555) 100-0000",
  email: "info@drenovagroup.com",
  address: "123 Main Street, Suite 200\nChicago, IL 60601",
  officeHours: "Monday – Friday: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM\nSunday: By Appointment",
  navigationLinks: [
    { _key: "nav-buy", label: "Buy", href: "/buy", showInHeader: true, showInFooter: true },
    { _key: "nav-sell", label: "Sell", href: "/sell", showInHeader: true, showInFooter: true },
    { _key: "nav-listings", label: "Listings", href: "/listings", showInHeader: true, showInFooter: true },
    { _key: "nav-about", label: "About", href: "/about", showInHeader: false, showInFooter: true },
    { _key: "nav-team", label: "Team", href: "/team", showInHeader: false, showInFooter: true },
    { _key: "nav-contact", label: "Contact", href: "/contact", showInHeader: false, showInFooter: true },
  ],
  socialLinks: {
    facebook: "https://facebook.com/drenovagroup",
    instagram: "https://instagram.com/drenovagroup",
    linkedin: "https://linkedin.com/company/drenovagroup",
    twitter: "https://x.com/drenovagroup",
  },
};

const homePageData = {
  hero: {
    _type: "heroSettings" as const,
    overline: "Drenova Group Real Estate",
    title: "Your Home's Story Starts Here",
    subtitle:
      "Modern brokerage. Local expertise. Multi-state coverage across Illinois, Arizona, Wisconsin, Indiana, and Michigan.",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80",
    imageAlt: "Modern luxury home with warm lighting",
  },
  featuredListingsHeading: {
    _type: "sectionHeading" as const,
    overline: "Featured Properties",
    title: "Explore Our Listings",
    description: "Hand-picked properties across our coverage areas, ready for you to make them home.",
  },
  aboutSectionOverline: "About Us",
  aboutSectionTitle: "An Elevated Approach to Real Estate",
  aboutSectionContent:
    "At Drenova Group, we combine deep local knowledge with modern tools and a client-first philosophy. Whether you're buying your first home or selling a luxury property, our experienced team delivers personalized service and exceptional results.",
  aboutSectionImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  aboutSectionImageAlt: "Warm interior of a modern home",
  valuePropsHeading: {
    _type: "sectionHeading" as const,
    overline: "Why Drenova Group",
    title: "What Sets Us Apart",
  },
  cta: {
    _type: "ctaSettings" as const,
    title: "Ready to Get Started?",
    subtitle: "Whether you're buying or selling, our team is here to guide you every step of the way.",
  },
  featuredListingIds: [
    "listing-1",
    "listing-2",
    "listing-5",
    "listing-6",
    "listing-9",
    "listing-10",
  ],
};

const aboutPageData = {
  hero: {
    _type: "heroSettings" as const,
    overline: "Our Story",
    title: "About Drenova Group",
    subtitle:
      "A modern brokerage built on integrity, innovation, and an unwavering commitment to our clients.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80",
    imageAlt: "Drenova Group office and team",
  },
  storyOverline: "Founded 2011",
  storyTitle: "Built on Relationships, Driven by Results",
  storyContent: [
    {
      _type: "block" as const,
      _key: "story-1",
      style: "normal" as const,
      children: [
        {
          _type: "span" as const,
          _key: "story-1-span",
          text: "Drenova Group was founded with a simple belief: that real estate should be personal, transparent, and driven by what's best for the client. What started as a single agent with a passion for helping families find their homes has grown into a multi-state brokerage serving hundreds of clients every year.",
          marks: [],
        },
      ],
      markDefs: [],
    },
    {
      _type: "block" as const,
      _key: "story-2",
      style: "normal" as const,
      children: [
        {
          _type: "span" as const,
          _key: "story-2-span",
          text: "Today, our team of experienced agents operates across five states, bringing local expertise and a modern approach to every transaction. We combine data-driven market analysis with genuine care for our clients' goals — because buying or selling a home is more than a transaction, it's a life milestone.",
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
  storyImageUrl:
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
  storyImageAlt: "Modern home interior",
  valuesHeading: {
    _type: "sectionHeading" as const,
    overline: "Our Values",
    title: "What We Stand For",
    description: "The principles that guide every interaction, negotiation, and decision we make.",
  },
  coverageHeading: {
    _type: "sectionHeading" as const,
    overline: "Where We Serve",
    title: "Multi-State Coverage",
    description: "Local expertise across five states and growing.",
  },
  cta: {
    _type: "ctaSettings" as const,
    title: "Meet Our Team",
    subtitle: "The people behind Drenova Group are what make us different.",
  },
};

const buyPageData = {
  hero: {
    _type: "heroSettings" as const,
    overline: "For Buyers",
    title: "Find Your Next Home",
    subtitle:
      "Let our experienced agents guide you through every step — from search to closing.",
    imageUrl:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80",
    imageAlt: "Beautiful home exterior with warm lighting",
  },
  benefitsHeading: {
    _type: "sectionHeading" as const,
    overline: "Why Choose Us",
    title: "Buy With Confidence",
  },
  benefits: [
    { _key: "buy-benefit-1", title: "Expert Local Knowledge", description: "Our agents live and work in the communities they serve. You'll get insider knowledge on neighborhoods, schools, market trends, and hidden opportunities." },
    { _key: "buy-benefit-2", title: "Data-Driven Search", description: "We leverage real-time MLS data and market analytics to identify properties that match your criteria and help you make informed decisions." },
    { _key: "buy-benefit-3", title: "Full-Service Support", description: "From mortgage pre-approval guidance to closing coordination, we manage every detail so you can focus on finding the right home." },
  ],
  processHeading: {
    _type: "sectionHeading" as const,
    overline: "The Process",
    title: "How Buying Works",
    description: "A clear, transparent process from start to finish.",
  },
  processSteps: [
    { _type: "processStep" as const, _key: "buy-step-1", stepNumber: "01", title: "Search & Discover", description: "Browse our curated listings, set your criteria, and explore neighborhoods that match your lifestyle and budget." },
    { _type: "processStep" as const, _key: "buy-step-2", stepNumber: "02", title: "Tour & Evaluate", description: "Schedule private showings with your dedicated agent. We'll provide detailed market analysis for every property you're considering." },
    { _type: "processStep" as const, _key: "buy-step-3", stepNumber: "03", title: "Offer & Negotiate", description: "We craft competitive offers backed by real-time market data. Our negotiation expertise ensures you get the best possible terms." },
    { _type: "processStep" as const, _key: "buy-step-4", stepNumber: "04", title: "Close & Celebrate", description: "From inspection to closing, we coordinate every detail. Our team ensures a smooth transaction so you can focus on moving in." },
  ],
  coverageHeading: {
    _type: "sectionHeading" as const,
    overline: "Where We Serve",
    title: "Explore Our Markets",
    description: "We bring local expertise to every community across our five-state coverage area.",
  },
  faqHeading: {
    _type: "sectionHeading" as const,
    overline: "FAQs",
    title: "Common Buyer Questions",
  },
  cta: {
    _type: "ctaSettings" as const,
    title: "Start Your Search Today",
    subtitle: "Browse our listings or connect with an agent to begin your home buying journey.",
  },
};

const sellPageData = {
  hero: {
    _type: "heroSettings" as const,
    overline: "For Sellers",
    title: "Sell with Confidence",
    subtitle:
      "Expert pricing, professional marketing, and skilled negotiation — we handle every detail.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    imageAlt: "Luxury home exterior at golden hour",
  },
  benefitsHeading: {
    _type: "sectionHeading" as const,
    overline: "Why Choose Us",
    title: "The Drenova Difference",
  },
  benefits: [
    { _key: "sell-benefit-1", title: "Strategic Pricing", description: "Our data-driven Comparative Market Analysis ensures your home is priced to attract buyers while maximizing your return." },
    { _key: "sell-benefit-2", title: "Professional Marketing", description: "From professional photography and staging to targeted digital campaigns, we showcase your home to the right audience." },
    { _key: "sell-benefit-3", title: "Expert Negotiation", description: "Our agents are skilled negotiators who advocate fiercely for your interests, ensuring the best possible terms on every offer." },
  ],
  processHeading: {
    _type: "sectionHeading" as const,
    overline: "The Process",
    title: "How Selling Works",
    description: "A proven, step-by-step approach to getting top dollar for your home.",
  },
  processSteps: [
    { _type: "processStep" as const, _key: "sell-step-1", stepNumber: "01", title: "Prepare & Price", description: "We analyze comparable sales, assess your home's unique features, and develop a pricing strategy designed to maximize your return." },
    { _type: "processStep" as const, _key: "sell-step-2", stepNumber: "02", title: "Stage & Style", description: "Our staging recommendations and professional photography showcase your home at its absolute best — first impressions matter." },
    { _type: "processStep" as const, _key: "sell-step-3", stepNumber: "03", title: "List & Market", description: "Your listing reaches thousands of qualified buyers through MLS syndication, targeted digital advertising, and our professional network." },
    { _type: "processStep" as const, _key: "sell-step-4", stepNumber: "04", title: "Negotiate & Accept", description: "We evaluate every offer with you, negotiate favorable terms, and guide you through counteroffers with confidence and clarity." },
    { _type: "processStep" as const, _key: "sell-step-5", stepNumber: "05", title: "Close & Move On", description: "We manage inspections, appraisals, and paperwork through closing. Our goal is a seamless handoff so you can move forward with ease." },
  ],
  valuation: {
    _type: "valuationSection" as const,
    overline: "Free Home Valuation",
    title: "What's Your Home Worth?",
    description: "Get a complimentary market analysis from our team. We'll evaluate recent comparable sales, current market conditions, and your home's unique features to provide an accurate valuation.",
    ctaText: "Request Valuation",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    imageAlt: "Beautiful home exterior",
  },
  storiesHeading: {
    _type: "sectionHeading" as const,
    overline: "Success Stories",
    title: "Results That Speak",
  },
  faqHeading: {
    _type: "sectionHeading" as const,
    overline: "FAQs",
    title: "Common Seller Questions",
  },
  cta: {
    _type: "ctaSettings" as const,
    title: "Ready to Sell?",
    subtitle: "Connect with an agent today and take the first step toward a successful sale.",
  },
};

// ---------------------------------------------------------------------------
// Singleton seed functions
// ---------------------------------------------------------------------------

async function seedSiteSettings() {
  console.log("Seeding siteSettings...");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: siteSettingsData.companyName,
    tagline: siteSettingsData.tagline,
    phone: siteSettingsData.phone,
    email: siteSettingsData.email,
    address: siteSettingsData.address,
    officeHours: siteSettingsData.officeHours,
    navigationLinks: siteSettingsData.navigationLinks,
    socialLinks: siteSettingsData.socialLinks,
  });
  console.log("  siteSettings");
}

async function seedHomePage() {
  console.log("Seeding homePage...");
  const heroImage = await uploadImageFromUrl(
    homePageData.hero.imageUrl,
    "home-hero.jpg"
  );
  heroImage.alt = homePageData.hero.imageAlt;

  const aboutImage = await uploadImageFromUrl(
    homePageData.aboutSectionImageUrl,
    "home-about.jpg"
  );
  aboutImage.alt = homePageData.aboutSectionImageAlt;

  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    hero: {
      _type: "heroSettings",
      image: heroImage,
      overline: homePageData.hero.overline,
      title: homePageData.hero.title,
      subtitle: homePageData.hero.subtitle,
    },
    featuredListings: homePageData.featuredListingIds.map((id) => ({
      _type: "reference",
      _ref: id,
      _key: id,
    })),
    featuredListingsHeading: homePageData.featuredListingsHeading,
    aboutSectionOverline: homePageData.aboutSectionOverline,
    aboutSectionTitle: homePageData.aboutSectionTitle,
    aboutSectionContent: homePageData.aboutSectionContent,
    aboutSectionImage: aboutImage,
    valuePropsHeading: homePageData.valuePropsHeading,
    cta: homePageData.cta,
  });
  console.log("  homePage");
}

async function seedAboutPage() {
  console.log("Seeding aboutPage...");
  const heroImage = await uploadImageFromUrl(
    aboutPageData.hero.imageUrl,
    "about-hero.jpg"
  );
  heroImage.alt = aboutPageData.hero.imageAlt;

  const storyImage = await uploadImageFromUrl(
    aboutPageData.storyImageUrl,
    "about-story.jpg"
  );
  storyImage.alt = aboutPageData.storyImageAlt;

  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    hero: {
      _type: "heroSettings",
      image: heroImage,
      overline: aboutPageData.hero.overline,
      title: aboutPageData.hero.title,
      subtitle: aboutPageData.hero.subtitle,
    },
    storyContent: aboutPageData.storyContent,
    storyOverline: aboutPageData.storyOverline,
    storyTitle: aboutPageData.storyTitle,
    storyImage: storyImage,
    valuesHeading: aboutPageData.valuesHeading,
    coverageHeading: aboutPageData.coverageHeading,
    cta: aboutPageData.cta,
  });
  console.log("  aboutPage");
}

async function seedBuyPage() {
  console.log("Seeding buyPage...");
  const heroImage = await uploadImageFromUrl(
    buyPageData.hero.imageUrl,
    "buy-hero.jpg"
  );
  heroImage.alt = buyPageData.hero.imageAlt;

  await client.createOrReplace({
    _id: "buyPage",
    _type: "buyPage",
    hero: {
      _type: "heroSettings",
      image: heroImage,
      overline: buyPageData.hero.overline,
      title: buyPageData.hero.title,
      subtitle: buyPageData.hero.subtitle,
    },
    benefits: buyPageData.benefits,
    benefitsHeading: buyPageData.benefitsHeading,
    processSteps: buyPageData.processSteps,
    processHeading: buyPageData.processHeading,
    coverageHeading: buyPageData.coverageHeading,
    faqHeading: buyPageData.faqHeading,
    cta: buyPageData.cta,
  });
  console.log("  buyPage");
}

async function seedSellPage() {
  console.log("Seeding sellPage...");
  const heroImage = await uploadImageFromUrl(
    sellPageData.hero.imageUrl,
    "sell-hero.jpg"
  );
  heroImage.alt = sellPageData.hero.imageAlt;

  const valuationImage = await uploadImageFromUrl(
    sellPageData.valuation.imageUrl,
    "sell-valuation.jpg"
  );
  valuationImage.alt = sellPageData.valuation.imageAlt;

  await client.createOrReplace({
    _id: "sellPage",
    _type: "sellPage",
    hero: {
      _type: "heroSettings",
      image: heroImage,
      overline: sellPageData.hero.overline,
      title: sellPageData.hero.title,
      subtitle: sellPageData.hero.subtitle,
    },
    benefits: sellPageData.benefits,
    benefitsHeading: sellPageData.benefitsHeading,
    processSteps: sellPageData.processSteps,
    processHeading: sellPageData.processHeading,
    valuation: {
      _type: "valuationSection",
      overline: sellPageData.valuation.overline,
      title: sellPageData.valuation.title,
      description: sellPageData.valuation.description,
      ctaText: sellPageData.valuation.ctaText,
      image: valuationImage,
    },
    storiesHeading: sellPageData.storiesHeading,
    faqHeading: sellPageData.faqHeading,
    cta: sellPageData.cta,
  });
  console.log("  sellPage");
}

async function seedContactPage() {
  console.log("Seeding contactPage...");
  const heroImage = await uploadImageFromUrl(
    "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=1600&q=80",
    "contact-hero.jpg"
  );
  heroImage.alt = "Modern office interior";

  await client.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    hero: {
      _type: "heroSettings",
      image: heroImage,
      title: "Get in Touch",
      subtitle: "Have a question or ready to get started? We'd love to hear from you.",
    },
    quickLinks: [
      {
        _key: "ql-buy",
        overline: "For Buyers",
        title: "Looking to Buy?",
        description: "Explore our buying guide and browse available listings.",
        href: "/buy",
      },
      {
        _key: "ql-sell",
        overline: "For Sellers",
        title: "Ready to Sell?",
        description: "Learn about our selling process and request a free home valuation.",
        href: "/sell",
      },
    ],
  });
  console.log("  contactPage");
}

async function seedTeamPage() {
  console.log("Seeding teamPage...");
  const heroImage = await uploadImageFromUrl(
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1600&q=80",
    "team-hero.jpg"
  );
  heroImage.alt = "Drenova Group team";

  await client.createOrReplace({
    _id: "teamPage",
    _type: "teamPage",
    hero: {
      _type: "heroSettings",
      image: heroImage,
      title: "Our Team",
      subtitle: "Experienced professionals dedicated to helping you achieve your real estate goals.",
    },
    cta: {
      _type: "ctaSettings",
      title: "Get in Touch",
      subtitle: "Have a question or ready to start? We'd love to hear from you.",
    },
  });
  console.log("  teamPage");
}

async function seedListingsPage() {
  console.log("Seeding listingsPage...");
  await client.createOrReplace({
    _id: "listingsPage",
    _type: "listingsPage",
    overline: "Properties",
    title: "All Listings",
  });
  console.log("  listingsPage");
}

async function seedLegalPages() {
  console.log("Seeding legal pages...");

  const privacyBody = [
    headingBlock("1. Information We Collect", "priv-h-1"),
    paragraphBlock("We collect information you provide directly to us, such as when you fill out a contact form, request a property valuation, or communicate with one of our agents. This may include your name, email address, phone number, and details about your real estate needs.", "priv-p-1"),
    headingBlock("2. How We Use Your Information", "priv-h-2"),
    paragraphBlock("We use the information we collect to respond to your inquiries, provide real estate services, send you relevant property updates, improve our website and services, and comply with legal obligations. We do not sell your personal information to third parties.", "priv-p-2"),
    headingBlock("3. Information Sharing", "priv-h-3"),
    paragraphBlock("We may share your information with our agents and team members to provide you with real estate services, with service providers who assist in operating our website and business, and when required by law or to protect our rights.", "priv-p-3"),
    headingBlock("4. Cookies and Tracking", "priv-h-4"),
    paragraphBlock("Our website uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand usage patterns. You can control cookie preferences through your browser settings.", "priv-p-4"),
    headingBlock("5. Data Security", "priv-h-5"),
    paragraphBlock("We implement reasonable security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of electronic transmission or storage is completely secure.", "priv-p-5"),
    headingBlock("6. Your Rights", "priv-h-6"),
    paragraphBlock("You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us at info@drenovagroup.com.", "priv-p-6"),
    headingBlock("7. Changes to This Policy", "priv-h-7"),
    paragraphBlock("We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on our website with a revised effective date.", "priv-p-7"),
    headingBlock("8. Contact Us", "priv-h-8"),
    paragraphBlock("If you have questions about this privacy policy or our data practices, please contact us at info@drenovagroup.com or call (555) 123-4567.", "priv-p-8"),
  ];

  await client.createOrReplace({
    _id: "legal-privacy",
    _type: "legalPage",
    title: "Privacy Policy",
    slug: { _type: "slug", current: "privacy" },
    lastUpdated: "2026-02-19",
    body: privacyBody,
  });
  console.log("  legal-privacy: Privacy Policy");

  const termsBody = [
    headingBlock("1. Acceptance of Terms", "terms-h-1"),
    paragraphBlock("By accessing and using the Drenova Group website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.", "terms-p-1"),
    headingBlock("2. Use of Website", "terms-h-2"),
    paragraphBlock("This website is provided for informational purposes and to facilitate real estate services. You agree to use the website only for lawful purposes and in accordance with these terms. You may not use the website in any way that could damage, disable, or impair our services.", "terms-p-2"),
    headingBlock("3. Property Listings", "terms-h-3"),
    paragraphBlock("Property listings displayed on this website are provided for informational purposes only. While we strive to ensure accuracy, listing data is sourced from MLS systems and may be subject to change without notice. Drenova Group does not guarantee the accuracy, completeness, or availability of any listing information.", "terms-p-3"),
    headingBlock("4. Intellectual Property", "terms-h-4"),
    paragraphBlock("All content on this website, including text, graphics, logos, images, and software, is the property of Drenova Group or its content suppliers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written consent.", "terms-p-4"),
    headingBlock("5. Limitation of Liability", "terms-h-5"),
    paragraphBlock("Drenova Group shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of this website or any services provided. This includes, but is not limited to, damages resulting from errors, omissions, or interruptions in service.", "terms-p-5"),
    headingBlock("6. Third-Party Links", "terms-h-6"),
    paragraphBlock("Our website may contain links to third-party websites. These links are provided for your convenience and do not signify our endorsement of such websites. We are not responsible for the content or privacy practices of third-party sites.", "terms-p-6"),
    headingBlock("7. Modifications", "terms-h-7"),
    paragraphBlock("We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of the modified terms.", "terms-p-7"),
    headingBlock("8. Governing Law", "terms-h-8"),
    paragraphBlock("These terms shall be governed by and construed in accordance with the laws of the State of Illinois, without regard to its conflict of law provisions.", "terms-p-8"),
    headingBlock("9. Contact", "terms-h-9"),
    paragraphBlock("For questions about these terms, please contact us at info@drenovagroup.com or call (555) 123-4567.", "terms-p-9"),
  ];

  await client.createOrReplace({
    _id: "legal-terms",
    _type: "legalPage",
    title: "Terms of Service",
    slug: { _type: "slug", current: "terms" },
    lastUpdated: "2026-02-19",
    body: termsBody,
  });
  console.log("  legal-terms: Terms of Service");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("SANITY_API_WRITE_TOKEN environment variable is required.");
    console.error("   Create a write token at: https://www.sanity.io/manage/project/apggi8zn/api#tokens");
    process.exit(1);
  }

  console.log("Starting Sanity seed...\n");

  await seedListings();
  await seedTeamMembers();
  await seedTestimonials();
  await seedFaqs();
  await seedCoverageAreas();
  await seedCompanyStats();
  await seedCompanyValues();
  await seedValuePropositions();
  await seedSiteSettings();
  await seedHomePage();
  await seedAboutPage();
  await seedBuyPage();
  await seedSellPage();
  await seedContactPage();
  await seedTeamPage();
  await seedListingsPage();
  await seedLegalPages();

  console.log("\nSeed complete!");
  console.log("   Documents: 12 listings, 5 team members, 5 testimonials, 10 FAQs, 5 coverage areas, 4 stats, 4 values, 3 value propositions, 2 legal pages");
  console.log("   Singletons: siteSettings, homePage, aboutPage, buyPage, sellPage, contactPage, teamPage, listingsPage");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
