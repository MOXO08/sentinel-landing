"use client"

import { useState } from "react"
import { Upload, FileText, Database, Activity, CheckCircle, Clock, AlertTriangle, Download, Search, Filter, ChevronDown } from "lucide-react"

const mockReservations = [
  { id: "res_01HX9A", client: "Axiom Insurance AG", system: "ClaimBot Pro 3.1", status: "COMPLIANT", risk: "HIGH", score: 98.2, created: "2026-03-08", expires: "2027-03-08" },
  { id: "res_01HX9B", client: "MediScan GmbH", system: "DiagnosisAI v2.0", status: "REVIEW", risk: "HIGH", score: 71.4, created: "2026-03-07", expires: "2027-03-07" },
  { id: "res_01HX9C", client: "Nexus Fintech", system: "CreditScorer 4.5", status: "COMPLIANT", risk: "HIGH", score: 94.7, created: "2026-03-06", expires: "2027-03-06" },
  { id: "res_01HX9D", client: "EduTech Solutions", system: "AdaptLearn Pro", status: "COMPLIANT", risk: "HIGH", score: 99.1, created: "2026-03-05", expires: "2027-03-05" },
  { id: "res_01HX9E", client: "BorderFlow Systems", system: "PassportScan AI", status: "DRIFT_DETECTED", risk: "HIGH", score: 61.3, created: "2026-02-28", expires: "2027-02-28" },
  { id: "res_01HX9F", client: "HireBot Europe", system: "RecruitEngine 2.2", status: "COMPLIANT", risk: "HIGH", score: 96.5, created: "2026-02-25", expires: "2027-02-25" },
]

const mockClients = [
  { id: "cli_01", name: "Axiom Insurance AG", tier: "FORTRESS", audits: 12, active: true },
  { id: "cli_02", name: "MediScan GmbH", tier: "WATCHTOWER", audits: 4, active: true },
  { id: "cli_03", name: "Nexus Fintech", tier: "WATCHTOWER", audits: 7, active: true },
  { id: "cli_04", name: "EduTech Solutions", tier: "SWIFT", audits: 2, active: true },
  { id: "cli_05", name: "BorderFlow Systems", tier: "FORTRESS", audits: 9, active: false },
]

const mockAuditLogs = [
  { id: "log_001", event: "MANIFEST_INGESTED", entity: "res_01HX9A", timestamp: "2026-03-09 18:44:12", severity: "INFO" },
  { id: "log_002", event: "CLASSIFICATION_COMPLETE", entity: "res_01HX9A", timestamp: "2026-03-09 18:44:13", severity: "INFO" },
  { id: "log_003", event: "ANNEX_IV_GENERATED", entity: "res_01HX9A", timestamp: "2026-03-09 18:44:14", severity: "INFO" },
  { id: "log_004", event: "DRIFT_DETECTED", entity: "res_01HX9E", timestamp: "2026-03-09 16:30:00", severity: "WARN" },
  { id: "log_005", event: "CERT_ISSUED", entity: "res_01HX9D", timestamp: "2026-03-09 14:22:08", severity: "INFO" },
  { id: "log_006", event: "CI_GATE_BLOCKED", entity: "res_01HX9B", timestamp: "2026-03-09 12:01:44", severity: "ERROR" },
  { id: "log_007", event: "REGULATION_SYNC", entity: "SYSTEM", timestamp: "2026-03-09 09:00:00", severity: "INFO" },
  { id: "log_008", event: "KEY_ROTATION", entity: "cli_01", timestamp: "2026-03-08 23:00:00", severity: "INFO" },
]

type ActiveTab = "upload" | "inventory" | "clients" | "logs"

export function VaultPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("upload")
  const [isDragging, setIsDragging] = useState(false)
  const [uploadFile, setUploadFile] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReservations = mockReservations.filter(
    (r) =>
      r.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-[#F4F1EA] pt-32 pb-24 text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] text-balance tracking-tight">Fortress Vault</h1>
              <p className="text-[#64748b] text-sm mt-2 font-mono uppercase tracking-widest">Cloudflare R2 · EU-West · All Audits</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-[#cbd5e1] bg-white px-3 py-2 rounded shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-[#64748b] uppercase tracking-wider">Vault Online</span>
              </div>
              <div className="border border-[#cbd5e1] bg-white px-3 py-2 text-xs font-mono font-bold text-[#64748b] rounded shadow-sm uppercase tracking-wider">
                {mockReservations.length} Audits
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-0 border-b border-[#cbd5e1] mb-8">
          {(["upload", "inventory", "clients", "logs"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#10b981] text-[#10b981]"
                  : "border-transparent text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              {tab === "upload" ? "Upload" : tab === "inventory" ? "Inventory" : tab === "clients" ? "Clients" : "Logs"}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Upload Manifest</h2>
            <p className="text-sm text-[#475569] leading-relaxed mb-6 font-light">
              Upload your <code className="bg-[#f0fdf4] text-[#059669] font-mono text-xs px-2 py-1 border border-[#10b981]/20 rounded">manifest.json</code> to initiate a full EU AI Act Annex IV audit. Files go directly to FORTRESS_VAULT via pre-signed R2 URL.
            </p>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files[0]
                if (file) setUploadFile(file.name)
              }}
              className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all rounded-[15px] ${
                isDragging
                  ? "border-[#10b981] bg-[#f0fdf4]"
                  : uploadFile
                  ? "border-[#10b981] bg-white shadow-inner"
                  : "border-[#cbd5e1] bg-white/50 hover:border-[#10b981] hover:bg-white hover:shadow-md"
              }`}
            >
              {uploadFile ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-[#10b981]" />
                  <div className="font-mono text-sm text-[#0f172a] font-bold">{uploadFile}</div>
                  <div className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-widest">Ready to Upload</div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-[#94a3b8]" />
                  <div>
                    <div className="text-sm text-[#0f172a] font-bold">Drop manifest.json here</div>
                    <div className="text-[10px] font-mono font-bold text-[#64748b] mt-1 uppercase tracking-widest">or click to browse</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setUploadFile("demo-manifest.json")}
                className="flex-1 py-4 bg-[#0f172a] text-white text-sm font-bold hover:bg-[#10b981] transition-all rounded-xl shadow-lg hover:shadow-[#10b981]/20"
              >
                {uploadFile ? "Initiate Audit" : "Select File"}
              </button>
              {uploadFile && (
                <button
                  onClick={() => setUploadFile(null)}
                  className="px-6 py-4 border border-[#cbd5e1] text-sm font-bold text-[#64748b] hover:border-[#ef4444] hover:text-[#ef4444] transition-colors rounded-xl bg-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-6 p-4 border border-[#e2e8f0] bg-[#f8fafc] rounded">
              <div className="text-xs font-semibold text-[#0f172a] mb-3">Security Guarantee</div>
              <div className="space-y-2">
                {[
                  "File transmitted directly to R2 via pre-signed URL",
                  "Sentinel never handles your document bytes",
                  "Processing in ephemeral V8 isolate (TEE)",
                  "Output encrypted with your client key",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-[#10b981] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#475569]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-[#0f172a]">Audit Inventory</h2>
              <div className="flex items-center gap-2 border border-[#cbd5e1] bg-white px-3 py-2 rounded shadow-sm">
                <Search className="w-4 h-4 text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Search audits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] w-48 font-medium"
                />
              </div>
            </div>
            <div className="border border-[#cbd5e1] bg-white rounded-[15px] overflow-hidden shadow-lg">
              <div className="grid grid-cols-6 bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-3 text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider">
                <div>ID</div>
                <div>Client</div>
                <div className="hidden md:block">System</div>
                <div>Status</div>
                <div className="hidden lg:block">Score</div>
                <div className="text-right">Actions</div>
              </div>
              {filteredReservations.map((res, i) => (
                <div
                  key={res.id}
                  className={`grid grid-cols-6 items-center px-4 py-3 text-sm hover:bg-white transition-colors ${
                    i < filteredReservations.length - 1 ? "border-b border-[#e2e8f0]" : ""
                  }`}
                >
                  <div className="text-[#64748b] font-mono text-xs">{res.id}</div>
                  <div className="text-[#0f172a] truncate">{res.client}</div>
                  <div className="text-[#475569] hidden md:block truncate text-xs">{res.system}</div>
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      res.status === "COMPLIANT"
                        ? "bg-[#f0fdf4] text-[#10b981] border-[#10b981]/30"
                        : res.status === "DRIFT_DETECTED"
                        ? "bg-[#fef2f2] text-[#ef4444] border-[#ef4444]/30"
                        : "bg-[#fffbeb] text-[#f59e0b] border-[#f59e0b]/30"
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <div className={`hidden lg:block text-sm ${
                    res.score >= 90 ? "text-[#10b981]" : res.score >= 70 ? "text-[#f59e0b]" : "text-[#ef4444]"
                  }`}>
                    {res.score}%
                  </div>
                  <div className="flex items-center justify-end">
                    <button className="text-[#64748b] hover:text-[#10b981] transition-colors" aria-label="Download audit">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Clients</h2>
            <div className="border border-[#e2e8f0] rounded overflow-hidden">
              <div className="grid grid-cols-5 bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">
                <div>ID</div>
                <div>Name</div>
                <div>Tier</div>
                <div>Audits</div>
                <div>Status</div>
              </div>
              {mockClients.map((client, i) => (
                <div
                  key={client.id}
                  className={`grid grid-cols-5 items-center px-4 py-3 text-sm hover:bg-white transition-colors ${
                    i < mockClients.length - 1 ? "border-b border-[#e2e8f0]" : ""
                  }`}
                >
                  <div className="text-[#64748b] font-mono text-xs">{client.id}</div>
                  <div className="text-[#0f172a]">{client.name}</div>
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      client.tier === "FORTRESS"
                        ? "bg-[#fffbeb] text-[#f59e0b] border-[#f59e0b]/30"
                        : client.tier === "WATCHTOWER"
                        ? "bg-[#f0fdf4] text-[#10b981] border-[#10b981]/30"
                        : "text-[#64748b] border-[#e2e8f0]"
                    }`}>
                      {client.tier}
                    </span>
                  </div>
                  <div className="text-[#64748b]">{client.audits}</div>
                  <div>
                    <div className={`flex items-center gap-1.5 text-xs ${client.active ? "text-[#10b981]" : "text-[#64748b]"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${client.active ? "bg-[#10b981]" : "bg-[#64748b]"}`}></span>
                      <span>{client.active ? "Active" : "Suspended"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === "logs" && (
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Audit Log</h2>
            <div className="border border-[#e2e8f0] rounded overflow-hidden">
              <div className="grid grid-cols-4 bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">
                <div>Timestamp</div>
                <div>Event</div>
                <div>Entity</div>
                <div>Severity</div>
              </div>
              {mockAuditLogs.map((log, i) => (
                <div
                  key={log.id}
                  className={`grid grid-cols-4 items-center px-4 py-3 text-xs hover:bg-white transition-colors ${
                    i < mockAuditLogs.length - 1 ? "border-b border-[#e2e8f0]" : ""
                  }`}
                >
                  <div className="text-[#64748b] font-mono">{log.timestamp}</div>
                  <div className="text-[#0f172a]">{log.event}</div>
                  <div className="text-[#64748b] font-mono">{log.entity}</div>
                  <div>
                    <span className={`${
                      log.severity === "ERROR"
                        ? "text-[#ef4444]"
                        : log.severity === "WARN"
                        ? "text-[#f59e0b]"
                        : "text-[#10b981]"
                    }`}>
                      {log.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
