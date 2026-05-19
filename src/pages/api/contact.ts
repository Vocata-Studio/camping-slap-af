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

  const html = `
    <h2>Ny henvendelse fra hjemmesiden</h2>
    <p><strong>Navn:</strong> ${escapeHtml(name)}<br/>
       <strong>Email:</strong> ${escapeHtml(email)}<br/>
       ${phone ? `<strong>Telefon:</strong> ${escapeHtml(phone)}<br/>` : ''}
    </p>
    <p><strong>Besked:</strong></p>
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `;

  const text = [
    'Ny henvendelse fra hjemmesiden',
    '',
    `Navn:  ${name}`,
    `Email: ${email}`,
    phone ? `Telefon: ${phone}` : null,
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
