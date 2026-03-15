import React, { useState, useEffect } from "react";
import { Shield, Lock, FileCheck, Server, AlertTriangle, Key, Network, EyeOff, Activity, ArrowRight, CheckCircle2, Scale } from "lucide-react";
import { motion } from "framer-motion";

export function SecurityPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#c5832b]/20 pb-24">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-[#e2e8f0]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(197,131,43,0.1),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5832b]/30 bg-[#c5832b]/10 mb-8 backdrop-blur-md shadow-sm">
              <Shield className="w-3.5 h-3.5 text-[#c5832b]" />
              <span className="text-[11px] font-mono text-[#b87333] font-bold uppercase tracking-[0.2em]">Trust & Compliance Center</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
              Cryptographic Proof.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b87333] to-[#c5832b] drop-shadow-[0_0_30px_rgba(197,131,43,0.2)]">Zero Blind Trust.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed font-light">
              We don't ask for trust; we provide mathematical guarantees. Our architecture is designed to prevent data exfiltration, ensuring total sovereignty of your proprietary AI models.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
               <a href="/legal/sovereignty" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0f172a] text-[#F4F1EA] font-bold rounded-xl hover:bg-[#c5832b] transition-all shadow-lg hover:shadow-[#c5832b]/20 hover:-translate-y-1">
                  Sovereignty Architecture <ArrowRight className="w-4 h-4" />
               </a>
               <a href="#whitepaper" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-[#e2e8f0] text-[#0f172a] font-bold rounded-xl hover:bg-[#F4F1EA] transition-colors shadow-sm">
                  Read Whitepaper
               </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE WHITE PAPER CONTENT */}
      <section id="whitepaper" className="py-24 px-6 max-w-7xl mx-auto border-b border-[#e2e8f0]">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-[11px] font-mono font-bold text-[#b87333] tracking-[0.2em] uppercase mb-4">Architecture Whitepaper</h2>
            <h3 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">Zero-Knowledge Compliance Engine</h3>
            
            <div className="prose prose-slate prose-lg max-w-none text-[#475569] font-light space-y-8">
              <section>
                <h4 className="text-xl font-bold text-[#0f172a] mb-4">1. Executive Summary</h4>
                <p>
                  Integrating LLM systems introduces new risk vectors, from API key exfiltration to unauthorized storage of PII data. Sentinel resolves this asymmetry through a <strong>Shift-Left</strong> approach, running a completely isolated (air-gapped) WASM-based analysis engine with a mathematical guarantee of non-disclosure for processed data.
                </p>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm">
                <h4 className="text-xl font-bold text-[#0f172a] mb-4">2. Air-Gapped Architecture</h4>
                <p className="text-sm mb-4">To eliminate the risk of exfiltration, the Sentinel core is built as a statically compiled Rust/WASM binary.</p>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#c5832b] shrink-0" /> <strong>Offline by Default:</strong> Analiza se execută 100% local sau la Edge (V8 Isolates). Niciun fragment de cod nu părăsește mediul clientului.</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#c5832b] shrink-0" /> <strong>Zero Persistență:</strong> Instanțe efemere care se auto-distrug după generarea hash-ului de securitate.</li>
                </ul>
              </section>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-8">
            <div className="bg-[#0f172a] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl"></div>
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Key className="w-6 h-6 text-[#10b981]" />
                3. Cryptographic Trust
              </h4>
              <p className="text-[#94a3b8] text-sm mb-8 leading-relaxed">
                Sentinel secures the supply chain through a trust model based on asymmetric cryptography.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="text-[10px] font-mono text-[#10b981] uppercase mb-1">Signed Rule Packs (SRP)</div>
                   <p className="text-xs text-[#cbd5e1]">Logica de conformitate este semnată Ed25519. Orice alterare suspendă imediat execuția motorului.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="text-[10px] font-mono text-blue-400 uppercase mb-1">Offline Licensing (JWT)</div>
                   <p className="text-xs text-[#cbd5e1]">Autorizarea se realizează asincron prin token-uri JWT EdDSA, protejând disponibilitatea sistemelor CI/CD.</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-white rounded-[3rem] border border-[#e2e8f0]">
               <h4 className="text-xl font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                 <Activity className="w-6 h-6 text-[#c5832b]" />
                 4. Determinism and Traceability
               </h4>
               <ul className="space-y-4 text-sm text-[#475569]">
                 <li><strong>Deterministic Output:</strong> Identical conditions generate the same verdict, eliminating "hallucinations" of human or purely LLM-based audits.</li>
                 <li><strong>Immutable Audit Trail:</strong> The hash of each report is stored in the Cloudflare D1 Ledger, providing legal proof under Art. 12 of the AI Act.</li>
               </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. TELEMETRY & ROI */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="p-12 bg-[#F4F1EA] rounded-[3rem] border border-[#e2e8f0]">
            <h4 className="text-2xl font-bold text-[#0f172a] mb-6">5. Telemetry for CISOs</h4>
            <p className="text-[#475569] font-light leading-relaxed mb-6">
              We provide total visibility into risk posture without exposing intellectual property. The system transmits only integrity hashes and performance metadata.
            </p>
            <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] font-mono text-[10px] text-[#059669]">
              {'{'} "integrity_hash": "sha256:...", "engine": "wasm-v8", "compliance": "annex-iv" {'}'}
            </div>
          </div>

          <div className="p-12 bg-[#0f172a] rounded-[3rem] text-white">
            <h4 className="text-2xl font-bold mb-6">6. Operational Efficiency</h4>
            <p className="text-[#94a3b8] font-light leading-relaxed">
              Our architecture reduces audit costs by up to 90%, replacing slow manual processes with automated assessments that meet ISO 42001 and EU AI Act standards.
            </p>
          </div>
        </div>
      </section>

      {/* VULNERABILITY DISCLOSURE */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center border-t border-[#e2e8f0] mt-12">
         <div className="w-16 h-16 mx-auto bg-amber-50 flex items-center justify-center rounded-2xl mb-6 border border-amber-200">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
         </div>
         <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Vulnerability Disclosure Program</h3>
         <p className="text-[#475569] font-light mb-8 max-w-2xl mx-auto italic">
            "We do not ask for your trust; we provide the means to verify it."
         </p>
         <p className="text-[#475569] font-light mb-8 max-w-2xl mx-auto text-sm">
            If you have identified a security risk in the Sentinel execution engine or the D1 Ledger logic, please follow our official reporting procedure.
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/legal/vdp" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0f172a] text-[#F4F1EA] rounded-xl hover:bg-[#c5832b] shadow-lg transition-colors text-sm font-medium">
               Reporting Procedure (VDP)
            </a>
            <a 
              href="mailto:security@gettingsentinel.com"
              data-contact-link="security@gettingsentinel.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#e2e8f0] text-[#0f172a] rounded-xl hover:bg-[#F4F1EA] hover:border-[#c5832b]/50 shadow-sm transition-all text-sm font-medium hover:-translate-y-0.5 cursor-pointer relative min-w-[180px]"
            >
               <Scale className="w-4 h-4 text-[#c5832b]" />
               <span>Security Contact</span>
            </a>
         </div>
      </section>

    </div>
  );
}
