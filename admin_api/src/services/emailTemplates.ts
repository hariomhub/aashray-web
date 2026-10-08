/**
 * Branded, responsive HTML email templates for the partner lifecycle.
 * Pure functions: input data -> { subject, html, text }. No I/O.
 */

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const BRAND = {
  navy: '#1A3E5C',
  navyDark: '#122B40',
  gold: '#A5916C',
  bg: '#F5F7FB',
  ink: '#1A1A1A',
  muted: '#5B6472',
  line: '#E5E8EF',
};

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function frontendUrl(): string {
  return (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function supportEmail(): string {
  return process.env.SUPPORT_EMAIL || 'partners@aashrayinfotech.com';
}

function layout(opts: { preheader: string; title: string; body: string }): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="x-apple-disable-message-reformatting" />
<title>${escapeHtml(opts.title)}</title>
<style>
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; border-radius: 0 !important; }
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .h1 { font-size: 22px !important; }
    .btn { display: block !important; text-align: center !important; }
    .stack { display: block !important; width: 100% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.ink};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(18,43,64,0.10);">
      <tr>
        <td class="px" style="background:${BRAND.navy};background-image:linear-gradient(135deg,${BRAND.navyDark},${BRAND.navy});padding:28px 36px;">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.gold};font-weight:600;">Partner Programme</p>
          <p style="margin:6px 0 0;font-size:24px;font-weight:700;color:#ffffff;">Aashray Infotech</p>
        </td>
      </tr>
      <tr><td style="height:4px;background:${BRAND.gold};font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td class="px" style="padding:36px;">${opts.body}</td></tr>
      <tr>
        <td class="px" style="background:#FAFBFD;padding:22px 36px;border-top:1px solid ${BRAND.line};">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.muted};">Questions? Write to <a href="mailto:${escapeHtml(supportEmail())}" style="color:${BRAND.navy};">${escapeHtml(supportEmail())}</a>. This is an automated message — replies are not monitored.</p>
          <p style="margin:8px 0 0;font-size:12px;color:#8C97A8;">&copy; ${year} Aashray Infotech Private Limited. Designed &amp; engineered in India.</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const h1 = (text: string) =>
  `<h1 class="h1" style="margin:0 0 12px;font-size:26px;line-height:1.25;color:${BRAND.navy};font-weight:700;">${text}</h1>`;
const p = (text: string) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${BRAND.muted};">${text}</p>`;
const hr = () => `<hr style="border:none;border-top:1px solid ${BRAND.line};margin:26px 0;" />`;
const small = (text: string) => `<p style="margin:0 0 6px;font-size:12px;color:#8C97A8;">${text}</p>`;

function button(label: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;"><tr><td>
    <a class="btn" href="${escapeHtml(url)}" style="display:inline-block;background:${BRAND.navy};color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:9px;font-weight:600;font-size:15px;">${escapeHtml(label)}</a>
  </td></tr></table>
  <p style="margin:0 0 16px;font-size:12px;color:#8C97A8;word-break:break-all;">Button not working? Paste this link into your browser:<br />${escapeHtml(url)}</p>`;
}

function callout(kind: 'info' | 'success' | 'warning' | 'danger', inner: string): string {
  const styles = {
    info: ['#EEF4FA', '#B9D0E6', BRAND.navy],
    success: ['#EAF6EF', '#9AD3B0', '#1D6B3F'],
    warning: ['#FFF7E6', '#F2D184', '#7A5800'],
    danger: ['#FDF0F0', '#F2B3B3', '#8F2323'],
  }[kind];
  return `<div style="background:${styles[0]};border:1px solid ${styles[1]};border-radius:10px;padding:16px 20px;margin:20px 0;color:${styles[2]};font-size:14px;line-height:1.6;">${inner}</div>`;
}

function refLine(label: string, value: string): string {
  return small(`${escapeHtml(label)}: <strong style="color:${BRAND.ink};">${escapeHtml(value)}</strong>`);
}

function toText(lines: string[]): string {
  return lines.filter((l) => l !== undefined).join('\n');
}

// ─── 1. Application received ────────────────────────────────────────────────────

export interface PortalCredentials {
  loginEmail: string;
  password: string;
}

export function applicationReceivedEmail(d: {
  applicationId: string;
  companyName: string;
  credentials?: PortalCredentials | null;
}): RenderedEmail {
  const loginUrl = `${frontendUrl()}/admin`;
  const credsHtml = d.credentials
    ? [
        callout(
          'info',
          `<strong>Your partner portal login</strong><br />Use these credentials to sign in at any time and track your application status.<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;"><tr><td style="padding:3px 14px 3px 0;color:${BRAND.muted};">Login email</td><td><strong style="font-family:Consolas,Menlo,monospace;color:${BRAND.ink};">${escapeHtml(d.credentials.loginEmail)}</strong></td></tr><tr><td style="padding:3px 14px 3px 0;color:${BRAND.muted};">Password</td><td><strong style="font-family:Consolas,Menlo,monospace;color:${BRAND.ink};">${escapeHtml(d.credentials.password)}</strong></td></tr></table>`
        ),
        button('Sign in to track your application', loginUrl),
        small('Please keep these credentials safe and do not share them.'),
      ].join('')
    : '';
  const subject = `We received your partner application — ${d.companyName}`;
  const html = layout({
    title: subject,
    preheader: 'Thanks for applying to the Aashray partner programme. Here is what happens next.',
    body: [
      h1(`Thank you, ${escapeHtml(d.companyName)}`),
      p('We have received your NiyamSaathi partner application. Our partnerships team will review it and get back to you.'),
      callout(
        'info',
        `<strong>What happens next</strong><br />1. Our team reviews your company details and documents.<br />2. You receive a decision by email — typically within <strong>3–5 business days</strong>.<br />3. If approved, you get a secure link to sign the partnership agreement and complete onboarding.`
      ),
      credsHtml,
      hr(),
      refLine('Application ID', d.applicationId),
      small('Please quote this ID in any correspondence.'),
    ].join(''),
  });
  const text = toText([
    `Thank you, ${d.companyName}`,
    '',
    'We have received your NiyamSaathi partner application.',
    'Expect a decision by email within 3-5 business days.',
    ...(d.credentials
      ? [
          '',
          'Your partner portal login (track your application status):',
          `Sign in: ${loginUrl}`,
          `Login email: ${d.credentials.loginEmail}`,
          `Password: ${d.credentials.password}`,
          'Please keep these credentials safe.',
        ]
      : []),
    '',
    `Application ID: ${d.applicationId}`,
  ]);
  return { subject, html, text };
}

// ─── 2. Approval & onboarding invite ────────────────────────────────────────────

export function approvalEmail(d: {
  applicationId: string;
  companyName: string;
  onboardingToken: string;
  missingDocs: { label: string }[];
}): RenderedEmail {
  const url = `${frontendUrl()}/onboarding/${d.onboardingToken}`;
  const hours = process.env.ONBOARDING_TOKEN_EXPIRES_HOURS || '72';
  const subject = `You're approved — begin onboarding, ${d.companyName}`;

  const docs = d.missingDocs.length
    ? callout(
        'warning',
        `<strong>Documents still needed</strong><ul style="margin:8px 0 0;padding-left:20px;">${d.missingDocs
          .map((m) => `<li style="margin:4px 0;">${escapeHtml(m.label)}</li>`)
          .join('')}</ul><div style="margin-top:8px;">You can upload these securely in the onboarding portal.</div>`
      )
    : callout('success', '<strong>Documents received.</strong> No additional uploads are required right now.');

  const html = layout({
    title: subject,
    preheader: 'Your partner application has been approved. Complete onboarding to activate your account.',
    body: [
      h1(`Congratulations, ${escapeHtml(d.companyName)}!`),
      p(`Your application to become an Aashray partner has been <strong style="color:#1D6B3F;">approved</strong>. Two quick steps remain: review &amp; accept the partnership agreement, then finish document verification.`),
      button('Begin partner onboarding', url),
      docs,
      hr(),
      small(`This link is valid for <strong>${escapeHtml(hours)} hours</strong>. If it expires, contact us and we will issue a new one.`),
      refLine('Application ID', d.applicationId),
    ].join(''),
  });
  const text = toText([
    `Congratulations, ${d.companyName}!`,
    '',
    'Your partner application has been approved.',
    `Begin onboarding: ${url}`,
    `The link is valid for ${hours} hours.`,
    d.missingDocs.length ? `Documents needed: ${d.missingDocs.map((m) => m.label).join(', ')}` : 'No additional documents are needed right now.',
    '',
    `Application ID: ${d.applicationId}`,
  ]);
  return { subject, html, text };
}

// ─── 3. Rejection with feedback ─────────────────────────────────────────────────

export function rejectionEmail(d: { applicationId: string; companyName: string; reason?: string }): RenderedEmail {
  const subject = `Update on your partner application — ${d.companyName}`;
  const html = layout({
    title: subject,
    preheader: 'An update on your Aashray partner application.',
    body: [
      h1('An update on your application'),
      p(`Thank you for your interest in partnering with Aashray, <strong>${escapeHtml(d.companyName)}</strong>. After careful review, we are unable to move forward with your application at this time.`),
      d.reason
        ? callout('danger', `<strong>Feedback from our team</strong><br />${escapeHtml(d.reason).replace(/\n/g, '<br />')}`)
        : '',
      p(`This is not necessarily final. If your circumstances change or you believe this decision was made in error, reply to <a href="mailto:${escapeHtml(supportEmail())}" style="color:${BRAND.navy};">${escapeHtml(supportEmail())}</a> and we will gladly take another look.`),
      hr(),
      refLine('Application ID', d.applicationId),
    ].join(''),
  });
  const text = toText([
    'An update on your application',
    '',
    `Thank you for applying, ${d.companyName}. We are unable to proceed at this time.`,
    d.reason ? `Feedback: ${d.reason}` : '',
    `Questions: ${supportEmail()}`,
    '',
    `Application ID: ${d.applicationId}`,
  ]);
  return { subject, html, text };
}

// ─── 4. Document re-request ─────────────────────────────────────────────────────

export function documentRequestEmail(d: {
  applicationId: string;
  companyName: string;
  onboardingToken: string;
  missingDocs: { label: string }[];
}): RenderedEmail {
  const url = `${frontendUrl()}/onboarding/${d.onboardingToken}`;
  const subject = `Action required: documents needed — ${d.companyName}`;
  const list = d.missingDocs.length
    ? `<ul style="margin:8px 0 0;padding-left:20px;">${d.missingDocs
        .map((m) => `<li style="margin:4px 0;">${escapeHtml(m.label)}</li>`)
        .join('')}</ul>`
    : '<div style="margin-top:6px;">Please re-upload the documents highlighted in your onboarding portal.</div>';

  const html = layout({
    title: subject,
    preheader: 'We need a few documents to continue your partner onboarding.',
    body: [
      h1('Documents required'),
      p(`Hello ${escapeHtml(d.companyName)}, to continue your partner onboarding we need the following:`),
      callout('warning', `<strong>Please provide</strong>${list}`),
      p('Accepted formats: PDF, JPG, PNG or WEBP, up to 10&nbsp;MB each.'),
      button('Upload documents', url),
      hr(),
      refLine('Application ID', d.applicationId),
    ].join(''),
  });
  const text = toText([
    `Documents required — ${d.companyName}`,
    '',
    d.missingDocs.length ? d.missingDocs.map((m) => `- ${m.label}`).join('\n') : 'Please re-upload the documents highlighted in your portal.',
    `Upload here: ${url}`,
    '',
    `Application ID: ${d.applicationId}`,
  ]);
  return { subject, html, text };
}

// ─── 5. Partner activation welcome ──────────────────────────────────────────────

export function partnerActivatedEmail(d: {
  applicationId: string;
  companyName: string;
  partnerCode?: string | null;
}): RenderedEmail {
  const subject = `Welcome to the Aashray Partner Network, ${d.companyName}`;
  const html = layout({
    title: subject,
    preheader: `${d.companyName} is now an active Aashray partner.`,
    body: [
      h1('Welcome aboard! 🎉'),
      callout('success', `<strong style="font-size:16px;">${escapeHtml(d.companyName)} is now an active Aashray partner.</strong>`),
      p('Your documents are verified and your partner account is fully active. Our partnerships team will reach out shortly with your onboarding kit, product training and commercial details.'),
      d.partnerCode
        ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;"><tr><td style="background:#FAFBFD;border:1px dashed ${BRAND.gold};border-radius:10px;padding:14px 22px;">
            <span style="display:block;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};">Your partner code</span>
            <span style="display:block;font-size:22px;font-weight:700;color:${BRAND.navy};font-family:Consolas,Menlo,monospace;">${escapeHtml(d.partnerCode)}</span>
          </td></tr></table>`
        : '',
      p(`Need anything in the meantime? Reach us at <a href="mailto:${escapeHtml(supportEmail())}" style="color:${BRAND.navy};">${escapeHtml(supportEmail())}</a>.`),
      hr(),
      refLine('Application ID', d.applicationId),
    ].join(''),
  });
  const text = toText([
    `Welcome to the Aashray Partner Network, ${d.companyName}!`,
    '',
    'Your partner account is now active.',
    d.partnerCode ? `Partner code: ${d.partnerCode}` : '',
    `Questions: ${supportEmail()}`,
    '',
    `Application ID: ${d.applicationId}`,
  ]);
  return { subject, html, text };
}
