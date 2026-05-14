import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const TAG_MAP: Record<string, string[]> = {
  listing: ["listing"],
  teamMember: ["teamMember"],
  testimonial: ["testimonial"],
  faq: ["faq"],
  coverageArea: ["coverageArea"],
  companyStat: ["companyStat"],
  companyValue: ["companyValue"],
  valueProposition: ["valueProposition"],
  siteSettings: ["siteSettings"],
  homePage: ["homePage"],
  aboutPage: ["aboutPage"],
  buyPage: ["buyPage"],
  sellPage: ["sellPage"],
  contactPage: ["contactPage"],
  teamPage: ["teamPage"],
  listingsPage: ["listingsPage"],
  legalPage: ["legalPage"],
  buyersGuidePage: ["buyersGuidePage"],
  sellersGuidePage: ["sellersGuidePage"],
  homeEvaluationPage: ["homeEvaluationPage"],
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-sanity-revalidate-secret");

  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json();
  const type = body?._type as string | undefined;

  if (!type) {
    return NextResponse.json(
      { message: "Missing _type in payload" },
      { status: 400 }
    );
  }

  const tags = TAG_MAP[type];

  if (!tags) {
    return NextResponse.json(
      { message: `Unknown type: ${type}`, revalidated: false },
      { status: 200 }
    );
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 3600 });
  }

  return NextResponse.json({ revalidated: true, tags });
}
