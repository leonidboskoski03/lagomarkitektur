import type {Language} from "../i18n/language";

export type EnquiryMode = "quick" | "structured";

export interface EnquirySubmission {
  submissionId: string;
  mode: EnquiryMode;
  language: Language;
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
  website: string;
}

interface EnquiryResponse {
  ok?: boolean;
  code?: string;
  messageId?: string;
}

const REQUEST_TIMEOUT_MS = 12_000;

export class EnquirySubmissionError extends Error {
  code: string;

  constructor(code = "delivery_failed") {
    super(code);
    this.name = "EnquirySubmissionError";
    this.code = code;
  }
}

export async function submitEnquiry(
  submission: EnquirySubmission,
): Promise<EnquiryResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(submission),
      credentials: "same-origin",
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({})) as EnquiryResponse;

    if (!response.ok || !result.ok) {
      throw new EnquirySubmissionError(result.code);
    }

    return result;
  } catch (error) {
    if (error instanceof EnquirySubmissionError) throw error;
    throw new EnquirySubmissionError(
      error instanceof DOMException && error.name === "AbortError"
        ? "timeout"
        : "network_error",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}
