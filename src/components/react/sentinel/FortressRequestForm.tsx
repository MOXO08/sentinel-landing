import React, { useState } from 'react';
import { Shield, Send, CheckCircle2, Building, Globe, Zap, Lock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FortressRequestForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    industry: 'Finance',
    jurisdiction: 'EU-Only',
    useCase: '',
    riskCategory: 'High-Risk',
    deployment: 'Sovereign Edge',
    inferenceVolume: '1M+',
    articles: [],
    contactName: '',
    contactEmail: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would POST to an API
  };

  const industries = ["Finance", "Healthcare", "Government", "Legal", "Defense", "Other"];
  const deploymentModels = ["Sovereign Edge (WASM)", "Private Cloud (AWS/Azure)", "On-Premise / Air-Gapped"];

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-[#10b981]/20 p-12 rounded-[2.5rem] text-center backdrop-blur-xl"
      >
        <div className="w-20 h-20 bg-[#10b981]/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Inquiry Transmitted</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          The Fortress architecture requires manual validation. A Sentinel compliance engineer will analyze the technical profile and contact you within maximum 4 hours.
        </p>
        <a href="/" className="btn-emerald inline-flex">Return to Dashboard</a>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#10b981]' : 'bg-white/10'}`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-mono font-bold text-[#10b981] uppercase tracking-widest mb-3">Organization Profile</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Legal Entity Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#10b981] transition-all outline-none"
                    value={formData.orgName}
                    onChange={e => setFormData({...formData, orgName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2 ml-1">Industry</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-[#10b981] outline-none"
                    value={formData.industry}
                    onChange={e => setFormData({...formData, industry: e.target.value})}
                  >
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2 ml-1">Jurisdiction</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-[#10b981] outline-none"
                    value={formData.jurisdiction}
                    onChange={e => setFormData({...formData, jurisdiction: e.target.value})}
                  >
                    <option>Strictly EU (EEUR-1)</option>
                    <option>Global (Multi-Region)</option>
                    <option>US Federal</option>
                  </select>
                </div>
              </div>
              
              <button type="button" onClick={nextStep} className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Next: AI System Context</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-mono font-bold text-[#10b981] uppercase tracking-widest mb-3">AI Use Case & Risk</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your AI system's goal (e.g., Automated Credit Scoring for Tier 1 Banks)..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-[#10b981] transition-all outline-none resize-none"
                  value={formData.useCase}
                  onChange={e => setFormData({...formData, useCase: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2 ml-1">Estimated Risk Category (AI Act)</label>
                <div className="grid grid-cols-2 gap-3">
                  {['High-Risk', 'Limited Risk', 'Minimal Risk', 'Unsure'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({...formData, riskCategory: cat})}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${formData.riskCategory === cat ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10">Back</button>
                <button type="button" onClick={nextStep} className="flex-[2] py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Next: Technical Specs</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-mono font-bold text-[#10b981] uppercase tracking-widest mb-3">Infrastructure Requirements</label>
                <div className="space-y-3">
                  {deploymentModels.map(model => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => setFormData({...formData, deployment: model})}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${formData.deployment === model ? 'bg-[#10b981]/10 border-[#10b981] text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                      <span className="text-sm font-bold">{model}</span>
                      {formData.deployment === model && <CheckCircle2 className="w-4 h-4 text-[#10b981]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-[#10b981] mt-1 shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    By submitting this form, you are requesting an **Isolated Edge Worker (WASM)** with dedicated resources. A Sentinel security expert will generate the architectural blueprint in accordance with Art. 11 of the EU AI Act.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={prevStep} className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10">Back</button>
                <button type="submit" className="flex-[2] py-4 bg-[#10b981] text-[#0f172a] font-bold rounded-xl hover:bg-[#059669] transition-all shadow-lg shadow-[#10b981]/20">Submit Technical Request</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
