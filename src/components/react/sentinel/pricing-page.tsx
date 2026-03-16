import React, { useState } from "react";
import { Shield, Lock, CheckCircle2, Server, Terminal, GitBranch, FileCheck, HelpCircle, Code, Rocket, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { EnterpriseModal } from "./enterprise-modal";

const PLAN_TEAM_MONTHLY = "https://radumuresanu.lemonsqueezy.com/checkout/buy/3f92be48-0dbb-458f-8a23-035e9452d0dc?embed=1";

export function PricingPage() {
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#10b981]/20 pb-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] -z-10 bg-[radial-gradient(ellipse_700px_450px_at_50%_-10%,rgba(16,185,129,0.08),transparent)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#10b981]/20 bg-[#10b981]/5 mb-8 backdrop-blur-sm shadow-sm">
              <Terminal className="w-3 h-3 text-[#059669]" />
              <span className="text-[10px] font-mono text-[#059669] font-bold uppercase tracking-[0.2em]">Compliance as Code</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.1]">
              AI Compliance for<br />
              <span className="text-[#059669]">Engineering Teams</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg md:text-xl text-[#64748b] mb-12 leading-relaxed max-w-2xl mx-auto font-light">
              From local CLI mapping to automated CI/CD enforcement. Deterministic compliance snapshots for the <strong className="text-[#0f172a] font-medium">EU AI Act</strong>.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. PRICING GRID */}
      <section className="px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          
          {/* Community */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 border border-[#e2e8f0] rounded-3xl p-8 flex flex-col hover:border-[#cbd5e1] hover:shadow-xl transition-all"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0f172a] mb-1">Community</h3>
              <p className="text-[#64748b] text-sm font-light">For individual developers & evaluation.</p>
            </div>
            
            <div className="mb-8 pb-8 border-b border-[#f1f5f9]">
              <div className="flex items-end gap-1.5 text-[#0f172a]">
                <span className="text-4xl font-black tracking-tight">$0</span>
                <span className="text-[#64748b] text-base mb-1">/ forever</span>
              </div>
              <p className="text-[#059669] text-[9px] font-mono font-bold uppercase tracking-widest mt-3">Free Local Usage</p>
            </div>
            
            <ul className="space-y-3.5 mb-10 flex-1">
              {[
                "Unlimited Local CLI Scans",
                "JSON / SARIF Mapping Output",
                "Article mapping support",
                "Distributed via npm",
                "Community Documentation"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-[#475569] text-sm leading-snug">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#cbd5e1] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <a 
              href="/docs"
              className="w-full block text-center py-3.5 px-6 bg-white text-[#0f172a] font-bold rounded-xl hover:bg-[#f8fafc] transition-colors border border-[#e2e8f0] text-sm tracking-tight shadow-sm"
            >
              Install CLI (npm)
            </a>
          </motion.div>

          {/* Team */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-[#10b981] rounded-3xl p-8 flex flex-col relative group shadow-2xl z-20 md:-mt-4 md:mb-4"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 bg-[#10b981] text-white rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] shadow-lg">
                Recommended
              </span>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0f172a] mb-1">Team</h3>
              <p className="text-[#64748b] text-sm font-light font-medium text-[#059669]">CI/CD Enforcement Workflow</p>
            </div>
            
            <div className="mb-8 pb-8 border-b border-[#f1f5f9]">
              <div className="flex items-end gap-1.5 text-[#0f172a]">
                <span className="text-4xl font-black tracking-tight">$299</span>
                <span className="text-[#64748b] text-base mb-1">/ mo</span>
              </div>
              <p className="text-[#059669] text-[9px] font-mono font-bold uppercase tracking-widest mt-3 whitespace-nowrap">Flat monthly team plan</p>
            </div>
            
            <ul className="space-y-3.5 mb-10 flex-1 relative z-10">
              {[
                "Everything in Community",
                "GitHub Action / CI Workflow",
                "Automated PR compliance checks",
                "Evidence artifact generation",
                "Compliance evidence snapshots",
                "Priority Technical Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-[#0f172a] text-sm font-medium leading-snug">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#10b981] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <a 
              href={PLAN_TEAM_MONTHLY} 
              className="lemonsqueezy-button w-full block text-center py-3.5 px-6 bg-[#10b981] text-white font-bold rounded-xl hover:bg-[#059669] transition-all shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] text-sm tracking-tight"
            >
              Start Team Plan
            </a>
          </motion.div>

          {/* Enterprise */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 border border-[#e2e8f0] rounded-3xl p-8 flex flex-col hover:border-[#cbd5e1] hover:shadow-xl transition-all"
          >
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-1">Enterprise</h3>
                <p className="text-[#64748b] text-sm font-light">Regulated orgs & scale.</p>
              </div>
              <Building2 className="w-5 h-5 text-[#94a3b8]" />
            </div>
            
            <div className="mb-8 pb-8 border-b border-[#f1f5f9]">
              <div className="flex items-end gap-1.5 text-[#0f172a]">
                <span className="text-3xl font-black tracking-tight">Custom</span>
              </div>
              <p className="text-[#64748b] text-[9px] font-mono font-bold uppercase tracking-widest mt-3 whitespace-nowrap">Procurement & Implementation</p>
            </div>
            
            <ul className="space-y-3.5 mb-10 flex-1">
              {[
                "Everything in Team",
                "Implementation support",
                "Technical onboarding",
                "Architecture & policy review",
                "Private distribution options",
                "Custom industry policy packs"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-[#475569] text-sm leading-snug">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#cbd5e1] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => setIsEnterpriseModalOpen(true)}
              className="w-full block text-center py-3.5 px-6 bg-[#0f172a] text-white font-bold rounded-xl hover:bg-[#1e293b] transition-all text-sm tracking-tight"
            >
              Talk to Enterprise
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3. SEGMENTATION */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Product Teams",
              desc: "Evaluate your AI system against EU AI Act requirements locally before shipping.",
              icon: <Code className="w-5 h-5" />,
              badge: "Evaluation"
            },
            {
              title: "High-Growth Startups",
              desc: "Enforce compliance at the PR level and generate artifacts for audit readiness.",
              icon: <Rocket className="w-5 h-5" />,
              badge: "CI Integration"
            },
            {
              title: "Regulated Organizations",
              desc: "Standardize policy enforcement and procurement vetting across the organization.",
              icon: <Building2 className="w-5 h-5" />,
              badge: "Governance"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/40 border border-[#e2e8f0] p-8 rounded-[2rem] hover:bg-white transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#059669] mb-6">
                {item.icon}
              </div>
              <span className="text-[10px] font-mono font-bold text-[#059669] uppercase tracking-widest mb-1.5 block opacity-60">{item.badge}</span>
              <h4 className="text-lg font-bold text-[#0f172a] mb-3">{item.title}</h4>
              <p className="text-[#64748b] text-sm leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WORKFLOW */}
      <section className="max-w-7xl mx-auto px-6 mt-40">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono font-bold text-[#10b981] uppercase tracking-[0.25em] mb-4">Implementation</h2>
          <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">How it works</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-px bg-[#cbd5e1] opacity-40"></div>
          
          {[
            {
              step: "01",
              title: "Install CLI",
              desc: "Run `npx sentinel-scan` to map your AI manifest to EU AI Act articles locally.",
              icon: <Terminal className="w-5 h-5" />
            },
            {
              step: "02",
              title: "Enforce in CI",
              desc: "Integrate the GitHub Action to block non-compliant changes at the PR level.",
              icon: <GitBranch className="w-5 h-5" />
            },
            {
              step: "03",
              title: "Generate Evidence",
              desc: "Export deterministic SARIF/JSON artifacts for internal review and audit preparation.",
              icon: <FileCheck className="w-5 h-5" />
            }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center text-[#10b981] shadow-sm mb-6 mx-auto transition-transform hover:-translate-y-1">
                {item.icon}
              </div>
              <p className="text-[10px] font-mono font-bold text-[#64748b] mb-2">{item.step}</p>
              <h4 className="text-lg font-bold text-[#0f172a] mb-2">{item.title}</h4>
              <p className="text-[#64748b] text-sm font-light leading-relaxed max-w-[240px] mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LOW-EGRESS INFRA */}
      <section className="max-w-7xl mx-auto px-6 mt-40">
        <div className="bg-[#0f172a] rounded-[2rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981]/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6 text-white font-mono text-[10px] font-bold uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5 text-[#10b981]" />
                Low-Egress Compliance Workflows
              </div>
              <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Data Residency by Design</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white text-sm font-bold mb-2">Local Execution</h4>
                  <p className="text-[#94a3b8] text-xs leading-relaxed font-light">Scans run in your local environment or CI runner. We don't ingest your training data or model weights.</p>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-2">Deterministic Artifacts</h4>
                  <p className="text-[#94a3b8] text-xs leading-relaxed font-light">Every scan produces verifiable evidence artifacts (SARIF/JSON) anchored to your development versioning.</p>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-2">CI-Native Enforcement</h4>
                  <p className="text-[#94a3b8] text-xs leading-relaxed font-light">Works as a standard step in your existing pipelines. Treat compliance as another passing test.</p>
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold mb-2">Regulation-Based Mapping</h4>
                  <p className="text-[#94a3b8] text-xs leading-relaxed font-light">Consistent compliance mapping derived directly from Regulation 2024/1689 (EU AI Act).</p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Server className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-white text-[10px] font-mono font-bold tracking-[0.2em] uppercase">Processing Mode</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#94a3b8]">Scan Runtime</span>
                  <span className="text-white">Local / CI</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#94a3b8]">Mandatory Uploads</span>
                  <span className="text-[#f43f5e]">None</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#94a3b8]">Artifact Storage</span>
                  <span className="text-white">Self-Managed</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#94a3b8]">Residency</span>
                  <span className="text-[#10b981]">Region-Private</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <span className="text-[10px] text-[#475569] font-bold uppercase tracking-widest">Privacy Focused Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 mt-40">
        <div className="text-center mb-16">
          <HelpCircle className="w-8 h-8 text-[#10b981] mx-auto mb-4 opacity-30" />
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-2 text-sm text-[#64748b]">For technical implementation details, visit our <a href="/ai-compliance-faq" className="text-[#10b981] hover:underline">AI Compliance FAQ</a>.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { 
              q: "Is Sentinel a managed SaaS?", 
              a: "Sentinel is developer-first infrastructure. You run the CLI locally or in your CI/CD environment. We provide the policy engine and logic updates, but we do not host your model data." 
            },
            { 
              q: "Do I need to upload my model?", 
              a: "No. Sentinel uses zero-egress scans. Only metadata and compliance signals required for article mapping are processed. Your model weights and code remain in your perimeter." 
            },
            { 
              q: "What does the Team plan unlock?", 
              a: "The Team plan enables collaborative compliance workflows: automated GitHub Actions, PR compliance comments, and the full evidence snapshot system for audit readiness." 
            },
            { 
              q: "When should we choose Enterprise?", 
              a: "Enterprise is designed for organizations requiring custom policy packs, technical implementation support, procurement-led auditing, and dedicated technical onboarding." 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/50 border border-[#e2e8f0] p-6 rounded-2xl shadow-sm">
              <h5 className="font-bold text-[#0f172a] text-sm mb-2">{item.q}</h5>
              <p className="text-[#64748b] text-xs leading-relaxed font-light">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <EnterpriseModal 
        isOpen={isEnterpriseModalOpen} 
        onClose={() => setIsEnterpriseModalOpen(false)} 
      />
    </div>
  );
}
