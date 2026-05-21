import type { PortableTextBlock } from "@portabletext/types";

export const defaultPrivacyMarketingConsentText: PortableTextBlock[] = [
  {
    _key: "privacy-marketing-consent",
    _type: "block",
    style: "normal",
    markDefs: [
      {
        _key: "privacy-link",
        _type: "link",
        href: "/privacy",
        blank: false,
      },
    ],
    children: [
      {
        _key: "privacy-marketing-consent-1",
        _type: "span",
        marks: [],
        text: "I agree to be contacted by Drenova Group about my inquiry and understand my information will be handled according to the ",
      },
      {
        _key: "privacy-marketing-consent-2",
        _type: "span",
        marks: ["privacy-link"],
        text: "Privacy Policy",
      },
      {
        _key: "privacy-marketing-consent-3",
        _type: "span",
        marks: [],
        text: ".",
      },
    ],
  },
];

export function portableTextToPlainText(value: PortableTextBlock[] | undefined): string {
  const blocks = value?.length ? value : defaultPrivacyMarketingConsentText;

  return blocks
    .map((block) =>
      block._type === "block"
        ? block.children
            ?.map((child) => ("text" in child ? child.text : ""))
            .join("")
            .trim()
        : ""
    )
    .filter(Boolean)
    .join("\n\n");
}
