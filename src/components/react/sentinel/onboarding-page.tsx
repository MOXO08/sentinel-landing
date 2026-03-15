import React from "react"
import { Check, ArrowRight, PartyPopper, BookOpen, CheckCircle2, FileText, Download, Rocket, ExternalLink, Mail, MessageSquare } from "lucide-react"

const resources = [
  {
    title: "EU AI Act Implementation Guide",
    desc: "46-page deep dive on Articles 6, 12, 13, 14 and your Sentinel configuration reference.",
    icon: <BookOpen className="w-6 h-6" />,
    color: "#10b981",
    tag: "ESSENTIAL READING"
  },
  {
    title: "API Integration Checklist",
    desc: "Step-by-step API key setup, endpoint reference, and first-audit verification checklist.",
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: "#0ea5e9",
    tag: "START HERE"
  },
  {
    title: "Compliance Proof Templates",
    desc: "Ready-made document templates for supervisory authority submissions (GDPR, MDR, AI Act Article 12).",
    icon: <FileText className="w-6 h-6" />,
    color: "#8b5cf6",
    tag: "LEGAL READY"
  }
];

const steps = [
  { n: "01", title: "Generate Your API Key", body: "In your Sentinel Dashboard, navigate to Settings → API Keys → Create New. Save this — it will not be shown again.", link: "/dashboard", cta: "Open Dashboard →" },
  { n: "02", title: "Send Your First Audit", body: "POST your model manifest JSON to /api/audit with your API key in the Authorization header. Your first audit should return a COMPLIANT verdict within 0.21ms.", link: "/api-docs", cta: "See API Reference →" },
  { n: "03", title: "Verify Your Audit Trail", body: "Check the Integrity Console to confirm your audit was written to the immutable D1 ledger. You now have legally-defensible evidence.", link: "/integrity-console", cta: "Open Integrity Console →" },
  { n: "04", title: "Download Your Proof Package", body: "Use the Compliance Proof Templates below to generate your Article 12 record-keeping documentation for supervisory authority review.", link: "#downloads", cta: "Get Templates →" },
];

export function OnboardingPage() {
  return (
    <div className="bg-[#F4F1EA] pt-32 pb-24 text-[#0f172a]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Welcome Section */}
        <div className="text-center mb-20 animate-in">
          <PartyPopper className="w-12 h-12 text-[#10b981] mx-auto mb-6" />
          <div className="text-[10px] font-mono font-bold text-[#059669] uppercase tracking-[0.3em] mb-4">Sentinel Access Confirmed</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-6 tracking-tight">
            Welcome to the <br />
            <span className="text-[#10b981]">Audit Infrastructure</span>
          </h1>
          <p className="text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto font-light">
            Your Sentinel deployment is ready. Follow the steps below to integrate the API, 
            verify your first audit trail, and download your compliance proof package.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mb-24">
          <div className="flex items-center gap-2 mb-8">
            <Rocket className="w-4 h-4 text-[#10b981]" />
            <h2 className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest">Getting Started</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div key={step.n} className="bg-white p-8 rounded-2xl border border-[#cbd5e1] shadow-sm hover:shadow-xl hover:border-[#10b981]/30 transition-all flex gap-6 group">
                <div className="text-5xl font-black text-[#10b981]/10 font-mono leading-none transition-colors group-hover:text-[#10b981]/20">
                  {step.n}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4 font-light">{step.body}</p>
                  <a href={step.link} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10b981] hover:text-[#059669] transition-colors uppercase tracking-wider">
                    {step.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloads Section */}
        <div id="downloads" className="mb-24">
          <div className="flex items-center gap-2 mb-8">
            <Download className="w-4 h-4 text-[#10b981]" />
            <h2 className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest">Compliance Resources</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div key={res.title} className="bg-white p-8 rounded-2xl border border-[#cbd5e1] shadow-sm flex flex-col gap-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-[#F4F1EA] text-[#10b981] shadow-inner" style={{ color: res.color }}>
                    {res.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-1 rounded bg-[#f8fafc] border border-[#e2e8f0] tracking-widest text-[#64748b]">
                    {res.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-2">{res.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed font-light">{res.desc}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-[#f1f5f9] text-center">
                  <span className="text-[9px] font-mono font-bold text-[#f59e0b] uppercase tracking-tighter">Available after manual verification</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps CTA */}
        <div className="bg-[#0f172a] rounded-3xl p-12 text-[#F4F1EA] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-3 tracking-tight">Questions? We Ship Fast.</h2>
            <p className="text-[#94a3b8] text-sm max-w-md font-light">
              Founder Plan customers get priority email support with 4-hour response SLA. 
              Enterprise customers get a dedicated Slack channel.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button className="bg-[#10b981] text-[#0f172a] px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
              <MessageSquare className="w-4 h-4" />
              Priority Support
            </button>
            <button className="bg-transparent border border-[#334155] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1e293b] transition-all flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Us
            </button>
          </div>
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>
    </div>
  )
}
