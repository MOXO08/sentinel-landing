globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_C0THm8nM.mjs';
import { $ as $$Layout } from '../../chunks/Layout_BgZ1aDSE.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Saas = createComponent(($$result, $$props, $$slots) => {
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "Sentinel for SaaS", "description": "EU AI Act compliance for SaaS platforms with AI features. Multi-tenant audit isolation, downstream provider obligations, and AI feature compliance at scale.", "url": "https://gettingsentinel.com/use-cases/saas", "publisher": { "@type": "Organization", "name": "Sentinel" } };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sentinel for SaaS \u2014 EU AI Act Compliance for AI-Powered Platforms", "description": "Multi-tenant AI audit isolation for SaaS companies. Downstream provider obligations, AI feature compliance at scale, and per-customer audit trail generation." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<header class="sticky top-9 z-50 border-b border-slate-900/80 backdrop-blur-xl bg-space/80"> <nav class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between"> <a href="/" class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-space font-black text-sm">S</div><span class="font-bold text-sm text-white">SENTINEL</span></a> <div class="flex gap-3"><a href="/#pricing" class="btn-ghost !py-2 !px-4 !text-xs">View Plans</a><a href="/#pricing" class="btn-emerald !py-2 !px-4 !text-xs">Get Access</a></div> </nav> </header> <main class="max-w-screen-lg mx-auto px-6"> <section class="pt-28 pb-16 text-center"> <div class="text-5xl mb-6">\u2601\uFE0F</div> <div class="section-label justify-center mb-4">INDUSTRY USE CASE \xB7 SAAS</div> <h1 class="text-4xl md:text-6xl text-white mb-6 tracking-tighter">EU AI Act Compliance<br><span style="color:var(--color-emerald);">for SaaS</span></h1> <p class="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">SaaS platforms embedding AI features bear downstream provider obligations under the EU AI Act. When your customers use your AI features in their regulated workflows, you inherit a portion of their compliance burden. Sentinel scales with your multi-tenant architecture to provide per-customer audit isolation.</p> <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center"> <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/2e6f810b-5b16-4303-b6b1-32d84cae06ae" class="lemonsqueezy-button btn-emerald">Deploy for SaaS \u2014 $99/mo \u2192</a> <a href="/compliance" class="btn-ghost">Architecture Deep-Dive</a> </div> </section> <section class="py-16 border-t border-slate-900 grid md:grid-cols-2 gap-6"> ', ' </section> <section class="py-16 text-center border-t border-slate-900"> <h2 class="text-3xl text-white mb-6">Scale Your SaaS AI Compliance</h2> <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/2e6f810b-5b16-4303-b6b1-32d84cae06ae" class="lemonsqueezy-button btn-emerald">Provision Sentinel for SaaS \u2192</a> </section> </main> <footer class="border-t border-slate-900 py-8"><div class="max-w-screen-lg mx-auto px-6 flex justify-between items-center"><span class="mono text-xs text-slate-600">SENTINEL \xB7 SAAS USE CASE</span><a href="/" class="mono text-xs text-slate-600 hover:text-emerald-400 transition-colors">\u2190 Homepage</a></div></footer> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), [
    { title: "Multi-Tenant Audit Isolation", art: "Art. 26 (Downstream Obligations)", body: "As a SaaS provider deploying AI features to business customers, you carry downstream provider obligations. Sentinel's D1 schema supports tenant_id partitioning, allowing you to generate per-customer compliance reports from a single Sentinel API deployment." },
    { title: "AI Feature Compliance at Scale", art: "Art. 13 + Art. 12", body: "SaaS platforms serving thousands of customers need audit infrastructure that scales with traffic \u2014 not per-instance overhead. Sentinel's serverless WASM model delivers consistent sub-millisecond compliance checks at any volume without infrastructure provisioning." },
    { title: "Enterprise Customer Due Diligence", art: "Art. 28 (Obligations)", body: "Your enterprise customers will increasingly require proof that your AI features are audited. Sentinel provides a compliance attestation endpoint that your enterprise customers can reference directly in their own EU AI Act technical documentation." },
    { title: "LLM Feature Wrapping", art: "Art. 52 (GPAI)", body: "SaaS platforms wrapping foundation models (GPT-4, Claude, Gemini) must comply with General Purpose AI provisions. Sentinel audits the wrapper layer \u2014 the prompt templates and post-processing logic \u2014 ensuring your customisation layer meets transparency obligations even when the base model is a third-party GPAI system." }
  ].map((c) => renderTemplate`<div class="glass p-7 rounded-2xl"> <div class="mono text-[10px] text-emerald-400 tracking-widest uppercase mb-2">${c.art}</div> <h3 class="text-lg font-bold text-white mb-3">${c.title}</h3> <p class="text-slate-400 text-sm leading-relaxed">${c.body}</p> </div>`), unescapeHTML(JSON.stringify(schema))) })}`;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/use-cases/saas.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/use-cases/saas.astro";
const $$url = "/use-cases/saas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Saas,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
