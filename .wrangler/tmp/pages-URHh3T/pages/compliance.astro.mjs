globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, g as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_CGa7oeTl.mjs';
import { $ as $$Layout } from '../chunks/Layout_Do7llZzW.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Compliance = createComponent(($$result, $$props, $$slots) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sentinel Compliance Architecture",
    "description": "Government-grade compliance architecture: Zero-Egress, WASM Immutability, and Cloudflare D1 Strong Consistency for EU AI Act compliance.",
    "url": "https://gettingsentinel.com/compliance",
    "publisher": {
      "@type": "Organization",
      "name": "Sentinel Technical Infrastructure"
    }
  };
  const sections = [
    {
      id: "zero-egress",
      tag: "SECURITY ARCHITECTURE",
      title: "Zero-Egress Data Processing",
      color: "#10b981",
      icon: "\u{1F512}",
      content: [
        { label: "Definition", body: "Zero-egress means that no data submitted to the Sentinel audit engine ever leaves the computational boundary of your Cloudflare Worker. Model manifests, training metadata, inference parameters \u2014 all are processed in-process and immediately discarded after verdict generation." },
        { label: "Technical Implementation", body: "Sentinel's WASM module is loaded directly into the Worker V8 isolate. Input data is passed via in-memory pointer (not serialized over a socket). The module executes, writes the verdict hash to D1, and the raw input is garbage-collected within the same event-loop tick." },
        { label: "Why It Matters for Compliance", body: "GDPR Article 46 transfer restrictions, the EU AI Act's downstream provider obligations, and sector-specific data localization requirements (DORA, MDR) all require proof that sensitive AI inputs do not cross data-processing boundaries. Sentinel's architecture makes this evidence gathering built-in \u2014 not just by policy." },
        { label: "Evidence Artifact", body: "Cloudflare publishes network egress logs per Worker endpoint. Sentinel generates zero outbound bytes on the audit path. You can validate this in your Cloudflare Dashboard > Workers > Sentinel > Analytics > Egress." }
      ]
    },
    {
      id: "wasm-immutability",
      tag: "COMPUTATIONAL INTEGRITY",
      title: "WASM Compiled Immutability",
      color: "#06b6d4",
      icon: "\u{1F9F1}",
      content: [
        { label: "Determinism Defined", body: "A deterministic audit engine produces the exact same verdict for the exact same input \u2014 always. This is technically validated by the Rust-to-WASM compilation model: there are no stochastic operations, no probabilistic classifiers, and no runtime model weights that could shift between calls." },
        { label: "Why LLM-based Auditors Fail the Determinism Standard", body: "LLM-based compliance tools use transformer inference, which is inherently probabilistic. The same prompt submitted twice may produce different verdicts. This makes them inadmissible for legal evidence because opposing counsel can trivially demonstrate inconsistency. Sentinel's output is reproducible by any third party with access to the same WASM binary and input." },
        { label: "Version-Pinned Rule Trees", body: "Each compliance check runs against a pinned version of Sentinel's EU AI Act rule tree. The version number is embedded in every D1 audit record. If the EU passes an Amendment, we release a new WASM minor version \u2014 and all prior audit records remain verifiable against the rule set that was in effect at the time of audit." },
        { label: "Tamper Evidence", body: "The WASM binary itself has a SHA-256 content hash that is published to our transparency log. Any modification to the audit logic changes the binary hash, making tampering trivially detectable. Enterprise customers receive a signed attestation document containing this hash for their compliance registers." }
      ]
    },
    {
      id: "d1-consistency",
      tag: "DATA INTEGRITY",
      title: "Cloudflare D1 Strong Consistency",
      color: "#a78bfa",
      icon: "\u{1F5C3}\uFE0F",
      content: [
        { label: "Architecture", body: "Cloudflare D1 is a serverless SQLite database with read replication at the edge. Sentinel writes audit records to the primary D1 instance using a synchronous, sequential write path. Each write is confirmed before the API response is returned, ensuring that no audit record is ever 'lost in transit'." },
        { label: "Append-Only Write Pattern", body: "Sentinel's D1 schema has no UPDATE or DELETE operations on the audit_logs table. All insertions are INSERT-only. The Worker's D1 binding is configured with execute privileges only \u2014 no DDL or destructive DML statements are possible from application code. This is enforced at the binding level, not just application policy." },
        { label: "Server-Side Timestamping", body: "All `created_at` timestamps are generated by D1's server clock at write time (DEFAULT CURRENT_TIMESTAMP). Application code cannot inject or override timestamps. This means the temporal evidence chain is controlled entirely by Cloudflare's infrastructure-level clock, which is synchronized to GPS-calibrated NTP and auditable by Cloudflare's own infrastructure logs." },
        { label: "Recovery & Durability", body: "D1 provides point-in-time recovery (PITR) at the Cloudflare infrastructure level with 30-day retention. Enterprise customers on the Scale-Up plan receive access to Sentinel's own D1 export endpoint, allowing them to maintain a secondary backup of all audit records in their own S3-compatible storage." }
      ]
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Compliance Architecture \u2014 Sentinel | Zero-Egress WASM D1 Infrastructure", "description": "Government-grade AI audit compliance: Zero-Egress data processing, WASM-compiled deterministic verdicts, and Cloudflare D1 strong consistency for EU AI Act obligations." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<header class="sticky top-9 z-50 border-b border-slate-900/80 backdrop-blur-xl bg-space/80"> <nav class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between"> <a href="/" class="flex items-center gap-2"> <div class="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-space font-black text-sm">S</div> <span class="font-bold text-sm tracking-tight text-white">SENTINEL</span> </a> <div class="flex items-center gap-3"> <a href="/#pricing" class="btn-ghost !py-2 !px-4 !text-xs">View Plans</a> <a href="/#pricing" class="btn-emerald !py-2 !px-4 !text-xs">Get Access</a> </div> </nav> </header> <main class="max-w-screen-lg mx-auto px-6"> <!-- HERO --> <section class="pt-28 pb-16 text-center"> <div class="section-label justify-center mb-4">GOVERNMENT-GRADE ARCHITECTURE</div> <h1 class="text-5xl md:text-6xl text-white mb-6 tracking-tighter">
Compliance<br><span style="color:var(--color-emerald);">Architecture</span> </h1> <p class="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
A technical deep-dive into the three pillars that make Sentinel's audit evidence legally admissible and regulatorily defensible: Zero-Egress processing, WASM immutability, and D1 strong consistency.
</p> <!-- Quick nav --> <div class="mt-10 flex flex-wrap gap-3 justify-center"> `, " </div> </section> <!-- THREE PILLARS --> ", ' <!-- COMPLIANCE MATRIX --> <section class="py-20 border-t border-slate-900"> <div class="section-label mb-4">REGULATORY MAPPING</div> <h2 class="text-3xl text-white mb-10">Architecture \u2192 Regulation Mapping</h2> <div class="glass overflow-hidden rounded-2xl"> <div class="grid grid-cols-3 gap-4 px-6 py-3 mono text-[10px] font-bold tracking-widest uppercase border-b border-slate-800 bg-slate-900/60 text-slate-500"> <span>SENTINEL FEATURE</span><span>EU AI ACT ARTICLE</span><span>COMPLIANCE EVIDENCE</span> </div> ', ' </div> </section> <!-- CTA --> <section class="py-20 text-center"> <h2 class="text-3xl text-white mb-6">Ready to Provision<br>Compliant Infrastructure?</h2> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/#pricing" class="btn-emerald">View Plans &amp; Pricing \u2192</a> <a href="/" class="btn-ghost">Back to Homepage</a> </div> </section> </main> <footer class="border-t border-slate-900 py-10"> <div class="max-w-screen-lg mx-auto px-6 flex justify-between items-center"> <span class="mono text-xs text-slate-600">SENTINEL COMPLIANCE ARCHITECTURE \xB7 2026</span> <a href="/" class="mono text-xs text-slate-600 hover:text-emerald-400 transition-colors">\u2190 Back to Homepage</a> </div> </footer> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), sections.map((s) => renderTemplate`<a${addAttribute(`#${s.id}`, "href")} class="glass px-4 py-2 rounded-xl mono text-xs hover:border-emerald-500/30 transition-colors"${addAttribute(`color: ${s.color};`, "style")}> ${s.icon} ${s.title} </a>`), sections.map((s) => renderTemplate`<section${addAttribute(s.id, "id")} class="py-20 border-t border-slate-900"> <div class="flex items-start gap-4 mb-10"> <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"${addAttribute(`background: ${s.color}18;`, "style")}>${s.icon}</div> <div> <div class="mono text-[10px] tracking-widest uppercase mb-2"${addAttribute(`color: ${s.color};`, "style")}>${s.tag}</div> <h2 class="text-3xl md:text-4xl text-white">${s.title}</h2> </div> </div> <div class="space-y-6"> ${s.content.map((item) => renderTemplate`<div class="glass p-7 rounded-2xl"> <div class="mono text-[10px] font-bold tracking-widest uppercase mb-3"${addAttribute(`color: ${s.color};`, "style")}>${item.label}</div> <p class="text-slate-300 leading-relaxed text-sm">${item.body}</p> </div>`)} </div> </section>`), [
    ["Zero-Egress WASM Exec", "Art. 10 (Data Governance)", "No outbound network bytes on audit path"],
    ["D1 Append-Only Writes", "Art. 12 (Record-Keeping)", "Immutable timestamp chain per audit"],
    ["Deterministic Verdict", "Art. 13 (Transparency)", "Same input \u2192 same output, reproducible"],
    ["Webhook Alerts", "Art. 14 (Human Oversight)", "Real-time alerts on non-compliant verdicts"],
    ["Version-Pinned Rules", "Art. 17 (Risk Mgmt)", "Each record embeds rule version at audit time"],
    ["SHA-256 WASM Hash", "Art. 72 (Market Surveillance)", "Binary integrity provable by third parties"]
  ].map(([feat, art, ev]) => renderTemplate`<div class="grid grid-cols-3 gap-4 px-6 py-4 border-b border-slate-800/50 last:border-0 hover:bg-white/5 transition-colors"> <span class="text-slate-200 text-sm font-semibold">${feat}</span> <span class="mono text-xs text-emerald-400">${art}</span> <span class="mono text-xs text-slate-400">${ev}</span> </div>`), unescapeHTML(JSON.stringify(schema))) })}`;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/compliance.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/compliance.astro";
const $$url = "/compliance";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Compliance,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
