import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Info } from 'lucide-react';

export function AIDisclosureBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('sentinel_ai_disclosure_dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('sentinel_ai_disclosure_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div 
      id="ai-disclosure-banner"
      className="fixed top-0 left-0 right-0 z-[10001] bg-[#020617] border-b border-amber-500/30 px-4 py-2.5 animate-in slide-in-from-top duration-500"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest mb-0.5">
              EU AI Act Compliance — Art. 52 Disclosure
            </p>
            <p className="text-[11px] text-slate-300 font-medium leading-tight">
              This system utilizes AI (<span className="text-white font-bold">Sentinel-Engine</span>) to process and analyze regulatory technical signals. 
              <span className="hidden md:inline ml-1 text-slate-500 italic">Interaction is verified via hardware-attested zero-egress protocols.</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="/docs/transparency/disclosure-config.json" 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-[9px] font-black uppercase tracking-widest text-[#94a3b8] hover:text-white hover:border-slate-700 transition-all"
          >
            <Info className="w-3 h-3" />
            Technical Evidence
          </a>
          <button 
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/5 rounded-md transition-colors group"
            aria-label="Dismiss disclosure"
          >
            <X className="w-4 h-4 text-slate-500 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
