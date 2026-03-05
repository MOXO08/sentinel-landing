// /api/reserve.ts — Save email reservation to D1 with Turnstile bot protection
import type { APIRoute } from 'astro';

export const prerender = false;

async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
    try {
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret, response: token, remoteip: ip }),
        });
        const data = await res.json() as { success: boolean };
        return data.success === true;
    } catch {
        return false;
    }
}

export const POST: APIRoute = async ({ request, locals }) => {
    const env = (locals as any).runtime?.env;
    const cors = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };

    try {
        const body = await request.json() as { email?: string; plan?: string; turnstileToken?: string };
        const email = body?.email?.trim().toLowerCase();
        const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(JSON.stringify({ ok: false, error: 'INVALID_EMAIL' }), {
                status: 400, headers: cors,
            });
        }

        // ── Turnstile verification (skip if no secret configured — dev mode) ──
        const tsSecret = env?.TURNSTILE_SECRET_KEY;
        if (tsSecret) {
            const tsToken = body?.turnstileToken || '';
            if (!tsToken) {
                return new Response(JSON.stringify({ ok: false, error: 'BOT_CHALLENGE_REQUIRED' }), {
                    status: 403, headers: cors,
                });
            }
            const valid = await verifyTurnstile(tsToken, ip, tsSecret);
            if (!valid) {
                return new Response(JSON.stringify({ ok: false, error: 'BOT_CHALLENGE_FAILED' }), {
                    status: 403, headers: cors,
                });
            }
        }

        const plan = body?.plan || 'founder';
        const country = request.headers.get('CF-IPCountry') || 'unknown';
        const ts = new Date().toISOString();

        if (env?.DB) {
            await env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS reservations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    plan TEXT NOT NULL DEFAULT 'founder',
                    country TEXT,
                    ip TEXT,
                    created_at TEXT NOT NULL
                )
            `).run();

            const existing = (await env.DB.prepare(
                `SELECT id FROM reservations WHERE email = ?1`
            ).bind(email).first()) as { id: number } | null;

            if (!existing) {
                await env.DB.prepare(
                    `INSERT INTO reservations (email, plan, country, ip, created_at) VALUES (?1, ?2, ?3, ?4, ?5)`
                ).bind(email, plan, country, ip, ts).run();
            }
        }

        return new Response(JSON.stringify({ ok: true, message: 'Reservation logged.', ts }), {
            status: 200, headers: cors,
        });
    } catch (err: any) {
        console.error('[reserve]', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 500, headers: cors,
        });
    }
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
};
