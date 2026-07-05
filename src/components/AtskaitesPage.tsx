import { Lock, ShieldCheck, TrendingUp } from "lucide-react";

interface AtskaitesPageProps {
  onSearch: () => void;
}

const sampleTransactions = [
  { date: "15.03.2023.", type: "Pārdošana", area: "54,2 m²", price: "87 500 €" },
  { date: "22.11.2017.", type: "Pārdošana", area: "54,2 m²", price: "48 000 €" },
  { date: "05.06.2008.", type: "Pārdošana", area: "54,2 m²", price: "72 000 €" },
];

const techData = [
  { label: "Objekta veids", value: "Dzīvoklis" },
  { label: "Platība", value: "54,2 m²" },
  { label: "Stāvs / Stāvi", value: "3 / 5" },
  { label: "Celšanas gads", value: "1967" },
  { label: "Sienu materiāls", value: "Ķieģeļu mūris" },
  { label: "Istabas", value: "2" },
  { label: "Zemes platība", value: "—" },
  { label: "Kadastra nr.", value: "01000640001" },
];

export default function AtskaitesPage({ onSearch }: AtskaitesPageProps) {
  return (
    <div className="flex-grow bg-[#faf9f6] font-sans">

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 py-20 px-6 sm:px-10 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-4">Atskaites piemērs</span>
          <h1 className="text-5xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Kā izskatās pilna atskaite?
          </h1>
          <p className="text-slate-500 text-base">
            Zemāk redzat reālas atskaites priekšskatījumu. Apmaksas gadījumā iegūstat visu bez aizmiglojuma.
          </p>
        </div>
      </section>

      {/* Mock Report */}
      <section className="py-16 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Certificate header */}
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute right-6 top-6 opacity-5">
              <TrendingUp className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest uppercase bg-white/10 border border-white/10 px-3 py-1.5 rounded-md w-max mb-5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Reģistra kopija · Verificēts
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Brīvības iela 64 - 12</h2>
              <p className="text-slate-400 text-sm">Rīga, Vidzemes priekšpilsēta · Kadastra nr.: <span className="text-emerald-400 font-mono font-bold">01000640001</span></p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block">Pēdējā cena</span>
                  <span className="text-2xl font-serif font-bold text-emerald-400">87 500 €</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block">Darījumi</span>
                  <span className="text-2xl font-serif font-bold">3</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block">Pēdējais darījums</span>
                  <span className="text-2xl font-serif font-bold">2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tech data grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-6">Ēkas tehniskie dati</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {techData.map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">{label}</span>
                  <span className="text-xs font-bold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold text-slate-900 text-lg">Darījumu vēsture</h3>
              <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-md font-bold uppercase tracking-wider">3 ieraksti</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 text-left">Datums</th>
                    <th className="pb-3 text-left">Veids</th>
                    <th className="pb-3 text-left">Platība</th>
                    <th className="pb-3 text-right">Summa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sampleTransactions.map((tx, i) => (
                    <tr key={i} className={i > 0 ? "relative" : ""}>
                      <td className={`py-3.5 font-mono text-slate-500 text-xs ${i > 0 ? "blur-sm select-none" : ""}`}>{tx.date}</td>
                      <td className={`py-3.5 ${i > 0 ? "blur-sm select-none" : ""}`}>
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">{tx.type}</span>
                      </td>
                      <td className={`py-3.5 text-slate-600 ${i > 0 ? "blur-sm select-none" : ""}`}>{tx.area}</td>
                      <td className={`py-3.5 text-right font-bold ${i > 0 ? "blur-sm select-none text-slate-400" : "text-slate-900"}`}>{tx.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Blur overlay on rows 2+ */}
            <div className="absolute bottom-8 left-8 right-8 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-2xl" />
            <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg pointer-events-auto cursor-pointer" onClick={onSearch}>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Atbloķēt pilnu vēsturi · 9,99 €
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 sm:px-10 text-center border-t border-slate-100">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Meklējiet savu īpašumu</h2>
          <p className="text-slate-500 mb-8">Ievadiet jebkuru Latvijas adresi un iegūstiet pilnu darījumu vēsturi.</p>
          <button
            onClick={onSearch}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-xl text-sm uppercase tracking-widest transition-colors cursor-pointer"
          >
            Sākt meklēšanu
          </button>
        </div>
      </section>

    </div>
  );
}
