import { ShieldCheck, Lock, Landmark, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800 font-sans" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          
          {/* Section 1: Security Pledge */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-3">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              <h4 className="font-semibold text-sm tracking-tight uppercase font-mono">Bankas līmeņa verifikācija</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mēs izmantojam oficiālos pašvaldību zemesgrāmatu reģistrus un patentētus vērtēšanas modeļus. Visi maksājumi tiek droši novirzīti un apstrādāti ar Stripe, izmantojot AES-256 SSL šifrēšanu.
            </p>
          </div>

          {/* Section 2: Verified Badges */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-3">
              <Lock className="h-5 w-5 text-indigo-400" />
              <h4 className="font-semibold text-sm tracking-tight uppercase font-sans">Drošības un privātuma garantija</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-left">
              Visi dati tiek apstrādāti saskaņā ar stingrākajiem privātuma standartiem. Meklēšanas vēsture un pieprasījumi netiek publiski uzglabāti vai nodoti trešajām personām.
            </p>
          </div>

          {/* Section 3: Payment Partners */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-3">
              <Landmark className="h-5 w-5 text-indigo-400" />
              <h4 className="font-semibold text-sm tracking-tight uppercase font-sans">Pieņemtie karšu tīkli</h4>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-sans border border-slate-700 font-semibold">VISA</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-sans border border-slate-700 font-semibold">MASTERCARD</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-sans border border-slate-700 font-semibold">AMEX</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-sans border border-slate-700 font-semibold">APPLE PAY</span>
              <span className="bg-slate-800 text-emerald-400 px-2 py-1 rounded text-[10px] font-sans border border-emerald-900 font-semibold">STRIPE SECURE</span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Stripe verificēts partneris. 100% drošs, vienreizējs maksājums, bez regulāra abonementa.
            </span>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            <p>© 2026 VeriSale Inc. Visas pašvaldības publisko aktu atskaites tiek piegādātas droši.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privātuma politika</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Lietošanas noteikumi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
