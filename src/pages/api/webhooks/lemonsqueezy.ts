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

async function hashKey(key: string) {
    const msgUint8 = new TextEncoder().encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
    // SAFE ENV ACCESS - Prevents top-level crash
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env || (locals as any)?.env || {};

    const debugInfo: any = {
        has_db: !!env.DB,
        has_cache: !!env.CACHE,
        keys: Object.keys(env || {}),
        runtime_exists: !!runtime,
        timestamp: new Date().toISOString(),
        version: "V3_VERIFIED_22:15"
    };

    console.log(`[LS-WEBHOOK-V3] --- NEW REQUEST --- Debug: ${JSON.stringify(debugInfo)}`);

    const body = await request.text();
    const signature = request.headers.get('x-signature') || '';

    if (!env.LEMONSQUEEZY_WEBHOOK_SECRET) {
        console.error('[LS-WEBHOOK-V3] CRITICAL ERROR: LEMONSQUEEZY_WEBHOOK_SECRET is missing from environment');
        return new Response(JSON.stringify({
            error: 'Secret missing',
            debug: debugInfo,
            status: "DEPLOYMENT_MISCONFIGURED"
        }), { status: 500 });
    }

    const isValid = await verifyLemonSqueezySignature(body, signature, env.LEMONSQUEEZY_WEBHOOK_SECRET);
    if (!isValid) {
        console.error('[LS-WEBHOOK-V3] UNAUTHORIZED: Invalid Signature');
        return new Response(JSON.stringify({ error: 'Invalid signature', debug: debugInfo }), { status: 401 });
    }

    let payload;
    try {
        payload = JSON.parse(body);
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const eventName = payload.meta.event_name;
    const eventId = payload.data.id; // order_id or subscription_id
    console.log(`[LS-WEBHOOK-V3] Event Type: ${eventName} | Event ID: ${eventId}`);

    // ── REPLAY ATTACK PROTECTION ──
    if (env.CACHE) {
        const alreadyProcessed = await env.CACHE.get(`ls_event:${eventId}`);
        if (alreadyProcessed) {
            console.warn(`[LS-WEBHOOK-V3] Duplicate event detected and ignored: ${eventId}`);
            return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
        }
    }

    let updateResult = { changes: 0, error: null as string | null };

    if (eventName === 'order_created' || eventName === 'subscription_created') {
        const attributes = payload.data.attributes;
        const customerEmail = (attributes.user_email || attributes.customer_email || '').toLowerCase().trim();
        const variantId = String(attributes.variant_id);

        console.log(`[LS-WEBHOOK-V3] Processing Payment for: ${customerEmail} (Variant: ${variantId})`);

        if (!customerEmail) {
            return new Response(JSON.stringify({ error: 'No email found in LS payload' }), { status: 400 });
        }

        const apiToken = generateApiToken();
        let planType = 'founder';
        const variantName = (attributes.variant_name || '').toLowerCase();

        // Deterministic Mapping (P1 Audit Remediation)
        const fortressId = env.LEMON_FORTRESS_ID || '873708';
        const enterpriseId = env.LEMON_ENTERPRISE_ID || '868657';
        const proId = env.LEMON_PRO_ID || '868655';

        if (variantId === fortressId || variantName.includes('fortress')) planType = 'fortress';
        else if (variantId === enterpriseId || variantName.includes('watchtower')) planType = 'watchtower';
        else if (variantId === proId || variantName.includes('scale-up')) planType = 'scaleup';
        else if (variantName.includes('freemium')) planType = 'freemium';

        const rpmLimit = planType === 'scaleup' || planType === 'fortress' ? 300 : (planType === 'freemium' ? 20 : 80);

        // 1. KV Authentication Sync
        try {
            if (env.CACHE) {
                await env.CACHE.put(
                    `apikey:${apiToken}`,
                    JSON.stringify({ email: customerEmail, plan: planType, rpm_limit: rpmLimit }),
                    { metadata: { active: true, created_at: new Date().toISOString() } }
                );
                console.log('[LS-WEBHOOK-V3] KV Auth Token generated and stored');
            } else {
                console.warn('[LS-WEBHOOK-V3] WARNING: CACHE (KV) binding is missing');
            }
        } catch (kvErr) {
            console.error('[LS-WEBHOOK-V3] ERROR writing to KV:', kvErr);
        }

        // 2. D1 Persistence Update
        if (env.DB) {
            try {
                console.log(`[LS-WEBHOOK-V3] STARTING D1 UPDATE for ${customerEmail}...`);

                // Attempt to update existing reservation
                const updateRes = await env.DB.prepare(
                    `UPDATE reservations 
                     SET is_paid = 1, plan = ?1 
                     WHERE LOWER(TRIM(email)) = ?2`
                ).bind(planType, customerEmail).run();

                updateResult.changes = updateRes.meta.changes;
                console.log(`[LS-WEBHOOK-V3] D1 UPDATE: ${updateRes.meta.changes} rows affected.`);

                // FALLBACK: If no reservation exists, create a permanent client entry
                if (updateRes.meta.changes === 0) {
                    console.warn(`[LS-WEBHOOK-V3] No reservation found for ${customerEmail}. Auto-provisioning new client.`);
                    const clientId = `client_${Date.now()}`;
                    const hashedToken = await hashKey(apiToken); // Hash the key securely

                    const insertRes = await env.DB.prepare(
                        `INSERT OR IGNORE INTO clients (id, email, plan, status, api_key_hash, rpm_limit)
                         VALUES (?1, ?2, ?3, 'active', ?4, ?5)`
                    ).bind(clientId, customerEmail, planType, hashedToken, rpmLimit).run();

                    if (insertRes.success) {
                        console.log(`[LS-WEBHOOK-V3] New client created successfully: ${clientId}`);
                        updateResult.changes = 1; // Mark as successful for the response
                    }
                }
            } catch (err: any) {
                console.error('[LS-WEBHOOK-V3] CRITICAL D1 EXECUTION ERROR:', err.message);
                updateResult.error = err.message;
                return new Response(JSON.stringify({ error: 'DB_COMMIT_FAILURE', details: err.message, debug: debugInfo }), { status: 500 });
            }
        } else {
            console.error('[LS-WEBHOOK-V3] CRITICAL ERROR: DB (D1) binding is missing');
            return new Response(JSON.stringify({ error: 'DB_BINDING_MISSING', debug: debugInfo }), { status: 500 });
        }

        try {
            await sendWelcomeEmail(customerEmail, apiToken);
            console.log(`[LS-WEBHOOK-V3] Welcome email dispatched to ${customerEmail}`);
        } catch (err) {
            console.error('[LS-WEBHOOK-V3] NON-CRITICAL: Email delivery failed:', err);
        }

        // Mark as processed to prevent replay
        if (env.CACHE) {
            await env.CACHE.put(`ls_event:${eventId}`, 'PROCESSED', { expirationTtl: 60 * 60 * 24 * 7 });
        }
    }

    console.log(`[LS-WEBHOOK-V3] SUCCESS. Event ${eventName} processed. Returning 200 OK.`);

    return new Response(JSON.stringify({
        received: true,
        version: "V3.25_PROVISION_ACTIVE",
        event: eventName,
        updated_rows: updateResult.changes,
        debug: debugInfo
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'X-Sentinel-Status': 'PROVISION_ACTIVE'
        }
    });
};
