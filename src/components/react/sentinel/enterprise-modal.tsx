import React, { useState } from "react";
import { X, Building2, Server, Shield, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnterpriseModal({ isOpen, onClose }: EnterpriseModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      role: formData.get("role"),
      industry: formData.get("industry"),
      volume: formData.get("volume"),
      architecture: formData.get("architecture"),
      dedicated_region: formData.get("dedicated_region") === "on",
      req_dedicated_worker: formData.get("req_dedicated_worker") === "on",
      req_sla: formData.get("req_sla") === "on",
      req_onprem: formData.get("req_onprem") === "on",
    };

    // Client-side freemail validation
    const freemailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "protonmail.com"];
    const emailDomain = (data.email as string)?.split('@')[1]?.toLowerCase();
    
    if (emailDomain && freemailDomains.includes(emailDomain)) {
      setStatus("error");
      setErrorMessage("Corporate email required for Enterprise tier requests.");
      return;
    }

    try {
      const response = await fetch('/api/enterprise-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message === "CORPORATE_EMAIL_REQUIRED" ? "Please use a corporate email address (no Gmail/Yahoo)." : "Error sending the form. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="w-full max-w-2xl bg-white border border-[#cbd5e1] rounded-3xl shadow-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-full"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#f1f5f9] bg-gradient-to-r from-[#f8fafc] to-white relative shrink-0">
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a]">Sovereign Fortress Vault</h2>
                    <p className="text-sm text-[#64748b]">Configure your dedicated custom edge instance.</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="overflow-y-auto px-8 py-6">
                {status === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 bg-[#f0fdf4] border border-[#10b981]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="w-8 h-8 text-[#10b981]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0f172a] mb-3">Request Securely Transmitted</h3>
                    <p className="text-[#475569] max-w-md">
                      A Sentinel compliance engineer will contact you within 4 hours to finalize your custom instance architecture.
                    </p>
                    <button 
                      onClick={onClose}
                      className="mt-8 px-8 py-3 bg-[#f1f5f9] text-[#0f172a] font-bold rounded-xl hover:bg-[#e2e8f0] transition-colors"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Identification */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Full Name</label>
                        <input 
                          required 
                          name="name"
                          type="text" 
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                          Email Corporate <Lock className="w-3 h-3 text-[#94a3b8]" />
                        </label>
                        <input 
                          required 
                          name="email"
                          type="email" 
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Industry</label>
                        <select 
                          required 
                          name="industry"
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none appearance-none"
                        >
                          <option value="">Choose industry...</option>
                          <option value="Fintech">Fintech</option>
                          <option value="Pharma">Pharma</option>
                          <option value="Gov">Gov</option>
                          <option value="Retail">Retail</option>
                          <option value="Other">Others</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Role in Company</label>
                        <select 
                          required 
                          name="role"
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none appearance-none"
                        >
                          <option value="">Choose role...</option>
                          <option value="CTO">CTO / Technical Lead</option>
                          <option value="Legal">Legal Counsel / DPO</option>
                          <option value="Dev">Developer / Engineer</option>
                          <option value="Procurement">Procurement</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Company</label>
                        <input 
                          required 
                          name="company"
                          type="text" 
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none"
                          placeholder="Tech Corp Ltd."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">Estimated Monthly Volume</label>
                        <select 
                          required
                          name="volume"
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none appearance-none"
                        >
                          <option value="">Choose audit volume...</option>
                          <option value="<50k">Under 50k Audits</option>
                          <option value="50k-200k">50k - 200k Audits</option>
                          <option value="200k-1M">200k - 1M Audits</option>
                          <option value="Custom/Unlimited">Custom / Unlimited</option>
                        </select>
                      </div>
                    </div>

                    {/* Architecture Needs */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                        Architecture & Compliance Requirements
                      </label>
                      <textarea 
                        required
                        name="architecture"
                        rows={4}
                        className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-sm text-[#0f172a] focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none resize-none"
                        placeholder="Describe your current architecture, models used and if you process PII/Medical data..."
                      ></textarea>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input id="req_dedicated_worker" name="req_dedicated_worker" type="checkbox" className="h-5 w-5 rounded border-[#cbd5e1] text-[#10b981] focus:ring-[#10b981]" />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="req_dedicated_worker" className="font-medium text-[#0f172a]">Dedicated / Physically Isolated Worker</label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input id="req_sla" name="req_sla" type="checkbox" className="h-5 w-5 rounded border-[#cbd5e1] text-[#10b981] focus:ring-[#10b981]" />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="req_sla" className="font-medium text-[#0f172a]">SLA Support &lt; 1h & Dedicated Compliance Officer</label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input id="req_onprem" name="req_onprem" type="checkbox" className="h-5 w-5 rounded border-[#cbd5e1] text-[#10b981] focus:ring-[#10b981]" />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="req_onprem" className="font-medium text-[#0f172a]">On-Premise / Hybrid Deployment</label>
                        </div>
                      </div>
                      <div className="relative flex items-start border-t border-[#e2e8f0] pt-3 mt-3">
                        <div className="flex h-6 items-center">
                          <input id="dedicated_region" name="dedicated_region" type="checkbox" className="h-5 w-5 rounded border-[#cbd5e1] text-[#10b981] focus:ring-[#10b981]" />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="dedicated_region" className="font-medium text-[#0f172a]">Strict Data Residency (EU Specific Region)</label>
                        </div>
                      </div>
                    </div>

                    {status === "error" && (
                      <div className="p-4 bg-[#fef2f2] border border-[#ef4444]/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-[#991b1b]">{errorMessage}</span>
                      </div>
                    )}

                    <div className="pt-2 shrink-0">
                      <button 
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-4 px-6 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {status === "loading" ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            Send Official Request <Send className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-[#94a3b8] mt-3 font-mono">
                        Data processed according to EU GDPR and retained only in ephemeral mode for contact.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
