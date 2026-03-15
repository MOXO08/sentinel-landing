"use client"

import React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, Lock } from "lucide-react"

export function BottomCTA() {
  return (
    <section className="py-24 px-6 bg-[#0f172a] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-[#10b981]/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[70%] bg-[#059669]/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-12 md:p-20 rounded-[3rem] text-center shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 mb-8"
          >
            <Shield className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="text-[10px] font-mono text-[#10b981] font-bold uppercase tracking-[0.2em]">Secure Your AI Perimeter</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]"
          >
            Ready for Deterministic<br />
            <span className="text-[#10b981]">Compliance?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#94a3b8] mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Deploy the <strong className="text-white font-medium">Sovereign Audit Engine</strong> today. From singular reports to industrial CI/CD protection, Sentinel ensures your AI assets remain compliant with the EU AI Act.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="/pricing"
              className="px-10 py-5 bg-[#10b981] text-[#0f172a] font-bold rounded-2xl hover:bg-[#059669] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#10b981]/20 flex items-center gap-3 group"
            >
              <Zap className="w-5 h-5 fill-current" />
              View Solution Tiers
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/security"
              className="px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <Lock className="w-5 h-5 text-[#10b981]" />
              Security Whitepaper
            </a>
          </motion.div>

          <div className="mt-16 pt-16 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Uptime", value: "99.99%" },
              { label: "Latency", value: "<15ms" },
              { label: "Data Egress", value: "0%" },
              { label: "Sovereign Trust", value: "Verified" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-lg font-bold text-white font-mono">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
