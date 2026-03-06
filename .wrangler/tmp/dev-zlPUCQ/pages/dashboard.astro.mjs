globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, r as renderTemplate, l as renderHead, h as createAstro } from '../chunks/astro/server_C0THm8nM.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const partial = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const cookie = Astro2.request.headers.get("Cookie") || "";
  const match = cookie.match(/sentinel_session=([^;]+)/);
  const env = Astro2.locals.runtime.env;
  if (!match) {
    return Astro2.redirect("/dashboard/login");
  }
  const sessionData = await env.CACHE.get(`session:${match[1]}`);
  if (!sessionData) {
    return Astro2.redirect("/dashboard/login");
  }
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-y55gmoyq> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sentinel \u2014 Compliance Dashboard</title><script src="https://assets.lemonsqueezy.com/lemon.js" defer><\/script>', `</head> <body data-astro-cid-y55gmoyq> <nav data-astro-cid-y55gmoyq> <div class="logo" data-astro-cid-y55gmoyq>&#x1F6E1; <span data-astro-cid-y55gmoyq>Compliance</span> Dashboard</div> <form action="/api/dashboard/auth/logout" method="POST" style="display:inline" data-astro-cid-y55gmoyq> <button type="submit" class="btn-sm" data-astro-cid-y55gmoyq>Sign out</button> </form> </nav> <main data-astro-cid-y55gmoyq> <!-- API KEY --> <div class="card" data-astro-cid-y55gmoyq> <h2 data-astro-cid-y55gmoyq>Your API Infrastructure</h2> <div class="key-box" data-astro-cid-y55gmoyq> <span id="key-display" data-astro-cid-y55gmoyq>Loading...</span> <button class="btn-copy" id="copy-btn" data-astro-cid-y55gmoyq>Copy</button> </div> <div class="meta" id="key-meta" data-astro-cid-y55gmoyq></div> <div class="meta" style="color:#d29922;margin-top:4px" id="limit-warning" data-astro-cid-y55gmoyq></div> <br data-astro-cid-y55gmoyq> <button class="btn-rotate" id="rotate-btn" data-astro-cid-y55gmoyq>&#x21bb; Regenerate Key</button> <div class="warning" data-astro-cid-y55gmoyq>\u26A0\uFE0F Rotating will immediately invalidate your Immutable Audit Trail key.</div> <div id="new-key-box" data-astro-cid-y55gmoyq></div> </div> <!-- USAGE CHART --> <div class="card" data-astro-cid-y55gmoyq> <h2 data-astro-cid-y55gmoyq>Automated Compliance Logs (30 Days)</h2> <canvas id="usageChart" data-astro-cid-y55gmoyq></canvas> </div> <!-- COMPLIANCE REPORTS --> <div class="card" data-astro-cid-y55gmoyq> <h2 data-astro-cid-y55gmoyq>Automated Compliance Reports</h2> <p style="color:#7d8590;font-size:0.9rem;margin-bottom:20px" data-astro-cid-y55gmoyq>
Generate audit-grade PDF reports including:
<br data-astro-cid-y55gmoyq>&bull; <strong data-astro-cid-y55gmoyq>Immutable Audit UUID</strong> (from Edge)
<br data-astro-cid-y55gmoyq>&bull; <strong data-astro-cid-y55gmoyq>Cloudflare-Native Timestamp</strong> <br data-astro-cid-y55gmoyq>&bull; <strong data-astro-cid-y55gmoyq>Ruleset Version:</strong> 2026-Q1.1
<br data-astro-cid-y55gmoyq>&bull; <strong data-astro-cid-y55gmoyq>Diagnostic Verdict</strong> </p> <button class="btn-copy" style="width:100%;background:#39d0dc;color:#0a0d12;padding:12px;margin-bottom:12px" onclick="alert('Feature coming soon for Pro B2B accounts.')" data-astro-cid-y55gmoyq>
Download Latest Report (PDF)
</button> <hr style="border:0;border-top:1px solid #21262d;margin:20px 0" data-astro-cid-y55gmoyq> <h2 style="font-size:0.8rem" data-astro-cid-y55gmoyq>Subscription & Billing</h2> <a href="https://radumuresanu.lemonsqueezy.com/billing" class="stripe-btn" style="width:100%;text-align:center" data-astro-cid-y55gmoyq>
&#x1F4CB; Manage Subscription & Billing &rarr;
</a> </div> </main> <footer data-astro-cid-y55gmoyq> <div style="max-width:900px;margin:0 auto;padding:40px 24px;text-align:center;border-top:1px solid #21262d;margin-top:40px" data-astro-cid-y55gmoyq> <p style="color:#7d8590;font-size:0.75rem" data-astro-cid-y55gmoyq>
&copy; 2026 Sentinel API \u2014 Technical Compliance Infrastructure.
<br data-astro-cid-y55gmoyq><br data-astro-cid-y55gmoyq> <strong data-astro-cid-y55gmoyq>Software as a Tool Disclaimer:</strong> Sentinel is a technical analysis utility and does not constitute legal advice. High-risk AI compliance remains the sole responsibility of the provider.
</p> </div> </footer> <script>
let currentKey = null;

async function loadKey() {
  try {
    const r = await fetch('/api/dashboard/api/key');
    if (r.status === 401) { window.location = '/dashboard/login'; return; }
    const d = await r.json();
    currentKey = d.api_key_masked;
    document.getElementById('key-display').textContent = d.api_key_masked || 'No key found';
    document.getElementById('key-meta').innerHTML = 
      '<strong>Plan:</strong> ' + (d.plan === 'developer' ? 'Developer (Free)' : 'Pro B2B') + 
      ' &nbsp;&bull;&nbsp; <strong>Protection:</strong> Immutable Audit Trail active';
      document.getElementById('limit-warning').innerHTML = 
        '\u26A0\uFE0F Developer Tier: 1,000 requests/month limit. <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/a4afd393-f642-41c7-ba71-bec3200ad514" class="lemonsqueezy-button" style="color:#39d0dc;text-decoration:none">Upgrade to Founder &rarr;</a>';
  } catch(e) { document.getElementById('key-display').textContent = 'Error loading key'; }
}

async function copyKey() {
  if (currentKey) {
    await navigator.clipboard.writeText(currentKey);
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 2000);
  }
}

async function rotateKey() {
  if (!confirm('Are you sure? Your current key will stop working immediately.')) return;
  const r = await fetch('/api/dashboard/api/rotate', { method: 'POST' });
  const d = await r.json();
  if (d.new_key) {
    const box = document.getElementById('new-key-box');
    box.textContent = 'New key: ' + d.new_key;
    box.style.display = 'block';
    currentKey = d.new_key;
    document.getElementById('key-display').textContent = d.new_key.slice(0, 16) + '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';
  }
}

async function loadUsage() {
  try {
    const r = await fetch('/api/dashboard/api/usage');
    const d = await r.json();
    const usage = d.usage || [];
    if (!usage.length) { document.getElementById('usageChart').parentElement.querySelector('h2').textContent += ' \u2014 No data yet'; return; }
    drawChart(usage);
  } catch {}
}

function drawChart(data) {
  const canvas = document.getElementById('usageChart');
  canvas.width = canvas.offsetWidth * 2; canvas.height = 360;
  const ctx = canvas.getContext('2d');
  const max = Math.max(...data.map(d => d.requests), 1);
  const W = canvas.width, H = canvas.height;
  const pad = 40; const barW = Math.floor((W - pad * 2) / data.length * 0.7);
  const gap = Math.floor((W - pad * 2) / data.length);
  ctx.fillStyle = '#0a0d12'; ctx.fillRect(0, 0, W, H);
  data.forEach((d, i) => {
    const x = pad + i * gap; const h = ((d.requests / max) * (H - pad * 2));
    const y = H - pad - h;
    ctx.fillStyle = '#1f6feb'; ctx.fillRect(x, y, barW, h);
    if (d.non_compliant > 0) {
      const rh = ((d.non_compliant / max) * (H - pad * 2));
      ctx.fillStyle = '#f85149'; ctx.fillRect(x, H - pad - rh, barW, rh);
    }
    ctx.fillStyle = '#484f58'; ctx.font = '20px system-ui';
    ctx.fillText(d.date?.slice(5) || '', x, H - 10);
  });
}

document.getElementById('copy-btn').addEventListener('click', copyKey);
document.getElementById('rotate-btn').addEventListener('click', rotateKey);

loadKey(); loadUsage();
<\/script> </body></html>`])), renderHead());
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/dashboard/index.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/dashboard/index.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  partial,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
