"use client"

import { Shield, Lock, HardDrive, Cpu, FileCheck, Server, Zap, Globe } from "lucide-react"

export function FortressVaultPage() {
  return (
    <div className="bg-[#0f172a] min-h-screen text-white pt-32 pb-24">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <div className="inline-flex items-center gap-2 border border-[#10b981]/30 bg-[#1e293b] px-4 py-2 rounded-full mb-8 shadow-xl">
          <Lock className="w-3.5 h-3.5 text-[#10b981]" />
          <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-widest">Enterprise Sovereignty Tier</span>
        </div>
        <h1 className="text-6xl font-bold tracking-tighter mb-6">Fortress Vault</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
          The industry's first HSM-backed compliance depository. Secure your Technical Files, Risk Management plans, and Data Governance policies in a cryptographically isolated environment.
        </p>
      </div>

      {/* Security Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          {
            icon: Cpu,
            title: "HSM-Backed Encryption",
            desc: "Every document is signed and encrypted using Hardware Security Modules. Sentinel never sees your private keys."
          },
          {
            icon: Server,
            title: "Sovereign R2 Vault",
            desc: "Data resides in region-locked Cloudflare R2 buckets. Zero-Egress Technical Constraint to jurisdictions outside the EU."
          },
          {
            icon: Shield,
            title: "Art 11 Compliance",
            desc: "Automatically structured to meet EU AI Act Article 11 requirements for high-risk technical documentation."
          }
        ].map((feat, i) => (
          <div key={i} className="bg-[#1e293b]/50 border border-slate-800 p-8 rounded-3xl hover:border-[#10b981]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <feat.icon className="w-6 h-6 text-[#10b981]" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Technical Specs Panel */}
      <div className="max-w-5xl mx-auto px-6 border border-slate-800 bg-black/40 rounded-[40px] p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/5 rounded-bl-[200px] -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">System Architecture</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 tracking-tight">Immutable Audit Trail</h2>
              <p className="text-slate-400 mb-8 leading-relaxed font-light">
                Every scan performed by the Sentinel Engine generates a cryptographic proof stored in the Vault. These proofs form an immutable chain of compliance, verifiable by regulators without exposing your raw source code.
              </p>
              <ul className="space-y-4">
                {[
                  "SHA-256 Content Addressing",
                  "Timestamp Authority (RFC 3161)",
                  "Zero-Knowledge Proof generation",
                  "Multi-region failover (EEUR-1)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-mono text-slate-300">
                    <FileCheck className="w-4 h-4 text-[#10b981]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 font-mono text-[10px] text-slate-500 overflow-hidden shadow-inner">
              <div className="flex justify-between mb-4 border-b border-slate-800 pb-2">
                <span>SENTINEL_VAULT_LOG_v1.0</span>
                <span className="text-[#10b981]">SECURED</span>
              </div>
              <div className="space-y-1">
                <p>[SYSTEM] Initializing Fortress-R2 connection...</p>
                <p>[AUTH] Validating BYOK certificates...</p>
                <p className="text-slate-300">[CRYPTO] Generating Art 11 Technical File Hash...</p>
                <p className="text-slate-300">[CRYPTO] 0x8f2a...9cB1 verified via EEUR-1 Node.</p>
                <p>[STORAGE] Encrypting at rest (AES-256-GCM).</p>
                <p>[LOG] Immutable entry #84,291 created.</p>
                <p className="text-[#10b981] mt-2 underline">Status: 100% Deterministic Integrity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="mt-32 text-center pb-12">
        <h2 className="text-2xl font-bold mb-8 italic text-slate-400">"Your compliance is as strong as your weakest vault."</h2>
        <div className="flex items-center justify-center gap-6">
          <a href="/vault/request" className="bg-[#10b981] text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#059669] transition-all">
            Initiate Fortress Inquiry
          </a>
          <a 
            href="https://radumuresanu.lemonsqueezy.com/checkout/buy/2af0bd06-7319-4390-91d4-397998ab012b?embed=1" 
            className="lemonsqueezy-button border border-slate-700 px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
          >
            Direct Purchase &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}
