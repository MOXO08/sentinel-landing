import React, { useState, useEffect } from "react";
import { Shield, Lock, Server, ArrowRight, Landmark, Fingerprint, Globe } from "lucide-react";
import { motion } from "framer-motion";

export function GovernmentPage() {
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
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#f59e0b]/20 pb-24">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-[#e2e8f0]">
        {/* Amber/Government Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 mb-8 backdrop-blur-md shadow-sm">
              <Landmark className="w-3.5 h-3.5 text-[#d97706]" />
              <span className="text-[11px] font-mono text-[#d97706] font-bold uppercase tracking-[0.2em]">Public Sector & Defense</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
              National Security. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97706] to-[#f59e0b] drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">Absolute Sovereignty.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed font-light">
              Biometric categorization and law enforcement AI are under intense regulatory scrutiny. Sentinel provides an air-gapped, zero-trust compliance engine for highly classified government workloads.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
               <a href="/methodology" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0f172a] text-[#F4F1EA] font-bold rounded-xl hover:bg-[#d97706] transition-all shadow-lg hover:shadow-[#f59e0b]/20 hover:-translate-y-1">
                  Review Air-Gap Protocol <ArrowRight className="w-4 h-4" />
               </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PUBLIC SECTOR IMPERATIVES */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-[#e2e8f0]">
         <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
                <h2 className="text-[11px] font-mono text-[#d97706] font-bold uppercase tracking-[0.2em]">Public Sector Offering</h2>
               <h3 className="text-3xl md:text-5xl font-black text-[#0f172a]">The Sovereign Security Solution</h3>
               <p className="text-[#475569] text-xl font-light leading-relaxed">
                  The EU AI Act places the strictest possible requirements on state-level actors. Biometrics, asylum, and judicial algorithms are classified as extreme **High-Risk** or **Prohibited**.
               </p>
               <div className="space-y-4">
                  <div className="flex gap-4 p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                        <Fingerprint className="w-5 h-5 text-[#d97706]" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Article 5: Prohibited Practice Detection</h4>
                        <p className="text-xs text-[#475569] leading-relaxed">We offer deterministic detection of social scoring and prohibited biometric categorization for all public service pipelines.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-[#3b82f6]" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Article 13: Technical Transparency</h4>
                        <p className="text-xs text-[#475569] leading-relaxed">Immutable documentation of system capabilities and limitations for use in law enforcement and migration contexts.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#f59e0b]/20 to-transparent rounded-[40px] blur-2xl"></div>
               <img 
                  src="/government_sovereign_viz_1773183465766.png" 
                  alt="Government Sovereignty Visualization" 
                  className="relative rounded-[40px] border border-[#e2e8f0] shadow-2xl z-10"
               />
               <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-xl z-20 hidden md:block">
                  <div className="text-[10px] font-mono text-[#d97706] mb-2 uppercase tracking-widest font-bold">State Isolation Protocol</div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 px-3 py-1 rounded bg-black text-white font-mono text-xs">
                        <Lock className="w-3 h-3" /> AIR-GAPPED
                     </div>
                     <div className="w-px h-8 bg-[#e2e8f0]"></div>
                     <div className="font-mono text-[10px] text-[#475569]">ZONE: SOVEREIGN-EU-01</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
               { icon: Fingerprint, title: "Biometric Categorization", desc: "Real-time remote biometric identification systems demand explicit cryptographic proof of necessity, proportionality, and zero racial bias per Article 5(1)(d).", color: "text-[#d97706]", bg: "bg-[#f59e0b]/10", border: "border-[#f59e0b]/20" },
               { icon: Globe, title: "Border Control & Asylum", desc: "Polygraphs and migration-risk algorithms must pass Sentinel's rigorous Article 10 and 11 structural audits to prevent human rights violations.", color: "text-[#10b981]", bg: "bg-[#10b981]/10", border: "border-[#10b981]/20" },
               { icon: Shield, title: "Law Enforcement", desc: "Predictive policing and evidence-evaluation models are subject to mandatory fundamental rights impact assessments (FRIA) monitored by our engine.", color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10", border: "border-[#3b82f6]/20" }
            ].map((Feature, i) => (
               <div key={i} className="bg-white p-8 rounded-2xl border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors relative overflow-hidden group shadow-sm hover:shadow-md">
                   <div className={`absolute top-0 right-0 w-32 h-32 ${Feature.bg} rounded-full blur-[50px] opacity-20 group-hover:opacity-50 transition-opacity`}></div>
                  <div className={`w-12 h-12 rounded-xl ${Feature.bg} ${Feature.border} border flex items-center justify-center mb-6`}>
                     <Feature.icon className={`w-6 h-6 ${Feature.color}`} />
                  </div>
                  <h4 className="text-lg font-bold text-[#0f172a] mb-3">{Feature.title}</h4>
                  <p className="text-sm text-[#475569] leading-relaxed font-light">{Feature.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* AIR-GAPPED DEPLOYMENT */}

      {/* AIR-GAPPED DEPLOYMENT */}
      <section className="bg-white py-32 border-b border-[#e2e8f0] relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-30"></div>
         
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
               <div className="bg-[#0f172a] border border-[#e2e8f0] rounded-[30px] p-8 shadow-xl relative">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#334155]">
                     <div className="flex items-center gap-2">
                        <Server className="w-5 h-5 text-[#64748b]" />
                        <span className="font-mono text-xs text-[#cbd5e1]">AirGapped_GovCloud_Region_1</span>
                     </div>
                     <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-mono font-bold uppercase tracking-widest">No Internet</span>
                  </div>
                  
                  <div className="space-y-4 font-mono text-sm text-[#cbd5e1] opacity-90">
                     <div className="flex gap-4 text-[#64748b]"><span>// Sentinel runs entirely offline via internal registry</span></div>
                     <div className="flex gap-4"><span><span className="text-[#f59e0b]">const</span> LocalSentinel = require(<span className="text-emerald-300">"sentinel-core-enterprise"</span>);</span></div>
                     <div className="flex gap-4"><span><span className="text-[#f59e0b]">await</span> LocalSentinel.Verify(DefenseModel);</span></div>
                     <div className="flex gap-4 text-emerald-400 mt-4"><span>// LOCAL ATTESTATION SUCCESS.</span></div>
                     <div className="flex gap-4 text-emerald-400"><span>// Signed: Military-Grade Hardware Key.</span></div>
                  </div>
               </div>
            </motion.div>

             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6">The National Vault <br /><span className="text-[#d97706]">Sovereign Offering.</span></h2>
               <p className="text-[#475569] text-lg leading-relaxed font-light mb-8">
                  State secrets cannot be uploaded to public clouds for compliance scanning. The Fortress tier packages the entire Sentinel WebAssembly engine into a deployable artifact that runs completely offline inside your secure government intranet.
               </p>
               <div className="p-5 border border-[#e2e8f0] rounded-xl bg-[#F4F1EA] mb-6 shadow-sm">
                  <p className="text-sm font-semibold text-[#0f172a] mb-2">D1 Ledger Federation (Optional)</p>
                  <p className="text-xs text-[#475569]">For non-classified data, compliance hashes can be securely synced to the global Cloudflare D1 ledger via an internal proxy, providing public observability without data egress.</p>
               </div>
            </motion.div>
         </div>
      </section>


    </div>
  );
}
