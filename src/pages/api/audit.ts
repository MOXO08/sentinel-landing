import init, { run_audit } from "../../api_pkg/sentinel_api.js";
import wasm from "../../api_pkg/sentinel_api_bg.wasm";
import type { APIRoute } from 'astro';

export const prerender = false;

let wasmInitPromise: Promise<any> | null = null;

// Circuit Breaker AI
const AI_REFILL_INTERVAL = 60000;
const AI_MAX_CALLS = 5;
let aiCallCount = 0;
let lastAiRefill = Date.now();

function checkGlobalAiLimit() {
    const now = Date.now();
    if (now - lastAiRefill > AI_REFILL_INTERVAL) {
        aiCallCount = 0;
        lastAiRefill = now;
    }
    if (aiCallCount >= AI_MAX_CALLS) return false;
    aiCallCount++;
    return true;
}

// ─── AUTH + RATE LIMIT PER CLIENT ────────────────────────────────────────────
async function authenticateRequest(request: Request, env: any) {
    const authHeader = request.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
        return { error: "MISSING_API_KEY", status: 401 };
    }

    const apiKey = authHeader.slice(7).trim();
    if (!apiKey) {
        return { error: "MISSING_API_KEY", status: 401 };
    }

    const clientData = await env.CACHE.get(`apikey:${apiKey}`);
    if (!clientData) {
        return { error: "INVALID_API_KEY", status: 401 };
    }

    let client;
    try {
        client = JSON.parse(clientData);
    } catch {
        return { error: "CORRUPTED_KEY_DATA", status: 500 };
    }

    // ── RATE LIMIT (RPM) ──
    const minuteBucket = Math.floor(Date.now() / 60000);
    const rlKey = `rl:${client.client_id}:${minuteBucket}`;
    const rpmLimit = client.rpm_limit || 60;

    const currentRPM = parseInt(await env.CACHE.get(rlKey) || "0", 10);
    if (currentRPM >= rpmLimit) {
        return { error: "RATE_LIMIT_EXCEEDED", status: 429, limit: rpmLimit };
    }
    await env.CACHE.put(rlKey, String(currentRPM + 1), { expirationTtl: 90 });

    return { client };
}

export const POST: APIRoute = async ({ request, locals }) => {
    const env = (locals as any).runtime.env;

    // 1. Inițializare WASM (pentru Cloudflare SSR)
    if (!wasmInitPromise) {
        try {
            wasmInitPromise = init(wasm);
        } catch (e) {
            console.error("WASM Init Error:", e);
            throw e;
        }
    }
    await wasmInitPromise;

    // 2. AUTENTIFICARE
    const auth = await authenticateRequest(request, env);
    if (auth.error) {
        return new Response(JSON.stringify({ error: auth.error }), {
            status: auth.status,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const { client } = auth;

    try {
        const manifestText = await request.text();
        let manifest;
        try {
            manifest = JSON.parse(manifestText);
        } catch (e) {
            return new Response(JSON.stringify({ verdict: "INVALID_PAYLOAD" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        manifest.client_id = client.client_id;

        // 3. Fetch reguli din KV
        let rulesJson = '{"rules":[]}';
        if (env.CACHE) {
            const cached = await env.CACHE.get("active_rules");
            if (cached) rulesJson = JSON.stringify({ rules: JSON.parse(cached) });
        }

        // 4. Apel WASM sincron
        const verdictText = run_audit(JSON.stringify(manifest), rulesJson);
        let verdict = JSON.parse(verdictText);

        // 5. Rutarea verdictelor
        if (verdict.verdict === "NON_COMPLIANT") {
            if (env.DB) await logToD1(env.DB, verdict, client.client_id);
            return new Response(JSON.stringify(verdict), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 6. Returnare răspuns sincron
        const response = new Response(JSON.stringify(verdict), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

        // 7. D1 Logging
        if (env.DB) {
            await logToD1(env.DB, verdict, client.client_id);
        }

        return response;

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

async function logToD1(db: any, verdict: any, clientId: string) {
    try {
        const isCompliant = (verdict.verdict === "COMPLIANT" || verdict.verdict === "COMPLIANT_VIA_AI_REVIEW") ? 1 : 0;
        await db.prepare(
            `INSERT INTO audit_logs (app_name, version, client_id, status, is_compliant, rules_version)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
        ).bind(
            verdict.app_name,
            verdict.version,
            clientId || "anonymous",
            verdict.verdict,
            isCompliant,
            verdict.rules_version || "unknown"
        ).run();
    } catch (err) {
        console.error("D1 Insert Error:", err);
    }
}
