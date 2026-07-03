import { PropertyReport as PropertyReportType } from "../types";
import {
  Download, ShieldCheck,
  MapPin, Landmark, ArrowLeft,
  BadgeCheck, Activity,
  Building2, Layers, FileText
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

interface PropertyReportProps {
  report: PropertyReportType;
  onGoBack: () => void;
}

const fmt = (val: string | number | null | undefined, suffix = "") =>
  val && String(val).trim() && String(val).trim() !== "0" ? `${val}${suffix}` : "—";

const fmtEur = (val: number | null | undefined) => {
  if (!val || val === 0) return "—";
  return new Intl.NumberFormat("et-EE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
};

const fmtDate = (d: string | null | undefined) => {
  if (!d) return "—";
  // Try native ISO parsing
  const native = new Date(d);
  if (!isNaN(native.getTime())) return native.toLocaleDateString("lv-LV");
  // Try DD.MM.YYYY (Latvian format)
  const m = d.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) {
    const iso = new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`);
    if (!isNaN(iso.getTime())) return iso.toLocaleDateString("lv-LV");
  }
  return d;
};

const parseYear = (d: string | null | undefined): number => {
  if (!d) return 0;
  const native = new Date(d);
  if (!isNaN(native.getTime())) return native.getFullYear();
  const m = d.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return parseInt(m[3], 10);
  const y = d.match(/(\d{4})/);
  return y ? parseInt(y[1], 10) : 0;
};

export default function PropertyReport({ report, onGoBack }: PropertyReportProps) {
  const chartData = [...report.transactions]
    .filter(tx => tx.price_eur > 0)
    .map(tx => ({
      date: parseYear(tx.transaction_date),
      "Summa (EUR)": tx.price_eur,
    }))
    .sort((a, b) => a.date - b.date);

  const detailCell = (label: string, value: string | number | null | undefined, suffix = "") => (
    <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-150">
      <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider mb-1">{label}</span>
      <span className="text-xs font-bold text-slate-800 block break-all">{fmt(value, suffix)}</span>
    </div>
  );

  const locationParts = [report.city, report.county, report.parish].filter(Boolean);

  return (
    <div className="flex-grow bg-[#faf9f6] py-12 px-6 sm:px-10 font-sans text-slate-900" id="property-report-view">
      <div className="max-w-5xl mx-auto">

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button
            onClick={onGoBack}
            className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 font-semibold uppercase tracking-widest transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Meklēt jaunu īpašumu</span>
          </button>
          <div className="flex flex-wrap gap-2.5">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase border border-emerald-100 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Atskaite verificēta</span>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest shadow-xs transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Lejupielādēt PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Header */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-md mb-8 relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center justify-center p-8 pointer-events-none">
            <Landmark className="h-48 w-48" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-[9px] font-mono tracking-widest uppercase bg-white/10 border border-white/5 px-3.5 py-1.5 rounded-md w-max mb-6">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Darījumu reģistra atskaite</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <span className="text-[10px] text-indigo-300 block font-mono uppercase tracking-widest">ADRESE</span>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-1">{report.address}</h1>
                {locationParts.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs mt-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{locationParts.join(", ")}</span>
                  </div>
                )}
                {report.property_cadastre_nr && (
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Kadastra nr.: <span className="text-emerald-400 font-bold">{report.property_cadastre_nr}</span>
                  </p>
                )}
              </div>
              <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/5">
                <span className="text-[9px] text-indigo-300 block font-mono uppercase tracking-widest">PĒDĒJĀ DARĪJUMA SUMMA</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold block text-emerald-400 mt-1">
                  {fmtEur(report.transactions[0]?.price_eur)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {report.transactions[0]?.transaction_date ? fmtDate(report.transactions[0].transaction_date) : ""}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Kopā: {report.transactions.length} darījumi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Building Details + Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs md:col-span-2">
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-6 flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <span>Ēkas tehniskie dati</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {detailCell("Izmantošanas veids", report.building_use_type)}
              {detailCell("Platība", report.building_area_m2, " m²")}
              {detailCell("Apbūves laukums", report.building_footprint_m2, " m²")}
              {detailCell("Tilpums", report.building_volume_m3, " m³")}
              {detailCell("Stāvi", report.building_floors)}
              {detailCell("Celtniecības gads", report.construction_year)}
              {detailCell("Sienu materiāls", report.wall_material)}
              {detailCell("Nolietojums", report.depreciation, "%")}
              {detailCell("Istabas", report.room_count)}
              {detailCell("Guļamistabas", report.bedroom_count)}
              {detailCell("Dzīvokļa platība", report.apartment_area_m2, " m²")}
              {detailCell("NILM kods", report.nilm_group_code)}
            </div>

            {chartData.length > 1 && (
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-serif font-bold text-slate-900 text-base mb-1">Darījumu cenu dinamika</h4>
                <p className="text-[11px] text-slate-400 mb-4">Reģistrēto darījumu summas hronoloģija (EUR)</p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEur" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false}
                        tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(v: any) => [fmtEur(v), "Summa"]}
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "11px" }}
                      />
                      <Area type="monotone" dataKey="Summa (EUR)" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEur)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Land + Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="font-serif font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                <span>Zemes dati</span>
              </h3>
              <div className="space-y-3">
                {detailCell("Zemes platība", report.land_area_m2 > 0 ? report.land_area_m2.toLocaleString() : null, " m²")}
                {detailCell("Zemes kadastra nr.", report.land_cadastre_nrs)}
                {detailCell("Ēkas kadastra nr.", report.building_cadastre_nr)}
                {detailCell("Pagasts / pilsēta", report.parish || report.city)}
                {detailCell("Novads", report.county)}
              </div>
            </div>

            <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-900 shadow-xs relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-5">
                <Activity className="h-20 w-20" />
              </div>
              <div className="relative z-10">
                <span className="text-[9px] font-mono text-indigo-300 uppercase tracking-widest block mb-1">Darījumu kopsavilkums</span>
                <h4 className="font-serif font-bold text-3xl text-white">{report.transactions.length}</h4>
                <p className="text-[11px] text-slate-400 mt-1">reģistrēti darījumi šim īpašumam</p>
                {report.transactions.length > 0 && (
                  <div className="mt-4 border-t border-slate-800 pt-3 space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Pirmais:</span>
                      <span className="text-slate-300 font-bold">
                        {fmtDate(report.transactions[report.transactions.length - 1].transaction_date)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Pēdējais:</span>
                      <span className="text-emerald-400 font-bold">{fmtDate(report.transactions[0].transaction_date)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Transaction Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-5">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Pilns darījumu žurnāls</h3>
              <p className="text-xs text-slate-500 mt-0.5">Visi reģistrētie darījumi hronoloģiskā secībā</p>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-md text-[9px] font-mono font-bold text-slate-600 uppercase tracking-wider">
              {report.transactions.length} ieraksti
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" id="deed-records-table">
              <thead>
                <tr className="border-b border-slate-200 font-mono text-slate-400 uppercase text-[9px] tracking-wider">
                  <th className="pb-3 pr-4">Datums</th>
                  <th className="pb-3 pr-4">Objekta veids</th>
                  <th className="pb-3 pr-4">Adrese</th>
                  <th className="pb-3 pr-4">Platība</th>
                  <th className="pb-3 text-right">Summa (EUR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {report.transactions.map((tx, idx) => (
                  <tr key={tx.id ?? idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 font-semibold font-mono text-slate-500 pr-4">
                      {tx.transaction_date ? fmtDate(tx.transaction_date) : "—"}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                        {tx.object_type || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-800 pr-4 max-w-[180px] truncate">
                      {tx.address || report.address}
                    </td>
                    <td className="py-3.5 text-slate-600 pr-4">
                      {fmt(tx.building_area_m2 || tx.apartment_area_m2, " m²")}
                    </td>
                    <td className="py-3.5 text-right font-bold">
                      {tx.price_eur > 0
                        ? <span className="text-emerald-700">{fmtEur(tx.price_eur)}</span>
                        : <span className="text-slate-400 font-mono text-[10px]">—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extra registration details */}
        {(report.nilm_codes || report.all_building_cadastre_nrs || report.building_use_code) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>Papildu reģistrācijas dati</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {detailCell("NILM kodi", report.nilm_codes)}
              {detailCell("Visi ēku kadastra nr.", report.all_building_cadastre_nrs)}
              {detailCell("Ēkas izmantošanas kods", report.building_use_code)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
