globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_CGa7oeTl.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Do7llZzW.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Finance = createComponent(($$result, $$props, $$slots) => {
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "Sentinel for Financial Services", "description": "EU AI Act compliance for financial institutions. MiFID II alignment, algorithmic trading AI audit, credit scoring transparency obligations.", "url": "https://gettingsentinel.com/use-cases/finance", "publisher": { "@type": "Organization", "name": "Sentinel" } };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sentinel for Finance \u2014 EU AI Act & MiFID II AI Compliance", "description": "EU AI Act compliance for banks, asset managers, and fintech. Deterministic audit trails for algorithmic trading, credit scoring, and fraud detection AI systems." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<header class="sticky top-9 z-50 border-b border-slate-900/80 backdrop-blur-xl bg-space/80"> <nav class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between"> <a href="/" class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-space font-black text-sm">S</div><span class="font-bold text-sm text-white">SENTINEL</span></a> <div class="flex gap-3"><a href="/#pricing" class="btn-ghost !py-2 !px-4 !text-xs">View Plans</a><a href="/#pricing" class="btn-emerald !py-2 !px-4 !text-xs">Get Access</a></div> </nav> </header> <main class="max-w-screen-lg mx-auto px-6"> <section class="pt-28 pb-16 text-center"> <div class="text-5xl mb-6">\u{1F3E6}</div> <div class="section-label justify-center mb-4">INDUSTRY USE CASE \xB7 FINANCIAL SERVICES</div> <h1 class="text-4xl md:text-6xl text-white mb-6 tracking-tighter">EU AI Act Compliance<br><span style="color:var(--color-emerald);">for Finance</span></h1> <p class="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">Banks, asset managers, and fintech platforms operating high-risk AI systems face the strictest obligations under the EU AI Act. Sentinel provides the cryptographic audit trail that makes compliance demonstrable \u2014 not just claimable.</p> <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center"> <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/a4afd393-f642-41c7-ba71-bec3200ad514" class="lemonsqueezy-button btn-emerald">Deploy for Finance \u2014 $49/mo \u2192</a> <a href="/compliance" class="btn-ghost">Architecture Deep-Dive</a> </div> </section> <section class="py-16 border-t border-slate-900 grid md:grid-cols-2 gap-6"> ', ' </section> <section class="py-16 text-center border-t border-slate-900"> <h2 class="text-3xl text-white mb-6">Start Your Financial AI Audit Trial</h2> <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/a4afd393-f642-41c7-ba71-bec3200ad514" class="lemonsqueezy-button btn-emerald">Provision Sentinel for Finance \u2192</a> </section> </main> <footer class="border-t border-slate-900 py-8"><div class="max-w-screen-lg mx-auto px-6 flex justify-between items-center"><span class="mono text-xs text-slate-600">SENTINEL \xB7 FINANCIAL SERVICES USE CASE</span><a href="/" class="mono text-xs text-slate-600 hover:text-emerald-400 transition-colors">\u2190 Homepage</a></div></footer> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), [
    { title: "Credit Scoring AI", art: "Art. 6 (Annex III)", body: "Credit scoring models are explicitly listed as high-risk AI under Annex III. Sentinel audits every inference call, creating a time-stamped record that the system operated within approved parameters \u2014 essential for EBA model risk guidelines." },
    { title: "Algorithmic Trading Systems", art: "Art. 12 + MiFID II", body: "Algo-trading AI must maintain complete decision traces for regulatory review. Sentinel's D1 audit log captures input parameters and verdicts in under 0.21ms \u2014 below market microstructure latency thresholds." },
    { title: "AML & Fraud Detection", art: "Art. 13 (Transparency)", body: "AML AI must be explainable to both customers and supervisory authorities. Sentinel's compliance JSON provides a structured explanation artifact that satisfies EBA Guidelines on internal governance." },
    { title: "KYC / Identity AI", art: "Art. 14 (Human Oversight)", body: "Identity verification AI rated as high-risk requires human oversight capabilities. Sentinel's webhook alerts trigger your internal review queue whenever a KYC AI verdict falls below the confidence threshold." }
  ].map((c) => renderTemplate`<div class="glass p-7 rounded-2xl"> <div class="mono text-[10px] text-emerald-400 tracking-widest uppercase mb-2">${c.art}</div> <h3 class="text-lg font-bold text-white mb-3">${c.title}</h3> <p class="text-slate-400 text-sm leading-relaxed">${c.body}</p> </div>`), unescapeHTML(JSON.stringify(schema))) })}`;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/use-cases/finance.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/use-cases/finance.astro";
const $$url = "/use-cases/finance";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Finance,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
