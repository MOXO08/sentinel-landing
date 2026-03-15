"use client"

import { FileText, Activity, AlertTriangle, GitBranch, ChevronRight, CheckCircle, ArrowRight, BarChart3, Layers } from "lucide-react"


const articles = [
  {
    num: "Art. 6",
    title: "High-Risk Classification",
    description: "Sentinel's classification engine evaluates your AI system against Annex II and Annex III criteria. The result is binary and deterministic — no LLM interpretation layer distorts the output.",
    tags: ["Annex II", "Annex III"],
    status: "ACTIVE",
  },
  {
    num: "Art. 9",
    title: "Risk Management System",
    description: "Continuous, iterative risk identification and mitigation mapped to your operational deployment context. Sentinel generates the complete Article 9 risk register automatically from your manifest.",
    tags: ["Risk Register", "Mitigation Log"],
    status: "ACTIVE",
  },
  {
    num: "Art. 11",
    title: "Technical Documentation (Annex IV)",
    description: "The complete 13-section Annex IV technical dossier generated from a single manifest.json upload. Every field traced to the regulation text. Ready for notified body submission.",
    tags: ["Annex IV", "NB Submission"],
    status: "ACTIVE",
  },
  {
    num: "Art. 13",
    title: "Transparency & Instructions",
    description: "Generates compliant instructions-for-use, system capability descriptions, and human oversight requirement documentation per Article 13 obligations.",
    tags: ["Instructions for Use", "Human Oversight"],
    status: "ACTIVE",
  },
  {
    num: "Art. 17",
    title: "Quality Management System",
    description: "Maps your existing QMS artifacts to EU AI Act requirements. Sentinel identifies gaps and generates compliant procedure templates for the required quality management documentation.",
    tags: ["QMS Mapping", "Gap Analysis"],
    status: "ACTIVE",
  },
  {
    num: "Art. 72",
    title: "Post-Market Monitoring",
    description: "Automated collection and analysis of post-deployment performance data. Incident reporting pipeline connected directly to the EU AI database registry via the Sentinel Watchtower API.",
    tags: ["PMS Log", "EU Registry"],
    status: "ACTIVE",
  },
]

const driftDetection = [
  {
    title: "Regulation KV Sync",
    description: "Sentinel maintains a real-time KV store of all EU AI Act regulatory texts, delegated acts, and implementing regulations. Every change is tracked at the clause level.",
    detail: "Updated: 09 March 2026 18:45 GMT",
  },
  {
    title: "Semantic Drift Scoring",
    description: "When regulations update, Sentinel re-evaluates your manifests against the new text. A 'Legal Drift Score' quantifies how far your documented compliance has moved from current statute.",
    detail: "Algorithm: deterministic, version-controlled",
  },
  {
    title: "Alert & Remediation",
    description: "Automated alerts sent when drift exceeds threshold. Each alert includes a delta report showing exactly which regulatory clauses now require action.",
    detail: "SLA: < 2h from regulation publication",
  },
]

export function SolutionsPage() {
  return (
    <div className="bg-[#F4F1EA] pt-32 pb-24 text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <h1 className="font-sans font-bold text-4xl md:text-5xl text-[#0f172a] mb-4 text-balance leading-tight">
            EU AI Act Solutions
          </h1>
          <p className="text-[#475569] font-sans text-base leading-relaxed">
            Sentinel interprets the EU AI Act with mathematical certainty. Every output is deterministic, traceable, and audit-ready.
          </p>
        </div>

        {/* Article Map */}
        <div className="mb-20">
          <h2 className="font-sans font-semibold text-lg text-[#0f172a] mb-8 uppercase tracking-[0.1em] text-xs">Article Coverage Map</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <div key={art.num} className="bg-white border border-[#e2e8f0] p-6 hover:border-[#10b981] transition-all hover:shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-semibold text-[#059669] border border-[#10b981]/30 px-2 py-0.5 rounded-sm">
                    {art.num}
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#059669] flex items-center gap-1 font-bold">
                    <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse"></span>
                    {art.status}
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-[#0f172a] text-sm mb-2">{art.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed mb-4">{art.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {art.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono font-bold text-[#64748b] bg-[#f8fafc] px-2 py-0.5 border border-[#e2e8f0] uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Drift Detection */}
        <div className="mb-20">
          <h2 className="font-sans font-semibold text-lg text-[#0f172a] mb-8 uppercase tracking-[0.1em] text-xs">Legal Drift Detection Engine</h2>
          <div className="border border-[#e2e8f0] bg-white shadow-lg overflow-hidden">
            {/* Drift meter visualization */}
            <div className="p-8 border-b border-[#e2e8f0] bg-gradient-to-r from-white to-[#f8fafc]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#64748b] mb-1 uppercase tracking-widest">Current Drift Score</div>
                  <div className="font-mono font-bold text-4xl text-[#059669]">0.03<span className="text-lg text-[#64748b]">/1.00</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono font-bold text-[#64748b] mb-1 uppercase tracking-widest">Regulation Revision</div>
                  <div className="font-mono text-sm text-[#0f172a] font-bold">EU AI Act 2026-R3</div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-[#e2e8f0] overflow-hidden rounded-full shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#10b981] to-[#059669] transition-all" style={{ width: "3%" }}></div>
              </div>
              <div className="flex justify-between mt-2.5 text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-tighter">
                <span className="text-[#059669]">FULLY COMPLIANT</span>
                <span>LEGAL DRIFT THRESHOLD (0.15)</span>
                <span className="text-red-500">NON-COMPLIANT</span>
              </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-[#f8fafc]">
              {driftDetection.map((item, i) => (
                <div key={item.title} className={`p-6 ${i < driftDetection.length - 1 ? "border-r border-[#e2e8f0]" : ""}`}>
                  <h3 className="text-sm font-semibold text-[#0f172a] mb-3">{item.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed mb-3 font-light">{item.description}</p>
                  <div className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wide">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Annex IV Structure */}
        <div className="mb-20">
          <h2 className="font-sans font-semibold text-lg text-[#0f172a] mb-8">Annex IV — Technical Dossier Structure</h2>
          <div className="border border-[#e2e8f0] bg-white">
            <div className="divide-y divide-[#e2e8f0]">
              {[
                { n: "§1", title: "General description of the AI system", status: "AUTO" },
                { n: "§2", title: "Detailed description of system elements", status: "AUTO" },
                { n: "§3", title: "Detailed information on monitoring, functioning and control", status: "AUTO" },
                { n: "§4", title: "Description of the changes made to the system", status: "AUTO" },
                { n: "§5", title: "List of harmonised standards applied", status: "AUTO" },
                { n: "§6", title: "Copy of EU declaration of conformity", status: "REVIEW" },
                { n: "§7", title: "Detailed description of training methodologies and techniques", status: "AUTO" },
                { n: "§8", title: "Validation and testing procedures used", status: "AUTO" },
                { n: "§9", title: "Data governance policies", status: "AUTO" },
                { n: "§10", title: "Post-market monitoring plan", status: "AUTO" },
                { n: "§11", title: "Human oversight measures", status: "AUTO" },
                { n: "§12", title: "Cybersecurity measures", status: "AUTO" },
                { n: "§13", title: "Instructions for use", status: "AUTO" },
              ].map((section) => (
                <div
                  key={section.n}
                  className="flex items-center justify-between px-6 py-3 hover:bg-[#f8fafc] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[#64748b] w-6 font-semibold">{section.n}</span>
                    <span className="text-[#0f172a]">{section.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 border rounded-sm ${
                    section.status === "AUTO"
                      ? "text-[#10b981] border-[#10b981]/30 bg-[#f0fdf4]"
                      : "text-[#f59e0b] border-[#f59e0b]/30 bg-[#fffbeb]"
                  }`}>
                    {section.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
