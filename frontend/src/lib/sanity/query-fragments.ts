import { groq } from "next-sanity";

export const documentProjection = groq`_id,
  _type`;

export const teamMemberProjection = groq`{
  _key,
  _type,
  "slug": slug.current,
  name,
  role,
  image,
  bio,
  phone,
  email
}`;

export const benefitsProjection = groq`benefits[] {
  _key,
  title,
  description
}`;

export const processStepsProjection = groq`processSteps[] {
  _key,
  _type,
  stepNumber,
  title,
  description
}`;

export const seoProjection = groq`seo {
  title,
  description,
  image,
  noIndex
}`;

export const homePageContentProjection = groq`
  hero,
  aboutSection {
    title,
    description,
    buttonText,
    buttonHref,
    image
  },
  valuePropositions[] {
    _key,
    _type,
    title,
    description
  },
  workWithUsHeading,
  ctaCard1 {
    image,
    title,
    subtitle,
    buttonText,
    buttonHref
  },
  ctaCard2 {
    image,
    title,
    subtitle,
    buttonText,
    buttonHref
  },
  contactForm {
    heading,
    subtitle
  }
`;

export const guidePageProjection = groq`{
  ${documentProjection},
  hero,
  guideTitle,
  guideDescription,
  guideImage,
  cta
}`;
