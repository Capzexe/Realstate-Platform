import React, { useState } from "react";
import { Search, Building2, MapPin, Landmark, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { motion } from "motion/react";

interface PropertySearchProps {
  onSearch: (address: string) => void;
  isLoading: boolean;
}

export default function PropertySearch({ onSearch, isLoading }: PropertySearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const selectSample = (sampleAddress: string) => {
    setQuery(sampleAddress);
    onSearch(sampleAddress);
  };

  const sampleProperties = [
    { address: "Brīvības iela 1, Rīga", city: "Rīga", badge: "Rīgas rajons" },
    { address: "Valdemāra iela 1, Rīga", city: "Rīga", badge: "Rīga" },
    { address: "Krišjāņa Valdemāra 5, Rīga", city: "Rīga", badge: "Centrs" }
  ];

  return (
    <div className="flex-grow grid grid-cols-12 bg-white font-sans" id="search-homepage">
      {/* Left Main Section - 7 Columns on desktop */}
      <section className="col-span-12 lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-center border-r border-slate-100 relative">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-xl mx-auto lg:mx-0 w-full relative z-10">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Sertificēti zemesgrāmatu ieraksti</span>
          </div>

          {/* High impact Editorial Serif Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif leading-[0.95] tracking-tight text-slate-900 mb-6">
            Katrs īpašums.<br />
            <span className="text-indigo-600 italic">Katra cena.</span><br />
            Atšifrēts.
          </h1>

          <p className="text-slate-500 text-base sm:text-lg mb-10 leading-relaxed">
            Droša, nerediģēta piekļuve darījumu vēsturei un reģistrētajiem aktiem Latvijas nekustamā īpašuma tirgū.
          </p>

          {/* Elegant Search Bar */}
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center mb-8 group"
          >
            <div className="absolute left-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search className="h-6 w-6" />
            </div>
            
            <input 
              type="text"
              id="property-address-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ievadiet īpašuma adresi (piemēram, Brīvības iela 1, Rīga)"
              className="w-full pl-14 pr-32 py-5.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm text-sm sm:text-base"
              disabled={isLoading}
            />

            <div className="absolute right-3">
              <button
                type="submit"
                id="search-button"
                disabled={isLoading || !query.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-1.5 disabled:bg-indigo-300 cursor-pointer text-xs uppercase tracking-wider"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-1.5">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Meklē...</span>
                  </span>
                ) : (
                  <>
                    <span>Meklēt</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Core Sample Badges */}
          <div className="mb-10 text-left">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4">
              Verificēti pamatdaļas reģistri
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleProperties.map((prop, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSample(prop.address)}
                  className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left transition-all duration-200 group flex flex-col justify-between shadow-xs cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono font-bold text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest">
                      {prop.badge}
                    </span>
                    <MapPin className="h-3 w-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-indigo-950 truncate">
                    {prop.address.split(",")[0]}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {prop.city}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Coverage Stats indicator */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-sans border-t border-slate-100 pt-6 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Latvija
            </span>
            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
            <span>Oficiāli reģistra dati</span>
            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
            <span>Droši norēķini</span>
          </div>

        </div>
      </section>

      {/* Right Column - 5 Columns with Preview Mockup widget */}
      <section className="col-span-12 lg:col-span-5 bg-slate-50/75 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center border-t lg:border-t-0 border-slate-100">
        <div className="w-full max-w-sm">
          
          {/* Preview Mockup Card */}
          <div className="bg-white rounded-[32px] shadow-xl border border-slate-200/40 overflow-hidden">
            <div className="p-8 pb-5">
              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 font-mono">
                Atrasts darījumu ieraksts
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight mb-1">Brīvības iela 1</h2>
              <p className="text-slate-400 text-xs">Rīga, Latvija</p>
            </div>
            
            <div className="px-8 py-5 bg-slate-50/80 border-y border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">Pēdējo reizi pārdots par</span>
                <div className="relative">
                   <span className="text-base font-bold text-slate-800 filter blur-[5px] select-none">$1,450,000</span>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-slate-900 text-white px-2.5 py-1.5 rounded-md text-[9px] font-bold tracking-widest flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" />
                        <span>BLOĶĒTS</span>
                      </span>
                   </div>
                </div>
              </div>
              <div className="flex justify-between items-center opacity-50">
                <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">Akta nodošanas</span>
                <span className="text-xs font-bold text-slate-700">3 reģistrēti</span>
              </div>
              <div className="flex justify-between items-center opacity-50">
                <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">Iepriekšējais īpašnieks</span>
                <span className="text-xs font-bold text-slate-700">Konfidenciāla persona</span>
              </div>
            </div>

            <div className="p-8">
              <button 
                type="button"
                onClick={() => selectSample("Brīvības iela 1, Rīga")}
                className="w-full py-4 bg-slate-950 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-[0.98] mb-4 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Atbloķēt atskaiti • $9.99</span>
              </button>
              
              <div className="flex items-center justify-center gap-4 opacity-40 grayscale text-[9px] font-mono tracking-widest text-slate-400">
                <span>VISA</span>
                <span>MASTERCARD</span>
                <span>AMEX</span>
                <span>STRIPE</span>
              </div>
            </div>
          </div>

          {/* Quick check list */}
          <div className="mt-10 space-y-4">
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Tūlītēja piegāde. Nekavējoties piekļūstiet sertificētam PDF aktu nodošanas saņemšanas apstiprinājumam un matricai.
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Pilna konfidencialitāte. Meklēšanas vēsture netiek publiskota vai nodota trešajām personām.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
