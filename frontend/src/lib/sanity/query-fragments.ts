import { groq } from "next-sanity";

export const documentProjection = groq`_id,
  _type`;

export const teamMemberProjection = groq`{
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

export const guidePageProjection = groq`{
  ${documentProjection},
  hero,
  guideTitle,
  guideDescription,
  guideImage,
  cta
}`;
