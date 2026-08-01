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

type EmailAnswer = string | string[];
type EmailRow = [label: string, answer: EmailAnswer];

const EMAIL_COPY = {
  en: {
    language: "English",
    notProvided: "Not provided",
    sizeUnknown: "I don't know yet",
    contactDetails: "Contact details",
    name: "Name",
    email: "Email",
    phone: "Phone number",
    location: "Where will the project be located?",
    quickTitle: "Quick enquiry",
    quickMessage: "Project overview",
    briefTitle: "Project brief",
    questions: {
      projectTypes: "What type of project are you planning?",
      description: "Tell us a little about your project",
      size: "Approximate project size (if known)",
      timeframe: "When are you planning to start your project?",
      priorities: "What is most important to you?",
      source: "How did you hear about us?",
      additional: "Is there anything else you'd like us to know?",
    },
  },
  sv: {
    language: "Svenska",
    notProvided: "Ej angivet",
    sizeUnknown: "Vet ej",
    contactDetails: "Kontaktuppgifter",
    name: "Namn",
    email: "E-postadress",
    phone: "Telefonnummer",
    location: "Var ligger projektet?",
    quickTitle: "Snabb förfrågan",
    quickMessage: "Projektöversikt",
    briefTitle: "Projektbrief",
    questions: {
      projectTypes: "Vad gäller ditt projekt?",
      description: "Berätta kort om ditt projekt",
      size: "Ungefärlig storlek (om du vet)",
      timeframe: "När planerar du att starta projektet?",
      priorities: "Vad är viktigast för dig i projektet?",
      source: "Hur hörde du talas om oss?",
      additional: "Finns det något annat du vill att vi ska veta?",
    },
  },
} as const;

const OPTION_LABELS = {
  en: {
    projectTypes: {
      "new-home": "New Home",
      extension: "Home Extension",
      renovation: "Renovation",
      "interior-design": "Interior Design",
      commercial: "Commercial Project",
      "building-permit": "Building Permit Documentation",
      visualization: "3D Visualization",
      "other-services": "Other Architectural Services",
    },
    timeframe: {
      asap: "As soon as possible",
      "three-months": "Within 3 months",
      "six-months": "Within 6 months",
      "twelve-months": "Within 12 months",
      exploring: "I'm currently exploring my options",
    },
    priorities: {
      design: "Design & Aesthetics",
      function: "Functionality",
      sustainability: "Sustainability",
      budget: "Budget",
      timeline: "Timeline",
      "energy-efficiency": "Energy Efficiency",
      other: "Other",
    },
    source: {
      google: "Google Search",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      recommendation: "Recommendation",
      returning: "Returning Client",
      other: "Other",
    },
  },
  sv: {
    projectTypes: {
      "new-home": "Nybyggnation",
      extension: "Tillbyggnad",
      renovation: "Ombyggnad/Renovering",
      "interior-design": "Inredningsdesign",
      commercial: "Kommersiell lokal",
      "building-permit": "Bygglovshandlingar",
      visualization: "3D-visualisering",
      "other-services": "Annat",
    },
    timeframe: {
      asap: "Så snart som möjligt",
      "three-months": "Inom 3 månader",
      "six-months": "Inom 6 månader",
      "twelve-months": "Inom ett år",
      exploring: "Jag undersöker bara möjligheterna",
    },
    priorities: {
      design: "Design",
      function: "Funktion",
      sustainability: "Hållbarhet",
      budget: "Budget",
      timeline: "Tidsplan",
      "energy-efficiency": "Energieffektivitet",
      other: "Annat",
    },
    source: {
      google: "Google-sökning",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      recommendation: "Rekommendation",
      returning: "Återkommande kund",
      other: "Annat",
    },
  },
} as const;

const optionLabel = (
  language: ValidatedEnquiry["language"],
  group: keyof typeof OPTION_LABELS.en,
  value: string,
) => {
  const labels = OPTION_LABELS[language][group] as Record<string, string>;
  return labels[value] ?? value;
};

const paragraph = (value: string) => escapeHtml(value).replaceAll("\n", "<br>");

const htmlTable = (rows: EmailRow[]) => rows.map(([label, answer]) => {
  const value = Array.isArray(answer)
    ? `<ul style="margin:0;padding-left:18px;">${answer.map((item) => `<li style="margin:0 0 4px;">${escapeHtml(item)}</li>`).join("")}</ul>`
    : escapeHtml(answer);
  return `<tr>
    <th style="width:38%;padding:10px 18px 10px 0;text-align:left;vertical-align:top;color:#777;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(label)}</th>
    <td style="padding:10px 0;vertical-align:top;color:#171714;font-size:15px;line-height:1.5;">${value}</td>
  </tr>`;
}).join("");

const textRows = (rows: EmailRow[]) => rows.flatMap(([label, answer]) => [
  label,
  ...(Array.isArray(answer) ? answer.map((item) => `- ${item}`) : [answer]),
  "",
]);

function createEmailContent(enquiry: ValidatedEnquiry) {
  const copy = EMAIL_COPY[enquiry.language];
  const optional = (value: string) => value || copy.notProvided;
  const contactRows: EmailRow[] = [
    [copy.name, enquiry.name],
    [copy.email, enquiry.email],
    ...(enquiry.phone ? [[copy.phone, enquiry.phone] as EmailRow] : []),
  ];
  const heading = enquiry.mode === "structured" ? copy.briefTitle : copy.quickTitle;

  if (enquiry.mode === "quick") {
    const quickRows: EmailRow[] = [
      ...contactRows,
      ...(enquiry.location ? [[copy.location, enquiry.location] as EmailRow] : []),
    ];
    const textContent = [
      heading.toUpperCase(),
      `Language: ${copy.language}`,
      "",
      ...textRows(quickRows),
      copy.quickMessage.toUpperCase(),
      enquiry.message,
      "",
      `Submission reference: ${enquiry.submissionId}`,
    ].join("\n");
    const htmlContent = `<!doctype html>
      <html><body style="margin:0;background:#f4f1ea;color:#171714;font-family:Arial,sans-serif;">
        <main style="max-width:680px;margin:0 auto;padding:40px 24px;">
          <p style="margin:0 0 28px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Lagom Arkitektur / Website</p>
          <h1 style="margin:0;font-size:34px;line-height:1.05;font-weight:500;">${escapeHtml(heading)}</h1>
          <p style="margin:8px 0 30px;color:#777;font-size:12px;">${escapeHtml(copy.language)}</p>
          <table style="width:100%;border-collapse:collapse;border-top:1px solid #c9c5bb;border-bottom:1px solid #c9c5bb;">${htmlTable(quickRows)}</table>
          <h2 style="margin:32px 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(copy.quickMessage)}</h2>
          <p style="margin:0;font-size:16px;line-height:1.65;">${paragraph(enquiry.message)}</p>
          <p style="margin:40px 0 0;color:#777;font-size:11px;">Submission reference: ${escapeHtml(enquiry.submissionId)}</p>
        </main>
      </body></html>`;
    return {textContent, htmlContent};
  }

  const briefRows: EmailRow[] = [
    [copy.questions.projectTypes, enquiry.projectTypes.map((value) => optionLabel(enquiry.language, "projectTypes", value))],
    [copy.questions.description, enquiry.message],
    [copy.location, enquiry.location],
    [copy.questions.size, enquiry.sizeUnknown ? copy.sizeUnknown : optional(enquiry.size)],
    [copy.questions.timeframe, enquiry.timeframe ? optionLabel(enquiry.language, "timeframe", enquiry.timeframe) : copy.notProvided],
    [copy.questions.priorities, enquiry.priorities.length ? enquiry.priorities.map((value) => optionLabel(enquiry.language, "priorities", value)) : copy.notProvided],
    [copy.questions.source, enquiry.source ? optionLabel(enquiry.language, "source", enquiry.source) : copy.notProvided],
    [copy.questions.additional, optional(enquiry.additional)],
  ];
  const textContent = [
    heading.toUpperCase(),
    `Language: ${copy.language}`,
    "",
    copy.contactDetails.toUpperCase(),
    "",
    ...textRows(contactRows),
    "QUESTIONS & ANSWERS",
    "",
    ...textRows(briefRows),
    `Submission reference: ${enquiry.submissionId}`,
  ].join("\n");
  const htmlQuestions = briefRows.map(([question, answer], index) => {
    const value = Array.isArray(answer)
      ? `<ul style="margin:0;padding-left:20px;">${answer.map((item) => `<li style="margin:0 0 5px;">${escapeHtml(item)}</li>`).join("")}</ul>`
      : `<p style="margin:0;">${paragraph(answer)}</p>`;
    return `<section style="padding:22px 0;${index < briefRows.length - 1 ? "border-bottom:1px solid #dedad0;" : ""}">
      <h2 style="margin:0 0 10px;color:#777;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;">${escapeHtml(question)}</h2>
      <div style="font-size:16px;line-height:1.6;">${value}</div>
    </section>`;
  }).join("");
  const htmlContent = `<!doctype html>
    <html><body style="margin:0;background:#f4f1ea;color:#171714;font-family:Arial,sans-serif;">
      <main style="max-width:680px;margin:0 auto;padding:40px 24px;">
        <p style="margin:0 0 28px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Lagom Arkitektur / Website</p>
        <h1 style="margin:0;font-size:34px;line-height:1.05;font-weight:500;">${escapeHtml(heading)}</h1>
        <p style="margin:8px 0 30px;color:#777;font-size:12px;">${escapeHtml(copy.language)}</p>
        <h2 style="margin:0 0 10px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(copy.contactDetails)}</h2>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #c9c5bb;border-bottom:1px solid #c9c5bb;">${htmlTable(contactRows)}</table>
        <div style="margin-top:34px;border-top:1px solid #c9c5bb;border-bottom:1px solid #c9c5bb;">${htmlQuestions}</div>
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
    subject: `[Website] ${enquiry.mode === "structured" ? "Project brief" : "Quick enquiry"} — ${enquiry.name}`,
    text: textContent,
    html: htmlContent,
    tags: [
      {name: "source", value: "project-enquiry"},
      {name: "type", value: enquiry.mode === "structured" ? "project-brief" : "quick-enquiry"},
    ],
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
