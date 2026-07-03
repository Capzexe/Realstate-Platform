import { PropertyTeaser as PropertyTeaserType } from "../types";
import {
  Lock, ShieldAlert, Sparkles,
  CheckCircle, Landmark,
  MapPin, ChevronLeft, CreditCard,
} from "lucide-react";
import { motion } from "motion/react";

interface PropertyTeaserProps {
  property: PropertyTeaserType;
  onUnlock: () => void;
  onGoBack: () => void;
  isUnlocking: boolean;
}

const fmt = (val: string | number | null | undefined, suffix = "") =>
  val && String(val).trim() && String(val).trim() !== "0" ? `${val}${suffix}` : "—";

export default function PropertyTeaser({ property, onUnlock, onGoBack, isUnlocking }: PropertyTeaserProps) {
  const locationParts = [property.city, property.county, property.parish].filter(Boolean);

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

        {/* Found badge */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8 flex items-center space-x-4">
          <div className="bg-emerald-600 text-white p-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-base leading-tight">
              Atrasts reģistrēts darījuma ieraksts
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Saskaņots ar officiālo darījumu reģistru — atrasti{" "}
              <span className="font-bold text-slate-800">{property.transaction_count}</span>{" "}
              darījumu ieraksti šim īpašumam.
            </p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs mb-8">

          {/* Dark header */}
          <div className="bg-slate-950 text-white p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-end justify-end p-6">
              <Landmark className="h-48 w-48" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-[9px] font-mono tracking-widest uppercase bg-white/15 backdrop-blur-md px-3 py-1 rounded-md w-max mb-3 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{property.object_type || "Nekustamais īpašums"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">{property.address}</h2>
              {locationParts.length > 0 && (
                <div className="flex items-center space-x-1.5 text-slate-300 text-sm mt-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{locationParts.join(", ")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-150 bg-slate-50/50 text-slate-800">
            <div className="p-5 text-center border-r border-b sm:border-b-0 border-slate-200">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Platība</span>
              <span className="text-base font-bold">{fmt(property.building_area_m2, " m²")}</span>
            </div>
            <div className="p-5 text-center border-r border-b sm:border-b-0 border-slate-200">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Istabas</span>
              <span className="text-base font-bold">{fmt(property.room_count)}</span>
            </div>
            <div className="p-5 text-center border-r border-slate-200">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Stāvi</span>
              <span className="text-base font-bold">{fmt(property.building_floors)}</span>
            </div>
            <div className="p-5 text-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Celts</span>
              <span className="text-base font-bold">{fmt(property.construction_year)}</span>
            </div>
          </div>

          {/* Secondary specs */}
          <div className="grid grid-cols-3 border-b border-slate-100">
            <div className="p-4 border-r border-slate-100">
              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider mb-0.5">Sienu materiāls</span>
              <span className="text-xs font-bold text-slate-700">{fmt(property.wall_material)}</span>
            </div>
            <div className="p-4 border-r border-slate-100">
              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider mb-0.5">Zemes platība</span>
              <span className="text-xs font-bold text-slate-700">
                {property.land_area_m2 > 0 ? `${property.land_area_m2.toLocaleString()} m²` : "—"}
              </span>
            </div>
            <div className="p-4">
              <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider mb-0.5">Pēdējais darījums</span>
              <span className="text-xs font-bold text-slate-700">
                {(() => {
                  const d = property.latest_transaction_date;
                  if (!d) return "—";
                  const native = new Date(d);
                  if (!isNaN(native.getTime())) return native.toLocaleDateString("lv-LV");
                  const m = d.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
                  if (m) {
                    const iso = new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`);
                    if (!isNaN(iso.getTime())) return iso.toLocaleDateString("lv-LV");
                  }
                  return d;
                })()}
              </span>
            </div>
          </div>

          {/* Locked content + checkout */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left: blurred records */}
              <div className="flex-grow space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-xl mb-1">Darījumu reģistrs</h3>
                  <p className="text-xs text-slate-500">
                    Atrasti <strong>{property.transaction_count}</strong> darījumu ieraksti. Pilnas summas un dati tiek atbloķēti pēc atskaites iegādes.
                  </p>
                </div>

                <div className="space-y-4 relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center rounded-2xl pointer-events-none">
                    <div className="bg-slate-950 text-white p-3.5 rounded-full shadow-lg">
                      <Lock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-950 uppercase tracking-widest mt-3 bg-white px-3 py-1.5 rounded-md shadow-xs border border-slate-200">
                      Saturs ir bloķēts
                    </span>
                  </div>

                  {Array.from({ length: Math.min(property.transaction_count, 3) }, (_, i) => (
                    <div
                      key={i}
                      className="p-4 border border-slate-200/80 bg-white rounded-xl flex items-center justify-between shadow-xs"
                      style={{ opacity: 1 - i * 0.3 }}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px] border border-slate-150">
                          TX{i + 1}
                        </div>
                        <div>
                          <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">DARĪJUMS</p>
                          <p className="text-xs font-bold text-slate-300">● ● ● ● ● ●</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">SUMMA EUR</p>
                        <p className="text-base font-black text-slate-300 tracking-wider">●●●●●●●</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-150">
                  <div className="flex items-start space-x-3">
                    <ShieldAlert className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Piekļuve datiem tiek nodrošināta saskaņā ar visiem drošības un privātuma standartiem. Pēc apmaksas saņemsiet pilnu atskaiti ar visiem darījumu datiem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: checkout */}
              <div className="w-full lg:w-[300px] shrink-0">
                <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-900 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/[0.03] rotate-45 border border-white/5 pointer-events-none" />

                  <div className="relative z-10 mb-6">
                    <div className="inline-flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md text-[9px] font-mono tracking-widest uppercase mb-4 border border-indigo-500/10">
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                      <span>PILNA DARĪJUMU ATSKAITE</span>
                    </div>
                    <h4 className="font-serif font-bold text-white text-xl tracking-tight leading-snug">
                      Atbloķēt pilnu darījumu vēsturi
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Tūlītēja piekļuve visiem {property.transaction_count} darījumiem ar cenām, kadastra numuriem un ēkas tehniskajiem datiem.
                    </p>
                  </div>

                  <div className="relative z-10 space-y-4 mt-auto">
                    <div className="flex justify-between items-baseline border-t border-slate-800 pt-4">
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Vienreizēja maksa</span>
                      <span className="text-3xl font-bold font-serif text-white">9,99 €</span>
                    </div>

                    <motion.button
                      onClick={onUnlock}
                      disabled={isUnlocking}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl text-sm uppercase tracking-widest shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
                    >
                      {isUnlocking ? (
                        <><span className="animate-spin h-4 w-4 border-2 border-slate-800 border-t-transparent rounded-full" /><span>Apstrādā...</span></>
                      ) : (
                        <><CreditCard className="h-4 w-4" /><span>Iegādāties atskaiti</span></>
                      )}
                    </motion.button>

                    <div className="flex flex-wrap gap-2">
                      {[`${property.transaction_count} darījumi`, "Cenas EUR", "Kadastra dati", "Ēkas info"].map((f) => (
                        <span key={f} className="text-[9px] text-slate-400 font-mono bg-white/5 px-2 py-1 rounded border border-white/5">{f}</span>
                      ))}
                    </div>
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

