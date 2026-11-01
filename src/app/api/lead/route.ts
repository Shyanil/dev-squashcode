/**
 * Hero lead capture: accepts an email or phone number from the homepage.
 *
 * If LEAD_WEBHOOK_URL is set (Zapier / Make / Google Apps Script / Slack / CRM webhook),
 * every lead is forwarded there as JSON. Without it, leads are only written to the
 * server log, so set the variable before going live.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s\-().]{6,18}$/;

type LeadType = "email" | "phone";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { type, value, company } = (body ?? {}) as { type?: string; value?: string; company?: string };

  // honeypot: real visitors never see or fill this field
  if (company) return Response.json({ ok: true });

  const kind: LeadType | null = type === "email" || type === "phone" ? type : null;
  const clean = String(value ?? "").trim().slice(0, 120);
  const valid = kind === "email" ? EMAIL_RE.test(clean) : kind === "phone" ? PHONE_RE.test(clean) && clean.replace(/\D/g, "").length >= 7 : false;

  if (!kind || !valid) {
    return Response.json(
      { ok: false, error: kind === "phone" ? "Please enter a valid phone number." : "Please enter a valid email address." },
      { status: 422 },
    );
  }

  const lead = {
    type: kind,
    value: clean,
    source: "homepage-hero",
    page: request.headers.get("referer") ?? null,
    userAgent: request.headers.get("user-agent") ?? null,
    receivedAt: new Date().toISOString(),
  };

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`webhook responded ${res.status}`);
    } catch (err) {
      console.error("[lead] webhook delivery failed", err);
      return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 502 });
    }
  } else {
    console.info("[lead] LEAD_WEBHOOK_URL not set; lead logged only:", lead);
  }

  return Response.json({ ok: true });
}
