import React, { useState, useEffect } from "react";
import { Scale, BookOpen, CheckCircle2, ChevronRight, FileText, Database, Shield, Zap, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const articles = [
   {
      id: "art-10",
      chapter: "Chapter III",
      title: "Article 10: Data & Data Governance",
      desc: "Requires training, validation, and testing data sets to be relevant, representative, and free of errors to prevent bias and discrimination.",
      sentinelSolution: "Automated Bias Mapping",
      solutionDesc: "Sentinel's WASM engine evaluates model metadata and feature distribution vectors on-prem. It issues a cryptographic proof of non-bias (or flags demographic skew) without seeing the raw dataset.",
      icon: Database,
      status: "Automated Verification"
   },
   {
      id: "art-11",
      chapter: "Chapter III",
      title: "Article 11: Technical Documentation",
      desc: "Providers must draw up technical documentation demonstrating that the AI system complies with requirements prior to placing it on the market.",
      sentinelSolution: "Immutable Audit Ledger",
      solutionDesc: "Our D1 Ledger automatically generates the 'Technical File' (Annex IV) based on continuous CI/CD pipeline scans, signing it with an unalterable cryptographic hash verifiable by regulators.",
      icon: FileText,
      status: "Continuous Generation"
   },
   {
      id: "art-12",
      chapter: "Chapter III",
      title: "Article 12: Record-Keeping",
      desc: "High-risk AI systems must automatically record events ('logs') over their lifetime to ensure a level of traceability.",
      sentinelSolution: "Ledger-Locked Telemetry",
      solutionDesc: "Inference telemetry metadata is stored locally. Sentinel routinely hashes the internal log states and commits the cryptographic root to the external D1 ledger for absolute non-repudiation.",
      icon: CheckCircle2,
      status: "Cryptographic Anchor"
   },
   {
      id: "art-13",
      chapter: "Chapter III",
      title: "Article 13: Transparency & Instructions",
      desc: "Operation must be sufficiently transparent to enable deployers to interpret the system's output.",
      sentinelSolution: "Model Card Attestation",
      solutionDesc: "Sentinel parses `.safetensors` headers and internal model cards during the build step, verifying that intended use cases and limitations are explicitly documented and mapped.",
      icon: Search,
      status: "Pipeline Validation"
   },
   {
      id: "art-14",
      chapter: "Chapter III",
      title: "Article 14: Human Oversight",
      desc: "AI systems must be designed in such a way that they can be effectively overseen by natural persons.",
      sentinelSolution: "Oversight Kill-Switch Audit",
      solutionDesc: "Sentinel statically analyzes the deployment architecture to ensure 'Human-in-the-Loop' APIs and fallback interceptors are present in the application's infrastructure code.",
      icon: Shield,
      status: "Static Analysis"
   },
   {
      id: "art-15",
      chapter: "Chapter III",
      title: "Article 15: Accuracy & Cybersecurity",
      desc: "High-risk systems must achieve an appropriate level of accuracy, robustness, and cybersecurity.",
      sentinelSolution: "Adversarial Drift Monitoring",
      solutionDesc: "Sentinel monitors incoming requests for adversarial perturbation and tracks accuracy drift over time, triggering instantaneous alerts if model degradation hits threshold criteria.",
      icon: Zap,
      status: "Real-time Defenses"
   }
];

export function CompliancePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(articles[0].id);

  useEffect(() => {
    setMounted(true);
    // Handle deep linking via hash
    const hash = window.location.hash.replace('#', '');
    if (hash && articles.some(a => a.id === hash)) {
      setActiveTab(hash);
    }
    
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && articles.some(a => a.id === newHash)) {
        setActiveTab(newHash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const activeArticle = articles.find(a => a.id === activeTab);

  return (
    <div className="bg-[#F4F1EA] min-h-screen text-[#0f172a] selection:bg-[#c5832b]/20 pb-24">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-[#e2e8f0]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(197,131,43,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5832b]/30 bg-[#c5832b]/10 mb-8 backdrop-blur-md">
              <Scale className="w-3.5 h-3.5 text-[#c5832b]" />
              <span className="text-[11px] font-mono text-[#b87333] font-bold uppercase tracking-[0.2em]">EU AI Act Translation Engine</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0f172a] tracking-tight mb-8 leading-[1.05]">
              Regulatory Law,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b87333] to-[#c5832b] drop-shadow-[0_0_30px_rgba(197,131,43,0.2)]">Compiled as Code.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-[#475569] mb-12 leading-relaxed font-light">
              Explore how Sentinel's deterministic protocol maps directly to the specific legal requirements of the European Union Artificial Intelligence Act.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* COMPLIANCE INTERACTIVE MAP */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xl sticky top-24">
               <div className="p-6 border-b border-[#e2e8f0] bg-[#F4F1EA]">
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2 flex items-center gap-2">
                     <BookOpen className="w-5 h-5 text-[#c5832b]" /> EU AI Act Map
                  </h3>
                  <p className="text-sm text-[#475569] font-light">Select a high-risk article to view the Sentinel engineering countermeasure.</p>
               </div>
               <div className="h-[500px] overflow-y-auto w-full custom-scrollbar">
                  {articles.map((art) => (
                     <button
                        key={art.id}
                        onClick={() => setActiveTab(art.id)}
                        className={`w-full text-left p-5 border-b border-[#e2e8f0] flex items-center justify-between transition-colors ${
                           activeTab === art.id ? 'bg-[#c5832b]/10 border-l-4 border-l-[#c5832b]' : 'hover:bg-[#F4F1EA] border-l-4 border-l-transparent'
                        }`}
                     >
                        <div>
                           <span className="text-[10px] font-mono text-[#64748b] block mb-1 uppercase tracking-widest">{art.chapter}</span>
                           <span className={`font-bold ${activeTab === art.id ? 'text-[#c5832b]' : 'text-[#0f172a]'}`}>{art.title}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${activeTab === art.id ? 'text-[#c5832b]' : 'text-[#64748b]'}`} />
                     </button>
                  ))}
               </div>
            </div>

            {/* Content Display */}
            <div className="lg:col-span-8">
               <AnimatePresence mode="wait">
                  {activeArticle && (
                      <motion.div
                        key={activeArticle.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white border border-[#e2e8f0] rounded-[32px] p-8 md:p-12 shadow-xl relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5832b]/5 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        {/* Legal Requirement */}
                        <div className="mb-12 relative z-10">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-50 border border-rose-200 text-rose-600 text-xs font-mono font-bold uppercase tracking-widest mb-4">
                              Legal Mandate
                           </div>
                           <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-6">{activeArticle.title}</h2>
                           <p className="text-[#475569] text-lg leading-relaxed font-light pl-6 relative">
                              <span className="absolute left-0 top-0 h-full w-1 bg-[#cbd5e1] rounded"></span>
                              "{activeArticle.desc}"
                           </p>
                        </div>

                        {/* Sentinel Resolution */}
                        <div className="bg-[#F4F1EA] border border-[#e2e8f0] rounded-2xl p-8 relative z-10 shadow-sm">
                           <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e2e8f0]">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#c5832b]/10 border border-[#c5832b]/20 text-[#b87333] text-xs font-mono font-bold uppercase tracking-widest">
                                 Sentinel Architecture
                              </div>
                              <span className="font-mono text-xs text-[#64748b] bg-white px-3 py-1 rounded flex items-center gap-2 border border-[#e2e8f0]">
                                 <CheckCircle2 className="w-4 h-4 text-[#c5832b]" /> Status: {activeArticle.status}
                              </span>
                           </div>

                           <div className="flex items-start gap-6">
                              <div className="w-16 h-16 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                                 <activeArticle.icon className="w-8 h-8 text-[#c5832b]" />
                              </div>
                              <div>
                                 <h3 className="text-2xl font-bold text-[#0f172a] mb-3">{activeArticle.sentinelSolution}</h3>
                                 <p className="text-[#475569] leading-relaxed font-light text-lg">
                                    {activeArticle.solutionDesc}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center mt-12 bg-white rounded-[40px] border border-[#e2e8f0] shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5832b]/5 rounded-full blur-[80px] pointer-events-none"></div>
         <h2 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-6 relative z-10">Automate The Legal Burden.</h2>
         <p className="text-xl text-[#475569] mb-10 font-light max-w-2xl mx-auto relative z-10">
            Stop mapping articles by hand. Deploy Sentinel and achieve deterministic compliance across the entire EU AI Act via our algorithmic pipeline.
         </p>
         <a href="/pricing" className="inline-flex items-center gap-3 px-8 py-4 bg-[#0f172a] text-[#F4F1EA] font-bold rounded-xl hover:bg-[#c5832b] transition-all shadow-lg hover:shadow-[#c5832b]/20 hover:-translate-y-1 relative z-10">
            View Licensing Tiers <ChevronRight className="w-4 h-4" />
         </a>
      </section>
      
      {/* Global override for custom scrollbar in this component */}
      <style dangerouslySetInnerHTML={{__html:`
         .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
            background: #F4F1EA;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
         }
      `}} />
    </div>
  );
}
