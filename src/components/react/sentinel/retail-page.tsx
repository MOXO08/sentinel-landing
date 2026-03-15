import React, { useState, useEffect } from "react"
import { ShoppingCart, BarChart3, Users, Zap, ArrowRight, Shield, CheckCircle2, Lock, EyeOff, Activity } from "lucide-react"
import { motion } from "framer-motion"

export function RetailPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  return (
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#10b981]/10 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-[#e2e8f0]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_60%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 mb-8">
              <ShoppingCart className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-[10px] font-mono font-bold text-[#059669] uppercase tracking-widest">Industry Solution · Retail</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold text-[#0f172a] mb-6 tracking-tight leading-tight">
              EU AI Act Compliance <br />
              <span className="text-[#10b981]">for Digital Commerce</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-[#475569] leading-relaxed max-w-3xl mx-auto font-light mb-10">
              Retail AI touches millions of consumers daily. From dynamic pricing to recommendation engines, 
              Sentinel ensures your customer-facing AI remains transparent, non-discriminatory, and fully compliant.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#0f172a] text-[#F4F1EA] px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#10b981] transition-all shadow-xl group">
                Download Retail Whitepaper
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Shift-Left Narrative for Retail */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-[#e2e8f0]">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-[11px] font-mono font-bold text-[#10b981] tracking-[0.2em] uppercase mb-4">The Strategic Shift</h2>
            <h3 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">Shift-Left Retail Compliance</h3>
            <p className="text-[#475569] text-lg leading-relaxed font-light mb-8">
              In retail, compliance shouldn't be a post-deployment hurdle. Our <strong>Shift-Left</strong> approach integrates deterministic WASM checks directly into your commerce engine's CI/CD pipeline, catching prohibited practices before they reach a single customer.
            </p>
            <div className="space-y-4">
               {[
                 { title: "Article 5 Intercepts", desc: "Automated detection of subliminal techniques in UI/UX recommendation flows." },
                 { title: "Bias Detection", desc: "Audit trail for pricing algorithms to prove non-discriminatory practices." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 p-4 bg-white border border-[#e2e8f0] rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />
                    <div>
                       <h4 className="text-sm font-bold text-[#0f172a]">{item.title}</h4>
                       <p className="text-xs text-[#64748b] leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-[#0f172a] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl"></div>
             <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Shield className="w-6 h-6 text-[#10b981]" />
               The Retail Solution Offering
             </h4>
             <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="text-[10px] font-mono text-[#10b981] uppercase mb-1">Algorithmic Transparency</div>
                   <p className="text-xs text-[#cbd5e1]">WASM-backed logs for every price adjustment or product recommendation, satisfying Art. 13 requirements.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="text-[10px] font-mono text-emerald-400 uppercase mb-1">Commerce Integrity Proof</div>
                   <p className="text-xs text-[#cbd5e1]">Immutable D1 records providing definitive proof of human oversight for high-risk customer profiling.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="text-[10px] font-mono text-blue-400 uppercase mb-1">GDPR Alignment</div>
                   <p className="text-xs text-[#cbd5e1]">Zero-knowledge architecture ensuring customer PII never leaves your POS or commerce environment.</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-[11px] font-mono font-bold text-[#10b981] tracking-[0.2em] uppercase mb-12 text-center">Specific Compliance Vectors</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {[
            {
              title: "Recommendation Engines",
              art: "Art. 13 (Transparency)",
              body: "Recommender systems that influence consumer choices must disclose their AI nature and operating logic. Sentinel logs each recommendation inference with parameters, enabling generation of consumer transparency reports on demand.",
              icon: <Zap className="w-5 h-5 text-[#10b981]" />
            },
            {
              title: "Dynamic Pricing AI",
              art: "Art. 5 (Prohibited Practices)",
              body: "Pricing AI that exploits consumer vulnerabilities or uses prohibited subliminal techniques is banned under Article 5. Sentinel audits pricing model outputs to detect patterns that could trigger prohibited practice investigations.",
              icon: <BarChart3 className="w-5 h-5 text-[#10b981]" />
            },
            {
              title: "Customer Profiling",
              art: "GDPR + Art. 10",
              body: "Profiling AI for marketing segmentation intersects GDPR Article 22 with EU AI Act data governance requirements. Sentinel creates a record of what data was processed by which model version for each segmentation decision.",
              icon: <Users className="w-5 h-5 text-[#10b981]" />
            },
            {
              title: "Inventory Forecasting",
              art: "Art. 9 (Risk Management)",
              body: "Forecasting AI that drives supply chain decisions affecting product availability must demonstrate adequate risk management. Sentinel's audit records provide the evidence layer for your ISO 9001 requirements.",
              icon: <Zap className="w-5 h-5 text-[#10b981]" />
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
      </section>
    </div>
  )
}
