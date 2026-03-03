// sentinel-api/src/dashboard-auth.js
import { getDashboardLoginPage, getDashboardPage } from './dashboard-ui.js';


const SESSION_TTL = 60 * 60 * 24; // 24 ore
const MAGIC_LINK_TTL = 60 * 15;   // 15 minute

function generateToken(prefix = '') {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${prefix}${hex}`;
}

async function sendMagicLinkEmail(email, magicUrl) {
    const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
    <h2>&#x1F6E1; Sentinel Dashboard</h2>
    <p>Click below to access your dashboard (link expires in 15 minutes):</p>
    <a href="${magicUrl}" style="display:inline-block;background:#238636;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:700;margin:16px 0">
      Access Dashboard &rarr;
    </a>
    <p style="color:#666;font-size:12px">If you didn't request this, ignore this email.</p>
  </body></html>`;

    await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: { email: 'noreply@sentinel-api.com', name: 'Sentinel API' },
            subject: '&#x1F6E1; Your Sentinel Dashboard access link',
            content: [{ type: 'text/html', value: html }]
        })
    });
}

async function requireSession(request, env) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/sentinel_session=([^;]+)/);
    if (!match) return null;

    const sessionData = await env.CACHE.get(`session:${match[1]}`);
    if (!sessionData) return null;
    return JSON.parse(sessionData);
}

async function getClientByEmail(env, email) {
    if (!env.DB) return null;
    const result = await env.DB.prepare(
        'SELECT id, email, api_key, plan, rpm_limit FROM clients WHERE email = ? AND status = "active" LIMIT 1'
    ).bind(email).first();
    return result;
}

export async function handleDashboard(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8' };

    // ── Pagini HTML ───────────────────────────────────────────────────────────
    if ((path === '/dashboard' || path === '/dashboard/') && request.method === 'GET') {
        const session = await requireSession(request, env);
        if (!session) return Response.redirect(`${url.origin}/dashboard/login`, 302);
        return new Response(getDashboardPage(), { status: 200, headers: htmlHeaders });
    }

    if (path === '/dashboard/login' && request.method === 'GET') {
        return new Response(getDashboardLoginPage(), { status: 200, headers: htmlHeaders });
    }
    // ─────────────────────────────────────────────────────────────────────────

    // ── POST /dashboard/auth/request ──────────────────────────────────────────
    if (path === '/dashboard/auth/request' && request.method === 'POST') {
        let email;
        try {
            const body = await request.json();
            email = body.email?.toLowerCase().trim();
        } catch {
            return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
        }

        if (!email || !email.includes('@')) {
            return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400 });
        }

        // Verifică că emailul există în D1 (client activ)
        const client = await getClientByEmail(env, email);
        if (!client) {
            // Răspunde cu același mesaj pentru securitate (anti-enumeration)
            return new Response(JSON.stringify({ message: 'If this email is registered, a link has been sent.' }), { status: 200 });
        }

        const magicToken = generateToken('magic_');
        await env.CACHE.put(
            `magic:${magicToken}`,
            JSON.stringify({ email, client_id: client.id }),
            { expirationTtl: MAGIC_LINK_TTL }
        );

        const magicUrl = `${url.origin}/dashboard/auth/verify?token=${magicToken}`;
        await sendMagicLinkEmail(email, magicUrl);

        return new Response(JSON.stringify({ message: 'If this email is registered, a link has been sent.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // ── GET /dashboard/auth/verify ────────────────────────────────────────────
    if (path === '/dashboard/auth/verify' && request.method === 'GET') {
        const token = url.searchParams.get('token');
        if (!token) return Response.redirect(`${url.origin}/dashboard/login?error=missing_token`);

        const magicData = await env.CACHE.get(`magic:${token}`);
        if (!magicData) return Response.redirect(`${url.origin}/dashboard/login?error=invalid_token`);

        const { email, client_id } = JSON.parse(magicData);
        await env.CACHE.delete(`magic:${token}`); // Single use

        const sessionToken = generateToken('sess_');
        await env.CACHE.put(
            `session:${sessionToken}`,
            JSON.stringify({ email, client_id }),
            { expirationTtl: SESSION_TTL }
        );

        return new Response(null, {
            status: 302,
            headers: {
                'Location': `${url.origin}/dashboard`,
                'Set-Cookie': `sentinel_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL}`
            }
        });
    }

    // ── POST /dashboard/auth/logout ───────────────────────────────────────────
    if (path === '/dashboard/auth/logout' && request.method === 'POST') {
        const cookie = request.headers.get('Cookie') || '';
        const match = cookie.match(/sentinel_session=([^;]+)/);
        if (match) await env.CACHE.delete(`session:${match[1]}`);

        return new Response(null, {
            status: 302,
            headers: {
                'Location': `${new URL(request.url).origin}/dashboard/login`,
                'Set-Cookie': 'sentinel_session=; Path=/; HttpOnly; Secure; Max-Age=0'
            }
        });
    }

    // ── Protected routes ──────────────────────────────────────────────────────
    const session = await requireSession(request, env);
    if (!session) {
        if (request.headers.get('Accept')?.includes('application/json')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        return Response.redirect(`${url.origin}/dashboard/login`);
    }

    const client = await getClientByEmail(env, session.email);

    // ── GET /dashboard/api/key ────────────────────────────────────────────────
    if (path === '/dashboard/api/key' && request.method === 'GET') {
        if (!client) return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404 });
        const maskedKey = client.api_key ? `${client.api_key.slice(0, 16)}${'•'.repeat(20)}` : null;
        return new Response(JSON.stringify({
            api_key_masked: maskedKey,
            plan: client.plan,
            rpm_limit: client.rpm_limit
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // ── POST /dashboard/api/rotate ────────────────────────────────────────────
    if (path === '/dashboard/api/rotate' && request.method === 'POST') {
        if (!client) return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404 });

        // Invalidează cheia veche din KV
        if (client.api_key) await env.CACHE.delete(`apikey:${client.api_key}`);

        // Generează cheie nouă
        const newKey = `sntl_live_${generateToken()}`;
        const kvData = { client_id: client.id, plan: client.plan, rpm_limit: client.rpm_limit };
        await env.CACHE.put(`apikey:${newKey}`, JSON.stringify(kvData));

        // Actualizează D1
        if (env.DB) {
            await env.DB.prepare('UPDATE clients SET api_key = ? WHERE id = ?')
                .bind(newKey, client.id).run();
        }

        return new Response(JSON.stringify({ new_key: newKey }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // ── GET /dashboard/api/usage ──────────────────────────────────────────────
    if (path === '/dashboard/api/usage' && request.method === 'GET') {
        if (!env.DB || !client) {
            return new Response(JSON.stringify({ usage: [] }), { status: 200 });
        }

        const result = await env.DB.prepare(
            `SELECT DATE(created_at) as date, COUNT(*) as requests, 
       SUM(CASE WHEN verdict LIKE '%COMPLIANT%' THEN 1 ELSE 0 END) as compliant,
       SUM(CASE WHEN verdict = 'NON_COMPLIANT' THEN 1 ELSE 0 END) as non_compliant
       FROM audit_logs 
       WHERE client_id = ? AND created_at >= date('now', '-30 days')
       GROUP BY DATE(created_at) 
       ORDER BY date ASC`
        ).bind(client.id).all();

        return new Response(JSON.stringify({ usage: result.results || [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response('Not Found', { status: 404 });
}
