import { Check } from "lucide-react";

interface CenasPageProps {
  onSearch: () => void;
}

const plans = [
  {
    name: "Parastais Pircējs",
    price: "9.00",
    period: "par atskaiti",
    description: "Ideāli, ja pērc vai pārdod sev vienu konkrētu īpašumu.",
    cta: "Pirkt atskaiti",
    highlighted: false,
    badge: null,
    features: [
      "1 konkrēta īpašuma tehniskie dati",
      "Visi darījumi mājā pēdējos 3 gadus",
      "Rajona vidējās cenas analītika",
      "Lejupielādējams PDF pārskats",
    ],
  },
  {
    name: "Profesionālis",
    price: "49.99",
    period: "mēnesī",
    description: "Mākleriem, vērtētājiem un investoriem ikdienas darbam.",
    cta: "Sākt abonementu",
    highlighted: true,
    badge: "Populārākais",
    features: [
      "Neierobežota meklēšana un dati",
      "Pilna piekļuve interaktīvajai kartei",
      "Padziļināti filtri (sērijas, materiāli, gadi)",
      "Neierobežota PDF atskaišu izveide",
    ],
  },
  {
    name: "Aģentūrām",
    price: "no 149.00",
    period: "mēnesī",
    description: "Komandu pakete nekustamā īpašuma birojiem un uzņēmumiem.",
    cta: "Pieteikt biroju",
    highlighted: false,
    badge: null,
    features: [
      "Kopīgs konts un rēķins visai komandai",
      "Sadalītas pieejas (5, 15 vai 50+ aģentiem)",
      "PDF atskaites ar jūsu aģentūras logo",
      "Darbinieku aktivitātes statistika vadītājam",
    ],
  },
];

const faqs = [
  {
    q: "Kā darbojas vienreizējā maksa?",
    a: "Jūs maksājat 9,00€ par vienu konkrētu īpašumu. Apmaksas rezultātā tiekat piekļūt tā pilnai darījumu vēsturei uz 24 stundām.",
  },
  {
    q: "Kādus datus iegūstu?",
    a: "Iegūstat visus reģistrētos darījumus ar cenām EUR, darījumu datumiem, kadastra numuriem, ēkas tehniskajiem datiem un zemes platību.",
  },
  {
    q: "Vai dati ir aktuāli?",
    a: "Dati nāk tieši no Latvijas Zemesgrāmatu reģistra un tiek regulāri atjaunināti.",
  },
  {
    q: "Vai varu iegādāties atskaiti par vairākiem īpašumiem?",
    a: "Jā. Katra meklēšana un apmaksa ir neatkarīga — varat iegādāties atskaites par cik vien īpašumiem vēlaties.",
  },
  {
    q: "Vai ir atteikuma tiesības?",
    a: "Tā kā atskaite ir digitāls produkts ar tūlītēju piekļuvi, atteikuma tiesības pēc atskaites atvēršanas nav piemērojamas.",
  },
];

export default function CenasPage({ onSearch }: CenasPageProps) {
  return (
    <div className="flex-grow bg-white font-sans">

      {/* Hero */}
      <section className="border-b border-slate-100 py-20 px-6 sm:px-10 text-center bg-gradient-to-b from-indigo-50/40 to-white">
        <div className="max-w-3xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-4">Cenas</span>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Izvēlieties savu plānu
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            No vienreizējas atskaites līdz pilnai aģentūras paketei — katram savam vajadzīgajam.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                plan.highlighted
                  ? "bg-slate-950 border-slate-800 text-white shadow-xl scale-[1.02]"
                  : "bg-white border-slate-200/80 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className={`font-serif font-bold text-xl mb-1 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h2>
                <p className={`text-sm leading-relaxed ${plan.highlighted ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className={`flex items-baseline gap-1 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  <span className="text-4xl font-serif font-bold">{plan.price}</span>
                  <span className={`text-base ${plan.highlighted ? "text-slate-300" : "text-slate-400"}`}>€</span>
                  <span className={`text-sm ml-1 ${plan.highlighted ? "text-slate-400" : "text-slate-400"}`}>/ {plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      plan.highlighted ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      <Check className="w-3 h-3" />
                    </span>
                    <span className={`text-sm ${plan.highlighted ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={onSearch}
                className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors cursor-pointer ${
                  plan.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-slate-950 hover:bg-slate-800 text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 sm:px-10 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-slate-900 text-center mb-12">Biežāk uzdotie jautājumi</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white border border-slate-100 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-2 text-sm">{q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 sm:px-10 bg-slate-950 border-t border-slate-800 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Gatavs sākt?</h2>
          <p className="text-slate-400 mb-8">Ievadiet adresi un saņemiet atskaiti dažu minūšu laikā.</p>
          <button
            onClick={onSearch}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-xl text-sm uppercase tracking-widest transition-colors cursor-pointer"
          >
            Meklēt īpašumu
          </button>
        </div>
      </section>

    </div>
  );
}
