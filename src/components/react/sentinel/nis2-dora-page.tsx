import React, { useState, useEffect } from "react";
import { Shield, Server, FileText, AlertTriangle, ArrowRight, Lock, Command, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function Nis2DoraPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-[#F4F1EA] text-[#0f172a] selection:bg-[#c5832b]/20 pb-24 font-sans border-t border-[#e2e8f0]/50">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(ellipse_800px_600px_at_50%_-20%,rgba(197,131,43,0.15),transparent)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Breadcrumbs */}
          <nav className="font-mono text-[10px] md:text-sm font-bold uppercase tracking-widest text-[#475569] mb-12 flex items-center gap-2">
            <a href="/" className="hover:text-[#c5832b] transition-colors">Home</a>
            <span className="text-[#c5832b]">/</span>
            <span className="hover:text-[#c5832b] transition-colors cursor-default">Audit Services</span>
            <span className="text-[#c5832b]">/</span>
            <span className="text-[#0f172a]">NIS2 & DORA</span>
          </nav>

          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5832b]/30 bg-[#c5832b]/10 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5832b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5832b]"></span>
              </span>
              <span className="text-[10px] font-mono text-[#b87333] font-bold uppercase tracking-widest">WASM-Based Security Active</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
              Deterministic Audit and <br className="hidden md:block" />
              <span className="text-[#c5832b]">NIS2/DORA</span> Compliance at the Edge
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed">
              Real-time regulatory compliance and <span className="font-bold text-[#0f172a]">WASM-based security</span>. Transformăm auditul din document static în infrastructură executabilă cu latență sub-milisecundă.
            </motion.p>
            
            <motion.div variants={fadeIn} className="mt-8 rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-2xl relative bg-[#0f172a] aspect-[21/9] flex items-center justify-center">
              {/* Abstract Visual for "Deterministic Core" */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2M1ODMyYiI+PC9jaXJjbGU+Cjwvc3ZnPg==')]"></div>
              <div className="relative z-10 w-48 h-48 border-[2px] border-[#c5832b]/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                 <div className="w-32 h-32 border-[1px] border-[#c5832b]/60 rounded-full flex items-center justify-center animate-[spin_8s_linear_infinite_reverse]">
                   <Shield className="w-12 h-12 text-[#c5832b] animate-pulse" aria-label="Arhitectură de audit deterministic bazată pe WebAssembly pentru conformitate DORA" />
                 </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                 <div className="font-mono text-xs font-bold text-[#e2e8f0] bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                   deterministic_core.wasm // ACTIVE
                 </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE LEGAL THREAT */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-[11px] font-mono font-bold text-[#c5832b] tracking-[0.2em] uppercase mb-4">Financial Risk</h2>
              <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">The Risks of Non-Compliance: Financial Impact of NIS2 and DORA Directives</h2>
              <p className="text-lg text-[#475569] leading-relaxed">
                European legislation has moved beyond recommendations. The lack of a resilient system-level architecture attracts direct capital impact through GDPR fines of <span className="font-bold text-[#0f172a]">4% of global turnover</span> and daily penalties under the DORA regulation (2026).
              </p>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="grid gap-6"
          >
            {[
              { title: "DORA Daily Penalties", desc: "Authorities can impose periodic fines of up to 1% of the average daily global turnover from the preceding financial year.", icon: AlertTriangle },
              { title: "NIS2 Direct Liability", desc: "Management body members can be temporarily suspended from their functions and are held personally liable.", icon: Command },
              { title: "Cross-Sector GDPR Sanctions", desc: "Any data breach caused by a lack of network resilience is cumulatively sanctioned with fines of up to €20,000,000.", icon: Shield }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-[#e2e8f0]/80 shadow-sm hover:border-[#c5832b]/50 transition-colors">
                <div className="shrink-0 p-3 bg-[#F4F1EA] rounded-xl h-fit">
                  <item.icon className="w-6 h-6 text-[#c5832b]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2">{item.title}</h3>
                  <p className="text-[#475569] text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. THE TECHNOLOGY */}
      <section className="py-24 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-[11px] font-mono font-bold text-[#c5832b] tracking-[0.2em] uppercase mb-4">Technical Authority</h2>
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">90/10 Radical Efficiency: Security via WASM Logic and Cloudflare Edge</h2>
            <p className="text-[#94a3b8] text-lg md:text-xl leading-relaxed">
              Our architecture transforms compliance: <span className="text-white font-bold">90% Deterministic (Edge WASM) / 10% AI Superior Instance</span>. We eliminate latency and exposure of sensitive data from the audit process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Zero-Latency Audit", desc: "NIS2 rules and DORA matrices are natively compiled into WebAssembly modules running at the Cloudflare Edge in less than 1ms." },
              { title: "No-Egress Data Validation", desc: "Data never leaves our nodes. Validation of financial structures and resilience is done strictly locally (Privacy by Design)." },
              { title: "Proprietary Compiled Logic", desc: "Audit logic is encrypted and immutable. WASM is the new defensive 'Moat', absolutely resistant to reverse-engineering and tampering." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1e293b]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#334155] hover:border-[#c5832b]/50 transition-colors"
               >
                 <div className="text-[#c5832b] font-mono text-sm font-bold mb-6">0{i + 1} // Spec</div>
                 <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                 <p className="text-[#94a3b8] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DATA PRIVACY */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] p-10 md:p-16 border border-[#e2e8f0] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5832b]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex p-4 bg-[#F4F1EA] rounded-2xl mb-8 border border-[#e2e8f0]">
               <Lock className="w-8 h-8 text-[#c5832b]" />
            </div>
            <h2 className="text-[11px] font-mono font-bold text-[#c5832b] tracking-[0.2em] uppercase mb-4">Trust Signals & E-E-A-T</h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0f172a] mb-8 tracking-tight leading-tight">Data Sovereignty: Audit Without Information Transfer <br/><span className="text-[#c5832b]">(Zero-Data-Exfiltration)</span></h2>
            <p className="text-lg md:text-xl text-[#475569] leading-relaxed mb-12">
              Conventional security audits expose sensitive data. At Sentinel, we respect strict Data Sovereignty norms by guaranteeing <strong className="text-[#0f172a]">GDPR compliance by Architecture</strong>. Your critical data is analyzed in the Enterprise network, but not a single byte leaves the analyzing Cloudflare node.
            </p>
            
            <ul className="space-y-6 font-mono text-xs md:text-sm font-bold text-[#0f172a]">
              <li className="flex items-center gap-4 bg-[#F4F1EA]/50 p-4 rounded-xl border border-[#e2e8f0]/50"><CheckCircle2 className="w-6 h-6 shrink-0 text-[#c5832b]" /> THEORETICALLY IMPOSSIBLE TO EXFILTRATE BY DESIGN</li>
              <li className="flex items-center gap-4 bg-[#F4F1EA]/50 p-4 rounded-xl border border-[#e2e8f0]/50"><CheckCircle2 className="w-6 h-6 shrink-0 text-[#c5832b]" /> MATHEMATICAL DETERMINISTIC VERIFICATION</li>
              <li className="flex items-center gap-4 bg-[#F4F1EA]/50 p-4 rounded-xl border border-[#e2e8f0]/50"><CheckCircle2 className="w-6 h-6 shrink-0 text-[#c5832b]" /> SOVEREIGN EUROPEAN COMPLIANCE</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-32 text-center px-6">
        <h2 className="text-4xl md:text-6xl font-black text-[#0f172a] mb-10 tracking-tight">Ready for Tomorrow's Audit?</h2>
        <a href="/vault" className="inline-flex justify-center items-center gap-3 px-10 py-5 bg-[#0f172a] text-[#F4F1EA] font-sans font-bold text-lg rounded-xl hover:bg-[#c5832b] transition-colors shadow-2xl hover:shadow-[#c5832b]/20 hover:-translate-y-1">
          <FileText className="w-5 h-5" /> 
          Request Risk and Compliance Report
        </a>
      </section>
    </div>
  );
}
