"use client"

import { useState } from "react"
import { Copy, Check, ChevronRight, Terminal, Code, GitBranch, Shield, Zap, Lock, EyeOff, Scale, HelpCircle, Globe, AlertTriangle } from "lucide-react"

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group border border-[#cbd5e1] bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#e2e8f0] bg-[#f8fafc]">
        <span className="text-[10px] font-mono text-[#64748b] tracking-widest uppercase font-bold">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-mono text-[#64748b] hover:text-[#0f172a] transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#10b981]" />
              <span className="text-[#10b981] font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono text-[#0f172a] overflow-x-auto leading-relaxed whitespace-pre bg-white">{code}</pre>
    </div>
  )
}

const endpoints = [
  {
    method: "POST",
    path: "/v1/vault/ingest",
    description: "Upload a manifest.json to FORTRESS_VAULT and initiate an Annex IV audit.",
    color: "emerald",
  },
  {
    method: "GET",
    path: "/v1/audit/{id}",
    description: "Retrieve audit results, compliance score, and generated dossier for a given audit ID.",
    color: "emerald",
  },
  {
    method: "GET",
    path: "/v1/drift/score",
    description: "Retrieve the current legal drift score for your active compliance snapshots.",
    color: "emerald",
  },
  {
    method: "POST",
    path: "/v1/ci/gate",
    description: "CI/CD compliance gate — returns pass/fail based on your system's current compliance status.",
    color: "gold",
  },
  {
    method: "GET",
    path: "/v1/status/{badge_id}",
    description: "Public Watchtower badge verification. Returns compliance status for embedding on your own site.",
    color: "emerald",
  },
  {
    method: "GET",
    path: "/v1/vault/inventory",
    description: "List all manifests, audit records, and compliance certificates in your Fortress Vault.",
    color: "emerald",
  },
]

const ingestExample = `curl -X POST https://api.gettingsentinel.com/v1/vault/ingest \\
  -H "Authorization: Bearer sk_sentinel_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "manifest": {
      "system_name": "ClaimBot Pro",
      "version": "3.1.0",
      "purpose": "Automated insurance claim assessment",
      "deployment_sector": "essential_private_services",
      "training_data_sources": ["internal_claims_db_v2"],
      "human_oversight": true,
      "eu_deployment": true
    }
  }'`

const ingestResponse = `{
  "audit_id": "aud_01HX9VK3M8P2QRST7WZA",
  "status": "processing",
  "risk_classification": "HIGH_RISK",
  "annex_iii_match": "essential_private_services",
  "estimated_completion_ms": 800,
  "vault_object": "vault://fortressvault/audits/aud_01HX9VK3M8P2QRST7WZA",
  "regulation_version": "EU-AI-ACT-2026-R3",
  "created_at": "2026-03-09T18:45:00.000Z"
}`

const githubActionsExample = `# .github/workflows/sentinel-gate.yml
name: Sentinel Compliance Gate

on: [push, pull_request]

jobs:
  compliance-check:
    runs-on: ubuntu-latest
    steps:
      - name: Sentinel Compliance Gate
        uses: sentinel-vault/ci-gate-action@v2
        with:
          api-key: \${{ secrets.SENTINEL_API_KEY }}
          manifest-path: ./sentinel-manifest.json
          fail-on-drift: true
          drift-threshold: 0.15
          
      - name: Upload Audit Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: sentinel-audit-report
          path: sentinel-report.pdf`

const gitlabExample = `# .gitlab-ci.yml
sentinel-compliance:
  stage: security
  image: sentinelvault/ci-gate:latest
  variables:
    SENTINEL_API_KEY: \$SENTINEL_API_KEY
    MANIFEST_PATH: "./sentinel-manifest.json"
    DRIFT_THRESHOLD: "0.15"
  script:
    - sentinel gate --strict
  artifacts:
    paths:
      - sentinel-report.pdf
    when: always`

export function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<"github" | "gitlab">("github")

  return (
    <div className="bg-[#F4F1EA] pt-32 pb-24 text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-48 shrink-0">
            <nav className="sticky top-24 space-y-8" aria-label="API documentation navigation">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest mb-3">Getting Started</div>
                <div className="space-y-2">
                  {["Authentication", "Base URL", "Rate Limits", "Versioning"].map((item) => (
                    <div key={item} className="text-sm text-[#64748b] hover:text-[#0f172a] cursor-pointer transition-colors font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest mb-3">Endpoints</div>
                <div className="space-y-2">
                  {endpoints.map((ep) => (
                    <div key={ep.path} className="text-xs text-[#64748b] hover:text-[#0f172a] cursor-pointer transition-colors font-mono">
                      {ep.method} {ep.path}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-[#0f172a] uppercase tracking-widest mb-3">CI/CD</div>
                <div className="space-y-2">
                  {["GitHub Actions", "GitLab CI", "Jenkins"].map((item) => (
                    <div key={item} className="text-sm text-[#64748b] hover:text-[#0f172a] cursor-pointer transition-colors font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-[#0f172a] mb-4 leading-tight text-balance tracking-tight">API Reference</h1>
              <p className="text-lg text-[#475569] leading-relaxed max-w-2xl mb-6 font-light">
                RESTful API with JSON request/response bodies. <strong className="text-[#0f172a] font-medium">90% of requests</strong> are processed deterministically by our custom Rust/WASM engine at the Edge.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 p-4 border border-[#cbd5e1] bg-white flex items-center gap-4 rounded-xl shadow-sm">
                  <Terminal className="w-4 h-4 text-[#10b981] shrink-0" />
                  <code className="text-xs font-mono text-[#0f172a] font-bold">Base URL: <span className="text-[#059669]">https://api.gettingsentinel.com/v1</span></code>
                </div>
                <div className="flex-1 p-4 border border-[#10b981]/30 bg-[#10b981]/5 flex items-center gap-4 rounded-xl shadow-sm">
                  <Globe className="w-4 h-4 text-[#10b981] shrink-0" />
                  <div className="text-[10px] font-mono font-bold text-[#059669]">Available on <span className="underline">RapidAPI Hub</span></div>
                </div>
              </div>

              {/* The Sentinel Moat */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { title: "Zero Latency Impact", text: "V8 isolate execution guarantees sub-10ms response times.", icon: <Zap className="w-4 h-4 text-[#10b981]" /> },
                  { title: "Immutable Audit Trails", text: "Every decision is instantly logged into a Cloudflare D1 SQL database.", icon: <Lock className="w-4 h-4 text-[#10b981]" /> },
                  { title: "Zero Hallucinations", text: "Strict deterministic execution ensures exact rulings for prohibited AI.", icon: <EyeOff className="w-4 h-4 text-[#10b981]" /> }
                ].map((moat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-[#cbd5e1] shadow-sm">
                    <div className="p-2 w-fit rounded-lg bg-[#f0fdf4] mb-4">{moat.icon}</div>
                    <h4 className="text-sm font-bold text-[#0f172a] mb-2">{moat.title}</h4>
                    <p className="text-xs text-[#64748b] leading-relaxed font-light">{moat.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Authentication */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">Authentication</h2>
              <p className="text-sm text-[#475569] leading-relaxed mb-4">
                All API requests must include your API key in the Authorization header. Keys are prefixed with <code className="text-[#10b981] text-xs font-mono bg-[#f0fdf4] px-2 py-1 rounded">sk_sentinel_</code>.
              </p>
              <CodeBlock code={`curl https://api.gettingsentinel.com/v1/vault/inventory \\
  -H "Authorization: Bearer sk_sentinel_YOUR_API_KEY"`} language="bash" />
            </div>

            {/* Endpoint Reference */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Endpoints</h2>
              <div className="space-y-2">
                {endpoints.map((ep) => (
                  <div
                    key={ep.path}
                    className="flex items-center gap-4 px-4 py-3 border border-[#cbd5e1] bg-white hover:border-[#10b981] transition-all cursor-pointer rounded-xl hover:shadow-md"
                  >
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      ep.color === "gold" ? "bg-[#fef3c7] text-[#f59e0b]" : "bg-[#f0fdf4] text-[#059669]"
                    }`}>
                      {ep.method}
                    </span>
                    <code className="font-mono text-xs text-[#0f172a] flex-1 font-bold">{ep.path}</code>
                    <span className="text-xs text-[#64748b] hidden md:block flex-1 font-light italic">{ep.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingest Example */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-2">POST /v1/vault/ingest</h2>
              <p className="text-sm text-[#475569] leading-relaxed mb-4">
                Initiate a full Annex IV audit by uploading your AI system manifest. The manifest is ingested into FORTRESS_VAULT and the classification pipeline begins immediately.
              </p>
              <div className="space-y-3">
                <CodeBlock code={ingestExample} language="Request" />
                <CodeBlock code={ingestResponse} language="Response 202" />
              </div>
            </div>

            {/* CI/CD Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">CI/CD Compliance Gating</h2>
              <p className="text-sm text-[#475569] leading-relaxed mb-6">
                Block non-compliant AI system deployments at the pipeline level. The Sentinel CI Gate action fails your build if the compliance score falls below threshold or if legal drift is detected.
              </p>
              
              {/* Tab switcher */}
              <div className="flex gap-0 border border-[#cbd5e1] w-fit mb-4 rounded-lg overflow-hidden bg-white shadow-sm">
                {(["github", "gitlab"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${
                      activeTab === tab
                        ? "bg-[#0f172a] text-[#F4F1EA]"
                        : "text-[#64748b] hover:text-[#0f172a] bg-white font-bold"
                    }`}
                  >
                    {tab === "github" ? "GitHub Actions" : "GitLab CI"}
                  </button>
                ))}
              </div>

              <CodeBlock
                code={activeTab === "github" ? githubActionsExample : gitlabExample}
                language={activeTab === "github" ? "YAML" : "YAML"}
              />
            </div>

            {/* Rate limits */}

            {/* Integration Guide - Flags */}
            <div className="mb-24">
               <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Integration & Payload Guide</h2>
               <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                     <div className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-widest flex items-center gap-2">
                        <Check className="w-3 h-3" /> Safe Flags
                     </div>
                     <ul className="space-y-2">
                        {['standard_encryption', 'anonymous_input', 'compliant_data'].map(f => (
                           <li key={f} className="text-[10px] font-mono bg-white border border-[#cbd5e1] px-2 py-1 rounded text-[#475569]">{f}</li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <div className="text-[10px] font-mono font-bold text-[#ef4444] uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" /> High-Risk Flags
                     </div>
                     <ul className="space-y-2">
                        {['dark_pattern', 'biometric_data', 'subliminal_techniques'].map(f => (
                           <li key={f} className="text-[10px] font-mono bg-white border border-[#ef4444]/20 px-2 py-1 rounded text-[#b91c1c]">{f}</li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <div className="text-[10px] font-mono font-bold text-[#f59e0b] uppercase tracking-widest flex items-center gap-2">
                        <HelpCircle className="w-3 h-3" /> Complex Flags
                     </div>
                     <ul className="space-y-2">
                        {['manual_review_required'].map(f => (
                           <li key={f} className="text-[10px] font-mono bg-white border border-[#f59e0b]/20 px-2 py-1 rounded text-[#b45309]">{f}</li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

            {/* Legal Shield */}
            <div className="bg-[#0f172a] p-12 rounded-[3rem] text-white">
               <div className="flex items-start gap-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0">
                     <Scale className="w-8 h-8 text-[#10b981]" />
                  </div>
                  <div>
                     <div className="text-[10px] font-mono font-bold text-[#10b981] uppercase tracking-[0.2em] mb-4">Part 3: The Legal Shield</div>
                     <h2 className="text-2xl font-bold mb-6">Legal Disclaimer & Limitation of Liability</h2>
                     <p className="text-sm text-[#94a3b8] leading-relaxed font-light">
                        Sentinel API is a technical decision-support tool designed to assist developers in identifying potential compliance risks. 
                        Sentinel API does not provide legal advice. The generated verdicts (COMPLIANT, NON_COMPLIANT) are deterministic technical outputs, not legally binding certifications. 
                        The end-user retains full and sole responsibility for ensuring their application complies with the EU AI Act.
                     </p>
                  </div>
               </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
