// Cloudflare Pages Function: receives the registration / contact forms from site.js and emails them to the AFSV VRC team.
// Environment (Pages → Settings → Variables and Secrets): RESEND_API_KEY (secret), MAIL_FROM (e.g. "AFSV VRC Booking <info@afsvvrc.com>"),
// NOTIFY_TO (default info@afsvvrc.com). The sending domain must be verified with the email provider.
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function onRequestPost({ request, env, params }) {
  if (!env.RESEND_API_KEY) return json({ message: 'Forms are not switched on yet. Please email info@afsvvrc.com.' }, 503);
  let data;
  try { data = await request.formData(); } catch { return json({ message: 'Could not read the form.' }, 400); }
  let labels = {}, consents = [];
  try { labels = JSON.parse(data.get('afsv_labels') || '{}'); } catch { /* ignore */ }
  try { consents = JSON.parse(data.get('afsv_consents') || '[]'); } catch { /* ignore */ }
  const email = String(data.get('email') || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ message: 'Please enter a valid email address.' }, 400);

  const skip = new Set(['afsv_labels', 'afsv_consents', 'afsv_page', 'afsv_title']);
  const rows = [];
  for (const [k, v] of data.entries()) if (!skip.has(k) && typeof v === 'string' && v) rows.push(`<tr><td><b>${esc(labels[k] || k)}</b></td><td>${esc(v)}</td></tr>`);
  const consentRows = consents.map((c) => `<li>${c.selected ? 'Yes' : 'No'}: ${esc(c.wording)}</li>`).join('');
  const body = `<h2>${esc(data.get('afsv_title') || params.id)}</h2><table cellpadding="6">${rows.join('')}</table>
<h3>Consent record</h3><ul>${consentRows}</ul><p>Page: ${esc(data.get('afsv_page'))}<br>Received: ${new Date().toISOString()}</p>`;

  const to = env.NOTIFY_TO || 'info@afsvvrc.com';
  const from = env.MAIL_FROM || 'AFSV VRC Booking <info@afsvvrc.com>';
  const send = (payload) => fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  const r = await send({ from, to: [to], reply_to: email, subject: `Booking site: ${data.get('afsv_title') || params.id}`, html: body });
  if (!r.ok) return json({ message: 'Something went wrong sending your form. Please email info@afsvvrc.com.' }, 502);
  await send({ from, to: [email], subject: 'We got your message', html: `<p>Hi,</p><p>Thanks for getting in touch with AFSV VRC Booking. We have your details and will be in touch soon. If you do not see our reply, please check your junk or spam folder.</p><p>AFSV VRC Global Development Group Limited<br>info@afsvvrc.com</p>` }).catch(() => {});
  return json({ ok: true });
}
