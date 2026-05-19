import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTACT_EMAIL_TEMPLATE_KEYS,
  EMAIL_TEMPLATE_KEYS,
  LEAD_EMAIL_TEMPLATE_KEYS,
  renderContactEmailTemplate,
  renderEmailTemplate,
  renderLeadEmailTemplates,
} from "./templates";
import type {
  ContactEmailContext,
  EmailMessagePayload,
  LeadEmailContext,
} from "./types";

const baseLeadContext: Omit<LeadEmailContext, "source"> = {
  firstName: "Avery",
  lastName: "Morgan",
  email: "avery@example.com",
  phone: "416-555-0199",
  addressLine: "10 King Street West",
  unit: "Suite 1400",
  city: "Toronto",
  province: "ON",
  postalCode: "M5H 1A1",
  notes: "Interested in a spring move.",
};

const contactContext: ContactEmailContext = {
  name: "Jordan Lee",
  email: "jordan@example.com",
  phone: "647-555-0188",
  subject: "Private consultation",
  message: "Please follow up this week.",
  sourcePath: "/team/jordan-lee",
  agentName: "Jordan Lee",
  agentRole: "Agent",
  agentSlug: "jordan-lee",
};

test("exports the complete page-specific template matrix", () => {
  assert.deepEqual(EMAIL_TEMPLATE_KEYS, [
    "homepage",
    "buy",
    "sell",
    "about",
    "team",
    "team-profile",
    "contact",
    "home-evaluation",
    "buyers-guide",
    "sellers-guide",
    "listing-detail",
  ]);
  assert.equal(EMAIL_TEMPLATE_KEYS.length, 11);
  assert.equal(LEAD_EMAIL_TEMPLATE_KEYS.length, 9);
  assert.deepEqual(CONTACT_EMAIL_TEMPLATE_KEYS, ["contact", "team-profile"]);
});

test("renders user confirmations and admin notifications for all lead templates", () => {
  const expectedLanguage = {
    homepage: "Thank you for reaching out to Drenova Group",
    buy: "buying a home",
    sell: "selling your home",
    about: "connecting with Drenova Group",
    team: "reaching out to our team",
    "home-evaluation": "requesting a home evaluation",
    "buyers-guide": "requesting our Buyer's Guide",
    "sellers-guide": "requesting our Seller's Guide",
    "listing-detail": "You expressed interest in Penthouse 1201",
  } satisfies Record<(typeof LEAD_EMAIL_TEMPLATE_KEYS)[number], string>;

  for (const source of LEAD_EMAIL_TEMPLATE_KEYS) {
    const result = renderLeadEmailTemplates({
      ...baseLeadContext,
      source,
      listing:
        source === "listing-detail"
          ? {
              listingSlug: "penthouse-1201",
              listingMlsNumber: "N1234567",
              listingTitle: "Penthouse 1201",
              listingPrice: 2450000,
              listingUrl: "https://drenovagroup.com/listings/penthouse-1201",
              listingCity: "Toronto",
              listingCommunity: "Yorkville",
              listingPropertyType: "Condo Apartment",
            }
          : undefined,
    });

    assertMessage(result.userConfirmation);
    assertMessage(result.adminNotification);
    assert.equal("replyTo" in result.adminNotification, false);
    assert.match(result.userConfirmation.text, new RegExp(expectedLanguage[source]));
    assert.match(result.userConfirmation.html, /The Drenova Group Team/);
    assert.match(result.adminNotification.subject, /New lead from Avery Morgan/);
    assert.deepEqual(result.userConfirmation.tags, [
      `template:${source}`,
      "audience:user",
    ]);
    assert.deepEqual(result.adminNotification.tags, [
      `template:${source}`,
      "audience:admin",
    ]);
  }
});

test("renders admin contact emails for contact and team-profile templates", () => {
  for (const key of CONTACT_EMAIL_TEMPLATE_KEYS) {
    const result = renderContactEmailTemplate(key, contactContext);

    assertMessage(result.adminContact);
    assert.equal("replyTo" in result.adminContact, false);
    assert.match(result.adminContact.subject, /New inquiry from Jordan Lee/);
    assert.match(result.adminContact.text, /Message:\nPlease follow up this week\./);
    assert.match(result.adminContact.text, /Agent Name: Jordan Lee/);
    assert.match(result.adminContact.text, /Agent Role: Agent/);
    assert.match(result.adminContact.text, /Agent Slug: jordan-lee/);
    assert.match(result.adminContact.text, /Source Path: \/team\/jordan-lee/);
    assert.deepEqual(result.adminContact.tags, [`template:${key}`, "audience:admin"]);
  }
});

test("generic renderer returns the correct result shape for lead and contact keys", () => {
  const leadResult = renderEmailTemplate("homepage", baseLeadContext);
  const contactResult = renderEmailTemplate("contact", contactContext);

  assert.ok("userConfirmation" in leadResult);
  assert.ok("adminNotification" in leadResult);
  assert.ok("adminContact" in contactResult);
});

test("escapes user-provided values in HTML output", () => {
  const maliciousLead = renderLeadEmailTemplates({
    source: "listing-detail",
    firstName: "Ada <script>alert(1)</script>",
    lastName: "O'Neil & Sons",
    email: "ada@example.com",
    listing: {
      listingTitle: "Loft <img src=x onerror=alert(1)> & Terrace",
    },
  });
  const maliciousContact = renderContactEmailTemplate("contact", {
    name: "Kai <b>Stone</b>",
    email: "kai@example.com",
    subject: "Tour <now>",
    message: "Can you show \"Suite A\" & the terrace?",
  });

  assert.doesNotMatch(maliciousLead.userConfirmation.html, /<script>/);
  assert.doesNotMatch(maliciousLead.userConfirmation.html, /<img/);
  assert.match(
    maliciousLead.userConfirmation.html,
    /Loft &lt;img src=x onerror=alert\(1\)&gt; &amp; Terrace/
  );
  assert.match(
    maliciousLead.adminNotification.html,
    /Ada &lt;script&gt;alert\(1\)&lt;\/script&gt; O&#39;Neil &amp; Sons/
  );
  assert.doesNotMatch(maliciousContact.adminContact.html, /<b>Stone<\/b>/);
  assert.match(maliciousContact.adminContact.html, /Tour &lt;now&gt;/);
  assert.match(
    maliciousContact.adminContact.html,
    /Can you show &quot;Suite A&quot; &amp; the terrace\?/
  );
});

test("listing-detail templates include only safe listing fields", () => {
  const unsafeListingFixture = {
    listingSlug: "ravine-view-home",
    listingMlsNumber: "C9876543",
    listingTitle: "Ravine View Home",
    listingPrice: 1895000,
    listingUrl: "https://drenovagroup.com/listings/ravine-view-home",
    listingCity: "Markham",
    listingCommunity: "Unionville",
    listingPropertyType: "Detached",
    address: "123 Hidden Lane",
    postalCode: "L3R 0X0",
    unit: "Upper",
    streetName: "Hidden Lane",
    latitude: 43.12345,
    longitude: -79.12345,
  };

  const result = renderLeadEmailTemplates({
    ...baseLeadContext,
    source: "listing-detail",
    listing: unsafeListingFixture,
  });
  const rendered = [
    result.userConfirmation.text,
    result.userConfirmation.html,
    result.adminNotification.text,
    result.adminNotification.html,
  ].join("\n");

  for (const allowedValue of [
    "Ravine View Home",
    "C9876543",
    "https://drenovagroup.com/listings/ravine-view-home",
    "Markham",
    "Unionville",
    "Detached",
    "$1,895,000",
  ]) {
    assert.match(rendered, escapeRegExp(allowedValue));
  }

  for (const forbidden of [
    "123 Hidden Lane",
    "L3R 0X0",
    "Upper",
    "Hidden Lane",
    "43.12345",
    "-79.12345",
    "Address Line",
    "Postal Code",
    "Unit/Suite",
    "streetName",
    "latitude",
    "longitude",
  ]) {
    assert.doesNotMatch(rendered, escapeRegExp(forbidden));
  }
});

function assertMessage(message: EmailMessagePayload): void {
  assert.equal(typeof message.subject, "string");
  assert.equal(typeof message.text, "string");
  assert.equal(typeof message.html, "string");
  assert.ok(message.subject.length > 0);
  assert.ok(message.text.length > 0);
  assert.match(message.html, /^<!doctype html>/);
}

function escapeRegExp(value: string): RegExp {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}
