import type { APIRoute } from 'astro';

export const prerender = false;

const SESSION_TTL = 60 * 60 * 24; // 24 ore
const MAGIC_LINK_TTL = 60 * 15;   // 15 minute

function generateToken(prefix = '') {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${prefix}${hex}`;
}

async function sendMagicLinkEmail(email: string, magicUrl: string) {
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

async function requireSession(request: Request, env: any) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/sentinel_session=([^;]+)/);
    if (!match) return null;

    const sessionData = await env.CACHE.get(`session:${match[1]}`);
    if (!sessionData) return null;
    return JSON.parse(sessionData);
}

async function getClientByEmail(env: any, email: string) {
    if (!env.DB) return null;
    const result = await env.DB.prepare(
        'SELECT id, email, api_key, plan, rpm_limit FROM clients WHERE email = ? AND status = "active" LIMIT 1'
    ).bind(email).first();
    return result;
}

// ── AUTH REQUEST ──────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, locals, params }) => {
    const env = (locals as any).runtime.env;
    const path = params.path;

    if (path === 'auth/request') {
        let email;
        try {
            const body = await request.json() as any;
            email = body.email?.toLowerCase().trim();
        } catch {
            return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
        }

        if (!email || !email.includes('@')) {
            return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400 });
        }

        const client = await getClientByEmail(env, email);
        if (!client) {
            return new Response(JSON.stringify({ message: 'If this email is registered, a link has been sent.' }), { status: 200 });
        }

        const magicToken = generateToken('magic_');
        await env.CACHE.put(
            `magic:${magicToken}`,
            JSON.stringify({ email, client_id: client.id }),
            { expirationTtl: MAGIC_LINK_TTL }
        );

        const magicUrl = `${url.origin}/api/dashboard/auth/verify?token=${magicToken}`;
        await sendMagicLinkEmail(email, magicUrl);

        return new Response(JSON.stringify({ message: 'If this email is registered, a link has been sent.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (path === 'auth/logout') {
        const cookie = request.headers.get('Cookie') || '';
        const match = cookie.match(/sentinel_session=([^;]+)/);
        if (match) await env.CACHE.delete(`session:${match[1]}`);

        return new Response(null, {
            status: 302,
            headers: {
                'Location': `/dashboard/login`,
                'Set-Cookie': 'sentinel_session=; Path=/; HttpOnly; Secure; Max-Age=0'
            }
        });
    }

    if (path === 'api/rotate') {
        const session = await requireSession(request, env);
        if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

        const client = await getClientByEmail(env, session.email);
        if (!client) return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404 });

        if (client.api_key) await env.CACHE.delete(`apikey:${client.api_key}`);

        const newKey = `sntl_live_${generateToken()}`;
        const kvData = { client_id: client.id, plan: client.plan, rpm_limit: client.rpm_limit };
        await env.CACHE.put(`apikey:${newKey}`, JSON.stringify(kvData));

        if (env.DB) {
            await env.DB.prepare('UPDATE clients SET api_key = ? WHERE id = ?')
                .bind(newKey, client.id).run();
        }

        return new Response(JSON.stringify({ new_key: newKey }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response('Not Found', { status: 404 });
};

export const GET: APIRoute = async ({ request, locals, params }) => {
    const env = (locals as any).runtime.env;
    const path = params.path;

    if (path === 'auth/verify') {
        const token = url.searchParams.get('token');
        if (!token) return new Response(null, { status: 302, headers: { 'Location': '/dashboard/login?error=missing_token' } });

        const magicData = await env.CACHE.get(`magic:${token}`);
        if (!magicData) return new Response(null, { status: 302, headers: { 'Location': '/dashboard/login?error=invalid_token' } });

        const { email, client_id } = JSON.parse(magicData);
        await env.CACHE.delete(`magic:${token}`);

        const sessionToken = generateToken('sess_');
        await env.CACHE.put(
            `session:${sessionToken}`,
            JSON.stringify({ email, client_id }),
            { expirationTtl: SESSION_TTL }
        );

        return new Response(null, {
            status: 302,
            headers: {
                'Location': `/dashboard`,
                'Set-Cookie': `sentinel_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL}`
            }
        });
    }

    const session = await requireSession(request, env);
    if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const client = await getClientByEmail(env, session.email);

    if (path === 'api/key') {
        if (!client) return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404 });
        const maskedKey = client.api_key ? `${client.api_key.slice(0, 16)}${'•'.repeat(20)}` : null;
        return new Response(JSON.stringify({
            api_key_masked: maskedKey,
            plan: client.plan,
            rpm_limit: client.rpm_limit
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (path === 'api/usage') {
        if (!env.DB || !client) {
            return new Response(JSON.stringify({ usage: [] }), { status: 200 });
        }

        const result = await env.DB.prepare(
            `SELECT DATE(created_at) as date, COUNT(*) as requests, 
       SUM(CASE WHEN status LIKE '%COMPLIANT%' THEN 1 ELSE 0 END) as compliant,
       SUM(CASE WHEN status = 'NON_COMPLIANT' THEN 1 ELSE 0 END) as non_compliant
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

    if (path === 'api/logs') {
        if (!env.DB || !client) {
            return new Response(JSON.stringify({ logs: [] }), { status: 200 });
        }

        const result = await env.DB.prepare(
            `SELECT app_name, version, status, is_compliant, triggered_rules, created_at, request_id, cli_version 
             FROM audit_logs 
             WHERE client_id = ? 
             ORDER BY created_at DESC LIMIT 50`
        ).bind(client.id).all();

        return new Response(JSON.stringify({ logs: result.results || [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (path === 'api/audit-detail') {
        const id = new URL(request.url).searchParams.get('id');
        if (!id || !env.DB || !client) {
            return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
        }

        // We join to ensure the user owns the audit they are requesting
        const result = await env.DB.prepare(
            `SELECT ar.* FROM Audit_Reports ar
             JOIN audit_logs al ON ar.Repo_ID = al.app_name AND ar.Commit_Hash = al.version
             WHERE al.request_id = ? AND al.client_id = ?
             LIMIT 1`
        ).bind(id, client.id).first();

        return new Response(JSON.stringify(result || { error: 'Not found' }), {
            status: result ? 200 : 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response('Not Found', { status: 404 });
};
