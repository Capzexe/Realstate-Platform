import { PropertyTeaser as PropertyTeaserType } from "../types";
import { 
  Lock, ShieldAlert, Sparkles, HelpCircle, 
  CheckCircle, Landmark, Award, Calendar, 
  MapPin, Coins, ChevronLeft, CreditCard 
} from "lucide-react";
import { motion } from "motion/react";

interface PropertyTeaserProps {
  property: PropertyTeaserType;
  onUnlock: () => void;
  onGoBack: () => void;
  isUnlocking: boolean;
}

export default function PropertyTeaser({ property, onUnlock, onGoBack, isUnlocking }: PropertyTeaserProps) {
  return (
    <div className="flex-grow bg-[#faf9f6] py-12 px-6 sm:px-10 font-sans" id="property-teaser-page">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={onGoBack} 
          className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 font-semibold uppercase tracking-widest mb-8 transition-colors group cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Meklēt jaunu adresi</span>
        </button>

        {/* Search status header */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8 flex items-center space-x-4">
          <div className="bg-emerald-600 text-white p-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-base leading-tight">
              Atrasts reģistrēts īpašuma akts
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Droši saskaņots ar oficiālajiem pašvaldības reģistriem, vēsturiskajiem datiem un īpašuma novērtējumu.
            </p>
          </div>
        </div>

        {/* Main Property Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs mb-8">
          
          {/* Cover & Address Title Block */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img 
              src={property.teaserImage} 
              alt={property.address} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Elegant dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
            
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center space-x-2 text-[9px] font-mono tracking-widest uppercase bg-white/15 backdrop-blur-md px-3 py-1 rounded-md w-max mb-3 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{property.propertyType === "Single Family Residential" || property.propertyType === "Single Family Residence" ? "Vienģimenes dzīvojamā māja" : property.propertyType === "Modern Craftsmanship Home" ? "Moderna dizaina māja" : property.propertyType === "Historic Brick Townhouse" ? "Vēsturiska ķieģeļu rindu māja" : property.propertyType}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">{property.address}</h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">{property.city === "New York" ? "Ņujorka" : property.city === "Los Angeles" ? "Losandželosa" : property.city === "Chicago" ? "Čikāga" : property.city}, {property.state} {property.zip}</p>
            </div>
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-150 bg-slate-50/50 text-slate-800">
            <div className="p-5 text-center border-r border-b sm:border-b-0 border-slate-200">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Guļamistabas</span>
              <span className="text-base font-bold text-slate-800">{property.beds} guļamistabas</span>
            </div>
            <div className="p-5 text-center border-r border-b sm:border-b-0 border-slate-200">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Vannasistabas</span>
              <span className="text-base font-bold text-slate-800">{property.baths} vannasistabas</span>
            </div>
            <div className="p-5 text-center border-r border-slate-200">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Dzīvojamā platība</span>
              <span className="text-base font-bold text-slate-800">{property.sqft.toLocaleString()} kv. pēdas</span>
            </div>
            <div className="p-5 text-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Uzcelšanas gads</span>
              <span className="text-base font-bold text-slate-800">{property.yearBuilt}</span>
            </div>
          </div>

          {/* Secure Teaser Price Panel & Deeds */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Visual paywall teaser records */}
              <div className="flex-grow space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-xl mb-1">
                    Pašvaldības darījumu žurnāls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Oficiālajā reģistrā fiksētie darījumi. Pilnas cenas un īpašnieku vārdi tiek atbloķēti pēc veiksmīgas atskaites iegādes.
                  </p>
                </div>

                {/* Simulated Blurred / Locked Records */}
                <div className="space-y-4 relative">
                  
                  {/* Lock Overlay inside blurred cards */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center rounded-2xl pointer-events-none">
                    <div className="bg-slate-950 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center">
                      <Lock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-950 uppercase tracking-widest font-sans mt-3 bg-white px-3 py-1.5 rounded-md shadow-xs border border-slate-200">
                      Saturs ir bloķēts
                    </span>
                  </div>

                  {/* Dummy Record 1 */}
                  <div className="p-4.5 border border-slate-200/80 bg-white rounded-xl flex items-center justify-between shadow-xs opacity-60">
                    <div className="flex items-center space-x-3.5">
                      <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px] border border-slate-150">
                        TX1
                      </div>
                      <div>
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">AKTA NODOŠANA</p>
                        <p className="text-xs font-bold text-slate-300">Reģistrēts 2024. gada 12. novembrī</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">PĀRDOŠANAS CENA</p>
                      <p className="text-base font-black text-slate-300 tracking-wider">●●●●●●●</p>
                    </div>
                  </div>

                  {/* Dummy Record 2 */}
                  <div className="p-4.5 border border-slate-200/80 bg-white rounded-xl flex items-center justify-between shadow-xs opacity-40">
                    <div className="flex items-center space-x-3.5">
                      <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px] border border-slate-150">
                        TX2
                      </div>
                      <div>
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">AKTA NODOŠANA</p>
                        <p className="text-xs font-bold text-slate-300">Reģistrēts 2018. gada 30. maijā</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">PĀRDOŠANAS CENA</p>
                      <p className="text-base font-black text-slate-300 tracking-wider">●●●●●●●</p>
                    </div>
                  </div>

                  {/* Dummy Record 3 */}
                  <div className="p-4.5 border border-slate-200/80 bg-white rounded-xl flex items-center justify-between shadow-xs opacity-20">
                    <div className="flex items-center space-x-3.5">
                      <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px] border border-slate-150">
                        TX3
                      </div>
                      <div>
                        <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">NODOKĻU NOVĒRTĒJUMS</p>
                        <p className="text-xs font-bold text-slate-300">Reģistrēts 2015. gada 15. janvārī</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">PĀRDOŠANAS CENA</p>
                      <p className="text-base font-black text-slate-300 tracking-wider">●●●●●●●</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-150">
                  <div className="flex items-start space-x-3">
                    <ShieldAlert className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-850 text-xs">Garantēta datu drošība</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                        Piekļuve datiem tiek nodrošināta, stingri ievērojot visus drošības un privātuma standartus. Pēc apmaksas jūs saņemsiet pilnu, oficiālu atskaiti ar visām darījumu vērtībām.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-conversion Checkout Action Block */}
              <div className="w-full lg:w-[320px] shrink-0">
                <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-sm border border-slate-900 flex flex-col justify-between h-full relative overflow-hidden">
                  
                  {/* Subtle editorial geometric accent */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/[0.03] rotate-45 border border-white/5 pointer-events-none"></div>

                  <div className="relative z-10 mb-6">
                    <div className="inline-flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md text-[9px] font-mono tracking-widest uppercase mb-4 border border-indigo-500/10">
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                      <span>AKTA SERTIFIKĀTS PDF</span>
                    </div>

                    <h4 className="font-serif font-bold text-white text-xl tracking-tight leading-snug">
                      Atbloķēt pilnu īpašuma atskaiti
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Tūlītēja, nerediģēta piekļuve aktiem, novērtēšanas hronoloģijai, nodokļu ierakstiem, hipotēkām un salīdzinošajām kaimiņu pārdošanas matricām.
                    </p>
                  </div>

                  <div className="space-y-4 mb-6 relative z-10">
                    <div className="flex items-baseline space-x-1.5 border-b border-white/10 pb-4">
                      <span className="text-4xl font-serif font-bold text-white">$9.99</span>
                      <span className="text-xs text-slate-400">Vienreizējs maksājums</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-350">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Precīzas nodošanas pārdošanas cenas</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Sertificēta pašvaldības aktu matrica</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Reģistrētie īpašnieku vārdi</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>Vēsturiskā nodokļu un apgrūtinājumu virsgrāmata</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={onUnlock}
                    disabled={isUnlocking}
                    id="checkout-button"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer relative z-10 text-xs uppercase tracking-widest disabled:bg-indigo-400"
                  >
                    {isUnlocking ? (
                      <span className="flex items-center space-x-1.5">
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Ielādē norēķinu lapu...</span>
                      </span>
                    ) : (
                      <>
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>Piekļūt atskaitei</span>
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex flex-col items-center space-y-2 relative z-10">
                    <div className="flex items-center justify-center space-x-1.5 opacity-60 text-[9px] font-mono text-slate-400 tracking-wider">
                      <span>VISA</span>
                      <span>•</span>
                      <span>MC</span>
                      <span>•</span>
                      <span>AMEX</span>
                      <span>•</span>
                      <span>STRIPE</span>
                    </div>
                    <span className="text-[9px] text-slate-500 text-center block">
                      Garantēta drošība un tūlītēja lejupielāde PDF formātā.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
