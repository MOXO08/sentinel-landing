globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CGa7oeTl.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Do7llZzW.mjs';
export { renderers } from '../../renderers.mjs';

const $$UsCompanies = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sentinel for US Companies | EU AI Act Compliance", "description": "Exporting AI to Europe? Learn how US-based AI companies can use Sentinel to ensure immediate EU AI Act compliance via deterministic audit logs." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen"> <a href="/" class="text-emerald-500 hover:text-emerald-400 font-mono text-sm mb-8 inline-block transition-colors">&larr; Back to Sentinel</a> <article class="prose prose-invert prose-emerald max-w-none"> <div class="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mono text-xs mb-6 font-bold tracking-widest">WIKI / COMPLIANCE GUIDES</div> <h1 class="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white leading-tight">Sentinel for US Companies</h1> <p class="text-xl text-slate-300 leading-relaxed mb-12 border-l-2 border-slate-700 pl-6">
A definitive guide for United States-based AI organizations exporting models, APIs, and SaaS applications to the European Union under the AI Act.
</p> <hr class="border-slate-800 my-10"> <h2 class="text-2xl font-semibold mb-4 text-white">The Compliance Mandate</h2> <p class="text-slate-400 mb-6 leading-relaxed">
If you develop an AI system in the US and make it available in the EU market (even via an API or a SaaS platform), the EU AI Act applies to you. For <strong>High-Risk AI Systems</strong> (e.g., employment, credit tracking, healthcare, critical infrastructure), Articles 12, 13, and 14 mandate strict logging, transparency, and human oversight.
</p> <p class="text-slate-400 mb-8 leading-relaxed">
Failure to comply can result in administrative fines of up to <strong class="text-white">€35 million or 7% of global annual turnover</strong>, whichever is higher, alongside a potential ban from operating in the EU.
</p> <div class="glass p-8 rounded-2xl mb-12 border-l-4 border-l-emerald-500 relative overflow-hidden group"> <div class="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2 relative z-10"><span class="text-emerald-500 text-xl">⚡</span> The Sentinel Advantage</h3> <p class="text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
Instead of spending months and millions of dollars restructuring your US infrastructure to appease EU regulators, Sentinel acts as a zero-egress, deterministic audit layer at the edge.
</p> <ul class="list-none space-y-4 text-sm text-slate-400 m-0 p-0 relative z-10"> <li class="flex items-start gap-3"><span class="text-emerald-500 mt-0.5 font-bold">✓</span> <div><strong class="text-white">Zero Data Egress:</strong> Sentinel processes audit metadata via WASM, ensuring your proprietary AI outputs and training parameters never leave your controlled environment.</div></li> <li class="flex items-start gap-3"><span class="text-emerald-500 mt-0.5 font-bold">✓</span> <div><strong class="text-white">Cryptographic Proofs:</strong> Every audit log is hashed and time-stamped locally, providing irrefutable mathematical proof of compliance directly to EU regulators without exposing raw data.</div></li> <li class="flex items-start gap-3"><span class="text-emerald-500 mt-0.5 font-bold">✓</span> <div><strong class="text-white">Drop-in Integration:</strong> Add Sentinel to your existing Node.js, Python, or Rust stack in less than 5 minutes. No architecture overhaul or dedicated compliance engineering team required.</div></li> </ul> </div> <h2 class="text-2xl font-semibold mb-4 text-white">How it Works for US Exporters</h2> <p class="text-slate-400 mb-6 leading-relaxed">
Sentinel sits invisibly between your US-hosted AI models and your EU customers. By routing requests through our lightweight Cloudflare Edge implementation or integrating our SDK natively, you automatically generate compliant audit trails for every interaction before it legally crosses borders.
</p> <div class="grid md:grid-cols-2 gap-6 mb-12"> <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/30 transition-colors"> <div class="text-emerald-500 font-mono text-xs mb-2 tracking-widest font-bold">01 / INTEGRATE</div> <h4 class="text-white font-semibold mb-2">Install the SDK</h4> <p class="text-sm text-slate-400 leading-relaxed">Add the Sentinel SDK to your API gateway or application backend. It runs asynchronously via WebAssembly, adding near-zero computational latency (<0.21ms) to your model's response time.</p> </div> <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/30 transition-colors"> <div class="text-emerald-500 font-mono text-xs mb-2 tracking-widest font-bold">02 / AUTOMATE</div> <h4 class="text-white font-semibold mb-2">Deterministic Logging</h4> <p class="text-sm text-slate-400 leading-relaxed">Sentinel autonomously logs the mandated regulatory metadata (inputs, latency, deterministic risk vectors) into an immutable SQLite-backed edge store (Cloudflare D1), ready for compliance reporting.</p> </div> </div> <h2 class="text-2xl font-semibold mb-4 text-white">Next Steps for US Teams</h2> <p class="text-slate-400 mb-8 leading-relaxed">
Don't let regulatory friction slow your European expansion. Secure your infrastructure today with Sentinel's enterprise-grade compliance engine and continue scaling globally with confidence.
</p> <a href="/#pricing" class="btn-emerald inline-flex px-8 py-4 no-underline font-semibold tracking-wide">
View Integration Plans &rarr;
</a> </article> </main> ` })}`;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/wiki/us-companies.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/wiki/us-companies.astro";
const $$url = "/wiki/us-companies";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$UsCompanies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
