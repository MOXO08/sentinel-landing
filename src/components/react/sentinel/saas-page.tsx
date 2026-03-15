import React, { useState, useEffect } from "react"
import { Check, ArrowRight, Cloud, Scale, Server, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export function SaasPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="bg-[#F4F1EA] pt-32 pb-24 text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 mb-8">
            <Cloud className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="text-[10px] font-mono font-bold text-[#059669] uppercase tracking-widest">Industry Use Case · SaaS & AI Providers</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#0f172a] mb-6 tracking-tight leading-tight">
            Compliance for <br />
            <span className="text-[#10b981]">AI-as-a-Service</span>
          </h1>
          <p className="text-xl text-[#475569] leading-relaxed max-w-3xl mx-auto font-light mb-10">
            SaaS platforms embedding AI bears downstream provider obligations under the EU AI Act. Sentinel automates the entire **Annex IV** pipeline directly from your CI/CD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/api-docs" className="bg-[#0f172a] text-[#F4F1EA] px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-all shadow-xl group">
              View API Documentation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Technical CI/CD Block */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
           <div className="space-y-8">
              <h2 className="text-[11px] font-mono text-[#059669] font-bold uppercase tracking-[0.2em]">Automated DevSecOps</h2>
              <h3 className="text-3xl md:text-5xl font-black text-[#0f172a]">The Compliance-as-Code Pipeline</h3>
              <p className="text-[#475569] text-xl font-light leading-relaxed">
                 Traditional compliance stops at the audit report. Sentinel starts at the **git push**. Every PR is evaluated against deterministic Rule Packs signed via **Ed25519**.
              </p>
              <div className="space-y-4">
                 <div className="flex gap-4 p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0">
                       <Check className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                       <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">GPAI Wrapper Audit (Art. 52)</h4>
                       <p className="text-xs text-[#475569] leading-relaxed">Verify transparency obligations for Large Language Model (LLM) wrappers automatically.</p>
                    </div>
                 </div>
                  <div className="flex gap-4 p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center shrink-0">
                        <Scale className="w-5 h-5 text-[#3b82f6]" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Downstream Governance (Art. 28)</h4>
                        <p className="text-xs text-[#475569] leading-relaxed">Pass compliance attestations to your enterprise customers via our cryptographic ledger pings.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-white border border-[#10b981]/15 rounded-2xl shadow-md border-l-4 border-l-[#10b981]">
                     <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-[#10b981]" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight text-[#059669]">CI/CD Plug-and-Play</h4>
                        <p className="text-xs text-[#475569] leading-relaxed italic">GitHub Actions: Plug-and-play integration via sentinel-scan-action.</p>
                     </div>
                  </div>
               </div>
           </div>
           <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#10b981]/20 to-transparent rounded-[40px] blur-2xl"></div>
              
              <div className="w-full bg-[#020617] p-8 rounded-[40px] border border-[#334155] shadow-2xl overflow-hidden relative group z-10">
                 <div className="flex items-center gap-2 mb-6 border-b border-[#334155] pb-4">
                    <div className="w-3 h-3 rounded-full bg-[#10b981]/20 flex items-center justify-center">
                       <div className="w-1 h-1 rounded-full bg-[#10b981]"></div>
                    </div>
                    <span className="font-mono text-[10px] text-white font-bold tracking-widest uppercase">Sentinel-CI Gate Engine</span>
                 </div>
                 <div className="font-mono text-xs text-[#cbd5e1] space-y-4">
                    <div className="text-[#64748b]">{"// Automated git-hook intercept"}</div>
                    <div><span className="text-[#10b981]">$</span> sentinel <span className="text-amber-500">scan</span> --branch <span className="text-white">main</span></div>
                    <div className="text-blue-400">{"[STEP] Loading Regulation KV Store..."}</div>
                    <div className="text-blue-400">{"[STEP] Analyzing Art. 52 Transparency Compliance..."}</div>
                    <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true }}
                       transition={{ delay: 0.4 }}
                       className="bg-[#1e293b] p-4 rounded-xl border border-[#334155] my-2"
                    >
                       <div className="text-green-400 font-bold mb-1">{"[PASS] GPAI Wrapper Verified"}</div>
                       <div className="text-[10px] text-[#94a3b8]">{"Trace: art_52_transparency_v1"}</div>
                       <div className="text-[10px] text-[#94a3b8]">{"Hash: 7f8c92a...e01d"}</div>
                    </motion.div>
                    <div className="text-[#10b981] font-bold animate-pulse">{"[SUCCESS] COMMIT_ALLOWED: Annex IV synchronized."}</div>
                    <div className="text-white tracking-widest animate-pulse">_</div>
                 </div>
                 
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#10b981]/10 rounded-full blur-[60px] pointer-events-none transition-opacity"></div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-[#0f172a] p-6 rounded-2xl border border-[#334155] shadow-xl z-20 hidden md:block">
                 <div className="text-[10px] font-mono text-[#10b981] mb-2 uppercase tracking-widest font-bold">Pipeline Gate: PASSED</div>
                 <div className="font-mono text-[10px] text-[#94a3b8] mb-2">SHA-256: 7f8c92a...e01d</div>
                 <div className="w-full bg-[#1e293b] h-1 rounded-full overflow-hidden">
                    <div className="bg-[#10b981] h-full w-full"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Card Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
           {[
            {
              title: "Multi-Tenant Isolation",
              art: "Art. 26 (Downstream)",
              body: "As a SaaS provider, you carry downstream provider obligations. Sentinel's D1 schema supports tenant_id partitioning, allowing you to generate per-customer compliance reports from a single deployment.",
              icon: <Server className="w-5 h-5 text-[#10b981]" />
            },
            {
              title: "AI Feature Scale",
              art: "Art. 13 + Art. 12",
              body: "SaaS platforms need audit infrastructure that scales with traffic — not per-instance overhead. Sentinel's serverless WASM model delivers consistent sub-millisecond compliance checks at any volume.",
              icon: <Zap className="w-5 h-5 text-[#10b981]" />
            },
            {
              title: "Enterprise Customer Due Diligence",
              art: "Art. 28 (Obligations)",
              body: "Your enterprise customers will increasingly require proof that your AI features are audited. Sentinel provides a compliance attestation endpoint that your customers can reference in their own documentation.",
              icon: <ShieldCheck className="w-5 h-5 text-[#10b981]" />
            },
            {
              title: "LLM Feature Wrapping",
              art: "Art. 52 (GPAI)",
              body: "SaaS platforms wrapping foundation models must comply with GPAI provisions. Sentinel audits the wrapper layer — the prompt templates and post-processing logic — ensuring the customisation layer meets obligations.",
              icon: <Scale className="w-5 h-5 text-[#10b981]" />
            }
          ].map((item, i) => (
            <div key={i} className="group bg-white p-8 rounded-2xl border border-[#cbd5e1] shadow-sm hover:shadow-xl hover:border-[#10b981]/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#f0fdf4] border border-[#10b981]/20">
                  {item.icon}
                </div>
                <div className="text-[10px] font-mono font-bold text-[#059669] uppercase tracking-widest">{item.art}</div>
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#10b981] transition-colors">{item.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed font-light">{item.body}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71 13 4l-1 9h8l-9 10.71 1-9H4z" />
    </svg>
  )
}
