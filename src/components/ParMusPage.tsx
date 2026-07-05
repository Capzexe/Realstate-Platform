import { ShieldCheck, Database, Lock } from "lucide-react";

export default function ParMusPage() {
  const values = [
    {
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      title: "Oficiālie dati",
      text: "Visi dati nāk tieši no Latvijas publiskajiem zemesgrāmatu reģistriem. Nekādas spekulācijas vai aprēķini.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      title: "Privātums",
      text: "Jūsu meklēšanas vēsture netiek uzglabāta vai nodota trešajām personām. Dati apstrādāti saskaņā ar GDPR.",
    },
    {
      icon: <Lock className="w-5 h-5 text-indigo-600" />,
      title: "Drošība",
      text: "Visi maksājumi tiek apstrādāti caur Stripe ar AES-256 SSL šifrēšanu. Mēs nekad neredzam jūsu karšu datus.",
    },
  ];

  const stats = [
    { num: "500K+", label: "Darījumu ieraksti" },
    { num: "100%", label: "Officiālie dati" },
    { num: "9,99€", label: "Vienreizēja maksa" },
    { num: "24/7", label: "Tūlītēja piekļuve" },
  ];

  return (
    <div className="flex-grow bg-white font-sans">

      {/* Hero */}
      <section className="border-b border-slate-100 py-24 px-6 sm:px-10 bg-gradient-to-b from-indigo-50/30 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-4">Par Mums</span>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-slate-900 tracking-tight mb-6">
            Latvijas nekustamā<br />
            <span className="text-indigo-600 italic">īpašuma pārredzamība</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            VeriSale padara Latvijas nekustamā īpašuma tirgus datus pieejamus ikvienam — godīgi, droši un par pieejamu cenu.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 sm:px-10 border-b border-slate-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="text-4xl font-serif font-bold text-slate-900 mb-1">{num}</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Mūsu misija</h2>
            <p className="text-slate-500 text-base leading-relaxed mb-4">
              Latvijā nekustamā īpašuma cenu vēsture tradicionāli bijusi grūti pieejama. Mūsu mērķis ir mainīt to — padarot šos datus pieejamus ikvienam, ne tikai bankām vai lieliem uzņēmumiem.
            </p>
            <p className="text-slate-500 text-base leading-relaxed mb-4">
              Neatkarīgi no tā, vai esat pircējs, pārdevējs, investors vai tirgus analītiķis — jums ir tiesības zināt, par cik īpašumi patiešām pārdodas.
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              Visi mūsu dati nāk no publiski pieejamiem Latvijas reģistriem. Mēs tos strukturējam un padarām viegli pārskatāmus.
            </p>
          </div>
          <div className="space-y-5">
            {values.map(({ icon, title, text }) => (
              <div key={title} className="flex gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <div className="mt-0.5 shrink-0 w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="py-16 px-6 sm:px-10 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Juridiski aspekti</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
            VeriSale izmanto tikai publiski pieejamus datus no Latvijas valsts reģistriem. Mēs nepārdodam un nepubliskojam personu datus. Visa informācija tiek apstrādāta saskaņā ar Eiropas Savienības GDPR regulējumu un Latvijas privātuma likumdošanu.
          </p>
        </div>
      </section>

    </div>
  );
}
