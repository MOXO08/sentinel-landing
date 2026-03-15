import type { APIRoute } from 'astro';

export const prerender = false;

// ── Rate Limiting (Prevent Spam) ──
const SPAM_LIMIT = 5;
const RATE_LIMIT_TTL = 3600; // 1 hour

export const POST: APIRoute = async ({ request, locals }) => {
    const env = (locals as any).runtime.env;

    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    if (env.CACHE) {
        const rateKey = `rl_lead:${ip}`;
        const currentCount = parseInt(await env.CACHE.get(rateKey) || "0", 10);
        if (currentCount >= SPAM_LIMIT) {
            return new Response(JSON.stringify({ error: 'LIMIT_EXCEEDED' }), { status: 429 });
        }
        await env.CACHE.put(rateKey, String(currentCount + 1), { expirationTtl: RATE_LIMIT_TTL });
    }

    let payload;
    try {
        payload = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'INVALID_JSON' }), { status: 400 });
    }

    const { 
        name, company, email, role, industry, volume, architecture, 
        data_location, requirements, pii_data, dedicated_region,
        req_dedicated_worker, req_sla, req_onprem 
    } = payload;

    // Reject freemail addresses
    const freemailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "protonmail.com"];
    const emailDomain = email?.split('@')[1]?.toLowerCase();
    
    if (!emailDomain || freemailDomains.includes(emailDomain)) {
        return new Response(JSON.stringify({ error: 'CORPORATE_EMAIL_REQUIRED' }), { status: 400 });
    }

    if (!name || !company || !email || !volume || !architecture) {
        return new Response(JSON.stringify({ error: 'MISSING_FIELDS' }), { status: 400 });
    }

    try {
        if (env.DB) {
            await env.DB.prepare(
                `INSERT INTO enterprise_leads (name, company, email, volume, architecture, dedicated_region, role, industry, req_dedicated_worker, req_sla, req_onprem)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
            ).bind(
                name, company, email, volume, architecture, dedicated_region ? 1 : 0,
                role || '', industry || '', req_dedicated_worker ? 1 : 0, req_sla ? 1 : 0, req_onprem ? 1 : 0
            ).run();
        }

        // Send Email via MailChannels
        const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111; }
.box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-size: 14px; margin-bottom: 24px; }
h1 { color: #0d1117; font-size: 18px; }
strong { color: #0f172a; }
</style>
</head>
<body>
  <h1>🏰 New Fortress Vault Request</h1>
  <div class="box">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Role:</strong> ${role || 'N/A'}</p>
      <p><strong>Industry:</strong> ${industry || 'N/A'}</p>
  </div>
  <div class="box">
      <p><strong>Estimated Volume (Audits/mo):</strong> ${volume}</p>
      <p><strong>PII/Health Processing:</strong> ${pii_data ? 'YES' : 'NO'}</p>
      <p><strong>Data Residency:</strong> ${data_location || 'N/A'}</p>
      <p><strong>Requires Dedicated Region:</strong> ${dedicated_region ? 'YES' : 'NO'}</p>
  </div>
  <div class="box">
      <p><strong>Technical Checkboxes:</strong></p>
      <ul>
          <li>Worker Dedicat / Izolat Fizic: ${req_dedicated_worker ? 'YES' : 'NO'}</li>
          <li>Suport SLA < 1h & Dedicated Compliance Officer: ${req_sla ? 'YES' : 'NO'}</li>
          <li>On-Premise / Hybrid Deployment: ${req_onprem ? 'YES' : 'NO'}</li>
      </ul>
      <p><strong>Architecture & Compliance Needs:</strong><br/>${architecture}</p>
      <p><strong>Specific Regulatory Req:</strong><br/>${requirements || 'N/A'}</p>
  </div>
</body>
</html>`;

        const emailPayload = {
            personalizations: [{ to: [{ email: 'office@gettingsentinel.com' }] }],
            from: { email: 'noreply@sentinel-api.com', name: 'Sentinel Sales' },
            subject: `🚨 [ENTERPRISE] New Fortress Lead: ${company}`,
            content: [{ type: 'text/html', value: html }]
        };

        const mailRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload)
        });

        if (!mailRes.ok) {
            console.error("MailChannels Error:", await mailRes.text());
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        console.error("Enterprise Lead Submit Error:", e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
