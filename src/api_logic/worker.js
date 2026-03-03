import init, { run_audit } from "../pkg/sentinel_api.js";
import wasm from "../pkg/sentinel_api_bg.wasm";
import { handleStripeWebhook } from "./webhook-stripe.js";
import { handleDashboard } from "./dashboard-auth.js";

let wasmInitPromise = null;

// Circuit Breaker AI — global per isolate (safeguard secundar)
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
//
// Schema KV pentru chei API:
//   key:   "apikey:<api_key>"
//   value: { "client_id": "org_acme", "plan": "starter", "rpm_limit": 60 }
//
// Schema KV pentru rate limit counter:
//   key:   "rl:<client_id>:<minute_bucket>"
//   value: "<count>"  (TTL: 90s)
//
async function authenticateRequest(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return { error: "MISSING_API_KEY", status: 401 };
  }

  const apiKey = authHeader.slice(7).trim();
  if (!apiKey) {
    return { error: "MISSING_API_KEY", status: 401 };
  }

  // ── VERSION ENFORCEMENT (The Kill Switch) ──
  const cliVersion = request.headers.get("X-Sentinel-CLI-Version");
  if (!cliVersion || semverCompare(cliVersion, "1.1.0") < 0) {
    return {
      error: "CLI_OUTDATED",
      status: 426,
      message: "This version is obsolete. Please upgrade to sentinel-scan v1.1.0+ to continue using Automated Compliance Intelligence."
    };
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

  // ── DEVELOPER TIER QUOTA (Monthly) ──
  if (client.plan === 'developer' || client.plan === 'hobby') {
    const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
    const quotaKey = `usage:${client.client_id}:${monthKey}`;
    const monthlyLimit = 1000;

    const currentUsage = parseInt(await env.CACHE.get(quotaKey) || "0", 10);
    if (currentUsage >= monthlyLimit) {
      return {
        error: "MONTHLY_QUOTA_EXCEEDED",
        status: 429,
        message: "Developer Tier limit reached (1,000 req/mo). Upgrade to Pro for unlimited access: https://sentinel-api.sentinel-moxo.workers.dev/upgrade"
      };
    }
    // Increment quota
    await env.CACHE.put(quotaKey, String(currentUsage + 1));
  }

  return { client };
}
// ─────────────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    // 1. Inițializare WASM (o singură dată per isolate)
    if (!wasmInitPromise) {
      wasmInitPromise = init(wasm);
    }
    await wasmInitPromise;

    const url = new URL(request.url);

    // Health check — public, fără auth
    if (url.pathname === '/health') {
      return new Response('Sentinel Audit API is operational (v3 — P0 Hardened)', { status: 200 });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // ── Stripe Webhook — autentificare proprie HMAC, nu necesită Bearer ──
    if (url.pathname === '/v1/webhooks/stripe') {
      return handleStripeWebhook(request, env);
    }
    // ─────────────────────────────────────────────────────────────────────

    // ── Dashboard — Magic Link auth propriu, nu necesită Bearer ──────────
    if (url.pathname.startsWith('/dashboard')) {
      return handleDashboard(request, env);
    }
    // ─────────────────────────────────────────────────────────────────────

    // ── P0: AUTENTIFICARE + RATE LIMIT ──
    const auth = await authenticateRequest(request, env);
    if (auth.error) {
      return new Response(JSON.stringify({
        error: auth.error,
        ...(auth.limit && { limit: auth.limit, reset_in_seconds: auth.reset_in_seconds })
      }), {
        status: auth.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const { client } = auth;
    // ────────────────────────────────────

    try {
      const manifestText = await request.text();
      let manifest;
      try {
        manifest = JSON.parse(manifestText);
      } catch (e) {
        return new Response(JSON.stringify({
          verdict: "INVALID_PAYLOAD",
          flags_triggered: ["MALFORMED_JSON_CONTRACT"],
          risk_score: 100,
          manual_review_required: false
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      // Pre-fill câmpuri opționale + suprascrie client_id din token (nu din payload)
      if (manifest.app_description === undefined) manifest.app_description = null;
      if (manifest.fallback_ai_verification === undefined) manifest.fallback_ai_verification = null;
      if (manifest.declared_flags === undefined) manifest.declared_flags = [];
      if (manifest.risk_category === undefined) manifest.risk_category = "Minimal";
      manifest.client_id = client.client_id; // Suprascris întotdeauna din token

      // 2. Fetch reguli din KV
      let rulesJson = '{"rules":[]}';
      if (env.CACHE) {
        const cached = await env.CACHE.get("active_rules");
        if (cached) rulesJson = JSON.stringify({ rules: JSON.parse(cached) });
      }

      // 3. Apel WASM sincron — decizia deterministă sub 5ms
      const verdictText = run_audit(JSON.stringify(manifest), rulesJson);
      let verdict = JSON.parse(verdictText);

      // 4. Rutarea verdictelor
      if (verdict.verdict === "NON_COMPLIANT") {
        // Art. 5 violation — răspuns instant, fără AI
        if (env.DB) ctx.waitUntil(logToD1(env.DB, verdict, client.client_id));
        return new Response(JSON.stringify(verdict), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } else if (verdict.verdict === "HUMAN_INTERVENTION_REQUIRED") {
        // Verificare circuit breaker global AI
        if (!checkGlobalAiLimit()) {
          verdict.flags_triggered.push("AI_GLOBAL_LIMIT_EXCEEDED: Manual review queued.");
          if (env.DB) ctx.waitUntil(logToD1(env.DB, verdict, client.client_id));
          return new Response(JSON.stringify(verdict), {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Apel Llama 3
        if (manifest.app_description && env.AI) {
          const systemPrompt = `You are a strict EU AI Act compliance auditor. Analyze the app description and the triggered flags. Return ONLY valid JSON: {"analysis": "reasoning", "confidence_score": 0.95, "final_verdict": true}. final_verdict=true means COMPLIANT, false means NON_COMPLIANT. NEVER add markdown or text outside the JSON.`;
          const userPrompt = `App: ${manifest.app_name}\nRisk Category: ${manifest.risk_category}\nDescription: ${manifest.app_description}\nTriggered Flags: ${verdict.flags_triggered.join(", ")}`;

          try {
            const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ]
            });

            const rawText = typeof aiResponse === 'string' ? aiResponse : (aiResponse?.response || '');
            const aiParsed = JSON.parse(rawText);

            if (aiParsed.confidence_score < 0.90) {
              verdict.flags_triggered.push(`AI_LOW_CONFIDENCE: ${aiParsed.confidence_score}. Human review required.`);
            } else if (aiParsed.final_verdict === true) {
              verdict.verdict = "COMPLIANT_VIA_AI_REVIEW";
              verdict.flags_triggered = [];
              verdict.risk_score = 0;
            } else {
              verdict.verdict = "NON_COMPLIANT";
              verdict.flags_triggered.push(`AI_VERDICT: ${aiParsed.analysis}`);
            }
          } catch (e) {
            verdict.flags_triggered.push("AI_FALLBACK_FAILED: Returned invalid format.");
          }
        }
      }

      // 5. Returnare răspuns sincron
      const response = new Response(JSON.stringify(verdict), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

      // 6. D1 Logging asincron — zero latență adăugată clientului
      if (env.DB) {
        ctx.waitUntil(logToD1(env.DB, verdict, client.client_id));
      }

      return response;

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
};

/**
 * Compară două șiruri de versiune semver (ex: "1.0.0", "1.1.0")
 * @returns {number} 1 dacă a > b, -1 dacă a < b, 0 dacă sunt egale
 */
function semverCompare(a, b) {
  const pa = a.split('.');
  const pb = b.split('.');
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i] || 0);
    const nb = Number(pb[i] || 0);
    if (na > nb) return 1;
    if (nb > na) return -1;
  }
  return 0;
}

/**
 * Insert asincron în D1 — rulează după ce răspunsul a fost trimis clientului
 */
async function logToD1(db, verdict, clientId) {
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
