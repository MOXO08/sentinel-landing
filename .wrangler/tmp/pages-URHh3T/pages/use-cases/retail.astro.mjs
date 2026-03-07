globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_CGa7oeTl.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Do7llZzW.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Retail = createComponent(($$result, $$props, $$slots) => {
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "Sentinel for Retail", "description": "EU AI Act compliance for retail AI: recommendation engines, dynamic pricing, customer profiling, and inventory forecasting audit trails.", "url": "https://gettingsentinel.com/use-cases/retail", "publisher": { "@type": "Organization", "name": "Sentinel" } };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sentinel for Retail \u2014 EU AI Act Compliance for Recommendation & Profiling AI", "description": "Audit recommendation engines, dynamic pricing AI, and customer profiling systems for EU AI Act compliance. Cryptographic evidence for retail AI transparency obligations." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<header class="sticky top-9 z-50 border-b border-slate-900/80 backdrop-blur-xl bg-space/80"> <nav class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between"> <a href="/" class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-space font-black text-sm">S</div><span class="font-bold text-sm text-white">SENTINEL</span></a> <div class="flex gap-3"><a href="/#pricing" class="btn-ghost !py-2 !px-4 !text-xs">View Plans</a><a href="/#pricing" class="btn-emerald !py-2 !px-4 !text-xs">Get Access</a></div> </nav> </header> <main class="max-w-screen-lg mx-auto px-6"> <section class="pt-28 pb-16 text-center"> <div class="text-5xl mb-6">\u{1F6D2}</div> <div class="section-label justify-center mb-4">INDUSTRY USE CASE \xB7 RETAIL</div> <h1 class="text-4xl md:text-6xl text-white mb-6 tracking-tighter">EU AI Act Compliance<br><span style="color:var(--color-emerald);">for Retail</span></h1> <p class="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">Retail AI touches millions of consumers daily \u2014 from dynamic pricing to personalised recommendations. The EU AI Act imposes transparency and non-discrimination obligations on AI systems that influence purchasing decisions. Sentinel provides the audit infrastructure to demonstrate compliance at scale.</p> <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center"> <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/a4afd393-f642-41c7-ba71-bec3200ad514" class="lemonsqueezy-button btn-emerald">Deploy for Retail \u2014 $49/mo \u2192</a> <a href="/compliance" class="btn-ghost">Architecture Deep-Dive</a> </div> </section> <section class="py-16 border-t border-slate-900 grid md:grid-cols-2 gap-6"> ', ' </section> <section class="py-16 text-center border-t border-slate-900"> <h2 class="text-3xl text-white mb-6">Audit Your Retail AI Today</h2> <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/a4afd393-f642-41c7-ba71-bec3200ad514" class="lemonsqueezy-button btn-emerald">Provision Sentinel for Retail \u2192</a> </section> </main> <footer class="border-t border-slate-900 py-8"><div class="max-w-screen-lg mx-auto px-6 flex justify-between items-center"><span class="mono text-xs text-slate-600">SENTINEL \xB7 RETAIL USE CASE</span><a href="/" class="mono text-xs text-slate-600 hover:text-emerald-400 transition-colors">\u2190 Homepage</a></div></footer> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), [
    { title: "Recommendation Engines", art: "Art. 13 (Transparency)", body: "Recommender systems that influence consumer choices must disclose their AI nature and operating logic. Sentinel logs each recommendation inference with parameters, enabling generation of consumer transparency reports on demand." },
    { title: "Dynamic Pricing AI", art: "Art. 5 (Prohibited Practices)", body: "Pricing AI that exploits consumer vulnerabilities or uses prohibited subliminal techniques is banned under Article 5. Sentinel audits pricing model outputs to detect patterns that could trigger prohibited practice investigations." },
    { title: "Customer Profiling & Segmentation", art: "GDPR + Art. 10", body: "Profiling AI for marketing segmentation intersects GDPR Article 22 (automated decision-making) with EU AI Act data governance requirements. Sentinel creates a record of what data was processed by which model version for each segmentation decision." },
    { title: "Inventory & Demand Forecasting", art: "Art. 9 (Risk Management)", body: "Forecasting AI that drives supply chain decisions affecting product availability must demonstrate adequate risk management. Sentinel's audit records provide the evidence layer for your ISO 9001 and AI system documentation requirements." }
  ].map((c) => renderTemplate`<div class="glass p-7 rounded-2xl"> <div class="mono text-[10px] text-emerald-400 tracking-widest uppercase mb-2">${c.art}</div> <h3 class="text-lg font-bold text-white mb-3">${c.title}</h3> <p class="text-slate-400 text-sm leading-relaxed">${c.body}</p> </div>`), unescapeHTML(JSON.stringify(schema))) })}`;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/use-cases/retail.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/use-cases/retail.astro";
const $$url = "/use-cases/retail";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Retail,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
