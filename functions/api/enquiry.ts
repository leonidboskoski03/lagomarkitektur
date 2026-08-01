interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  TURNSTILE_HOSTNAMES?: string;
  ENQUIRY_RECIPIENT?: string;
  ENQUIRY_BCC?: string;
}

interface FunctionContext {
  request: Request;
  env: Env;
}

interface RawEnquiry {
  submissionId?: unknown;
  mode?: unknown;
  language?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  location?: unknown;
  message?: unknown;
  size?: unknown;
  sizeUnknown?: unknown;
  timeframe?: unknown;
  source?: unknown;
  additional?: unknown;
  projectTypes?: unknown;
  priorities?: unknown;
  turnstileToken?: unknown;
  website?: unknown;
}

interface ValidatedEnquiry {
  submissionId: string;
  mode: "quick" | "structured";
  language: "sv" | "en";
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  size: string;
  sizeUnknown: boolean;
  timeframe: string;
  source: string;
  additional: string;
  projectTypes: string[];
  priorities: string[];
  turnstileToken: string;
}

interface TurnstileResult {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TURNSTILE_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const PUBLIC_RECIPIENT = "info@lagomarkitektur.se";
const MAX_BODY_BYTES = 32_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PROJECT_TYPES = new Set([
  "new-home", "extension", "renovation", "interior-design", "commercial",
  "building-permit", "visualization", "other-services",
]);
const TIMEFRAMES = new Set([
  "asap", "three-months", "six-months", "twelve-months", "exploring",
]);
const SOURCES = new Set([
  "google", "instagram", "linkedin", "recommendation", "returning", "other",
]);
const PRIORITIES = new Set([
  "design", "function", "sustainability", "budget", "timeline",
  "energy-efficiency", "other",
]);

const json = (body: Record<string, unknown>, status = 200) => new Response(
  JSON.stringify(body),
  {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  },
);

const withoutControlCharacters = (value: string, keepLineBreaks: boolean) => (
  [...value].filter((character) => {
    const code = character.charCodeAt(0);
    if (keepLineBreaks && (character === "\n" || character === "\t")) return true;
    return code >= 32 && code !== 127;
  }).join("")
);

const cleanLine = (value: unknown, maxLength: number) => (
  typeof value === "string"
    ? withoutControlCharacters(value, false).replace(/\s+/g, " ").trim().slice(0, maxLength)
    : ""
);

const cleanText = (value: unknown, maxLength: number) => (
  typeof value === "string"
    ? withoutControlCharacters(value.replace(/\r\n?/g, "\n"), true).trim().slice(0, maxLength)
    : ""
);

const cleanChoiceList = (value: unknown, allowed: Set<string>, maxItems: number) => (
  Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === "string" && allowed.has(item)))].slice(0, maxItems)
    : []
);

function validateEnquiry(raw: RawEnquiry): ValidatedEnquiry | null {
  const mode = raw.mode === "structured" ? "structured" : raw.mode === "quick" ? "quick" : null;
  const language = raw.language === "en" ? "en" : raw.language === "sv" ? "sv" : null;
  const submissionId = cleanLine(raw.submissionId, 36);
  const name = cleanLine(raw.name, 100);
  const email = cleanLine(raw.email, 254).toLowerCase();
  const phone = cleanLine(raw.phone, 40);
  const location = cleanLine(raw.location, 160);
  const message = cleanText(raw.message, 5_000);
  const size = cleanLine(raw.size, 80);
  const timeframe = cleanLine(raw.timeframe, 40);
  const source = cleanLine(raw.source, 40);
  const additional = cleanText(raw.additional, 2_000);
  const turnstileToken = cleanLine(raw.turnstileToken, 2_048);
  const projectTypes = cleanChoiceList(raw.projectTypes, PROJECT_TYPES, 8);
  const priorities = cleanChoiceList(raw.priorities, PRIORITIES, 7);

  if (
    !mode
    || !language
    || !UUID_PATTERN.test(submissionId)
    || name.length < 2
    || !EMAIL_PATTERN.test(email)
    || message.length < 10
    || !turnstileToken
    || (timeframe && !TIMEFRAMES.has(timeframe))
    || (source && !SOURCES.has(source))
  ) return null;

  if (mode === "structured" && (!location || projectTypes.length === 0)) return null;

  return {
    submissionId,
    mode,
    language,
    name,
    email,
    phone,
    location,
    message,
    size,
    sizeUnknown: raw.sizeUnknown === true,
    timeframe,
    source,
    additional,
    projectTypes,
    priorities,
    turnstileToken,
  };
}

async function verifyTurnstile(
  enquiry: ValidatedEnquiry,
  secret: string,
  allowedHostnames: ReadonlySet<string>,
  request: Request,
): Promise<boolean> {
  const response = await fetch(TURNSTILE_ENDPOINT, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    signal: AbortSignal.timeout(10_000),
    body: new URLSearchParams({
      secret,
      response: enquiry.turnstileToken,
      ...(request.headers.get("CF-Connecting-IP")
        ? {remoteip: request.headers.get("CF-Connecting-IP") as string}
        : {}),
      idempotency_key: enquiry.submissionId,
    }),
  });

  if (!response.ok) return false;
  const result = await response.json() as TurnstileResult;
  const requestHostname = new URL(request.url).hostname;
  const testSecret = secret.startsWith("1x0000000000000000000000000000000AA");
  const actionIsValid = result.action === "project_enquiry" || (testSecret && result.action === "test");
  const hostnameIsValid = testSecret
    ? !result.hostname || result.hostname === requestHostname
    : typeof result.hostname === "string"
      && allowedHostnames.has(result.hostname)
      && result.hostname === requestHostname;

  return result.success === true && actionIsValid && hostnameIsValid;
}

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const displayChoice = (value: string) => value
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

function emailRows(enquiry: ValidatedEnquiry): Array<[string, string]> {
  const optional = (value: string) => value || "Not provided";
  const selections = (values: string[]) => values.length
    ? values.map(displayChoice).join(", ")
    : "Not provided";

  return [
    ["Enquiry type", enquiry.mode === "structured" ? "Guided project brief" : "Quick enquiry"],
    ["Language", enquiry.language === "sv" ? "Swedish" : "English"],
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Phone", optional(enquiry.phone)],
    ["Project location", optional(enquiry.location)],
    ["Project types", selections(enquiry.projectTypes)],
    ["Approximate size", enquiry.sizeUnknown ? "Not known yet" : optional(enquiry.size)],
    ["Timeframe", optional(enquiry.timeframe ? displayChoice(enquiry.timeframe) : "")],
    ["Priorities", selections(enquiry.priorities)],
    ["How they found Lagom", optional(enquiry.source ? displayChoice(enquiry.source) : "")],
  ];
}

function createEmailContent(enquiry: ValidatedEnquiry) {
  const rows = emailRows(enquiry);
  const textContent = [
    "NEW PROJECT ENQUIRY",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "PROJECT OVERVIEW",
    enquiry.message,
    ...(enquiry.additional ? ["", "ADDITIONAL INFORMATION", enquiry.additional] : []),
    "",
    `Submission reference: ${enquiry.submissionId}`,
  ].join("\n");
  const htmlRows = rows.map(([label, value]) => `
    <tr>
      <th style="padding:8px 16px 8px 0;text-align:left;vertical-align:top;color:#777;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;">${escapeHtml(label)}</th>
      <td style="padding:8px 0;vertical-align:top;color:#171714;font-size:15px;line-height:1.45;">${escapeHtml(value)}</td>
    </tr>`).join("");
  const paragraph = (value: string) => escapeHtml(value).replaceAll("\n", "<br>");
  const htmlContent = `<!doctype html>
    <html><body style="margin:0;background:#f4f1ea;color:#171714;font-family:Arial,sans-serif;">
      <main style="max-width:680px;margin:0 auto;padding:40px 24px;">
        <p style="margin:0 0 32px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Lagom Arkitektur / Website</p>
        <h1 style="margin:0 0 32px;font-size:32px;line-height:1.05;font-weight:500;">New project enquiry</h1>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #c9c5bb;border-bottom:1px solid #c9c5bb;">${htmlRows}</table>
        <h2 style="margin:32px 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Project overview</h2>
        <p style="margin:0;font-size:16px;line-height:1.6;">${paragraph(enquiry.message)}</p>
        ${enquiry.additional ? `<h2 style="margin:32px 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Additional information</h2><p style="margin:0;font-size:16px;line-height:1.6;">${paragraph(enquiry.additional)}</p>` : ""}
        <p style="margin:40px 0 0;color:#777;font-size:11px;">Submission reference: ${escapeHtml(enquiry.submissionId)}</p>
      </main>
    </body></html>`;

  return {textContent, htmlContent};
}

export async function onRequestPost({request, env}: FunctionContext): Promise<Response> {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  if (!origin || origin !== requestOrigin) return json({ok: false, code: "forbidden"}, 403);

  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > MAX_BODY_BYTES) return json({ok: false, code: "payload_too_large"}, 413);

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) return json({ok: false, code: "payload_too_large"}, 413);

  let raw: RawEnquiry;
  try {
    raw = JSON.parse(rawBody) as RawEnquiry;
  } catch {
    return json({ok: false, code: "invalid_request"}, 400);
  }

  if (cleanLine(raw.website, 200)) return json({ok: true});

  const enquiry = validateEnquiry(raw);
  if (!enquiry) return json({ok: false, code: "invalid_enquiry"}, 400);
  const allowedHostnames = new Set(
    (env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
  if (!env.TURNSTILE_SECRET || !env.RESEND_API_KEY || allowedHostnames.size === 0) {
    console.error("Enquiry service is missing required secrets.");
    return json({ok: false, code: "service_unavailable"}, 503);
  }

  let verified: boolean;
  try {
    verified = await verifyTurnstile(enquiry, env.TURNSTILE_SECRET, allowedHostnames, request);
  } catch {
    return json({ok: false, code: "verification_unavailable"}, 503);
  }
  if (!verified) return json({ok: false, code: "verification_failed"}, 400);

  const recipient = cleanLine(env.ENQUIRY_RECIPIENT, 254) || PUBLIC_RECIPIENT;
  const bcc = cleanLine(env.ENQUIRY_BCC, 254);
  const {textContent, htmlContent} = createEmailContent(enquiry);
  const providerPayload = {
    from: `Lagom Website <${PUBLIC_RECIPIENT}>`,
    to: [recipient],
    ...(EMAIL_PATTERN.test(bcc) && bcc !== recipient ? {bcc: [bcc]} : {}),
    reply_to: `${enquiry.name} <${enquiry.email}>`,
    subject: `[Website] ${enquiry.mode === "structured" ? "Project brief" : "Project enquiry"} — ${enquiry.name}`,
    text: textContent,
    html: htmlContent,
    tags: [{name: "source", value: "project-enquiry"}],
  };

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "User-Agent": "Lagom-Arkitektur-Website/1.0",
        "Idempotency-Key": enquiry.submissionId,
      },
      body: JSON.stringify(providerPayload),
    });

    if (!response.ok) {
      console.error("Resend rejected an enquiry notification.", response.status);
      return json({ok: false, code: "delivery_failed"}, 502);
    }

    const result = await response.json().catch(() => ({})) as {id?: string};
    return json({ok: true, messageId: result.id});
  } catch {
    return json({ok: false, code: "delivery_unavailable"}, 503);
  }
}

export function onRequestGet(): Response {
  return json({ok: false, code: "method_not_allowed"}, 405);
}
