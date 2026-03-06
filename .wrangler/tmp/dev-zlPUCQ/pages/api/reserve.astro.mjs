globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function verifyTurnstile(token, ip, secret) {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip })
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
const POST = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const ip = request.headers.get("CF-Connecting-IP") || "0.0.0.0";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "INVALID_EMAIL" }), {
        status: 400,
        headers: cors
      });
    }
    const tsSecret = env?.TURNSTILE_SECRET_KEY;
    if (tsSecret) {
      const tsToken = body?.turnstileToken || "";
      if (!tsToken) {
        return new Response(JSON.stringify({ ok: false, error: "BOT_CHALLENGE_REQUIRED" }), {
          status: 403,
          headers: cors
        });
      }
      const valid = await verifyTurnstile(tsToken, ip, tsSecret);
      if (!valid) {
        return new Response(JSON.stringify({ ok: false, error: "BOT_CHALLENGE_FAILED" }), {
          status: 403,
          headers: cors
        });
      }
    }
    const plan = body?.plan || "founder";
    const country = request.headers.get("CF-IPCountry") || "unknown";
    const ts = (/* @__PURE__ */ new Date()).toISOString();
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
      const existing = await env.DB.prepare(
        `SELECT id FROM reservations WHERE email = ?1`
      ).bind(email).first();
      if (!existing) {
        await env.DB.prepare(
          `INSERT INTO reservations (email, plan, country, ip, created_at) VALUES (?1, ?2, ?3, ?4, ?5)`
        ).bind(email, plan, country, ip, ts).run();
      }
    }
    return new Response(JSON.stringify({ ok: true, message: "Reservation logged.", ts }), {
      status: 200,
      headers: cors
    });
  } catch (err) {
    console.error("[reserve]", err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: cors
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    OPTIONS,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
