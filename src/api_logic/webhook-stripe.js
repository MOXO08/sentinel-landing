// sentinel-api/src/webhook-stripe.js
// POST /v1/webhooks/stripe
// Provizionare automată la checkout.session.completed

const STRIPE_API_BASE = 'https://api.stripe.com/v1';

/**
 * Verificare semnătură webhook Stripe (HMAC-SHA256)
 */
async function verifyStripeSignature(body, signatureHeader, secret) {
    const parts = signatureHeader.split(',').reduce((acc, part) => {
        const [k, v] = part.split('=');
        acc[k] = v;
        return acc;
    }, {});

    const timestamp = parts.t;
    const sigHex = parts.v1;

    if (!timestamp || !sigHex) return false;

    // Protecție replay: respinge webhooks mai vechi de 5 minute
    const tolerance = 300;
    if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > tolerance) return false;

    const signedPayload = `${timestamp}.${body}`;
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
    const computed = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');

    // Constant-time comparison
    if (computed.length !== sigHex.length) return false;
    let diff = 0;
    for (let i = 0; i < computed.length; i++) {
        diff |= computed.charCodeAt(i) ^ sigHex.charCodeAt(i);
    }
    return diff === 0;
}

/**
 * Generează un token criptografic `sntl_live_<32 bytes hex>`
 */
function generateApiToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `sntl_live_${hex}`;
}

/**
 * Email de bun venit via MailChannels (gratuit pe Cloudflare Workers)
 */
async function sendWelcomeEmail(toEmail, apiToken) {
    const curlSnippet = `curl -X POST https://api.gettingsentinel.com/v1/audit \\\\
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
  <a class="btn" href="https://api.gettingsentinel.com/v1/docs">Documentație completă →</a>
  <p style="color:#666;font-size:12px;">Sentinel API · EU AI Act Compliance Engine · <a href="https://api.gettingsentinel.com/v1">api.gettingsentinel.com</a></p>
</body>
</html>`;

    const text = `Bine ai venit la Sentinel API!\n\nCheia ta API:\n${apiToken}\n\nIntegrare rapidă:\n${curlSnippet}\n\nDocumentație: https://api.gettingsentinel.com/v1/docs`;

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

export async function handleStripeWebhook(request, env) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const body = await request.text();
    const signatureHeader = request.headers.get('stripe-signature') || '';

    // 1. Verifică autenticitatea webhook-ului
    if (!env.STRIPE_WEBHOOK_SECRET) {
        return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { status: 500 });
    }

    const isValid = await verifyStripeSignature(body, signatureHeader, env.STRIPE_WEBHOOK_SECRET);
    if (!isValid) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });
    }

    let event;
    try {
        event = JSON.parse(body);
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    // 2. Procesează doar evenimentul de checkout completat
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const stripeCustomerId = session.customer;
        const stripeSubscriptionId = session.subscription;

        if (!customerEmail) {
            console.error('No email in checkout session:', session.id);
            return new Response('OK', { status: 200 }); // returnăm 200 să nu retrieze Stripe
        }

        // 3. Generare token API
        const apiToken = generateApiToken();
        const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const planType = session.metadata?.plan || 'founder';
        const rpmLimit = planType === 'scaleup' ? 300 : 80;

        // 4. Salvare în KV (auth lookup rapid)
        await env.CACHE.put(
            `apikey:${apiToken}`,
            JSON.stringify({ client_id: clientId, plan: planType, rpm_limit: rpmLimit }),
            { metadata: { email: customerEmail } }
        );

        // 5. Salvare în D1 (billing + audit trail)
        if (env.DB) {
            try {
                await env.DB.prepare(
                    `INSERT INTO clients (id, email, stripe_customer_id, stripe_subscription_id, plan, status, api_key, rpm_limit)
           VALUES (?1, ?2, ?3, ?4, ?5, 'active', ?6, ?7)`
                ).bind(clientId, customerEmail, stripeCustomerId, stripeSubscriptionId, planType, apiToken, rpmLimit).run();
            } catch (err) {
                console.error('D1 client insert error:', err);
            }
        }

        // 6. Email de bun venit
        try {
            await sendWelcomeEmail(customerEmail, apiToken);
        } catch (err) {
            console.error('Email send error:', err);
            // Nu blocăm dacă emailul eșuează — cheia există deja în KV
        }

        console.log(`✅ Provisioned: ${clientId} for ${customerEmail}`);
    }

    // Stripe așteaptă 200 pentru orice eveniment procesat
    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
