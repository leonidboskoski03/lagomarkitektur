# Deployment — Cloudflare Pages, Resend and STRATO mail

## Production architecture

```text
React form
  → POST /api/enquiry
  → Cloudflare Turnstile verification
  → Cloudflare Pages Function
  → Resend transactional email API
  → To: info@lagomarkitektur.se
  → BCC: private named mailbox (server-only setting)
  → Reply-To: visitor
```

The private notification mailbox must never be placed in a `VITE_*` variable,
frontend source, browser request or public documentation.

## 1. Accounts

The client should own the Cloudflare, Resend, STRATO and Sanity accounts. Enable
two-factor authentication and invite the developer instead of sharing passwords.

## 2. Resend

1. Create a client-owned Resend account.
2. Add and authenticate `lagomarkitektur.se` as a sending domain.
3. Add only the exact DNS records Resend supplies in Cloudflare DNS.
4. Do not replace existing STRATO MX, SPF, DKIM or DMARC records.
5. Keep the existing strict DMARC policy and wait until Resend reports the domain
   authenticated before enabling production submissions.
6. Keep the standard 30-day email-data retention in mind and disable open/click
   tracking because these internal notifications do not need engagement analytics.
7. Create a restricted transactional-email API key for the website.

Resend is used only to deliver notifications. It does not log into STRATO.

## 3. Turnstile

1. In Cloudflare, create a Managed Turnstile widget.
2. Allow `lagomarkitektur.se` and `www.lagomarkitektur.se`.
3. Keep localhost out of the production widget.
4. Copy the public sitekey to the Pages build variable
   `VITE_TURNSTILE_SITE_KEY`.
5. Store the secret key as the encrypted Function secret `TURNSTILE_SECRET`.

For local tests, use Cloudflare's official always-pass test sitekey and secret;
never use test keys in production.

## 3A. Sanity public reads

In Sanity Manage, add these credential-free CORS origins:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `https://lagomarkitektur.se`
- `https://www.lagomarkitektur.se`

Do not enable credentials. The production website reads only published content
from the public dataset. The origins are not currently allowed, so this step is
required before launch.

The existing 11 projects and galleries are published. Their text was imported
in a legacy English-only shape; use a temporary write token only for the
one-time Swedish/English field migration, then revoke it. Never expose it as a
`VITE_*` variable.

## 4. Cloudflare Pages project

Connect the production Git repository and configure:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | the repository's production branch |
| Node version | 22 |

Public build variables:

```env
VITE_SANITY_PROJECT_ID=jrg1q51h
VITE_SANITY_DATASET=production
VITE_TURNSTILE_SITE_KEY=...
```

Encrypted Function secrets:

```env
RESEND_API_KEY=...
TURNSTILE_SECRET=...
ENQUIRY_BCC=the private named notification mailbox
```

Server-side variable:

```env
ENQUIRY_RECIPIENT=info@lagomarkitektur.se
```

Set variables and secrets for both Production and Preview where the form must
work. Preview can use Turnstile test credentials until production validation.

## 5. Abuse protection

The code validates input, limits field sizes, uses a honeypot, checks same-origin
requests and validates every Turnstile token server-side.

In the Cloudflare zone, use the single Free-plan rate-limiting rule for the path
`/api/enquiry`. Start with 5 requests per 10 seconds per IP and a Managed
Challenge action. Review Security Events after launch and adjust only if real
visitors are affected.

## 6. Domain and DNS

1. Export or screenshot the complete current Cloudflare DNS zone.
2. Preserve all STRATO MX records.
3. Preserve the existing email SPF, DKIM and DMARC records.
4. Add Resend records without creating a second conflicting root SPF record.
5. Point only the website hostnames to Cloudflare Pages.
6. Attach `lagomarkitektur.se` and `www.lagomarkitektur.se` as Pages custom
   domains; choose one canonical hostname and redirect the other.
7. Test inbound and outbound mail for both existing STRATO mailboxes before and
   after DNS changes.

## 7. Release checks

Run:

```powershell
npm ci
npm run lint
npm run build
```

Then test on the Pages preview URL:

- Swedish and English quick enquiries;
- one guided project brief;
- required-field and invalid-email messages;
- Turnstile failure and expired-token recovery;
- successful delivery to `info@` and the private BCC mailbox;
- Reply from the BCC copy goes to the visitor and exposes the named mailbox only
  in that intentional reply;
- provider failure preserves the form and displays the direct-email fallback;
- `/privacy` and `/integritet` load directly and after a refresh;
- both existing STRATO mailboxes can send and receive normal mail.

## 8. Operational ownership

- Nikola owns the production accounts and receives provider/account alerts.
- The developer verifies the initial deployment and delivery logs.
- Review Resend failures and Cloudflare Security Events after launch and monthly.
- Delete unsuccessful enquiries from the STRATO mailboxes no later than 24
  months after the last contact unless a contract or legal obligation requires
  longer retention.
