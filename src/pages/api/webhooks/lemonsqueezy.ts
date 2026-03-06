import type { APIRoute } from 'astro';

export const prerender = false;

async function verifyLemonSqueezySignature(body: string, signature: string, secret: string) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );

    // Lemon Squeezy signature is hex
    const sigBytes = new Uint8Array(signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        sigBytes,
        encoder.encode(body)
    );
    return isValid;
}

function generateApiToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `sntl_live_${hex}`;
}

async function sendWelcomeEmail(toEmail: string, apiToken: string) {
    const curlSnippet = `curl -X POST https://gettingsentinel.com/api/audit \\
  -H "Authorization: Bearer ${apiToken}" \\
  -H "Content-Type: application/json" \\
  -d '{"app_name":"my-app","version":"1.0","risk_category":"High","declared_flags":["human_oversight_enabled"]}'`;

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111; }
.key-box { background: #0d1117; color: #7ee787; font-family: monospace; padding: 16px; border-radius: 8px; word-break: break-all; font-size: 14px; }
.snippet { background: #0d1117; color: #e6edf3; font-family: monospace; padding: 16px; border-radius: 8px; font-size: 12px; white-space: pre-wrap; }
.btn { display: inline-block; background: #238636; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 16px 0; }
h1 { color: #0d1117; }
</style></head>
<body>
  <h1>🛡 Bine ai venit la Sentinel API</h1>
  <p>Contul tău este activ. Iată cheia ta API:</p>
  <div class="key-box">${apiToken}</div>
  <p>⚠️ <strong>Păstrează această cheie în siguranță.</strong> Nu o publica în cod sursă public.</p>
  <h2>Integrare rapidă (cURL)</h2>
  <div class="snippet">${curlSnippet}</div>
  <a class="btn" href="https://gettingsentinel.com/docs">Documentație completă →</a>
  <p style="color:#666;font-size:12px;">Sentinel API · EU AI Act Compliance Engine · <a href="https://gettingsentinel.com">gettingsentinel.com</a></p>
</body>
</html>`;

    const text = `Bine ai venit la Sentinel API!\n\nCheia ta API:\n${apiToken}\n\nIntegrare rapidă:\n${curlSnippet}\n\nDocumentație: https://gettingsentinel.com/docs`;

    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            personalizations: [{ to: [{ email: toEmail }] }],
            from: { email: 'noreply@sentinel-api.com', name: 'Sentinel API' },
            subject: '🛡 Cheia ta API Sentinel este gata',
            content: [
                { type: 'text/plain', value: text },
                { type: 'text/html', value: html }
            ]
        })
    });

    return response.ok;
}

export const POST: APIRoute = async ({ request, locals }) => {
    const env = (locals as any).runtime.env;
    const body = await request.text();
    const signature = request.headers.get('x-signature') || '';

    if (!env.LEMONSQUEEZY_WEBHOOK_SECRET) {
        console.error('LEMONSQUEEZY_WEBHOOK_SECRET not configured');
        return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { status: 500 });
    }

    const isValid = await verifyLemonSqueezySignature(body, signature, env.LEMONSQUEEZY_WEBHOOK_SECRET);
    if (!isValid) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });
    }

    let payload;
    try {
        payload = JSON.parse(body);
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const eventName = payload.meta.event_name;

    if (eventName === 'order_created' || eventName === 'subscription_created') {
        const attributes = payload.data.attributes;
        const customerEmail = attributes.user_email || attributes.customer_email;
        const variantId = String(attributes.variant_id); // This is what comes in the webhook

        // Mapping Variant IDs (extracted from URLs provided by user)
        // Founder: a4afd393...
        // Freemium: 4239b25b...
        // Scale-up: 2e6f810b...
        // Note: LS numeric IDs are usually preferred, but we'll use a safer logic if possible.
        // For now, we'll try to match the variant name or ID if available.

        let planType = 'founder';
        if (attributes.variant_name?.toLowerCase().includes('freemium')) planType = 'freemium';
        if (attributes.variant_name?.toLowerCase().includes('scale-up')) planType = 'scaleup';

        const apiToken = generateApiToken();
        const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const rpmLimit = planType === 'scaleup' ? 300 : (planType === 'freemium' ? 20 : 80);

        // Save to KV
        await env.CACHE.put(
            `apikey:${apiToken}`,
            JSON.stringify({ client_id: clientId, plan: planType, rpm_limit: rpmLimit }),
            { metadata: { email: customerEmail } }
        );

        // Save to D1
        if (env.DB) {
            try {
                await env.DB.prepare(
                    `INSERT INTO clients (id, email, plan, status, api_key, rpm_limit)
                     VALUES (?1, ?2, ?3, 'active', ?4, ?5)`
                ).bind(clientId, customerEmail, planType, apiToken, rpmLimit).run();
            } catch (err) {
                console.error('D1 client insert error:', err);
            }
        }

        // Send Email
        try {
            await sendWelcomeEmail(customerEmail, apiToken);
        } catch (err) {
            console.error('Email send error:', err);
        }
    }

    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
