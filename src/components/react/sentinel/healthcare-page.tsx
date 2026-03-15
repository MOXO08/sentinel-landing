import React, { useState, useEffect } from "react";
import { Shield, HeartPulse, Stethoscope, Lock, FileText, Activity, Server, ArrowRight, Dna } from "lucide-react";
import { motion } from "framer-motion";

export function HealthcarePage() {
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
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#06b6d4]/20 pb-24">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-[#e2e8f0]">
        {/* Deep Cyan/Medical Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 mb-8 backdrop-blur-md shadow-sm">
              <HeartPulse className="w-3.5 h-3.5 text-[#0891b2]" />
              <span className="text-[11px] font-mono text-[#0891b2] font-bold uppercase tracking-[0.2em]">Medical Devices & Diagnostics</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
              Deterministic Compliance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891b2] to-[#06b6d4] drop-shadow-[0_0_30px_rgba(6,182,212,0.2)]">for Healthcare AI.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed font-light">
              Medical Device (MDR) and EU AI Act intersection is complex. Sentinel ensures your clinical algorithms are bias-free and cryptographically certified without ever touching patient PHI.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
               <a href="/methodology" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0f172a] text-[#F4F1EA] font-bold rounded-xl hover:bg-[#0891b2] transition-all shadow-lg hover:shadow-[#06b6d4]/20 hover:-translate-y-1">
                  Review Zero-Egress Engine <ArrowRight className="w-4 h-4" />
               </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CORE HEALTHCARE CHALLENGES */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-[#e2e8f0]">
         <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
               <h2 className="text-[11px] font-mono text-[#0891b2] font-bold uppercase tracking-[0.2em]">Clinical Vulnerabilities</h2>
               <h3 className="text-3xl md:text-5xl font-black text-[#0f172a]">MDR & AI Act Intersection</h3>
               <p className="text-[#475569] text-xl font-light leading-relaxed">
                  If your AI influences a clinical decision, it is classified as **High-Risk** under Annex III. Regulators demand complete transparency, yet HIPAA/GDPR forbids exposing raw patient data.
               </p>
               <div className="space-y-6">
                  <div className="flex gap-4 p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center shrink-0">
                        <Dna className="w-5 h-5 text-[#0891b2]" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Article 10: Bias Detection Engine</h4>
                        <p className="text-xs text-[#475569] leading-relaxed">Our clinical bias detection engine executes categorical distribution analysis to mitigate algorithmic health imbalance without seeing raw patient records.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm">
                     <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#10b981]" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Article 11: Technical File</h4>
                        <p className="text-xs text-[#475569] leading-relaxed">Automated generation of Annex IV dossiers for Artificial Intelligence Medical Devices (AIMD), signed via Ed25519.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#06b6d4]/20 to-transparent rounded-[40px] blur-2xl"></div>
               <img 
                  src="/healthcare_compliance_viz_1773183448389.png" 
                  alt="Healthcare Compliance Visualization" 
                  className="relative rounded-[40px] border border-[#e2e8f0] shadow-2xl z-10"
               />
               <div className="absolute -bottom-6 -right-6 bg-[#0f172a] p-6 rounded-2xl border border-[#334155] shadow-xl z-20 hidden md:block">
                  <div className="text-[10px] font-mono text-[#06b6d4] mb-2 uppercase tracking-widest font-bold">Deterministic Audit Result</div>
                  <div className="flex items-center gap-4">
                     <div>
                        <div className="text-[9px] text-[#94a3b8] uppercase mb-1">Bias Score</div>
                        <div className="font-mono text-xl text-white">0.02 <span className="text-[10px] text-green-500 font-bold tracking-tighter">NOMINAL</span></div>
                     </div>
                     <div className="w-px h-8 bg-[#334155]"></div>
                     <div>
                        <div className="text-[9px] text-[#94a3b8] uppercase mb-1">PHI Egress</div>
                        <div className="font-mono text-xl text-white">0.00 <span className="text-[10px] text-green-500 font-bold tracking-tighter">SECURE</span></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-10 rounded-3xl border border-[#e2e8f0] hover:border-[#0891b2]/50 transition-colors relative overflow-hidden group shadow-sm hover:shadow-md">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[50px]"></div>
               <div className="w-12 h-12 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-[#0891b2]" />
               </div>
               <h4 className="text-xl font-bold text-[#0f172a] mb-4">Diagnostics & Imaging</h4>
               <p className="text-[#475569] leading-relaxed font-light mb-6">
                  Computer vision models detecting anomalies must prove they don't suffer from demographic bias. Sentinel audits the model's structural fairness within your own clean-room.
               </p>
               <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-[#475569]"><Shield className="w-4 h-4 text-[#0891b2]" /> Automated Article 10 Bias Checks</li>
                  <li className="flex items-center gap-2 text-sm text-[#475569]"><Shield className="w-4 h-4 text-[#0891b2]" /> ISO 13485 Alignment Tracking</li>
               </ul>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-[#e2e8f0] hover:border-[#10b981]/50 transition-colors relative overflow-hidden group shadow-sm hover:shadow-md">
               <div className="absolute top-0 left-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-[50px]"></div>
               <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mb-6">
                  <Stethoscope className="w-6 h-6 text-[#10b981]" />
               </div>
               <h4 className="text-xl font-bold text-[#0f172a] mb-4">Clinical Decision Support</h4>
               <p className="text-[#475569] leading-relaxed font-light mb-6">
                  Systems recommending treatment plans require continuous monitoring. Sentinel's CI/CD Watchtower detects 'Clinical Drift' before it impacts patient outcomes.
               </p>
               <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-[#475569]"><Shield className="w-4 h-4 text-[#10b981]" /> Real-time MDR/AI Act Drift Alerts</li>
                  <li className="flex items-center gap-2 text-sm text-[#475569]"><Shield className="w-4 h-4 text-[#10b981]" /> Immutable D1 Ledger Certification</li>
               </ul>
            </div>
         </div>
      </section>

      {/* TECHNICAL BIAS HEURISTICS */}
      <section className="py-24 px-6 bg-[#0f172a] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none"></div>
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="w-full lg:w-1/2">
                  <h2 className="text-[11px] font-mono font-bold text-[#06b6d4] tracking-[0.2em] uppercase mb-4">The Clinical Solution</h2>
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">Biased Algorithmic<br/><span className="text-[#06b6d4]">Health Mitigation</span></h3>
                  <p className="text-[#94a3b8] text-lg font-light leading-relaxed mb-8">
                     We offer a specialized solution using Feature Distribution Heuristics to satisfy Article 10.3. It measures the entropy of categorical identifiers in your training logs while maintaining 100% data isolation.
                  </p>
                  <div className="space-y-4">
                     {[
                        { l: "Diversity Index", v: "0.94", b: "w-[94%]" },
                        { l: "Categorical Balance", v: "0.89", b: "w-[89%]" },
                        { l: "Noise Correlation", v: "0.02", b: "w-[2%]" }
                     ].map((item, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between text-xs font-mono text-[#cbd5e1] uppercase tracking-tighter">
                              <span>{item.l}</span>
                              <span>{item.v}</span>
                           </div>
                           <div className="h-1.5 w-full bg-[#334155] rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: item.b.replace("w-[", "").replace("]", "") }}
                                 viewport={{ once: true }}
                                 transition={{ delay: 0.5, duration: 1 }}
                                 className="h-full bg-gradient-to-r from-[#0891b2] to-[#06b6d4]"
                              ></motion.div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="w-full lg:w-1/2 bg-[#020617] p-8 rounded-[40px] border border-[#334155] shadow-2xl">
                  <div className="flex items-center gap-2 mb-6 border-b border-[#334155] pb-4">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-red-500"></div>
                     </div>
                     <span className="font-mono text-[10px] text-white font-bold tracking-widest uppercase">Sentinel-Engine Console</span>
                  </div>
                  <div className="font-mono text-xs text-[#cbd5e1] space-y-4">
                     <div className="text-[#64748b]">{"// Executing Article 10.3 Diversity Check"}</div>
                     <div><span className="text-[#06b6d4]">$</span> sentinel <span className="text-amber-500">audit</span> --source-type <span className="text-white">AIMD-V3</span></div>
                     <div className="text-green-400">{"[INFO] Connected to Sovereign Cloud Node: Frankfurt-01"}</div>
                     <div className="text-blue-400">{"[STEP] Analyzing categorical distribution vectors..."}</div>
                     <div className="bg-[#1e293b] p-4 rounded-xl border border-[#334155] my-2">
                        <div className="text-red-400 font-bold mb-1">{"[VIOLATION] Article 10.3 (Bias Cluster Detected)"}</div>
                        <div className="text-[10px] text-[#94a3b8]">{"Location: feature_set_radiology_v1.2"}</div>
                        <div className="text-[10px] text-[#94a3b8]">{"Metric: Entropy Variation > 18%"}</div>
                     </div>
                     <div className="text-amber-400">{"[WARNING] HUMAN_INTERVENTION_REQUIRED: Non-nominal distribution."}</div>
                     <div className="text-white tracking-widest animate-pulse">_</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ZERO-PHI COMPLIANCE */}
      <section className="bg-white py-32 border-b border-[#e2e8f0]">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-200 bg-rose-50 mb-6 shadow-sm">
               <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-widest">PHI / GDPR Firewall</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-8">Sovereign Health Audit.</h2>
            <p className="text-[#475569] text-lg leading-relaxed font-light mb-12">
               Traditional compliance tools require you to expose model telemetry, which often inadvertently contains Protected Health Information (PHI). Sentinel operates as a compiled WebAssembly binary inside your VPC. We grade the math; we never see the patient.
            </p>
            
            <div className="bg-[#0f172a] border border-[#e2e8f0] rounded-2xl p-6 text-left max-w-2xl mx-auto shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#0891b2] to-[#10b981]"></div>
               <div className="font-mono text-sm text-[#cbd5e1] space-y-4">
                  <div className="text-[#64748b]">{"// Clinical Pipeline Secure Execution"}</div>
                  <div><span className="text-[#06b6d4]">const</span> patient_data = DB.FetchPHI();</div>
                  <div><span className="text-[#06b6d4]">const</span> inference = RadiologyModel.predict(patient_data);</div>
                  <div className="text-[#64748b] mt-4">{"// Sentinel grades the *structure* of the model, not the data."}</div>
                  <div><span className="text-[#10b981]">await</span> Sentinel.AuditArchitecture(RadiologyModel.getManifest());</div>
                  <div className="text-[#10b981] mt-2">{"// => 0.21ms: Proof of Compliance Logged to D1 Ledger."}</div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}
