import React, { useState, useEffect } from "react";
import { Shield, Users, Target, Globe, ArrowRight, Award, Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function AboutPage() {
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
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#10b981]/10 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-[#e2e8f0]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_60%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 mb-8 backdrop-blur-md">
              <Shield className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-[11px] font-mono text-[#059669] font-bold uppercase tracking-[0.2em]">Our Mission & Vision</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
              Sovereign Trust for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#10b981] drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]">AI-Native Era.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed font-light">
              Sentinel was founded on a singular premise: regulatory compliance should be a technical asset, not a legal bottleneck. We build the cryptographic bridge between high-stakes AI and democratic oversight.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: Target,
              title: "Deterministic Integrity",
              desc: "We replace subjective questionnaires with mathematically verifiable audit logs compiled to WASM. Truth is absolute, not descriptive."
            },
            {
              icon: Lock,
              title: "Privacy by Design",
              desc: "Our Zero-Egress architecture ensures your model logic and patient/client data never leave your secure perimeter."
            },
            {
              icon: Globe,
              title: "European Sovereignty",
              desc: "Built to uphold the highest standards of the EU AI Act, ensuring that European digital space remains safe, human-centric, and innovative."
            }
          ].map((value, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 bg-white rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F4F1EA] border border-[#e2e8f0] flex items-center justify-center mb-6 group-hover:bg-[#10b981]/10 group-hover:border-[#10b981]/30 transition-colors">
                <value.icon className="w-6 h-6 text-[#059669]" />
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-[#475569] leading-relaxed font-light">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team / Expertise Section */}
      <section className="py-24 px-6 bg-[#0f172a] text-white rounded-[3rem] mx-6 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10b981]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[11px] font-mono font-bold text-[#10b981] tracking-[0.2em] uppercase mb-4">The Expertise</h2>
            <h3 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">Built by Compliance <br/><span className="text-[#10b981]">Engineers.</span></h3>
            <p className="text-[#94a3b8] text-lg font-light leading-relaxed mb-8">
              Sentinel isn't just a software company; we are a multidisciplinary team. Our leadership combines world-class software engineering with deep legal expertise in European Union digital regulation.
            </p>
            <div className="space-y-4">
              {[
                { title: "Former Regulatory Officers", role: "Expertise in Annex III/IV mandates" },
                { title: "WASM & Cryptography Experts", role: "Specialists in secure computation" },
                { title: "AI Research Scientists", role: "Focused on deterministic bias detection" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#10b981]/30 transition-colors">
                  <Award className="w-6 h-6 text-[#10b981] shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-[#94a3b8]">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group">
               <Shield className="w-32 h-32 text-[#10b981] opacity-20 group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]"></div>
               <div className="absolute bottom-10 left-10 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest mb-1">Established</div>
                  <div className="text-2xl font-bold">2026</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
       <section className="text-center py-12">
          <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-10 tracking-tight">Ready to Secure Your AI Legacy?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/pricing" className="bg-[#0f172a] text-white px-10 py-5 rounded-xl font-bold hover:bg-[#c5832b] transition-all shadow-xl hover:-translate-y-1">
              Review Pricing Plans
            </a>
            <a href="mailto:office@gettingsentinel.com" className="bg-white border border-[#e2e8f0] px-10 py-5 rounded-xl font-bold hover:bg-[#F4F1EA] transition-all shadow-sm">
              Contact Sales
            </a>
          </div>
       </section>
    </div>
  );
}
