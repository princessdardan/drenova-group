import type { Listing } from "@/types/listing";
import type { TeamMember } from "@/types/team";
import type { Testimonial } from "@/types/testimonial";

export const listings: Listing[] = [
  {
    id: "1",
    slug: "123-maple-drive-springfield-il",
    price: 425000,
    address: "123 Maple Drive",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    beds: 4,
    baths: 3,
    sqft: 2850,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    status: "Active",
    propertyType: "Single Family",
  },
  {
    id: "2",
    slug: "456-oak-avenue-naperville-il",
    price: 675000,
    address: "456 Oak Avenue",
    city: "Naperville",
    state: "IL",
    zip: "60540",
    beds: 5,
    baths: 4,
    sqft: 3600,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    status: "Active",
    propertyType: "Single Family",
  },
  {
    id: "3",
    slug: "789-elm-street-chicago-il",
    price: 350000,
    address: "789 Elm Street",
    city: "Chicago",
    state: "IL",
    zip: "60614",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    status: "Active",
    propertyType: "Condo",
  },
  {
    id: "4",
    slug: "321-birch-lane-evanston-il",
    price: 520000,
    address: "321 Birch Lane",
    city: "Evanston",
    state: "IL",
    zip: "60201",
    beds: 3,
    baths: 2,
    sqft: 2100,
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    status: "Active",
    propertyType: "Townhouse",
  },
  {
    id: "5",
    slug: "555-cedar-court-scottsdale-az",
    price: 890000,
    address: "555 Cedar Court",
    city: "Scottsdale",
    state: "AZ",
    zip: "85251",
    beds: 5,
    baths: 5,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    status: "Active",
    propertyType: "Single Family",
  },
  {
    id: "6",
    slug: "102-desert-ridge-phoenix-az",
    price: 465000,
    address: "102 Desert Ridge",
    city: "Phoenix",
    state: "AZ",
    zip: "85054",
    beds: 3,
    baths: 2,
    sqft: 1950,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    status: "Active",
    propertyType: "Single Family",
  },
  {
    id: "7",
    slug: "88-lakeshore-drive-milwaukee-wi",
    price: 315000,
    address: "88 Lakeshore Drive",
    city: "Milwaukee",
    state: "WI",
    zip: "53202",
    beds: 2,
    baths: 1,
    sqft: 1100,
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
    status: "Active",
    propertyType: "Condo",
  },
  {
    id: "8",
    slug: "240-prairie-path-madison-wi",
    price: 398000,
    address: "240 Prairie Path",
    city: "Madison",
    state: "WI",
    zip: "53703",
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    status: "Pending",
    propertyType: "Single Family",
  },
  {
    id: "9",
    slug: "17-summit-place-indianapolis-in",
    price: 285000,
    address: "17 Summit Place",
    city: "Indianapolis",
    state: "IN",
    zip: "46204",
    beds: 3,
    baths: 2,
    sqft: 1650,
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
    status: "Active",
    propertyType: "Single Family",
  },
  {
    id: "10",
    slug: "400-river-road-carmel-in",
    price: 575000,
    address: "400 River Road",
    city: "Carmel",
    state: "IN",
    zip: "46032",
    beds: 4,
    baths: 3,
    sqft: 3100,
    image: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80",
    status: "Active",
    propertyType: "Single Family",
  },
  {
    id: "11",
    slug: "62-harbor-view-grand-rapids-mi",
    price: 340000,
    address: "62 Harbor View",
    city: "Grand Rapids",
    state: "MI",
    zip: "49503",
    beds: 3,
    baths: 2,
    sqft: 1750,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    status: "Sold",
    propertyType: "Townhouse",
  },
  {
    id: "12",
    slug: "905-michigan-avenue-ann-arbor-mi",
    price: 490000,
    address: "905 Michigan Avenue",
    city: "Ann Arbor",
    state: "MI",
    zip: "48104",
    beds: 4,
    baths: 3,
    sqft: 2500,
    image: "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800&q=80",
    status: "Active",
    propertyType: "Single Family",
  },
];

export const teamMembers: TeamMember[] = [
  {
    slug: "semir-drenova",
    name: "Semir Drenova",
    role: "Founder & Principal Broker",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    bio: "With over 15 years of experience in residential and commercial real estate, Semir founded Drenova Group with a vision to bring a modern, client-first approach to the Midwest market. His expertise spans luxury homes, investment properties, and new construction across multiple states. Semir is known for his market knowledge, negotiation skills, and dedication to achieving the best outcomes for every client.",
    phone: "(555) 100-0001",
    email: "semir@drenovagroup.com",
  },
  {
    slug: "elena-vasquez",
    name: "Elena Vasquez",
    role: "Senior Sales Agent",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    bio: "Elena brings a decade of experience and a passion for helping families find their perfect home. Specializing in the greater Chicago area and suburban markets, she has built a reputation for her attention to detail and commitment to client satisfaction. Elena consistently ranks among the top agents in her region.",
    phone: "(555) 100-0002",
    email: "elena@drenovagroup.com",
  },
  {
    slug: "marcus-chen",
    name: "Marcus Chen",
    role: "Buyer Specialist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
    bio: "Marcus is dedicated to making the home-buying process seamless and stress-free. With deep knowledge of market trends and financing options, he guides first-time buyers and seasoned investors alike through every step of the transaction. His clients appreciate his patience, transparency, and data-driven approach.",
    phone: "(555) 100-0003",
    email: "marcus@drenovagroup.com",
  },
  {
    slug: "sarah-mitchell",
    name: "Sarah Mitchell",
    role: "Listing Specialist",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
    bio: "Sarah specializes in helping homeowners maximize the value of their properties. Her marketing expertise, staging recommendations, and pricing strategies consistently deliver above-asking results. With a background in interior design, Sarah brings a unique eye for presentation that sets her listings apart.",
    phone: "(555) 100-0004",
    email: "sarah@drenovagroup.com",
  },
  {
    slug: "david-okafor",
    name: "David Okafor",
    role: "Commercial & Investment Advisor",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    bio: "David brings a strategic mindset to every real estate transaction. Specializing in commercial properties and investment portfolios, he helps clients build wealth through smart acquisitions and data-backed market analysis. His background in finance gives him a unique perspective on property valuation and ROI optimization.",
    phone: "(555) 100-0005",
    email: "david@drenovagroup.com",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: "Drenova Group made selling our home an incredibly smooth experience. From staging advice to closing, every detail was handled with care and professionalism.",
    name: "Jennifer & Mark Thompson",
    detail: "Sold in Naperville, IL",
  },
  {
    quote: "As first-time buyers, we were nervous about the process. Marcus walked us through every step and found us the perfect home under budget. We couldn't be more grateful.",
    name: "Priya & Raj Patel",
    detail: "Purchased in Evanston, IL",
  },
  {
    quote: "The level of market knowledge and negotiation skill that Semir brought to our investment property purchase was exceptional. We've already seen significant appreciation.",
    name: "Robert Nguyen",
    detail: "Investment Property, Phoenix, AZ",
  },
  {
    quote: "Sarah's listing strategy was brilliant — professional photography, targeted marketing, and expert staging. We received multiple offers within the first weekend.",
    name: "Lisa & Tom Brennan",
    detail: "Sold in Chicago, IL",
  },
  {
    quote: "Working with Drenova Group felt like having a trusted partner, not just an agent. Their modern approach and genuine care for clients set them apart from everyone else.",
    name: "Angela Davis",
    detail: "Purchased in Scottsdale, AZ",
  },
];

export const companyStats = [
  { label: "Years of Experience", value: "15+" },
  { label: "Homes Sold", value: "500+" },
  { label: "Expert Agents", value: "12" },
  { label: "States Covered", value: "5" },
];

export const valuePropositions = [
  {
    title: "Multi-State Coverage",
    description: "Operating across Illinois, Arizona, Wisconsin, Indiana, and Michigan — we bring local expertise to every market we serve.",
  },
  {
    title: "Modern Approach",
    description: "From data-driven pricing to digital marketing strategies, we leverage the latest tools and technology to deliver exceptional results.",
  },
  {
    title: "Client-First Philosophy",
    description: "Every decision we make is guided by what's best for our clients. Your goals are our goals, and your success is our measure of performance.",
  },
];

export const buyingSteps = [
  {
    number: "01",
    title: "Search & Discover",
    description: "Browse our curated listings, set your criteria, and explore neighborhoods that match your lifestyle and budget.",
  },
  {
    number: "02",
    title: "Tour & Evaluate",
    description: "Schedule private showings with your dedicated agent. We'll provide detailed market analysis for every property you're considering.",
  },
  {
    number: "03",
    title: "Offer & Negotiate",
    description: "We craft competitive offers backed by real-time market data. Our negotiation expertise ensures you get the best possible terms.",
  },
  {
    number: "04",
    title: "Close & Celebrate",
    description: "From inspection to closing, we coordinate every detail. Our team ensures a smooth transaction so you can focus on moving in.",
  },
];

export const sellingSteps = [
  {
    number: "01",
    title: "Prepare & Price",
    description: "We analyze comparable sales, assess your home's unique features, and develop a pricing strategy designed to maximize your return.",
  },
  {
    number: "02",
    title: "Stage & Style",
    description: "Our staging recommendations and professional photography showcase your home at its absolute best — first impressions matter.",
  },
  {
    number: "03",
    title: "List & Market",
    description: "Your listing reaches thousands of qualified buyers through MLS syndication, targeted digital advertising, and our professional network.",
  },
  {
    number: "04",
    title: "Negotiate & Accept",
    description: "We evaluate every offer with you, negotiate favorable terms, and guide you through counteroffers with confidence and clarity.",
  },
  {
    number: "05",
    title: "Close & Move On",
    description: "We manage inspections, appraisals, and paperwork through closing. Our goal is a seamless handoff so you can move forward with ease.",
  },
];

export const buyerFaqs = [
  {
    question: "How do I get pre-approved for a mortgage?",
    answer: "We recommend connecting with a mortgage lender early in the process. Pre-approval involves submitting financial documents (income verification, credit check, assets) to determine your budget. We work with trusted lending partners and can provide referrals to get you started.",
  },
  {
    question: "How long does the home buying process take?",
    answer: "On average, the buying process takes 30–60 days from accepted offer to closing. The timeline depends on factors like financing, inspections, and any negotiated repairs. We keep you informed at every step and work to resolve issues quickly.",
  },
  {
    question: "What costs should I expect beyond the purchase price?",
    answer: "Buyers should budget for closing costs (typically 2–5% of the purchase price), which include lender fees, title insurance, appraisal, and prepaid taxes/insurance. Your agent will provide a detailed estimate early in the process so there are no surprises.",
  },
  {
    question: "Do I need a buyer's agent?",
    answer: "Absolutely. A buyer's agent represents your interests exclusively, providing market expertise, negotiation support, and guidance through the entire transaction. Our services are typically compensated by the seller, so there's no direct cost to you.",
  },
  {
    question: "What if I find a home I love but it's out of my budget?",
    answer: "We'll help you evaluate all options — from negotiating a lower price to exploring different financing structures. Sometimes sellers are flexible on terms even if the listing price seems firm. Our market knowledge helps identify opportunities others might miss.",
  },
];

export const sellerFaqs = [
  {
    question: "How do you determine my home's value?",
    answer: "We perform a Comparative Market Analysis (CMA) that examines recent sales of similar properties, current market conditions, your home's unique features, and neighborhood trends. This data-driven approach ensures your listing price is competitive and maximizes your return.",
  },
  {
    question: "How long will it take to sell my home?",
    answer: "Market conditions, pricing, location, and presentation all influence timing. In a balanced market, well-priced homes typically sell within 30–90 days. Our marketing strategies and staging expertise are designed to reduce time on market while achieving top-dollar results.",
  },
  {
    question: "What should I do to prepare my home for sale?",
    answer: "We provide a customized preparation checklist for every seller. Common recommendations include decluttering, minor repairs, fresh paint in neutral tones, and professional cleaning. Our staging consultation helps highlight your home's best features for maximum buyer appeal.",
  },
  {
    question: "What are the costs of selling a home?",
    answer: "Typical selling costs include agent commissions, closing costs, title fees, and any agreed-upon buyer credits or repairs. We provide a detailed net proceeds estimate upfront so you know exactly what to expect. Our transparent approach means no hidden fees.",
  },
  {
    question: "Should I make renovations before selling?",
    answer: "Not always — some renovations provide excellent ROI while others don't recoup their cost. We advise on which improvements will deliver the best return based on your specific market. Often, simple updates like fresh paint and landscaping have the biggest impact.",
  },
];

export const coverageAreas = [
  { name: "Illinois", cities: "Chicago, Naperville, Evanston, Springfield" },
  { name: "Arizona", cities: "Phoenix, Scottsdale, Tempe, Mesa" },
  { name: "Wisconsin", cities: "Milwaukee, Madison, Green Bay" },
  { name: "Indiana", cities: "Indianapolis, Carmel, Fishers" },
  { name: "Michigan", cities: "Grand Rapids, Ann Arbor, Detroit" },
];

export const companyValues = [
  {
    title: "Integrity",
    description: "We operate with complete transparency. Every recommendation we make is grounded in honest market analysis and our clients' best interests.",
  },
  {
    title: "Excellence",
    description: "From marketing materials to negotiation strategy, we hold ourselves to the highest standard in every aspect of the transaction.",
  },
  {
    title: "Innovation",
    description: "We embrace modern technology and data-driven strategies to give our clients a competitive edge in today's real estate market.",
  },
  {
    title: "Community",
    description: "We're invested in the neighborhoods we serve. Building lasting relationships with our clients and communities is at the heart of everything we do.",
  },
];
