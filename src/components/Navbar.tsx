import { ShieldCheck } from "lucide-react";

interface NavbarProps {
  onGoHome: () => void;
  onNavigate: (page: string) => void;
  activePage?: string;
  sessionActive?: boolean;
}

export default function Navbar({ onGoHome, onNavigate, activePage = "home", sessionActive = false }: NavbarProps) {
  const navLinks = [
    { label: "Sākums", page: "home" },
    { label: "Cenas", page: "cenas" },
    { label: "Atskaites piemērs", page: "atskaites" },
    { label: "Par Mums", page: "par-mums" },
    { label: "Kontakti", page: "kontakti" },
  ];

  return (
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-8">

        {/* Nav Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <button
              key={link.page}
              type="button"
              onClick={() => onNavigate(link.page)}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activePage === link.page
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-3 ml-auto">
          {sessionActive && (
            <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Atskaites atbloķētas</span>
            </div>
          )}
          <button
            onClick={onGoHome}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-900 hover:bg-slate-50 transition-all cursor-pointer text-[11px] font-semibold uppercase tracking-wider"
          >
            Jauna meklēšana
          </button>
        </div>
      </div>
    </header>
  );
}
