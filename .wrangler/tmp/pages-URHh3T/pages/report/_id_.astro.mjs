globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_CGa7oeTl.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Do7llZzW.mjs';
/* empty css                                   */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const { DB } = Astro2.locals.runtime.env;
  let report = null;
  let error = null;
  try {
    const result = await DB.prepare(
      "SELECT * FROM Audit_Reports WHERE Repo_ID = ? OR Commit_Hash = ? LIMIT 1"
    ).bind(id, id).first();
    if (result) {
      report = {
        ...result,
        payload: JSON.parse(result.JSON_Payload)
      };
    } else {
      error = "Report not found or still processing.";
    }
  } catch (e) {
    console.error("D1 Fetch Error:", e);
    error = "Infrastructure connection issue. Please retry.";
  }
  const scoreColor = report?.Scor_Compliance >= 80 ? "text-emerald-400" : report?.Scor_Compliance >= 50 ? "text-amber-400" : "text-red-400";
  const borderColor = report?.Scor_Compliance >= 80 ? "border-emerald-500/20" : report?.Scor_Compliance >= 50 ? "border-amber-500/20" : "border-red-500/20";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Shadow Audit: ${report?.Repo_ID || "Not Found"}`, "data-astro-cid-mzfl6kou": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen pt-32 pb-20 px-6 container mx-auto max-w-4xl" data-astro-cid-mzfl6kou> ${error ? renderTemplate`<div class="glass p-12 rounded-3xl text-center border-red-500/20" data-astro-cid-mzfl6kou> <div class="text-4xl mb-6" data-astro-cid-mzfl6kou>🔍</div> <h1 class="text-2xl font-bold text-white mb-4" data-astro-cid-mzfl6kou>${error}</h1> <p class="text-slate-400 mb-8" data-astro-cid-mzfl6kou>If this is a recent audit, it might take a few seconds to propagate.</p> <a href="/" class="btn-emerald inline-flex" data-astro-cid-mzfl6kou>Return to Safety</a> </div>` : renderTemplate`<div${addAttribute(`glass p-8 md:p-12 rounded-[2rem] border ${borderColor} relative overflow-hidden`, "class")} data-astro-cid-mzfl6kou> <!-- Background Glow --> <div class="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" data-astro-cid-mzfl6kou></div> <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10" data-astro-cid-mzfl6kou> <div data-astro-cid-mzfl6kou> <div class="section-label mb-2" data-astro-cid-mzfl6kou>SHADOW AUDIT REPORT (UNCLAIMED)</div> <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight mb-2" data-astro-cid-mzfl6kou> ${report.Repo_ID} </h1> <p class="mono text-xs text-slate-500 uppercase tracking-widest" data-astro-cid-mzfl6kou>
COMMIT: ${report.Commit_Hash.substring(0, 12)}...
</p> </div> <div class="flex flex-col items-center" data-astro-cid-mzfl6kou> <div${addAttribute(`text-6xl font-black ${scoreColor} mb-1`, "class")} data-astro-cid-mzfl6kou> ${report.Scor_Compliance} </div> <div class="mono text-[10px] text-slate-500 font-bold" data-astro-cid-mzfl6kou>COMPLIANCE SCORE</div> </div> </div> <!-- Risk Summary --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10" data-astro-cid-mzfl6kou> <div class="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl" data-astro-cid-mzfl6kou> <h3 class="mono text-xs font-bold text-slate-400 mb-4 uppercase" data-astro-cid-mzfl6kou>AI Act Status</h3> <div${addAttribute(`text-xl font-bold ${report.payload.verdict === "COMPLIANT" ? "text-emerald-400" : "text-red-400"}`, "class")} data-astro-cid-mzfl6kou> ${report.payload.verdict.replace(/_/g, " ")} </div> </div> <div class="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl" data-astro-cid-mzfl6kou> <h3 class="mono text-xs font-bold text-slate-400 mb-4 uppercase" data-astro-cid-mzfl6kou>Engine Version</h3> <div class="text-xl font-bold text-white" data-astro-cid-mzfl6kou>Sentinel WASM v2.1</div> </div> </div> <!-- Violations List --> <div class="space-y-4 mb-12 relative z-10" data-astro-cid-mzfl6kou> <h3 class="section-label mb-6" data-astro-cid-mzfl6kou>Detected Anomalies (${report.payload.violations?.length || 0})</h3> ${report.payload.violations?.map((v) => renderTemplate`<div${addAttribute(`bg-slate-900/30 border p-6 rounded-2xl flex flex-col gap-4 transition-all ${v.article === "LOCKED" ? "border-dashed border-slate-700 opacity-60" : "border-slate-800/50"}`, "class")} data-astro-cid-mzfl6kou> <div class="flex justify-between items-start" data-astro-cid-mzfl6kou> <div data-astro-cid-mzfl6kou> <span${addAttribute(`text-[10px] border px-2 py-0.5 rounded-full mono font-bold mr-2 ${v.article === "LOCKED" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`, "class")} data-astro-cid-mzfl6kou> ${v.article} </span> <span${addAttribute(`text-white font-bold ${v.article === "LOCKED" ? "italic" : ""}`, "class")} data-astro-cid-mzfl6kou>${v.description}</span> </div> <span class="mono text-[10px] text-slate-600" data-astro-cid-mzfl6kou>${v.severity}</span> </div> <div${addAttribute(`p-4 rounded-xl ${v.article === "LOCKED" ? "bg-amber-500/5 border border-amber-500/10" : "bg-indigo-500/5 border border-indigo-500/10"}`, "class")} data-astro-cid-mzfl6kou> <div${addAttribute(`text-[10px] mono font-bold mb-2 uppercase tracking-tighter ${v.article === "LOCKED" ? "text-amber-400" : "text-indigo-400"}`, "class")} data-astro-cid-mzfl6kou> ${v.article === "LOCKED" ? "Access Restricted:" : "Recommended Fix (The Fix):"} </div> <code${addAttribute(`text-xs block ${v.article === "LOCKED" ? "text-amber-300" : "text-indigo-300"}`, "class")} data-astro-cid-mzfl6kou>${v.fix_snippet}</code> </div> ${v.article === "LOCKED" && renderTemplate`<a href="#pricing" class="mt-2 text-center text-[10px] font-bold text-amber-400 hover:underline uppercase tracking-widest" data-astro-cid-mzfl6kou>
Unlock Full Regulatory Report &rarr;
</a>`} </div>`)} ${report.payload.violations?.length === 0 && renderTemplate`<div class="text-center py-12 glass border-dashed border-slate-800" data-astro-cid-mzfl6kou> <div class="text-emerald-400 text-3xl mb-4" data-astro-cid-mzfl6kou>🛡️</div> <p class="text-slate-400" data-astro-cid-mzfl6kou>No prohibited practices or high-risk violations detected.</p> </div>`} </div> <!-- NEW: REGULATORY PANIC WIDGETS --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10" data-astro-cid-mzfl6kou> <div class="glass p-6 rounded-2xl border-amber-500/20 bg-amber-500/[0.03]" data-astro-cid-mzfl6kou> <div class="flex items-center gap-2 mb-4" data-astro-cid-mzfl6kou> <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" data-astro-cid-mzfl6kou></span> <h3 class="mono text-[10px] font-bold text-amber-400 uppercase tracking-widest" data-astro-cid-mzfl6kou>Regulatory Deadline</h3> </div> <div class="text-2xl font-black text-white mb-1" data-astro-cid-mzfl6kou>Aug 2026</div> <p class="text-[10px] text-slate-500 leading-relaxed uppercase" data-astro-cid-mzfl6kou>EU AI Act Enforcement for High-Risk Systems starts in 512 days. Unaudited models face immediate market ban.</p> </div> <div class="glass p-6 rounded-2xl border-red-500/20 bg-red-500/[0.03]" data-astro-cid-mzfl6kou> <div class="flex items-center gap-2 mb-4" data-astro-cid-mzfl6kou> <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse" data-astro-cid-mzfl6kou></span> <h3 class="mono text-[10px] font-bold text-red-400 uppercase tracking-widest" data-astro-cid-mzfl6kou>Exposure Estimator</h3> </div> <div class="text-2xl font-black text-white mb-1" data-astro-cid-mzfl6kou>€35.000.000</div> <p class="text-[10px] text-slate-500 leading-relaxed uppercase" data-astro-cid-mzfl6kou>Projected max fine (7% of global turnover) for detected Article 5/10 non-compliance.</p> </div> </div> <!-- CTA --> <div class="relative z-10 bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center" data-astro-cid-mzfl6kou> <h2 class="text-xl font-bold text-white mb-4" data-astro-cid-mzfl6kou>Secure your CI/CD with Continuous Monitoring</h2> <p class="text-slate-400 text-sm mb-8 max-w-md mx-auto" data-astro-cid-mzfl6kou>
This report was snapshots via Sentinel Shadow Audit. Install the GitHub App to enable real-time risk mitigation and automated compliance signatures.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center" data-astro-cid-mzfl6kou> <a${addAttribute(`/report/article43/${id}`, "href")} class="btn-emerald" data-astro-cid-mzfl6kou>Draft Article 43 Proof →</a> <a href="mailto:office@gettingsentinel.com?subject=Enterprise%20Invoice%20Request" class="px-8 py-3 rounded-xl border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/10 transition-all no-underline" data-astro-cid-mzfl6kou>Request Enterprise Invoice</a> </div> </div> </div>`} <div class="mt-8 text-center mono text-[9px] text-slate-600 uppercase tracking-widest" data-astro-cid-mzfl6kou>
Cryptographic Signature: ${report?.Signature || "PENDING_AT_EDGE"} </div> </main> ` })} `;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/report/[id].astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/report/[id].astro";
const $$url = "/report/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
