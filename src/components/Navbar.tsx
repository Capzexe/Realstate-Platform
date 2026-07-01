import { Building2, ShieldCheck, Lock } from "lucide-react";

interface NavbarProps {
  onGoHome: () => void;
  sessionActive?: boolean;
}

export default function Navbar({ onGoHome, sessionActive = false }: NavbarProps) {
  return (
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={onGoHome} 
          className="flex items-center space-x-3 cursor-pointer group"
          id="nav-logo"
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
            V
          </div>
          <div>
            <span className="font-sans font-bold text-xl tracking-tight text-slate-900 block leading-none">
              VeriSale<span className="text-indigo-600">.ai</span>
            </span>
            <span className="text-[9px] font-sans text-slate-400 tracking-widest uppercase block mt-1">
              Zemesgrāmatu un vērtību reģistrs
            </span>
          </div>
        </div>

        {/* Security & Verification Badges */}
        <div className="flex items-center space-x-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
          {sessionActive && (
            <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-md px-3 py-1.5 text-[10px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Atskaites atbloķētas</span>
            </div>
          )}

          <button 
            onClick={onGoHome}
            className="px-4 py-2 border border-slate-200 rounded-md text-slate-950 hover:bg-slate-50 transition-all cursor-pointer text-[11px]"
          >
            Jauna meklēšana
          </button>
        </div>
      </div>
    </header>
  );
}
