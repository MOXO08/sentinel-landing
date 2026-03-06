globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ locals }) => {
  const env = locals.runtime?.env || locals.cloudflare?.env;
  let totalReads = 2950;
  let totalQueries = 198;
  let integrityScore = 100;
  let deployments = 7;
  try {
    if (env?.DB) {
      const now = Date.now();
      const globalCache = globalThis;
      if (!globalCache.__d1_count_cache || globalCache.__d1_count_cache.expiresAt < now) {
        const cnt = await env.DB.prepare(`SELECT COUNT(*) AS c FROM audit_logs`).first();
        const apps = await env.DB.prepare(`SELECT COUNT(DISTINCT app_name) AS n FROM audit_logs`).first();
        const compliant = await env.DB.prepare(`SELECT COUNT(*) AS c FROM audit_logs WHERE is_compliant = 1`).first();
        globalCache.__d1_count_cache = {
          c: cnt?.c || 0,
          n: apps?.n || 0,
          comp: compliant?.c || 0,
          expiresAt: now + 6e4
          // 60 seconds TTL
        };
      }
      const cached = globalCache.__d1_count_cache;
      if (cached.c > 0) totalReads += cached.c;
      if (cached.n > 0) {
        totalQueries += cached.n;
        deployments = 7 + cached.n;
      }
      if (cached.c > 0) {
        const rawScore = Math.round(cached.comp / cached.c * 100);
        integrityScore = Math.max(rawScore, 50);
      }
    }
  } catch (e) {
    console.error("[audit-count]", e);
  }
  try {
    const LS_KEY = env?.LEMONSQUEEZY_API_KEY;
    const LS_STORE = env?.LEMONSQUEEZY_STORE_ID;
    if (LS_KEY && LS_STORE) {
      const lsRes = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions?filter[store_id]=${LS_STORE}&filter[status]=active&page[size]=1`,
        { headers: { "Authorization": `Bearer ${LS_KEY}`, "Accept": "application/vnd.api+json" } }
      );
      if (lsRes.ok) {
        const lsData = await lsRes.json();
        const active = lsData?.meta?.page?.total ?? null;
        if (active !== null) deployments = active;
      }
    }
  } catch (e) {
    console.warn("[audit-count/lemonsqueezy]", e);
  }
  const systemStatus = integrityScore >= 75 ? "STABLE" : "CRITICAL";
  return new Response(JSON.stringify({
    count: totalQueries,
    totalReads,
    totalQueries,
    integrityScore,
    deployments,
    systemStatus,
    ts: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Expires": "0",
      "Pragma": "no-cache",
      "Surrogate-Control": "no-store"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
