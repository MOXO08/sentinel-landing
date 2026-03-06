globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead } from '../../chunks/astro/server_C0THm8nM.mjs';
import { $ as $$Layout } from '../../chunks/Layout_BgZ1aDSE.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Government = createComponent(($$result, $$props, $$slots) => {
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "Sentinel for Government", "description": "EU AI Act compliance for public sector AI deployments. Law enforcement, benefits administration, and border control AI audit infrastructure.", "url": "https://gettingsentinel.com/use-cases/government", "publisher": { "@type": "Organization", "name": "Sentinel" } };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sentinel for Government \u2014 EU AI Act Public Sector AI Compliance", "description": "Cryptographic audit infrastructure for public sector AI: law enforcement AI, benefits administration, border control, and judicial decision support. EU AI Act compliant by design." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<header class="sticky top-9 z-50 border-b border-slate-900/80 backdrop-blur-xl bg-space/80"> <nav class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between"> <a href="/" class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-space font-black text-sm">S</div><span class="font-bold text-sm text-white">SENTINEL</span></a> <div class="flex gap-3"><a href="/#pricing" class="btn-ghost !py-2 !px-4 !text-xs">View Plans</a><a href="/#pricing" class="btn-emerald !py-2 !px-4 !text-xs">Get Access</a></div> </nav> </header> <main class="max-w-screen-lg mx-auto px-6"> <section class="pt-28 pb-16 text-center"> <div class="text-5xl mb-6">\u{1F3DB}\uFE0F</div> <div class="section-label justify-center mb-4">INDUSTRY USE CASE \xB7 GOVERNMENT</div> <h1 class="text-4xl md:text-6xl text-white mb-6 tracking-tighter">EU AI Act Compliance<br><span style="color:var(--color-emerald);">for Government</span></h1> <p class="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">Public sector AI deployments carry the heaviest compliance burden in the EU AI Act. Law enforcement biometrics, judicial support tools, and benefits processing AI are categorised as Critical High-Risk or outright Prohibited. Sentinel provides the immutable audit trail that supervisory authorities require for oversight.</p> <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center"> <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/2e6f810b-5b16-4303-b6b1-32d84cae06ae" class="lemonsqueezy-button btn-emerald">Deploy for Government \u2014 $99/mo \u2192</a> <a href="/compliance" class="btn-ghost">Architecture Deep-Dive</a> </div> </section> <section class="py-16 border-t border-slate-900 grid md:grid-cols-2 gap-6"> ', ' </section> <section class="py-16 text-center border-t border-slate-900"> <h2 class="text-3xl text-white mb-6">Government-Grade Audit Infrastructure</h2> <a href="https://radumuresanu.lemonsqueezy.com/checkout/buy/2e6f810b-5b16-4303-b6b1-32d84cae06ae" class="lemonsqueezy-button btn-emerald">Provision Sentinel for Government \u2192</a> </section> </main> <footer class="border-t border-slate-900 py-8"><div class="max-w-screen-lg mx-auto px-6 flex justify-between items-center"><span class="mono text-xs text-slate-600">SENTINEL \xB7 GOVERNMENT USE CASE</span><a href="/" class="mono text-xs text-slate-600 hover:text-emerald-400 transition-colors">\u2190 Homepage</a></div></footer> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), [
    { title: "Benefits & Social Services AI", art: "Annex III \xA75(b)", body: "AI systems used to evaluate eligibility for public benefits are explicitly listed in Annex III. Sentinel audits each determination to ensure the model operated within approved parameters, providing the audit trail required by national social security oversight bodies." },
    { title: "Border Control & Immigration AI", art: "Art. 6 + Annex III \xA77", body: "Border management AI \u2014 risk assessment of individuals, identity verification at crossings \u2014 is among the highest-risk classifications. Sentinel's records use zero-egress processing, ensuring no personal data traverses additional boundaries during the audit." },
    { title: "Law Enforcement Predictive Tools", art: "Art. 5 (Prohibited) + Art. 26", body: "Real-time biometric identification in public spaces by law enforcement is prohibited with narrow exceptions. Sentinel's audit log records the legal basis asserted for each AI use, creating evidence of compliance with the permitted exception framework." },
    { title: "Judicial Decision Support", art: "Art. 6 + Art. 14", body: "AI tools used to assist judges in sentencing or risk assessment must have human oversight as a non-negotiable feature. Sentinel's alert webhooks ensure no AI verdict influences a judicial proceeding without a named human reviewer confirming receipt." }
  ].map((c) => renderTemplate`<div class="glass p-7 rounded-2xl"> <div class="mono text-[10px] text-emerald-400 tracking-widest uppercase mb-2">${c.art}</div> <h3 class="text-lg font-bold text-white mb-3">${c.title}</h3> <p class="text-slate-400 text-sm leading-relaxed">${c.body}</p> </div>`), unescapeHTML(JSON.stringify(schema))) })}`;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/use-cases/government.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/use-cases/government.astro";
const $$url = "/use-cases/government";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Government,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
