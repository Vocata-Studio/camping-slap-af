import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const FROM = 'Camping Slap Af <kontakt@noreply.vocata.studio>';
const SUBJECT = 'Hjemmeside henvendelse';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO;

  if (!apiKey || !to) {
    console.error('contact: missing RESEND_API_KEY / CONTACT_TO');
    return json(500, { error: 'server_misconfigured' });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const name = String(payload.name ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const phone = String(payload.phone ?? '').trim();
  const message = String(payload.message ?? '').trim();

  if (!name || name.length > 200) return json(400, { error: 'invalid_name' });
  if (!EMAIL_RE.test(email) || email.length > 320) return json(400, { error: 'invalid_email' });
  if (!message || message.length > 5000) return json(400, { error: 'invalid_message' });
  if (phone.length > 50) return json(400, { error: 'invalid_phone' });

  const html = `<!DOCTYPE html>
<html lang="da">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f6f4;font-family:'Inter',Arial,sans-serif;color:#1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f4;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#2B9854;border-radius:8px 8px 0 0;padding:28px 36px;text-align:center;">
            <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.75);">Camping Slap Af</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">Ny henvendelse</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

            <!-- Field rows -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:20px;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#6B7280;">Navn</p>
                  <p style="margin:0;font-size:15px;color:#1A1A1A;">${escapeHtml(name)}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#6B7280;">Email</p>
                  <p style="margin:0;font-size:15px;"><a href="mailto:${escapeHtml(email)}" style="color:#2B9854;text-decoration:none;">${escapeHtml(email)}</a></p>
                </td>
              </tr>
              ${phone ? `<tr>
                <td style="padding:20px 0;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#6B7280;">Telefon</p>
                  <p style="margin:0;font-size:15px;color:#1A1A1A;">${escapeHtml(phone)}</p>
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding-top:20px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#6B7280;">Besked</p>
                  <p style="margin:0;font-size:15px;line-height:1.65;color:#1A1A1A;white-space:pre-wrap;">${escapeHtml(message)}</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Reply CTA -->
        <tr>
          <td style="background:#ffffff;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;padding:0 36px 32px;text-align:center;">
            <a href="mailto:${escapeHtml(email)}?subject=Re%3A%20Din%20henvendelse%20til%20Camping%20Slap%20Af"
               style="display:inline-block;background:#2B9854;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:6px;">
              Svar til ${escapeHtml(name)}
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:16px 36px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">campingslapaf.dk &mdash; Sejerslev, Mors&oslash;</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    'Ny henvendelse fra hjemmesiden',
    '',
    `Navn: ${name}`,
    '',
    `Email: ${email}`,
    phone ? `\nTelefon: ${phone}` : null,
    '',
    'Besked:',
    message,
  ].filter(Boolean).join('\n');

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    replyTo: email,
    subject: SUBJECT,
    html,
    text,
  });

  if (error) {
    console.error('contact: resend error', error);
    return json(502, { error: 'send_failed' });
  }

  return json(200, { id: data?.id ?? null });
};
