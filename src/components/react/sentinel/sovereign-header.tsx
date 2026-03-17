"use client"

import { useState, useEffect } from "react"

import { Shield, Menu, X } from "lucide-react"

const navItems = [
  { label: "Scout", href: "/scout-vault" },
  { label: "Intelligence", href: "/ai-compliance" },
  { label: "Integrity Console", href: "/integrity-console" },
  { label: "Docs", href: "/docs" },
  { label: "GitHub", href: "https://github.com/MOXO08/sentinel", target: "_blank" },
]

export function SovereignHeader({ activePage = "/" }: { activePage?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F4F1EA]/80 backdrop-blur-xl border-b border-[#e2e8f0] shadow-sm"
          : "bg-[#F4F1EA]"
      }`}
    >
      {/* Status Bar */}
      <div className="border-b border-[#e2e8f0] bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
            </span>
            <span className="text-xs font-mono text-[#475569]">
              Regulatory Ruleset: Updated 18 March 2026
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 border border-[#10b981] rounded-sm flex items-center justify-center group-hover:bg-[#f8fafc] transition-colors">
            <Shield className="w-4 h-4 text-[#10b981]" />
          </div>
          <span className="font-sans font-semibold text-[#0f172a] text-sm tracking-wide">
            Sentinel
          </span>
          <span className="text-[#0f172a] text-xs font-mono text-[#64748b] ml-1">•</span>
          <span className="text-[#64748b] text-xs font-mono ml-1">Compliance Infrastructure</span>
        </a>

        {/* Desktop Nav - Centered & Airy */}
        <nav className="hidden lg:flex flex-1 justify-center items-center gap-2" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target={item.target}
              rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              className={`px-4 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                activePage === item.href
                  ? "text-[#10b981]"
                  : "text-[#475569] hover:text-[#0f172a]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA - Precisely Aligned Right */}
        <div className="hidden lg:flex items-center justify-end gap-3 min-w-[240px]">
          <a
            href="/#quickstart"
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#0f172a] rounded-full hover:bg-[#10b981] transition-all shadow-md active:scale-95 text-center"
          >
            Get Started
          </a>
        </div>

        {/* Mobile menu */}
        <button
          className="lg:hidden text-[#475569] hover:text-[#0f172a]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#F4F1EA] border-t border-[#e2e8f0] px-6 py-4">
          <nav className="flex flex-col gap-1" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.target}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                className={`py-3 px-2 text-sm font-medium border-b border-[#e2e8f0] last:border-0 transition-colors ${
                  activePage === item.href ? "text-[#10b981]" : "text-[#475569] hover:text-[#0f172a]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-6 flex flex-col gap-3">
              <a
                href="/#quickstart"
                className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-[#0f172a] rounded-xl hover:bg-[#10b981] transition-all active:scale-[0.98]"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
