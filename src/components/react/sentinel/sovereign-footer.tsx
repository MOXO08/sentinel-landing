import { Shield, Globe, Lock, FileText, Mail } from "lucide-react"

export function SovereignFooter() {
  return (
    <footer className="border-t border-[#e2e8f0] bg-[#F4F1EA] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 border border-[#10b981] rounded-sm flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-[#10b981]" />
              </div>
              <span className="font-sans font-semibold text-[#0f172a] text-sm">
                Sentinel
              </span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed mb-4">
              Compliance Infrastructure.<br />
              Deterministic AI Compliance for CI/CD.<br />
              High-end compliance infrastructure<br />
              for AI engineering teams.
            </p>
            <a href="/compliance" className="flex items-center gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              <span className="text-xs text-[#64748b] group-hover:text-[#10b981] transition-colors">
                EU AI Act — Compliant Infrastructure
              </span>
            </a>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-[#0f172a] mb-4 tracking-[0.1em]">Developers</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "GitHub Repository", href: "https://github.com/MOXO08/sentinel", target: "_blank" },
                { label: "NPM Package", href: "https://www.npmjs.com/package/@radu_api/sentinel-scan", target: "_blank" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.target}
                    rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="text-xs font-mono text-[#64748b] hover:text-[#10b981] transition-colors tracking-wide"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Infrastructure */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-[#0f172a] mb-4 tracking-[0.1em]">Infrastructure</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Security Policy", href: "/security" },
                { label: "Compliance Mapping", href: "/compliance" },
                { label: "Data Residency", href: "/legal/data-residency" },
                { label: "Sovereignty Model", href: "/legal/sovereignty" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-xs font-mono text-[#64748b] hover:text-[#10b981] transition-colors tracking-wide"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-[#0f172a] mb-4 tracking-[0.1em]">Legal</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Privacy Policy", href: "/legal/privacy" },
                { label: "Terms of Service", href: "/legal/terms" },
                { label: "Pricing & Licensing", href: "/pricing" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-xs font-mono text-[#64748b] hover:text-[#10b981] transition-colors tracking-wide"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-[#0f172a] mb-4">Contact</h3>
            <p className="text-sm text-[#475569] mb-6 leading-relaxed">
              Technical inquiries &<br />
              Audit Architecture
            </p>
            <a
              href="mailto:office@gettingsentinel.com"
              data-contact-link="office@gettingsentinel.com"
              className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#10b981] transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              office@gettingsentinel.com
            </a>
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
