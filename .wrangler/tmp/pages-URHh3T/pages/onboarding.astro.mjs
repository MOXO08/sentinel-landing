globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_C0THm8nM.mjs';
import { $ as $$Layout } from '../chunks/Layout_BgZ1aDSE.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Onboarding = createComponent(($$result, $$props, $$slots) => {
  const resources = [
    {
      title: "EU AI Act Implementation Guide",
      desc: "46-page deep dive on Articles 6, 12, 13, 14 and your Sentinel configuration reference.",
      icon: "\u{1F4D8}",
      color: "var(--color-emerald)",
      filename: "sentinel-eu-ai-act-implementation-guide-v2.pdf",
      size: "2.4 MB",
      tag: "ESSENTIAL READING"
    },
    {
      title: "API Integration Checklist",
      desc: "Step-by-step API key setup, endpoint reference, and first-audit verification checklist.",
      icon: "\u2705",
      color: "var(--color-cyan)",
      filename: "sentinel-api-integration-checklist.pdf",
      size: "340 KB",
      tag: "START HERE"
    },
    {
      title: "Compliance Proof Templates",
      desc: "Ready-made document templates for supervisory authority submissions (GDPR, MDR, AI Act Article 12).",
      icon: "\u{1F4CB}",
      color: "#a78bfa",
      filename: "sentinel-compliance-proof-templates.pdf",
      size: "1.1 MB",
      tag: "LEGAL READY"
    }
  ];
  const steps = [
    { n: "01", title: "Generate Your API Key", body: "In your Sentinel Dashboard, navigate to Settings \u2192 API Keys \u2192 Create New. Save this \u2014 it will not be shown again.", link: "/dashboard", cta: "Open Dashboard \u2192" },
    { n: "02", title: "Send Your First Audit", body: "POST your model manifest JSON to /api/audit with your API key in the Authorization header. Your first audit should return a COMPLIANT verdict within 0.21ms.", link: "/compliance", cta: "See API Reference \u2192" },
    { n: "03", title: "Verify Your Audit Trail", body: "Check the Integrity Console to confirm your audit was written to the immutable D1 ledger. You now have legally-defensible evidence.", link: "/integrity-console", cta: "Open Integrity Console \u2192" },
    { n: "04", title: "Download Your Proof Package", body: "Use the Compliance Proof Templates below to generate your Article 12 record-keeping documentation for supervisory authority review.", link: "#downloads", cta: "Get Templates \u2192" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sentinel Onboarding \u2014 Welcome to the Audit Infrastructure", "description": "Get started with Sentinel: download your implementation guide, integrate the API, and generate your first legally-defensible EU AI Act compliance proof." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<header class="sticky top-9 z-50 border-b border-slate-900/80 backdrop-blur-xl bg-space/80"> <nav class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between"> <a href="/" class="flex items-center gap-2"> <div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-space font-black text-sm">S</div> <span class="font-bold text-sm text-white">SENTINEL</span> <span class="mono text-[10px] text-emerald-400 ml-1">ONBOARDING</span> </a> <div class="flex gap-3"> <a href="/integrity-console" class="btn-ghost !py-2 !px-4 !text-xs">Integrity Console</a> <a href="/dashboard" class="btn-emerald !py-2 !px-4 !text-xs">Open Dashboard →</a> </div> </nav> </header> <main class="max-w-screen-xl mx-auto px-6 pb-24"> <section class="pt-20 pb-12 text-center"> <div class="text-4xl mb-6">🎉</div> <div class="section-label justify-center mb-4">SENTINEL ACCESS CONFIRMED</div> <h1 class="text-4xl md:text-5xl text-white mb-4 tracking-tighter">
Welcome to the<br><span style="color:var(--color-emerald);">Audit Infrastructure</span> </h1> <p class="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
Your Sentinel deployment is ready. Follow the steps below to integrate the API, verify your first audit trail, and download your compliance proof package.
</p> </section> <!-- STEPS --> <section class="mb-16"> <div class="section-label mb-6">GETTING STARTED</div> <div class="grid md:grid-cols-2 gap-6"> ${steps.map((s) => renderTemplate`<div class="glass p-7 rounded-2xl flex gap-5"> <div class="mono text-5xl font-black shrink-0 leading-none" style="color:rgba(16,185,129,0.15);">${s.n}</div> <div class="flex-1"> <h3 class="text-lg font-bold text-white mb-2">${s.title}</h3> <p class="text-slate-400 text-sm leading-relaxed mb-4">${s.body}</p> <a${addAttribute(s.link, "href")} class="mono text-xs text-emerald-400 hover:text-emerald-300 transition-colors">${s.cta}</a> </div> </div>`)} </div> </section> <!-- DOWNLOADS --> <section id="downloads"> <div class="section-label mb-6">COMPLIANCE RESOURCES · 3 DOWNLOADS</div> <div class="grid md:grid-cols-3 gap-6"> ${resources.map((r) => renderTemplate`<div class="glass p-7 rounded-2xl flex flex-col gap-5"> <div class="flex items-start justify-between"> <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"${addAttribute(`background:${r.color}18`, "style")}>${r.icon}</div> <span class="mono text-[9px] font-bold tracking-widest px-2 py-1 rounded border"${addAttribute(`color:${r.color};border-color:${r.color}33`, "style")}>${r.tag}</span> </div> <div> <h3 class="text-base font-bold text-white mb-2">${r.title}</h3> <p class="text-slate-400 text-sm leading-relaxed">${r.desc}</p> </div> <div class="mt-auto pt-4 border-t border-slate-800 text-center"> <span class="mono text-[9px] text-amber-400">Available after manual verification</span> </div> </div>`)} </div> </section> <!-- NEXT STEPS CTA --> <section class="mt-16 glass p-8 rounded-3xl text-center"> <h2 class="text-2xl font-bold text-white mb-3">Questions? We Ship Fast.</h2> <p class="text-slate-400 text-sm mb-6">Founder Plan customers get priority email support with 4-hour response SLA. Enterprise customers get a dedicated Slack channel.</p> <div class="flex flex-col sm:flex-row justify-center gap-4"> <a href="/integrity-console" class="btn-emerald">View Your Live Audit Trail →</a> <a href="mailto:support@sentinel.dev?subject=Onboarding%20Support%20Request" class="btn-emerald">Email Support</a> </div> </section> </main> <footer class="border-t border-slate-900 py-8"> <div class="max-w-screen-xl mx-auto px-6 flex justify-between items-center"> <span class="mono text-xs text-slate-600">SENTINEL ONBOARDING PORTAL · 2026</span> <a href="/" class="mono text-xs text-slate-600 hover:text-emerald-400 transition-colors">← Homepage</a> </div> </footer> ` })}`;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/onboarding.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/onboarding.astro";
const $$url = "/onboarding";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Onboarding,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
