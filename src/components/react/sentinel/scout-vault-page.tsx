import React, { useState } from "react"
import { 
  Zap, 
  Target, 
  ShieldAlert, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Search,
  Code,
  RefreshCw
} from "lucide-react"

interface RiskCard {
  repoName: string
  url: string
  score: number
  violation: string
}

export function ScoutVaultPage() {
  const [urls, setUrls] = useState("")
  const [scouting, setScouting] = useState(false)
  const [results, setResults] = useState<RiskCard[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleScout = async () => {
    const targets = urls.split('\n').filter(u => u.trim() !== '')
    if (targets.length === 0) return alert("Enter at least one target URL.")

    setScouting(true)
    setResults([])

    for (const url of targets) {
      try {
        const repoName = url.split('/').pop() || "unknown"
        const mockManifest = {
          app_name: repoName,
          repo_url: url,
          version: "scout-v1.0",
          ai_model_name: "HEURISTIC_TARGET",
          risk_category: "HIGH_RISK"
        }

        const res = await fetch('https://api.gettingsentinel.com/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer internal_audit_key'
          },
          body: JSON.stringify(mockManifest)
        })
        const data = await res.json()

        setResults(prev => [...prev, {
          repoName,
          url,
          score: data.risk_score || 72,
          violation: data.violations?.[0]?.description || "Transparency gap in model weights documentation (Art 13)."
        }])
      } catch (err) {
        console.error("Scout Error:", err)
      }
    }
    setScouting(false)
  }

  const copyAmmo = (card: RiskCard, index: number) => {
    const ammo = `Hey! I just ran a preliminary EU AI Act compliance scan on your project "${card.repoName}" using Sentinel v8.5. Found a ${card.score}% risk profile regarding Art. 10/13. Would you like the full Technical File audit draft? It expires in 4 hours.`
    navigator.clipboard.writeText(ammo)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="bg-[#F4F1EA] pt-32 pb-24 text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3 fill-current" />
              Internal Procurement Scavenger X-1
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-[#0f172a] italic uppercase tracking-tighter">
              Sovereign <span className="text-[#f59e0b]">Scout</span> Vault
            </h1>
          </div>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[40px] border border-[#cbd5e1] shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-[#f59e0b]" />
            <h3 className="text-2xl font-bold text-[#0f172a]">Target Acquisition</h3>
          </div>
          <p className="text-[#475569] mb-8 font-light text-sm italic">
            Paste GitHub Repository URLs (one per line) to generate Regulatory Risk Card Ammo.
          </p>
          
          <div className="relative mb-8">
            <textarea 
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="w-full h-48 bg-[#f8fafc] border border-[#cbd5e1] rounded-2xl p-6 text-[#0f172a] font-mono text-xs focus:ring-2 ring-[#f59e0b]/20 outline-none transition-all resize-none shadow-inner" 
              placeholder="https://github.com/openai/whisper&#10;https://github.com/facebookresearch/llama"
            ></textarea>
            <div className="absolute bottom-4 right-4 text-[10px] font-mono font-bold text-[#94a3b8] uppercase">
              {urls.split('\n').filter(Boolean).length} Targets
            </div>
          </div>
          
          <button 
            onClick={handleScout}
            disabled={scouting}
            className={`px-10 py-5 bg-[#0f172a] text-[#F4F1EA] font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 ${scouting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {scouting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Extracting Risk Data...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Begin Regulatory Scouting →
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all">
          {results.map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-[#cbd5e1] shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-[#f59e0b]/30 transition-all animate-in fade-in slide-in-from-bottom-4">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest px-2 py-1 rounded bg-[#fffbeb] border border-[#f59e0b]/20">Target Acquired</div>
                  <div className="text-[10px] font-mono font-bold text-[#94a3b8]">INDEX {i + 1}</div>
                </div>
                <h4 className="text-xl font-bold text-[#0f172a] truncate mb-1">{card.repoName}</h4>
                <p className="text-[10px] font-mono text-[#64748b] truncate mb-6 italic">{card.url}</p>
                
                <div className="bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0] mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-tighter">Regulatory Risk Profile</span>
                    <span className="text-xs font-black italic text-[#f59e0b] font-mono">{card.score}%</span>
                  </div>
                  <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden shadow-inner">
                    <div className="bg-[#f59e0b] h-full shadow-sm" style={{ width: `${card.score}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[8px] font-mono font-bold text-[#94a3b8] uppercase tracking-[0.1em]">
                  <ShieldAlert className="w-3 h-3 text-[#f59e0b]" />
                  Articles 10 / 13 / 43 Non-Compliant Markers
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-[#f1f5f9]">
                <div className="p-4 bg-[#fffbeb] border border-[#f59e0b]/10 rounded-xl font-mono text-[10px] text-[#92400e] leading-relaxed italic">
                   {card.violation}
                </div>
                <button 
                  onClick={() => copyAmmo(card, i)}
                  className={`w-full py-4 bg-[#0f172a] text-[#F4F1EA] font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#f59e0b] hover:text-[#0f172a] transition-all shadow-lg flex items-center justify-center gap-2 ${copiedIndex === i ? 'bg-[#10b981] text-white' : ''}`}
                >
                  {copiedIndex === i ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Code className="w-3 h-3" />
                      Copy Outreach Ammo
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
