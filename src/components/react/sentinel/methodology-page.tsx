import React, { useState, useEffect } from "react";
import { Shield, Cpu, Network, CheckCircle2, ChevronRight, Lock, Database, Code, Zap, GitBranch, Terminal, ArrowRight, EyeOff, Activity, Key } from "lucide-react";
import { motion } from "framer-motion";

export function MethodologyPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#c5832b]/20 pb-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-32 px-6 overflow-hidden border-b border-[#e2e8f0]">
        {/* Abstract Data Flow Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 bg-[radial-gradient(ellipse_800px_600px_at_50%_-20%,rgba(197,131,43,0.1),transparent)] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-full h-full -z-10 bg-[linear-gradient(to_bottom,transparent,rgba(244,241,234,1)_80%)] pointer-events-none"></div>
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5832b]/30 bg-[#c5832b]/10 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(197,131,43,0.1)]">
              <Cpu className="w-3.5 h-3.5 text-[#c5832b]" />
              <span className="text-[11px] font-mono text-[#b87333] font-bold uppercase tracking-[0.2em]">The Entropy Engine</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
              Mathematical Certainty.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b87333] to-[#c5832b] drop-shadow-[0_0_30px_rgba(197,131,43,0.2)]">Zero Data Egress.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed font-light">
              Sentinel is not a generic GRC form-builder. It is a <strong className="text-[#0f172a] font-medium">Deterministic Protocol</strong>. We execute regulatory audits as compiled WebAssembly directly in memory, locking the cryptographic proof without your AI data ever leaving the facility.
            </motion.p>
          </motion.div>

          {/* Architecture Abstract Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-5xl mt-8"
          >
             <div className="bg-[#0f172a] border border-[#e2e8f0] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c5832b]/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                
                <div className="grid md:grid-cols-3 gap-6 relative z-10">
                   {/* Step 1 */}
                   <div className="bg-[#020617] border border-[#334155] rounded-2xl p-6 relative shadow-inner">
                      <div className="w-10 h-10 rounded-lg bg-[#334155]/50 flex items-center justify-center mb-4 border border-[#475569]">
                         <GitBranch className="w-5 h-5 text-[#cbd5e1]" />
                      </div>
                      <h4 className="font-mono text-sm font-bold text-white mb-2">1. Solution Ingestion</h4>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">
                         Plug-and-play integration intercepts system manifests directly from your existing CI/CD pipelines.
                      </p>
                      <div className="absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20">
                         <ChevronRight className="w-5 h-5 text-[#cbd5e1]" />
                      </div>
                   </div>
                   
                   {/* Step 2 */}
                   <div className="bg-[#020617] border border-[#c5832b]/50 rounded-2xl p-6 relative shadow-[0_0_30px_rgba(197,131,43,0.15)] group">
                      <div className="absolute inset-0 bg-[#c5832b]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                         <div className="w-10 h-10 rounded-lg bg-[#c5832b]/10 flex items-center justify-center mb-4 border border-[#c5832b]/30">
                            <Cpu className="w-5 h-5 text-[#c5832b]" />
                         </div>
                         <h4 className="font-mono text-sm font-bold text-[#c5832b] mb-2">2. Sovereign Audit Engine</h4>
                         <p className="text-xs text-[#94a3b8] leading-relaxed">
                            The EU AI Act ruleset executes as a production-grade verified isolate. ~0.21ms latency. 100% data isolation.
                         </p>
                      </div>
                      <div className="absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20">
                         <ChevronRight className="w-5 h-5 text-[#cbd5e1]" />
                      </div>
                   </div>

                   {/* Step 3 */}
                   <div className="bg-[#020617] border border-[#334155] rounded-2xl p-6 relative shadow-inner">
                      <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center mb-4 border border-[#3b82f6]/30">
                         <Database className="w-5 h-5 text-[#3b82f6]" />
                      </div>
                      <h4 className="font-mono text-sm font-bold text-white mb-2">3. D1 Ledger-Lock</h4>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">
                         The cryptographic hash of the 'Technical File' (Annex IV) is permanently anchored in a distributed database. 
                      </p>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE PROBLEM: RISK ASYMMETRY */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-[#e2e8f0]">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-[11px] font-mono font-bold text-[#b87333] tracking-[0.2em] uppercase mb-4">The Problem</h2>
            <h3 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6">Risk Asymmetry in the AI Era</h3>
            <p className="text-[#475569] text-lg leading-relaxed font-light mb-6">
              Enterprise AI adoption is stalled by new regulations (EU AI Act 2026, GDPR) and security risks. Development teams introduce critical vulnerabilities daily: LLM key exfiltration, PII data logging in prompts, or lack of transparency disclaimers.
            </p>
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
              <p className="text-rose-900 text-sm font-medium">
                Manual audits (pentests) are retroactive and slow. By the time a human auditor identifies a data leak, the code is already in production.
              </p>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-4">
             {[
               { title: "Manual Latency", val: "Weeks/Months", color: "bg-rose-500" },
               { title: "Sentinel Guard", val: "0.21ms", color: "bg-[#10b981]" }
             ].map((stat, i) => (
               <div key={i} className="bg-white p-6 rounded-2xl border border-[#e2e8f0] flex items-center justify-between">
                 <span className="font-bold text-[#0f172a]">{stat.title}</span>
                 <span className={`px-4 py-1 rounded-full text-white font-mono text-sm ${stat.color}`}>{stat.val}</span>
               </div>
             ))}
          </motion.div>
        </div>
      </section>

      {/* 3. THE SOLUTION: WASM ENGINE */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-[#e2e8f0]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[11px] font-mono font-bold text-[#b87333] tracking-[0.2em] uppercase mb-4">The Solution</h2>
          <h3 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6">Invisible Compliance at Compile-Time</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           {[
             { 
               title: "Air-Gapped & Zero-Knowledge", 
               icon: Shield,
               desc: "Source code never leaves the company network. Sentinel runs 100% offline. We don't sell access to a vulnerable API, but invisible infrastructure." 
             },
             { 
               title: "Proprietary Logic in WASM", 
               icon: Code,
               desc: "The engine executes cryptographically signed rule packs (Ed25519) compiled into WebAssembly. Absolute guarantee against supply chain tampering." 
             },
             { 
               title: "Absolute Determinism", 
               icon: Activity,
               desc: "Results are mathematically sorted and hashed. The same code will always generate the same audit report, eliminating false-positive 'noise'." 
             }
           ].map((item, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 rounded-xl bg-[#c5832b]/10 flex items-center justify-center mb-6 border border-[#c5832b]/20">
                 <item.icon className="w-6 h-6 text-[#c5832b]" />
               </div>
               <h4 className="text-xl font-bold text-[#0f172a] mb-4">{item.title}</h4>
               <p className="text-sm text-[#475569] leading-relaxed font-light">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 4. ROI & EFFICIENCY */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-[#0f172a] rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5832b]/20 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-8">Radical Efficiency and Real ROI</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full border border-[#c5832b]/50 flex items-center justify-center font-mono text-[#c5832b] font-bold text-lg">90</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Deterministic Layer ($0 Marginal Cost)</h4>
                  <p className="text-[#94a3b8] font-light">90% of AI vulnerabilities (hardcoded keys, PII patterns) are intercepted directly on the local processor, without calls to expensive external LLM models.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full border border-blue-500/50 flex items-center justify-center font-mono text-blue-400 font-bold text-lg">0</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Zero Egress & Cold Start</h4>
                  <p className="text-[#94a3b8] font-light">Being a statically compiled binary (Rust), latency is non-existent. We eliminate data transfer costs and per-scan processing fees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RULE PACKS V1 */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white rounded-[3rem] border border-[#e2e8f0] mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Critical Use Cases (Rule Packs V1)</h2>
          <p className="text-[#475569]">Technical specifications of active rule packs in the Sentinel engine.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "Leakage Prevention", desc: "Surgical precision detection of exposed OpenAI, Anthropic, and GCP keys in code.", icon: Key },
            { label: "PII Protection (GDPR)", desc: "Intercepting logging functions that could send raw data (prompts) to insecure systems.", icon: Lock },
            { label: "AI Act Transparency", desc: "Validating the presence of mandatory labeling for AI-generated content.", icon: EyeOff }
          ].map((item, i) => (
            <div key={i} className="p-8 border-r border-[#e2e8f0] last:border-0">
               <h5 className="font-bold text-[#0f172a] mb-3 flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                 {item.label}
               </h5>
               <p className="text-sm text-[#475569] font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
