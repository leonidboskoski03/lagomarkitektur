# Lagom Arkitektur — Deployment and Email Memory

Last updated: 2026-08-01

## Project context

- Application: Lagom Arkitektur website.
- Stack: React 19, TypeScript, Vite and Sanity.
- Domain: `lagomarkitektur.se`.
- Likely hosting: Cloudflare Pages.
- DNS is currently managed by Cloudflare.
- Domain and existing mailboxes are provided by STRATO.
- Sanity is used for published website content on its free plan.
- Project enquiries do not need to be stored in a database.

## Existing STRATO mailboxes

- `info@lagomarkitektur.se`
- `nikola…@lagomarkitektur.se`

No additional STRATO mailbox is required.

The previously discussed `website@mail.lagomarkitektur.se` was only an example. It does not exist and should not be created or used.

## Current contact-form behaviour

There are two enquiry forms:

1. The white contact-page form creates a `mailto:` draft and opens the visitor's email application. It does not send automatically.
2. The black overlay form currently prevents submission and sends nothing.

Both forms should eventually use one shared submission function.

## Existing email inconsistency

The shared project contact address is:

```text
info@lagomarkitektur.se
```

The full-screen menu contains a hardcoded link to:

```text
studio@lagomarkitektur.se
```

That menu link should eventually use the shared `info@` address.

## Recommended production architecture

```text
React/Vite form
    ↓ HTTPS POST
Cloudflare Pages Function: /api/enquiry
    ↓ HTTPS with protected API key
Brevo or Resend transactional email API
    ↓ standard internet email delivery
STRATO info@ mailbox
    ↓ optional BCC
Nikola's existing mailbox
```

Recommended email provider:

- Brevo if EU-oriented processing is the priority.
- Resend if the simplest developer experience is the priority.

Brevo was previously called Sendinblue.

## Why the Cloudflare Function is required

The transactional provider's API key must not be included in browser JavaScript.

The Cloudflare Function:

- Stores the email-provider API key as an encrypted secret.
- Receives the form data from the browser.
- Validates every field server-side.
- Keeps the recipient fixed as `info@lagomarkitektur.se`.
- Validates Cloudflare Turnstile.
- Applies spam and abuse protection.
- Calls Brevo or Resend over HTTPS.
- Returns success or failure to the UI.

It is serverless. It runs only when the form is submitted, so no traditional server needs to be rented or maintained.

## Final email structure

```text
From: Lagom Website <info@lagomarkitektur.se>
To: info@lagomarkitektur.se
BCC: nikola…@lagomarkitektur.se    (optional)
Reply-To: visitor@email.com
Subject: New project enquiry — Visitor Name
```

It is valid for `info@` to send to itself. This does not create a loop.

The visitor's address is placed in `Reply-To`. When Nikola presses Reply, the response is addressed to the visitor.

Nikola's mailbox remains fully usable for professional email. If he replies from his mailbox, the visitor sees his `nikola…@lagomarkitektur.se` address.

## How the email provider interacts with STRATO

Brevo or Resend does not log into STRATO and does not know the STRATO mailbox password.

There are two separate connections:

```text
Cloudflare Function
→ Brevo/Resend API using the provider API key

Brevo/Resend mail servers
→ STRATO receiving servers using normal internet email delivery
```

The provider discovers STRATO through the domain's MX records, just as Gmail does when sending an email to a STRATO mailbox.

## How the provider is authorised to send as info@

Cloudflare DNS is used to authorise the provider:

- SPF lists authorised sending infrastructure.
- DKIM provides a cryptographic signature.
- DMARC controls how unauthenticated messages are treated.

Workflow:

```text
Provider supplies SPF/DKIM DNS records
→ records are added in Cloudflare DNS
→ provider signs each outgoing message
→ STRATO checks the DNS authentication
→ SPF/DKIM/DMARC pass
→ STRATO delivers the message to info@
```

The domain currently has a strict DMARC policy of `p=reject`, so provider authentication must be configured correctly before production sending.

## DNS and deployment cautions

Do not delete or replace the entire DNS zone when deploying the new website.

- Repoint only website-related `A`, `AAAA` or `CNAME` records.
- Preserve the STRATO MX records.
- Preserve all existing SPF, DKIM and DMARC records.
- Add the transactional provider's DNS records carefully.
- Do not create multiple conflicting SPF records.
- Test both mailboxes before and after DNS changes.

Cloudflare can manage DNS and host the website while STRATO continues to provide the domain registration and mailboxes.

The current Vite configuration uses:

```text
base: /lagomarkitektur/
```

This will likely need to become `/` for deployment at the root domain.

## Planned code structure

```text
src/
├── components/contact/
│   ├── ContactForm.tsx
│   └── ContactOverlay.tsx
└── lib/
    └── submitEnquiry.ts

functions/
└── api/
    └── enquiry.ts
```

Frontend flow:

```text
Both forms
→ shared submitEnquiry()
→ POST /api/enquiry
```

Function flow:

```text
Validate request
→ validate Turnstile
→ validate and limit fields
→ use fixed recipient
→ call Brevo/Resend
→ return success or failure
```

## Environment variables and secrets

Public Cloudflare build variables for Sanity:

```env
VITE_SANITY_PROJECT_ID=jrg1q51h
VITE_SANITY_DATASET=production
```

These are public identifiers, not secrets.

Cloudflare Function secrets:

```env
BREVO_API_KEY=...
TURNSTILE_SECRET=...
```

Server configuration:

```env
ENQUIRY_RECIPIENT=info@lagomarkitektur.se
ENQUIRY_BCC=nikola...@lagomarkitektur.se
```

Sanity write token for local migration/import scripts or protected CI only:

```env
SANITY_AUTH_TOKEN=...
```

The contact-form function does not need a Sanity token because enquiries are not written to Sanity.

Sanity currently reads published data directly from the browser using `useCdn: true` and no token.

## Expected cost

| Service | Expected cost |
|---|---:|
| Cloudflare Pages | $0 |
| Cloudflare Pages Function | $0 |
| Cloudflare Turnstile | $0 |
| Brevo/Resend free allowance | $0 |
| Sanity | Existing free plan |
| STRATO domain and mailboxes | Existing subscription |
| Additional mailbox | Not required |

Vercel Hobby is intended for personal/non-commercial projects. Cloudflare is the preferred free production host for this business website.

## Alternatives discussed

### Direct STRATO SMTP

```text
Cloudflare Function
→ smtp.strato.de
→ info@ mailbox
```

Possible but not preferred because Cloudflare would have to store the real `info@` mailbox password, SMTP/TLS is more complicated in Workers, and delivery diagnostics are weaker.

### Formspree

```text
Browser
→ Formspree
→ STRATO mailbox
```

Simpler, but provides less control, stores submissions externally and has a smaller free allowance.

## Ownership and handoff

Nikola/client should ultimately own:

- STRATO domain and mailboxes.
- Cloudflare account, DNS and Pages project.
- Brevo or Resend account.
- Sanity project.
- Git repository.
- Analytics and billing.
- Two-factor authentication recovery codes.

Recommended process:

1. Nikola creates and owns the production accounts.
2. Nikola enables two-factor authentication.
3. Nikola invites the developer as an account member.
4. The developer builds and deploys the website.
5. Nikola can reduce or revoke developer access later.

Do not share account passwords.

If the project is initially deployed under the developer's Cloudflare account, move it into a separate client-owned account before final handoff. Preserve and copy all DNS records before changing nameservers.

## Separate unresolved translation issue

The Swedish translation displayed for the English heading `Selected spatial work` appeared unrelated or incorrect. A Swedish paragraph about interiors and architectural concepts appeared instead. This issue was reported but has not yet been investigated or corrected.

## Current status

- Architecture and workflow have been discussed only.
- No contact-form backend has been implemented yet.
- No transactional provider account has been connected.
- No production DNS changes have been made.
- No additional mailbox should be created.
- Next decision: choose Brevo or Resend, create client-owned production accounts, and implement the shared `/api/enquiry` function.
