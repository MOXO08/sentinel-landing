import React, { useState, useEffect } from "react"
import { 
  Terminal, 
  Users, 
  ShieldAlert, 
  Activity, 
  Power,
  Ban,
  RefreshCcw,
  Zap,
  Globe
} from "lucide-react"

interface ClientData {
    id: string
    email: string
    plan: string
    status: string
    created_at: string
    rpm_limit: number
    audit_count: number
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

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [clients, setClients] = useState<ClientData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [metricsRes, clientsRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/clients')
      ])

      if (metricsRes.status === 403) {
          window.location.href = '/dashboard/login'
          return
      }

      setMetrics(await metricsRes.json())
      const clientsData = await clientsRes.json()
      setClients(clientsData.clients || [])
    } catch (error) {
      console.error("HQ Fetch Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string, payload: any) => {
      if (!confirm(`Execute: ${action.toUpperCase()}?`)) return;
      try {
          const res = await fetch('/api/admin/action', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ action, payload })
          });
          if (res.ok) await fetchData();
          else alert("Failed to execute command.");
      } catch (e) {
          alert("Error executing command.")
      }
  }

  if (loading || !metrics) {
      return (
          <div className="bg-[#0f172a] min-h-screen text-[#F4F1EA] flex items-center justify-center font-mono">
              INITIATING SECURE HQ CONNECTION...
          </div>
      )
  }

  // Cost Calculation (Rule 90/10 Logic)
  // Cloudflare Workers Free Tier covers 10M requests. Let's calculate overage manually if needed.
  const estimatedEgressCost = (metrics.totals?.audits * 0.0000003).toFixed(4)

  return (
    <div className="bg-[#0f172a] pt-32 pb-24 text-[#F4F1EA] min-h-screen font-mono">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HQ Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-[#ef4444] mb-2 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse"></span>
              God Mode Active
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sentinel HQ</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white/5 px-4 py-2 rounded shadow-sm text-xs font-bold text-[#94a3b8] uppercase tracking-wider border border-white/10">
               {clients.length} Active Nodes
             </div>
             <a href="/dashboard" className="px-4 py-2 bg-white/10 text-xs font-bold rounded hover:bg-white/20 transition-all shadow-sm border border-white/20">
               Exit to User Panel
             </a>
          </div>
        </div>

        {/* Global Metrics Panels */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 p-6 rounded relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#10b981]/20 blur-[20px] -translate-y-1/2 translate-x-1/2"></div>
                <Activity className="w-5 h-5 text-[#10b981] mb-4" />
                <div className="text-[10px] text-[#94a3b8] uppercase tracking-widest mb-1">Total Payload Executions</div>
                <div className="text-3xl font-bold">{metrics.totals?.audits.toLocaleString()}</div>
                <div className="text-[10px] text-[#059669] mt-2">+ Cloudflare D1 Synced</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4af37]/20 blur-[20px] -translate-y-1/2 translate-x-1/2"></div>
                <Zap className="w-5 h-5 text-[#d4af37] mb-4" />
                <div className="text-[10px] text-[#94a3b8] uppercase tracking-widest mb-1">Compute Cost Analysis</div>
                <div className="text-3xl font-bold">${estimatedEgressCost}</div>
                <div className="text-[10px] text-[#d4af37] mt-2">Zero-Egress WASM Margin Maintained</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded relative overflow-hidden flex flex-col justify-between">
                <div>
                    <Terminal className="w-5 h-5 text-[#94a3b8] mb-4" />
                    <div className="text-[10px] text-[#94a3b8] uppercase tracking-widest mb-1">Emergency Operations</div>
                </div>
                <button className="bg-black/40 border border-[#ef4444]/50 py-2 px-4 text-xs font-bold text-[#ef4444] rounded hover:bg-[#ef4444] hover:text-white transition-all flex items-center justify-between w-full">
                    PURGE EDGE CACHE <Power className="w-3 h-3" />
                </button>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded relative overflow-hidden">
                <Globe className="w-5 h-5 text-[#3b82f6] mb-4" />
                <div className="text-[10px] text-[#94a3b8] uppercase tracking-widest mb-1">Autonomous Discovery</div>
                <div className="text-3xl font-bold">{metrics.totals?.discovery?.toLocaleString() || 0}</div>
                <div className="text-[10px] text-[#3b82f6] mt-2">+ Mapping AI Ecosystem</div>
            </div>
        </div>

        {/* Discovery Section */}
        <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-4 h-4 text-[#3b82f6]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#3b82f6]">Discovery Index (Internal Analysis)</h2>
            </div>
            <div className="bg-white/5 border border-white/10 rounded overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20 text-[#94a3b8] uppercase tracking-widest text-[10px]">
                    <th className="p-4">Repository</th>
                    <th className="p-4">Context</th>
                    <th className="p-4">Signals</th>
                    <th className="p-4">Audit Result</th>
                    <th className="p-4 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {metrics.discovery?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold">{item.repo_name}</div>
                        <a href={item.repo_url} target="_blank" rel="noreferrer" className="text-[10px] text-[#3b82f6] hover:underline mt-1 block truncate max-w-[200px]">{item.repo_url}</a>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-[#94a3b8]">{item.stars} ⭐</span>
                          <span className="text-[9px] uppercase font-bold text-[#64748b] bg-white/5 px-1 rounded">{item.language}</span>
                        </div>
                        <div className="text-[9px] text-[#94a3b8]">{item.detected_ai_stack}</div>
                      </td>
                      <td className="p-4">
                        <div className={`text-[10px] font-bold uppercase tracking-tighter ${item.risk_level === 'Low' ? 'text-[#10b981]' : (item.risk_level === 'Medium' ? 'text-[#f59e0b]' : 'text-[#ef4444]')}`}>
                          {item.risk_level} RISK
                        </div>
                        <div className="text-[9px] text-[#64748b] mt-1">{JSON.parse(item.rules_failed || '[]').length} Violations</div>
                      </td>
                      <td className="p-4">
                         <div className="text-lg font-black">{item.audit_score}<span className="text-[10px] opacity-30">/100</span></div>
                         <div className="text-[9px] text-[#64748b]">{new Date(item.scan_timestamp).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 text-right">
                         <span className="text-[9px] font-bold uppercase text-[#94a3b8] bg-white/5 border border-white/10 px-2 py-1 rounded">
                           Pending Review
                         </span>
                      </td>
                    </tr>
                  ))}
                  {(!metrics.discovery || metrics.discovery.length === 0) && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-[#64748b] italic">
                        Discovery queue empty. Trigger manual scan or wait for schedule.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main User Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#cbd5e1]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#cbd5e1]">Infrastructure Clients</h2>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20 text-[#94a3b8] uppercase tracking-widest text-[10px]">
                    <th className="p-4">Identity</th>
                    <th className="p-4">Plan / Usage</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold">{client.email}</div>
                        <div className="text-[10px] text-[#64748b] mt-1">{new Date(client.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="uppercase tracking-widest text-[9px] font-bold text-[#10b981]">{client.plan}</div>
                        <div className="text-[#94a3b8] mt-1">{client.audit_count} requests</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                            client.status === 'active' 
                                ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20" 
                                : "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20"
                        }`}>
                            {client.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                            onClick={() => handleAction('revoke_key', { client_id: client.id })}
                            className="text-[10px] px-2 py-1 bg-black/40 border border-white/10 hover:border-[#f59e0b] hover:text-[#f59e0b] rounded transition-colors"
                            title="Force Key Rotation"
                        >
                            <RefreshCcw className="w-3 h-3 inline-block" />
                        </button>
                        {client.status === 'active' ? (
                            <button 
                                onClick={() => handleAction('suspend_client', { client_id: client.id })}
                                className="text-[10px] px-2 py-1 bg-black/40 border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444] hover:text-white rounded transition-colors"
                                title="Suspend Account"
                            >
                                <Ban className="w-3 h-3 inline-block" />
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleAction('activate_client', { client_id: client.id })}
                                className="text-[10px] px-2 py-1 bg-black/40 border border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981] hover:text-white rounded transition-colors"
                                title="Reactivate Account"
                            >
                                ACTIVATE
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Threat Intel Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#cbd5e1]">Global Threat Radar</h2>
              </div>
              <span className="text-[10px] bg-[#ef4444]/10 text-[#ef4444] px-2 py-0.5 rounded border border-[#ef4444]/20 uppercase tracking-widest font-bold">LIVE</span>
            </div>

            <div className="bg-white/5 border border-[#ef4444]/20 p-6 rounded space-y-4 max-h-[600px] overflow-y-auto">
                {metrics.threats?.map((threat: ThreatLog) => (
                    <div key={threat.id} className="border-l-2 border-[#ef4444] pl-3 py-1">
                        <div className="flex justify-between items-start">
                            <span className="text-[9px] uppercase tracking-widest text-[#ef4444] bg-[#ef4444]/10 px-1 py-0.5 font-bold mb-1 block w-fit">
                                {threat.incident_type}
                            </span>
                            <span className="text-[9px] text-[#64748b]">
                                {new Date(threat.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        <div className="text-xs font-bold text-[#F4F1EA]">
                            {threat.ip_address}
                        </div>
                        <div className="text-[10px] text-[#94a3b8] mt-1 flex items-center justify-between">
                            <span>{threat.endpoint}</span>
                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {threat.colo_node}</span>
                        </div>
                        <div className="mt-2 text-right">
                           <button 
                                onClick={() => handleAction('global_ban_ip', { ip: threat.ip_address })}
                                className="text-[9px] border border-white/20 hover:border-[#ef4444] hover:text-[#ef4444] px-2 py-0.5 rounded transition-colors"
                            >
                                EXTEND GLOBAL BAN
                           </button>
                        </div>
                    </div>
                ))}
                {metrics.threats?.length === 0 && (
                    <div className="text-xs text-[#64748b] text-center pt-8 pb-4">
                        No active threats detected.
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
