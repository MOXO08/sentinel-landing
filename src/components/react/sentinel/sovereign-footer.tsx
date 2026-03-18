import { Shield, Globe, Lock, FileText, Mail } from "lucide-react"

export function SovereignFooter() {
  return (
    <footer className="border-t border-[#e2e8f0] bg-[#F4F1EA] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-wrap md:flex-nowrap justify-between gap-x-8 gap-y-12">
          {/* Brand & Contact */}
          <div className="w-full md:w-auto md:min-w-[240px] md:mr-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 border border-[#10b981] rounded-sm flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-[#10b981]" />
              </div>
              <span className="font-sans font-semibold text-[#0f172a] text-sm">
                Sentinel
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed mb-6 max-w-xs">
              Compliance Infrastructure.<br />
              Deterministic AI Compliance for CI/CD.<br />
              High-end compliance infrastructure for AI engineering teams.
            </p>
            
            <div className="mb-8 p-4 bg-[#0f172a]/5 border border-[#0f172a]/5 rounded-xl">
                <h3 className="text-[9px] font-black uppercase text-[#94a3b8] mb-2 tracking-[0.1em]">Technical Contact</h3>
                <a
                  href="mailto:office@gettingsentinel.com"
                  className="flex items-center gap-2 text-xs text-[#0f172a] hover:text-[#10b981] transition-colors cursor-pointer font-mono font-bold"
                >
                  <Mail className="w-3.5 h-3.5 opacity-60" />
                  office@gettingsentinel.com
                </a>
            </div>

            <a href="/compliance" className="flex items-center gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              <span className="text-[10px] text-[#64748b] group-hover:text-[#10b981] transition-colors font-mono uppercase tracking-tighter">
                EU AI Act — Compliant Infrastructure
              </span>
            </a>
          </div>

          {/* Product */}
          <div className="flex-1 min-w-[120px]">
            <h3 className="text-[10px] font-black uppercase text-[#0f172a] mb-5 tracking-[0.2em] opacity-50">Product</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Scout (Discovery)", href: "/scout-vault" },
                { label: "Intelligence (Hub)", href: "/ai-compliance" },
                { label: "Integrity (Ledger)", href: "/integrity-console" },
                { label: "Documentation", href: "/docs" },
                { label: "Pricing", href: "/pricing" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[11px] font-mono text-[#64748b] hover:text-[#10b981] transition-colors tracking-tight"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="flex-1 min-w-[120px]">
            <h3 className="text-[10px] font-black uppercase text-[#0f172a] mb-5 tracking-[0.2em] opacity-50">Resources</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "CLI on npm", href: "https://www.npmjs.com/package/@radu_api/sentinel-scan", target: "_blank" },
                { label: "GitHub Repo", href: "https://github.com/MOXO08/sentinel", target: "_blank" },
                { label: "Compliance Tools", href: "/ai-compliance-tools" },
                { label: "Compliance FAQ", href: "/ai-compliance-faq" },
                { label: "Governance Fix", href: "/sentinel-vs-governance-tools" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.target}
                    rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="text-[11px] font-mono text-[#64748b] hover:text-[#10b981] transition-colors tracking-tight"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div className="flex-1 min-w-[120px]">
            <h3 className="text-[10px] font-black uppercase text-[#0f172a] mb-5 tracking-[0.2em] opacity-50">Trust</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Privacy Policy", href: "/legal/privacy" },
                { label: "Terms of Service", href: "/legal/terms" },
                { label: "Sovereignty", href: "/legal/sovereignty" },
                { label: "Security", href: "/security" },
                { label: "Data Residency", href: "/legal/data-residency" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[11px] font-mono text-[#64748b] hover:text-[#10b981] transition-colors tracking-tight"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases */}
          <div className="flex-1 min-w-[120px]">
            <h3 className="text-[10px] font-black uppercase text-[#0f172a] mb-5 tracking-[0.2em] opacity-50">Use Cases</h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Finance", href: "/use-cases/finance" },
                { label: "Healthcare", href: "/use-cases/healthcare" },
                { label: "Engineering", href: "/use-cases/saas" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[11px] font-mono text-[#64748b] hover:text-[#10b981] transition-colors tracking-tight"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#e2e8f0] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#64748b]">
            © 2026 Sentinel — Sovereign Trust. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#64748b]" />
              <span className="text-xs text-[#64748b]">EU Jurisdiction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#64748b]" />
              <span className="text-xs text-[#64748b]">Zero-Egress Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#64748b]" />
              <span className="text-xs text-[#64748b]">ISO 27001 Aligned</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
