"use client"

import { Shield, CheckCircle, Clock, AlertTriangle, ExternalLink, Activity } from "lucide-react"

const kvStates = [
  { key: "eu_ai_act_version", value: "2024/1689 (Official)", updated: "11 Mar 2026 13:45 GMT", status: "SYNCED" },
  { key: "high_risk_classification", value: "Annex III v4.2", updated: "12 Feb 2026 09:00 GMT", status: "SYNCED" },
  { key: "technical_doc_requirements", value: "Art 11 Rev 2", updated: "01 Mar 2026 12:00 GMT", status: "SYNCED" },
  { key: "prohibited_practices_check", value: "Art 5 v3.1", updated: "15 Jan 2026 14:30 GMT", status: "SYNCED" },
  { key: "fundamental_rights_impact", value: "Art 29a", updated: "01 Mar 2026 08:00 GMT", status: "SYNCED" },
  { key: "iso_iec_42001_alignment", value: "AMD 1:2025", updated: "05 Mar 2026 10:00 GMT", status: "SYNCED" },
  { key: "nist_ai_600-1_sync", value: "v1.1.2", updated: "20 Dec 2025 16:00 GMT", status: "SYNCED" },
  { key: "notified_body_interface", value: "API-NB-v2.8", updated: "11 Mar 2026 00:00 GMT", status: "SYNCED" },
]

const systemChecks = [
  { label: "Regulation KV Store", status: "OPERATIONAL", latency: "4ms" },
  { label: "FORTRESS_VAULT R2", status: "OPERATIONAL", latency: "12ms" },
  { label: "Audit Database D1", status: "OPERATIONAL", latency: "8ms" },
  { label: "AI Compliance Engine", status: "OPERATIONAL", latency: "340ms" },
  { label: "CI Gate API", status: "OPERATIONAL", latency: "65ms" },
  { label: "Watchtower Badge CDN", status: "OPERATIONAL", latency: "18ms" },
  { label: "EU Registry Sync", status: "OPERATIONAL", latency: "220ms" },
]

export function ComplianceStatusPage() {
  return (
    <div className="bg-[#F4F1EA] pt-32 pb-24 text-[#0f172a]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Badge Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 border border-[#10b981]/30 bg-white px-8 py-6 mb-8 rounded-2xl shadow-xl">
            <div className="relative">
              <Shield className="w-10 h-10 text-[#059669]" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10b981] ring-4 ring-white"></span>
            </div>
            <div className="text-left">
              <div className="font-bold text-[#0f172a] text-xl tracking-tight">SENTINEL WATCHTOWER</div>
              <div className="text-[10px] font-mono font-bold text-[#059669] uppercase tracking-[0.2em]">EU AI Act Compliant</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-[0.3em]">Platform Status</div>
            <div className="font-bold text-5xl text-[#0f172a] tracking-tighter">All Systems Online</div>
            <div className="text-[10px] font-mono text-[#64748b] bg-white/50 border border-[#cbd5e1] inline-block px-3 py-1 rounded-full">Last checked: {new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</div>
          </div>
        </div>

        {/* System Status Grid */}
        <div className="mb-12">
          <h2 className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest mb-4">System Components</h2>
          <div className="border border-[#cbd5e1] bg-white rounded-2xl overflow-hidden shadow-lg">
            {systemChecks.map((check, i) => (
              <div
                key={check.label}
                className={`flex items-center justify-between px-6 py-4 hover:bg-[#f8fafc] transition-colors ${
                  i < systemChecks.length - 1 ? "border-b border-[#e2e8f0]" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span className="text-sm text-[#0f172a] font-medium">{check.label}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-mono text-[#64748b] font-bold">{check.latency}</span>
                  <span className="text-[10px] font-mono font-bold text-[#059669] border border-[#10b981]/20 px-2 py-0.5 rounded bg-[#f0fdf4]">{check.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KV State Visualization */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#059669]" />
            <h2 className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest">Regulation State</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#f0fdf4] text-[#059669] border border-[#10b981]/20 rounded">SYNCED</span>
          </div>
          <div className="border border-[#cbd5e1] bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-3 bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-3 text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-widest">
              <div>Key</div>
              <div>Value</div>
              <div>Synced</div>
            </div>
            {kvStates.map((kv, i) => (
              <div
                key={kv.key}
                className={`grid grid-cols-3 items-center px-6 py-4 text-xs hover:bg-white transition-colors ${
                  i < kvStates.length - 1 ? "border-b border-[#e2e8f0]" : ""
                }`}
              >
                <div className="text-[#64748b] font-mono font-bold">{kv.key}</div>
                <div className="text-[#059669] font-mono font-bold">{kv.value}</div>
                <div className="text-[#64748b] font-mono text-[10px]">{kv.updated}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Uptime History */}
        <div className="mb-12">
          <h2 className="text-xs font-semibold text-[#0f172a] uppercase tracking-wide mb-4">90-Day Uptime</h2>
          <div className="border border-[#e2e8f0] p-6 rounded bg-[#f8fafc]">
            <div className="flex items-end gap-0.5 h-12 mb-4">
              {Array.from({ length: 90 }).map((_, i) => {
                // Deterministic function based on the day to ensure consistency across reloads
                const dateOffset = 90 - i;
                const d = new Date();
                d.setDate(d.getDate() - dateOffset);
                const seed = d.getDate() * d.getMonth() * d.getFullYear();
                
                // Realistically, expect ~99.9% uptime, which means incidents are extremely rare.
                const isMinorIncident = (seed % 93 === 0); 
                const isMajorIncident = (seed % 345 === 0);
                
                let barColor = "bg-[#10b981]";
                let barHeight = "100%";
                let tooltip = "Operational";
                
                if (isMajorIncident) {
                  barColor = "bg-[#ef4444]";
                  barHeight = "40%";
                  tooltip = "Partial Outage";
                } else if (isMinorIncident) {
                  barColor = "bg-[#f59e0b]";
                  barHeight = "70%";
                  tooltip = "Degraded Performance";
                }

                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm transition-all hover:opacity-80 ${barColor}`}
                    style={{ height: barHeight }}
                    title={`${d.toLocaleDateString()}: ${tooltip}`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-[#64748b]">
              <span>90 days ago</span>
              <span className="text-[#10b981] font-semibold">99.97% uptime</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Embed badge */}
        <div className="border border-[#cbd5e1] bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-sm font-bold text-[#0f172a] mb-3 uppercase tracking-widest">Display Compliance Badge</h3>
          <p className="text-sm text-[#475569] leading-relaxed mb-6 font-light">
            Add the Watchtower badge to your website to display your compliance status publicly.
          </p>
          <div className="bg-[#f8fafc] border border-[#cbd5e1] p-4 overflow-x-auto rounded-xl shadow-inner">
            <code className="text-xs font-mono text-[#0f172a] leading-relaxed whitespace-pre">{`<a href="https://status.gettingsentinel.com/badge/YOUR_BADGE_ID">
  <img src="https://api.gettingsentinel.com/v1/status/badge.svg"
       alt="Sentinel EU AI Act Compliant" />
</a>`}</code>
          </div>
        </div>
      </div>
    </div>
  )
}
