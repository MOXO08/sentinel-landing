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
        const body = await request.json() as { email?: string; plan?: string; company?: string; role?: string; audit_id?: string; turnstileToken?: string };
        const email = body?.email?.trim().toLowerCase();
        const company = body?.company?.trim();
        const role = body?.role?.trim();
        const auditId = body?.audit_id?.trim();
        const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(JSON.stringify({ ok: false, error: 'INVALID_EMAIL' }), {
                status: 400, headers: cors,
            });
        }

        // ── Turnstile verification (Always fail-soft or use testing secret if no env) ──
        const tsSecret = env?.TURNSTILE_SECRET_KEY || '1X0000000000000000000000000000000AA';
        const tsToken = body?.turnstileToken || '';

        if (!tsToken && env?.TURNSTILE_SECRET_KEY) {
            return new Response(JSON.stringify({ ok: false, error: 'BOT_CHALLENGE_REQUIRED' }), {
                status: 403, headers: cors,
            });
        }

        if (tsToken) {
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
            // Updated schema for B2B Monetization Phase 1
            await env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS reservations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    plan TEXT NOT NULL DEFAULT 'founder',
                    company TEXT,
                    role TEXT,
                    audit_id_ref TEXT,
                    country TEXT,
                    ip TEXT,
                    created_at TEXT NOT NULL
                )
            `).run();

            // Attempt migration if columns missing (non-destructive)
            try {
                await env.DB.prepare("ALTER TABLE reservations ADD COLUMN company TEXT").run();
                await env.DB.prepare("ALTER TABLE reservations ADD COLUMN role TEXT").run();
                await env.DB.prepare("ALTER TABLE reservations ADD COLUMN audit_id_ref TEXT").run();
            } catch (e) { /* already exists */ }

            await env.DB.prepare(
                `INSERT INTO reservations (email, plan, company, role, audit_id_ref, country, ip, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
            ).bind(email, plan, company, role, auditId, country, ip, ts).run();
        }

        return new Response(JSON.stringify({ ok: true, message: 'Lead captured.', ts }), {
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
