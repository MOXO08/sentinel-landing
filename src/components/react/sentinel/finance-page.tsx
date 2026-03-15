import React, { useState, useEffect } from "react";
import { Shield, TrendingUp, Building, Lock, FileText, Activity, Server, Scale, ArrowRight, Zap, Database } from "lucide-react";
import { motion } from "framer-motion";

export function FinancePage() {
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
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#3b82f6]/20 pb-24">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-[#e2e8f0]">
        {/* Deep Blue/Finance Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/10 mb-8 backdrop-blur-md shadow-sm">
              <Building className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span className="text-[11px] font-mono text-[#2563eb] font-bold uppercase tracking-[0.2em]">Banking & Trading Infrastructure</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
              AI Act Compliance for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#60a5fa] drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">Global Capital Markets.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed font-light">
              Algorithmic trading and automated credit scoring are classified as High-Risk per the EU AI Act. Sentinel delivers deterministic compliance without ever requesting egress of your proprietary trading logic.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
               <a href="/methodology" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3b82f6] text-white font-bold rounded-xl hover:bg-[#2563eb] transition-all shadow-lg hover:shadow-[#3b82f6]/30 hover:-translate-y-1">
                  Review Methodology <ArrowRight className="w-4 h-4" />
               </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CORE FINANCIAL CHALLENGES */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-[#e2e8f0]">
         <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
               <h2 className="text-[11px] font-mono text-[#2563eb] font-bold uppercase tracking-[0.2em]">High-Frequency Solutions</h2>
               <h3 className="text-3xl md:text-5xl font-black text-[#0f172a]">The Algorithmic Alpha Offering</h3>
               <p className="text-[#475569] text-xl font-light leading-relaxed">
                  Financial institutions face a critical convergence: **DORA** (Digital Operational Resilience) and the **EU AI Act**. Technical failure in any layer results in systemic risk and massive regulatory exposure.
               </p>
               <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm">
                     <div className="text-[10px] font-mono text-[#2563eb] mb-2 font-bold flex items-center gap-2">
                        <Scale className="w-3 h-3" /> DORA Alignment
                     </div>
                     <p className="text-xs text-[#475569] leading-relaxed">Sentinel maps AI risk to DORA ICT risk management frameworks automatically.</p>
                  </div>
                  <div className="p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm">
                     <div className="text-[10px] font-mono text-[#2563eb] mb-2 font-bold flex items-center gap-2">
                        <Zap className="w-3 h-3" /> &lt; 1ms Latency
                     </div>
                     <p className="text-xs text-[#475569] leading-relaxed">WASM-compiled audits execute in memory for sub-millisecond trading overhead.</p>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/20 to-transparent rounded-[40px] blur-2xl"></div>
               <img 
                  src="/finance_compliance_viz_1773183432926.png" 
                  alt="Finance Compliance Visualization" 
                  className="relative rounded-[40px] border border-[#e2e8f0] shadow-2xl z-10"
               />
               <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xl z-20 hidden md:block">
                  <div className="text-[10px] font-mono text-[#2563eb] mb-2 uppercase tracking-widest font-bold">Sovereign Ledger-Lock Protocol</div>
                  <div className="flex items-center gap-4">
                     <div>
                        <div className="text-[9px] text-[#94a3b8] uppercase mb-1">Audit Hash</div>
                        <div className="font-mono text-[10px] text-[#0f172a]">0xAE8F...7D2B</div>
                     </div>
                     <div className="w-px h-8 bg-[#e2e8f0]"></div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <div className="font-mono text-[10px] text-green-600 font-bold uppercase">SIGNATURE VALID</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
               { icon: TrendingUp, title: "Algorithmic Pricing & Trading", desc: "Automated trading logic must prove it does not inadvertently manipulate markets or exhibit unmonitored drift per Annex III Section 5.", color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/20" },
               { icon: Activity, title: "Automated Credit Scoring", desc: "Explicitly designated as High-Risk. Requires extensive bias testing (Art. 10), fairness proofs, and unalterable Article 11 logic trails.", color: "text-[#c5832b]", bg: "bg-[#c5832b]/10", border: "border-[#c5832b]/20" },
               { icon: Shield, title: "Fraud Detection Drift", desc: "ML models hunting for anomalies often drift. Article 15 requires deterministic proof that accuracy and robustness haven't decayed.", color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" }
            ].map((Feature, i) => (
               <div key={i} className="bg-white p-8 rounded-2xl border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors relative overflow-hidden group shadow-sm hover:shadow-md">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${Feature.bg.replace('/10', '')} opacity-50`}></div>
                  <div className={`w-12 h-12 rounded-xl ${Feature.bg} ${Feature.border} border flex items-center justify-center mb-6`}>
                     <Feature.icon className={`w-6 h-6 ${Feature.color}`} />
                  </div>
                  <h4 className="text-lg font-bold text-[#0f172a] mb-3">{Feature.title}</h4>
                  <p className="text-sm text-[#475569] leading-relaxed font-light">{Feature.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* DORA vs AI ACT MAPPING SECTION */}
      <section className="py-24 px-6 bg-[#0f172a] relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-[11px] font-mono text-[#3b82f6] font-bold uppercase tracking-[0.2em] mb-4">Regulatory Alignment</h2>
               <h3 className="text-3xl md:text-5xl font-black text-white">The DORA Resilience Solution</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
               <div className="bg-[#1e293b]/50 border border-[#334155] p-10 rounded-[40px] backdrop-blur-md">
                  <h4 className="text-white font-bold text-2xl mb-6 flex items-center gap-3">
                     <span className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-sm">01</span>
                     AI Act Mandate
                  </h4>
                  <p className="text-[#94a3b8] font-light leading-relaxed mb-8">
                     Focuses on human-centric safeguards, transparency (Art 13), and technical documentation (Annex IV) specifically for AI systems.
                  </p>
                  <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/20">
                     <div className="text-[10px] font-mono text-blue-400 mb-2 font-bold uppercase tracking-widest">Sentinel Solver</div>
                     <p className="text-xs text-[#cbd5e1]">Automated Annex IV generation for High-Risk financial systems, reducing manual legal desk time by 90%.</p>
                  </div>
               </div>
               <div className="bg-[#1e293b]/50 border border-[#334155] p-10 rounded-[40px] backdrop-blur-md">
                  <h4 className="text-white font-bold text-2xl mb-6 flex items-center gap-3">
                     <span className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-sm">02</span>
                     DORA Mandate
                  </h4>
                  <p className="text-[#94a3b8] font-light leading-relaxed mb-8">
                     Dictates ICT risk management, incident reporting, and digital operational resilience for the entire financial entity.
                  </p>
                  <div className="bg-indigo-500/5 rounded-2xl p-6 border border-indigo-500/20">
                     <div className="text-[10px] font-mono text-indigo-400 mb-2 font-bold uppercase tracking-widest">Sentinel Solver</div>
                     <p className="text-xs text-[#cbd5e1]">Seamless telemetry integration with SOC/SIEM layers, anchoring all AI operational logs in a DORA-compliant immutable ledger.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ZERO-EGRESS GUARANTEE */}
      <section className="bg-white py-32 border-b border-[#e2e8f0] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3b82f6]/5 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
               <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6">Keep Your Alpha <br /><span className="text-[#2563eb]">Off Our Servers.</span></h2>
               <p className="text-[#475569] text-lg leading-relaxed font-light mb-8">
                  For a quantitative hedge fund or global bank, sending proprietary model weights or high-frequency trading logic to a third-party compliance SaaS is unacceptable. 
               </p>
               <div className="space-y-6">
                  <div className="flex gap-4 p-5 rounded-xl bg-[#F4F1EA] border border-[#e2e8f0] shadow-sm">
                     <Lock className="w-6 h-6 text-[#2563eb] shrink-0" />
                     <div>
                        <h4 className="text-[#0f172a] font-bold mb-1">Zero-Egress WASM</h4>
                        <p className="text-sm text-[#475569] font-light">Compliance grading occurs directly at the edge or on-prem. The payload never leaves your isolated environment.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 p-5 rounded-xl bg-[#F4F1EA] border border-[#e2e8f0] shadow-sm">
                     <Database className="w-6 h-6 text-[#c5832b] shrink-0" />
                     <div>
                        <h4 className="text-[#0f172a] font-bold mb-1">Immutable Ledger-Lock</h4>
                        <p className="text-sm text-[#475569] font-light">Only the cryptographic hash of the compliance proof is sent to our D1 ledger. Nothing that can be reverse-engineered.</p>
                     </div>
                  </div>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
               <div className="bg-[#0f172a] border border-[#e2e8f0] rounded-[30px] p-8 shadow-xl relative">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#334155]">
                     <div className="flex items-center gap-2">
                        <Server className="w-5 h-5 text-[#64748b]" />
                        <span className="font-mono text-xs text-[#cbd5e1]">Trading_Algorithm_Cluster_Prod</span>
                     </div>
                     <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded text-[10px] font-mono font-bold uppercase tracking-widest">Isolated</span>
                  </div>
                  
                  <div className="space-y-4 font-mono text-sm text-[#cbd5e1] opacity-90">
                     <div className="flex gap-4"><span><span className="text-blue-400">await</span> Sentinel.evaluate(credit_model);</span></div>
                     <div className="flex gap-4 text-rose-400"><span>// ERROR: API Payload Detected</span></div>
                     <div className="flex gap-4 text-emerald-400"><span>// SUCCESS: In-Memory Isolate Created. No Network Call.</span></div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>


    </div>
  );
}
