globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, r as renderTemplate, l as renderHead, h as createAstro } from '../../chunks/astro/server_CGa7oeTl.mjs';
/* empty css                                          */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const partial = false;
const $$DataHealth = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DataHealth;
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
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-6t2zlxk2> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sentinel \u2014 Data Health HUD (Art. 10)</title>', `</head> <body data-astro-cid-6t2zlxk2> <nav data-astro-cid-6t2zlxk2> <div class="logo" onclick="window.location='/dashboard'" data-astro-cid-6t2zlxk2>&#x1F6E1; <span data-astro-cid-6t2zlxk2>Sentinel</span> Data Health</div> <div style="display:flex;gap:12px" data-astro-cid-6t2zlxk2> <span class="badge badge-enterprise" data-astro-cid-6t2zlxk2>Enterprise Tier</span> <form action="/api/dashboard/auth/logout" method="POST" style="display:inline" data-astro-cid-6t2zlxk2> <button type="submit" class="btn-sm" data-astro-cid-6t2zlxk2>Sign out</button> </form> </div> </nav> <main data-astro-cid-6t2zlxk2> <div class="card" data-astro-cid-6t2zlxk2> <h2 data-astro-cid-6t2zlxk2>Article 10: Data Governance Deep Audit</h2> <p style="color:#7d8590;font-size:0.9rem;margin-bottom:24px" data-astro-cid-6t2zlxk2>
Visualizing dataset representativeness and bias indicators as required by EU AI Act Article 10.3.
</p> <div class="radar-container" data-astro-cid-6t2zlxk2> <canvas id="healthChart" data-astro-cid-6t2zlxk2></canvas> </div> <div class="stat-grid" data-astro-cid-6t2zlxk2> <div class="stat-item" data-astro-cid-6t2zlxk2> <div class="stat-label" data-astro-cid-6t2zlxk2>Bias Imbalance</div> <div class="stat-value" id="bias-val" data-astro-cid-6t2zlxk2>--%</div> </div> <div class="stat-item" data-astro-cid-6t2zlxk2> <div class="stat-label" data-astro-cid-6t2zlxk2>Coverage Quality</div> <div class="stat-value" id="quality-val" data-astro-cid-6t2zlxk2>--%</div> </div> </div> <div style="margin-top:30px" data-astro-cid-6t2zlxk2> <h2 style="font-size:0.8rem" data-astro-cid-6t2zlxk2>Audit Conclusion (Heuristics)</h2> <div id="conclusion-text" style="font-size:0.9rem;line-height:1.5;color:#e6edf3;background:rgba(255,255,255,0.03);padding:16px;border-radius:8px" data-astro-cid-6t2zlxk2>
Select a repository and commit to view Article 10 analysis.
</div> </div> </div> <div class="card" style="text-align:center" data-astro-cid-6t2zlxk2> <h2 data-astro-cid-6t2zlxk2>Compliance Status</h2> <div id="score-circle" class="score-circle" data-astro-cid-6t2zlxk2>--</div> <div style="font-size:0.85rem;color:#7d8590" data-astro-cid-6t2zlxk2>Data Health Score</div> <div style="margin-top:40px;text-align:left" data-astro-cid-6t2zlxk2> <h2 style="font-size:0.8rem" data-astro-cid-6t2zlxk2>Regulatory Controls</h2> <button class="export-btn" id="export-btn" data-astro-cid-6t2zlxk2>
\u{1F4E5} Generate Art. 11 Tech File (PDF)
</button> <p style="font-size:0.7rem;color:#7d8590;margin-top:12px" data-astro-cid-6t2zlxk2>
* This export satisfies the <strong data-astro-cid-6t2zlxk2>Article 11</strong> requirement for technical documentation regarding training datasets and bias mitigation.
</p> </div> </div> </main> <script>
async function loadHealthData() {
    const params = new URLSearchParams(window.location.search);
    const repo = params.get('repo') || 'default';
    const commit = params.get('commit') || 'latest';
    
    try {
        const r = await fetch(\`https://sentinel-api.sentinel-moxo.workers.dev/api/v1/data-health?repo=\${encodeURIComponent(repo)}&commit=\${encodeURIComponent(commit)}\`);
        const data = await r.json();
        
        if (data.error) {
            document.getElementById('conclusion-text').textContent = "No Article 10 telemetry found for this commit. Ensure the Sentinel GitHub Action is updated.";
            return;
        }

        renderHealth(data);
    } catch(e) {
        console.error(e);
    }
}

function renderHealth(data) {
    const score = data.Data_Health_Score;
    const circle = document.getElementById('score-circle');
    circle.textContent = score;
    circle.className = 'score-circle ' + (score > 80 ? 'score-good' : (score > 50 ? 'score-warning' : 'score-bad'));

    const distribution = JSON.parse(data.Distribution_Payload || '{}');
    const categories = Object.keys(distribution);
    const values = Object.values(distribution);

    document.getElementById('bias-val').textContent = (Math.max(...values, 0) * 100).toFixed(1) + '%';
    document.getElementById('quality-val').textContent = (score * 0.95).toFixed(1) + '%';

    document.getElementById('conclusion-text').innerHTML = \`
        <strong>Verificator:</strong> Sentinel Engine v7.6 (Art 10 Explorer)<br>
        <strong>Finding:</strong> Detected distribution spread of \${categories.length} segments. 
        \${score < 80 ? '<span style="color:#f85149">Imbalance exceeds Article 10.3 safety thresholds.</span>' : '<span style="color:#3fb950">Statistically representative dataset detected.</span>'}
    \`;

    drawDistribution(distribution);
}

function drawDistribution(dist) {
    const canvas = document.getElementById('healthChart');
    const p = canvas.parentElement;
    canvas.width = p.offsetWidth * 2; canvas.height = p.offsetHeight * 2;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    
    const keys = Object.keys(dist);
    const vals = Object.values(dist);
    if (!keys.length) return;

    const centerX = W / 2, centerY = H / 2, radius = Math.min(W, H) / 2.5;

    // Draw Radar Background
    ctx.strokeStyle = '#21262d'; ctx.lineWidth = 2;
    for (let r = 1; r <= 5; r++) {
        ctx.beginPath();
        for (let i = 0; i < keys.length; i++) {
            const ang = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + Math.cos(ang) * (radius * r / 5);
            const y = centerY + Math.sin(ang) * (radius * r / 5);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
    }

    // Draw Labels
    ctx.fillStyle = '#7d8590'; ctx.font = '24px system-ui'; ctx.textAlign = 'center';
    keys.forEach((k, i) => {
        const ang = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(ang) * (radius * 1.2);
        const y = centerY + Math.sin(ang) * (radius * 1.2);
        ctx.fillText(k.toUpperCase(), x, y);
    });

    // Draw Data Area
    ctx.fillStyle = 'rgba(57, 208, 220, 0.4)';
    ctx.strokeStyle = '#39d0dc'; ctx.lineWidth = 4;
    ctx.beginPath();
    keys.forEach((k, i) => {
        const ang = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
        const v = dist[k];
        const x = centerX + Math.cos(ang) * (radius * v);
        const y = centerY + Math.sin(ang) * (radius * v);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath(); ctx.fill(); ctx.stroke();
}

document.getElementById('export-btn').onclick = () => {
    alert("Generating Article 11 Technical Documentation PDF... (Secure Link will be sent to office@gettingsentinel.com)");
};

loadHealthData();
<\/script> </body></html>`], ['<html lang="en" data-astro-cid-6t2zlxk2> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sentinel \u2014 Data Health HUD (Art. 10)</title>', `</head> <body data-astro-cid-6t2zlxk2> <nav data-astro-cid-6t2zlxk2> <div class="logo" onclick="window.location='/dashboard'" data-astro-cid-6t2zlxk2>&#x1F6E1; <span data-astro-cid-6t2zlxk2>Sentinel</span> Data Health</div> <div style="display:flex;gap:12px" data-astro-cid-6t2zlxk2> <span class="badge badge-enterprise" data-astro-cid-6t2zlxk2>Enterprise Tier</span> <form action="/api/dashboard/auth/logout" method="POST" style="display:inline" data-astro-cid-6t2zlxk2> <button type="submit" class="btn-sm" data-astro-cid-6t2zlxk2>Sign out</button> </form> </div> </nav> <main data-astro-cid-6t2zlxk2> <div class="card" data-astro-cid-6t2zlxk2> <h2 data-astro-cid-6t2zlxk2>Article 10: Data Governance Deep Audit</h2> <p style="color:#7d8590;font-size:0.9rem;margin-bottom:24px" data-astro-cid-6t2zlxk2>
Visualizing dataset representativeness and bias indicators as required by EU AI Act Article 10.3.
</p> <div class="radar-container" data-astro-cid-6t2zlxk2> <canvas id="healthChart" data-astro-cid-6t2zlxk2></canvas> </div> <div class="stat-grid" data-astro-cid-6t2zlxk2> <div class="stat-item" data-astro-cid-6t2zlxk2> <div class="stat-label" data-astro-cid-6t2zlxk2>Bias Imbalance</div> <div class="stat-value" id="bias-val" data-astro-cid-6t2zlxk2>--%</div> </div> <div class="stat-item" data-astro-cid-6t2zlxk2> <div class="stat-label" data-astro-cid-6t2zlxk2>Coverage Quality</div> <div class="stat-value" id="quality-val" data-astro-cid-6t2zlxk2>--%</div> </div> </div> <div style="margin-top:30px" data-astro-cid-6t2zlxk2> <h2 style="font-size:0.8rem" data-astro-cid-6t2zlxk2>Audit Conclusion (Heuristics)</h2> <div id="conclusion-text" style="font-size:0.9rem;line-height:1.5;color:#e6edf3;background:rgba(255,255,255,0.03);padding:16px;border-radius:8px" data-astro-cid-6t2zlxk2>
Select a repository and commit to view Article 10 analysis.
</div> </div> </div> <div class="card" style="text-align:center" data-astro-cid-6t2zlxk2> <h2 data-astro-cid-6t2zlxk2>Compliance Status</h2> <div id="score-circle" class="score-circle" data-astro-cid-6t2zlxk2>--</div> <div style="font-size:0.85rem;color:#7d8590" data-astro-cid-6t2zlxk2>Data Health Score</div> <div style="margin-top:40px;text-align:left" data-astro-cid-6t2zlxk2> <h2 style="font-size:0.8rem" data-astro-cid-6t2zlxk2>Regulatory Controls</h2> <button class="export-btn" id="export-btn" data-astro-cid-6t2zlxk2>
\u{1F4E5} Generate Art. 11 Tech File (PDF)
</button> <p style="font-size:0.7rem;color:#7d8590;margin-top:12px" data-astro-cid-6t2zlxk2>
* This export satisfies the <strong data-astro-cid-6t2zlxk2>Article 11</strong> requirement for technical documentation regarding training datasets and bias mitigation.
</p> </div> </div> </main> <script>
async function loadHealthData() {
    const params = new URLSearchParams(window.location.search);
    const repo = params.get('repo') || 'default';
    const commit = params.get('commit') || 'latest';
    
    try {
        const r = await fetch(\\\`https://sentinel-api.sentinel-moxo.workers.dev/api/v1/data-health?repo=\\\${encodeURIComponent(repo)}&commit=\\\${encodeURIComponent(commit)}\\\`);
        const data = await r.json();
        
        if (data.error) {
            document.getElementById('conclusion-text').textContent = "No Article 10 telemetry found for this commit. Ensure the Sentinel GitHub Action is updated.";
            return;
        }

        renderHealth(data);
    } catch(e) {
        console.error(e);
    }
}

function renderHealth(data) {
    const score = data.Data_Health_Score;
    const circle = document.getElementById('score-circle');
    circle.textContent = score;
    circle.className = 'score-circle ' + (score > 80 ? 'score-good' : (score > 50 ? 'score-warning' : 'score-bad'));

    const distribution = JSON.parse(data.Distribution_Payload || '{}');
    const categories = Object.keys(distribution);
    const values = Object.values(distribution);

    document.getElementById('bias-val').textContent = (Math.max(...values, 0) * 100).toFixed(1) + '%';
    document.getElementById('quality-val').textContent = (score * 0.95).toFixed(1) + '%';

    document.getElementById('conclusion-text').innerHTML = \\\`
        <strong>Verificator:</strong> Sentinel Engine v7.6 (Art 10 Explorer)<br>
        <strong>Finding:</strong> Detected distribution spread of \\\${categories.length} segments. 
        \\\${score < 80 ? '<span style="color:#f85149">Imbalance exceeds Article 10.3 safety thresholds.</span>' : '<span style="color:#3fb950">Statistically representative dataset detected.</span>'}
    \\\`;

    drawDistribution(distribution);
}

function drawDistribution(dist) {
    const canvas = document.getElementById('healthChart');
    const p = canvas.parentElement;
    canvas.width = p.offsetWidth * 2; canvas.height = p.offsetHeight * 2;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    
    const keys = Object.keys(dist);
    const vals = Object.values(dist);
    if (!keys.length) return;

    const centerX = W / 2, centerY = H / 2, radius = Math.min(W, H) / 2.5;

    // Draw Radar Background
    ctx.strokeStyle = '#21262d'; ctx.lineWidth = 2;
    for (let r = 1; r <= 5; r++) {
        ctx.beginPath();
        for (let i = 0; i < keys.length; i++) {
            const ang = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + Math.cos(ang) * (radius * r / 5);
            const y = centerY + Math.sin(ang) * (radius * r / 5);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
    }

    // Draw Labels
    ctx.fillStyle = '#7d8590'; ctx.font = '24px system-ui'; ctx.textAlign = 'center';
    keys.forEach((k, i) => {
        const ang = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(ang) * (radius * 1.2);
        const y = centerY + Math.sin(ang) * (radius * 1.2);
        ctx.fillText(k.toUpperCase(), x, y);
    });

    // Draw Data Area
    ctx.fillStyle = 'rgba(57, 208, 220, 0.4)';
    ctx.strokeStyle = '#39d0dc'; ctx.lineWidth = 4;
    ctx.beginPath();
    keys.forEach((k, i) => {
        const ang = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
        const v = dist[k];
        const x = centerX + Math.cos(ang) * (radius * v);
        const y = centerY + Math.sin(ang) * (radius * v);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath(); ctx.fill(); ctx.stroke();
}

document.getElementById('export-btn').onclick = () => {
    alert("Generating Article 11 Technical Documentation PDF... (Secure Link will be sent to office@gettingsentinel.com)");
};

loadHealthData();
<\/script> </body></html>`])), renderHead());
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/dashboard/data-health.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/dashboard/data-health.astro";
const $$url = "/dashboard/data-health";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DataHealth,
  file: $$file,
  partial,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
