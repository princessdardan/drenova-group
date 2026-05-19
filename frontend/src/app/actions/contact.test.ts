import { describe, it, afterEach, beforeEach } from "node:test";
import assert from "node:assert";
import { submitContactForm } from "./contact";

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

interface ResendTag {
  name: string;
  value: string;
}

interface ResendPayload {
  from?: string;
  reply_to?: string;
  tags?: ResendTag[];
  text: string;
}

const verifiedFromEmail = "Drenova Group <send.info@info.drenova.ca>";
const automatedReplyToEmail = "semir@drenova.ca";

describe("submitContactForm", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_FROM_EMAIL = verifiedFromEmail;
    process.env.CONTACT_EMAIL = "info@drenovagroup.com";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
  });

  it("returns error if required fields are missing", async () => {
    const formData = new FormData();
    const result = await submitContactForm(formData);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, "All required fields must be filled.");
  });

  it("returns error if email is invalid", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "invalid-email");
    formData.append("subject", "general");
    formData.append("message", "Hello");
    const result = await submitContactForm(formData);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, "Please enter a valid email address.");
  });

  it("sends email with contact template by default", async () => {
    let fetchOptions: RequestInit | undefined;
    
    global.fetch = async (_url, options) => {
      fetchOptions = options;
      return new Response(JSON.stringify({ id: "test-id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("subject", "general");
    formData.append("message", "Hello");

    const result = await submitContactForm(formData);
    assert.strictEqual(result.success, true);
    
    assert.ok(fetchOptions?.body);
    const body = JSON.parse(fetchOptions.body as string) as ResendPayload;
    assert.strictEqual(body.from, verifiedFromEmail);
    assert.strictEqual(body.reply_to, automatedReplyToEmail);
    assert.ok(body.tags?.some((t) => t.name === "category" && t.value === "template:contact"));
    assert.ok(body.text.includes("Source: Contact Page"));
  });

  it("sends email with team-profile template when provided", async () => {
    let fetchOptions: RequestInit | undefined;
    
    global.fetch = async (_url, options) => {
      fetchOptions = options;
      return new Response(JSON.stringify({ id: "test-id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const formData = new FormData();
    formData.append("name", "Jane Doe");
    formData.append("email", "jane@example.com");
    formData.append("subject", "buying");
    formData.append("message", "I want to buy a house");
    formData.append("templateKey", "team-profile");
    formData.append("agentName", "Agent Smith");
    formData.append("agentRole", "Broker");
    formData.append("agentSlug", "agent-smith");
    formData.append("sourcePath", "/team/agent-smith");

    const result = await submitContactForm(formData);
    assert.strictEqual(result.success, true);
    
    assert.ok(fetchOptions?.body);
    const body = JSON.parse(fetchOptions.body as string) as ResendPayload;
    assert.strictEqual(body.from, verifiedFromEmail);
    assert.strictEqual(body.reply_to, automatedReplyToEmail);
    assert.ok(body.tags?.some((t) => t.name === "category" && t.value === "template:team-profile"));
    assert.ok(body.text.includes("Source: Team Profile"));
    assert.ok(body.text.includes("Agent Name: Agent Smith"));
    assert.ok(body.text.includes("Agent Role: Broker"));
    assert.ok(body.text.includes("Agent Slug: agent-smith"));
    assert.ok(body.text.includes("Source Path: /team/agent-smith"));
  });

  it("returns error if sendEmailMessage fails", async () => {
    const originalConsoleError = console.error;
    const logs: unknown[][] = [];

    console.error = (...args: unknown[]) => {
      logs.push(args);
    };

    global.fetch = async () => {
      return new Response(JSON.stringify({ message: "Failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    };

    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("subject", "general");
    formData.append("message", "Hello");

    try {
      const result = await submitContactForm(formData);
      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, "Failed to send your message. Please try again later.");
      assert.deepStrictEqual(logs, [
        ["Resend provider rejected email:", { message: "Failed" }],
        [
          "Failed to send contact email:",
          {
            code: "provider_error",
            message: "Email provider rejected the message.",
          },
        ],
      ]);
    } finally {
      console.error = originalConsoleError;
    }
  });
});
