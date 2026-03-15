import React, { useState, useEffect } from "react"
import { 
  Shield, 
  Key, 
  Activity, 
  History, 
  FileCheck, 
  CreditCard, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Database,
  Download
} from "lucide-react"

interface AuditLog {
  app_name: string
  version?: string
  status: string
  created_at: string
  request_id: string
  is_compliant: boolean
  verdict?: string
}

interface ThreatLog {
  id: number
  incident_type: string
  ip_address: string
  endpoint: string
  colo_node: string
  severity: string
  created_at: string
}

interface UsageData {
  date: string
  requests: number
  non_compliant: number
}

interface DashboardProps {
  founderId: string
}

export function DashboardPage({ founderId }: DashboardProps) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [plan, setPlan] = useState<string>("developer")
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [usage, setUsage] = useState<UsageData[]>([])
  const [threats, setThreats] = useState<ThreatLog[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [keyRes, usageRes, logsRes, threatsRes] = await Promise.all([
          fetch('/api/dashboard/api/key'),
          fetch('/api/dashboard/api/usage'),
          fetch('/api/dashboard/api/logs'),
          fetch('/api/dashboard/api/threats')
        ])

        if (keyRes.status === 401) {
          window.location.href = '/dashboard/login'
          return
        }

        const keyData = await keyRes.json()
        setApiKey(keyData.api_key_masked)
        setPlan(keyData.plan)

        const usageData = await usageRes.json()
        setUsage(usageData.usage || [])

        const logsData = await logsRes.json()
        setLogs(logsData.logs || [])

        const threatsData = await threatsRes.json()
        setThreats(threatsData.threats || [])
      } catch (error) {
        console.error("Dashboard Fetch Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRotateKey = async () => {
    if (!confirm('Are you sure? Your current key will stop working immediately.')) return
    const r = await fetch('/api/dashboard/api/rotate', { method: 'POST' })
    const d = await r.json()
    if (d.new_key) {
      setNewKey(d.new_key)
      setApiKey(d.new_key.slice(0, 16) + '••••••••••••••••••••')
    }
  }

  return (
    <div className="bg-[#F4F1EA] pt-32 pb-24 text-[#0f172a]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#059669] mb-2 font-mono text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              Live Regulatory Vault
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] tracking-tight">Compliance Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-[#cbd5e1] bg-white px-4 py-2 rounded-xl shadow-sm text-xs font-bold text-[#64748b] uppercase tracking-wider font-mono">
              {logs.length} Audits Secured
            </div>
            <form action="/api/dashboard/auth/logout" method="POST">
              <button type="submit" className="px-4 py-2 border border-[#cbd5e1] bg-white text-xs font-bold text-[#0f172a] rounded-xl hover:bg-[#f8fafc] transition-all shadow-sm">
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Controls - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* API Key Section */}
            <div className="bg-white rounded-2xl border border-[#cbd5e1] p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Key className="w-4 h-4 text-[#10b981]" />
                <h2 className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest">Infrastructure Key</h2>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 font-mono text-sm text-[#0f172a] shadow-inner break-all">
                  {apiKey === null ? "HIDDEN (Regenerate to view)" : apiKey}
                </div>
                <button
                  disabled={apiKey === null}
                  onClick={() => handleCopy(apiKey || "")}
                  className={`p-3 bg-white border border-[#cbd5e1] text-[#10b981] rounded-xl transition-all shadow-sm ${apiKey === null ? "opacity-50 cursor-not-allowed" : "hover:bg-[#f0fdf4]"}`}
                  aria-label="Copy key"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              {newKey && (
                <div className="mb-6 p-4 bg-[#f0fdf4] border border-[#10b981]/20 rounded-xl">
                  <div className="text-[10px] font-mono font-bold text-[#059669] uppercase tracking-widest mb-1">New Key Generated</div>
                  <div className="font-mono text-xs text-[#0f172a] break-all font-bold">{newKey}</div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
                <div className="text-xs text-[#64748b]">
                  <span className="font-bold text-[#0f172a]">Plan:</span> {plan === 'developer' ? 'Developer (Free)' : 'Pro B2B'}
                </div>
                <button
                  onClick={handleRotateKey}
                  className="flex items-center gap-2 text-xs font-bold text-[#ef4444] hover:text-[#dc2626] transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate Key
                </button>
              </div>
              
              {plan === 'developer' && (
                <div className="mt-6 p-4 bg-[#fffbeb] border border-[#fef3c7] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                    <span className="text-xs text-[#92400e] font-medium">1,000 requests/month limit</span>
                  </div>
                  <a 
                    href={`https://radumuresanu.lemonsqueezy.com/checkout/buy/${founderId}?embed=1`} 
                    className="lemonsqueezy-button text-xs font-bold text-[#0f172a] hover:underline underline-offset-4"
                  >
                    Upgrade to Founder &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Audit History */}
            <div className="bg-white rounded-2xl border border-[#cbd5e1] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#10b981]" />
                  <h2 className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest">Immutable Audit Trail</h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#64748b] transition-colors">{logs.length} Total</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#f1f5f9] text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-widest">
                      <th className="pb-4 pr-4">App Name</th>
                      <th className="pb-4 px-4">Status</th>
                      <th className="pb-4 px-4">Date</th>
                      <th className="pb-4 pl-4 text-right">Trace ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-sm text-[#94a3b8] font-light">
                          No immutable audits detected in the vault yet.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.request_id} className="group hover:bg-[#f8fafc] transition-all">
                          <td className="py-4 pr-4">
                            <div className="text-sm font-bold text-[#0f172a] truncate max-w-[120px]">{log.app_name}</div>
                            <div className="text-[10px] font-mono text-[#64748b] mt-0.5">{log.version?.slice(0, 8) || 'v1.0'}</div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              log.is_compliant 
                                ? "bg-[#f0fdf4] text-[#059669] border-[#10b981]/20" 
                                : "bg-[#fef2f2] text-[#ef4444] border-[#ef4444]/20"
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-[#64748b] font-medium">
                            {new Date(log.created_at).toLocaleDateString()}
                            {(() => {
                              try {
                                const xtra = log.verdict ? JSON.parse(log.verdict) : {}
                                if (xtra.latency_ms) {
                                  return (
                                    <div className="flex items-center gap-1 mt-1 font-mono text-[10px] text-[#059669]">
                                      <span className="bg-[#f0fdf4] px-1.5 py-0.5 rounded border border-[#10b981]/20" title="Zero-Egress Processing">
                                        [{xtra.edge_location}] {xtra.latency_ms}ms
                                      </span>
                                    </div>
                                  )
                                }
                              } catch(e) {}
                              return null;
                            })()}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <a 
                              href={`/dashboard/certificate/${log.request_id}`} 
                              target="_blank"
                              className="text-[10px] font-mono text-[#059669] font-bold hover:underline underline-offset-4 opacity-50 hover:opacity-100 flex items-center justify-end gap-1 transition-all"
                            >
                              CERT &darr;
                            </a>
                            <div className="text-[10px] font-mono text-[#cbd5e1] mt-0.5">{log.request_id.slice(0, 8)}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Right 1 Column */}
          <div className="space-y-8">
            {/* Usage Sidebar */}
            <div className="bg-white rounded-2xl border border-[#cbd5e1] p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-[#10b981]" />
                <h2 className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest">Traffic Analytics</h2>
              </div>
              
              <div className="space-y-4">
                {usage.slice(-5).map((u) => {
                  const maxRequests = Math.max(...usage.map(d => d.requests), 1)
                  return (
                    <div key={u.date} className="flex items-end gap-3 h-12">
                      <div className="flex-1">
                        <div className="text-[10px] font-mono font-bold text-[#64748b] mb-1">{u.date.slice(5)}</div>
                        <div className="relative h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-[#10b981] rounded-full" 
                            style={{ width: `${(u.requests / maxRequests) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-xs font-bold text-[#0f172a] w-8 text-right">{u.requests}</div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#f1f5f9]">
                <div className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-widest mb-1">Status</div>
                <div className="text-xs font-bold text-[#10b981] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                  Infrastructure Ready
                </div>
              </div>
            </div>

            {/* Active Deception (Threat Intel) Sidebar */}
            <div className="bg-white rounded-2xl border border-[#cbd5e1] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#ef4444]" />
                  <h2 className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest">Active Deception</h2>
                </div>
                {threats.length > 0 && <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]"></span>
                </span>}
              </div>
              
              <div className="space-y-3">
                {threats.length === 0 ? (
                   <div className="text-xs text-[#64748b] text-center p-4 bg-[#f8fafc] rounded-xl border border-[#f1f5f9]">
                     No security incidents. Honeypot traps are armed.
                   </div>
                ) : (
                  threats.slice(0, 3).map((threat) => (
                    <div key={threat.id} className="p-3 bg-[#fef2f2] border border-[#ef4444]/20 rounded-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#ef4444]/10 blur-[20px] -translate-y-1/2 translate-x-1/2"></div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-mono font-bold text-[#ef4444] px-1.5 py-0.5 bg-white rounded uppercase ring-1 ring-[#ef4444]/20">
                          {threat.incident_type === 'HONEYPOT_TRIGGER' ? 'Trap Triggered' : 'Shield Block'}
                        </span>
                        <span className="text-[9px] font-mono text-[#64748b]">{new Date(threat.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div className="text-xs font-bold text-[#0f172a] font-mono mt-2 break-all">
                        IP: {threat.ip_address}
                      </div>
                      <div className="text-[10px] text-[#475569] font-mono mt-0.5 break-all">
                        Route: {threat.endpoint} <span className="text-[#64748b]">[{threat.colo_node}]</span>
                      </div>
                      <div className="mt-2 text-[9px] font-bold text-[#059669] flex items-center gap-1 uppercase tracking-widest">
                        <Check className="w-3 h-3" /> Auto-Banned
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reports Sidebar */}
            <div className="bg-[#0f172a] rounded-2xl p-8 text-[#F4F1EA] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 blur-[50px] -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-lg font-bold mb-4 tracking-tight flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#10b981]" />
                Regulatory Proofs
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-6 font-light">
                Generate audit-grade PDF reports for legal and procurement departments.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/dashboard/data-health'}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-bold text-[#F4F1EA] hover:bg-white/10 transition-all flex items-center justify-between group/btn"
                >
                  Data Health (Art. 10)
                  <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform text-[#10b981]" />
                </button>
                <button 
                  disabled={logs.length === 0}
                  onClick={() => window.open(`/dashboard/certificate/${logs[0]?.request_id}`, '_blank')}
                  className={`w-full p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between group/btn ${
                    logs.length === 0 
                      ? "opacity-50 cursor-not-allowed bg-white/5 text-[#64748b]" 
                      : "bg-[#10b981] text-[#0f172a] hover:bg-[#059669]"
                  }`}
                >
                  Extract Certificate
                  <Download className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <a 
                  href="https://radumuresanu.lemonsqueezy.com/billing" 
                  className="text-[10px] font-mono font-bold text-[#94a3b8] hover:text-[#10b981] transition-colors flex items-center gap-2"
                >
                  <CreditCard className="w-3 h-3" />
                  MANAGE SUBSCRIPTION &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
