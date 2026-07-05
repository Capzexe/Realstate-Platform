import React, { useState } from "react";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Lock,
  Building2,
  Activity,
  Layers3,
  Clock3,
  FileText,
  Mail,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

interface PropertySearchProps {
  onSearch: (address: string) => void;
  isLoading: boolean;
}

export default function PropertySearch({ onSearch, isLoading }: PropertySearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const selectSample = (sampleAddress: string) => {
    setQuery(sampleAddress);
    onSearch(sampleAddress);
  };

  const sampleProperties = [
    { address: "Brīvības iela 1, Rīga", city: "Rīga", badge: "Rīgas centrs" },
    { address: "Krišjāņa Valdemāra iela 5, Rīga", city: "Rīga", badge: "Centrs" },
    { address: "Jomas iela 12, Jūrmala", city: "Jūrmala", badge: "Pie jūras" },
  ];

  const pricingPlans = [
    {
      name: "Parastais Pircējs",
      price: "9.00 €",
      period: "par vienu PDF atskaiti",
      description: "Vienreizēja tirgus atskaite vienam īpašumam ar darījumu vēsturi un tehniskajiem datiem.",
      cta: "Pirkt atskaiti",
      highlighted: false,
      features: [
        "Pilna darījumu vēsture",
        "Ēkas tehniskie dati",
        "Kadastra informācija",
        "Lejupielādējams PDF",
      ],
    },
    {
      name: "Profesionālis",
      price: "49.99 €",
      period: "mēnesī",
      description: "Neierobežota meklēšana un kartes profesionāļiem, kas ikdienā strādā ar tirgu.",
      cta: "Sākt abonementu",
      highlighted: true,
      features: [
        "Neierobežota meklēšana",
        "Interaktīva karte",
        "Filtri pēc sērijām un gadiem",
        "Neierobežotas atskaites",
      ],
    },
    {
      name: "Aģentūrām",
      price: "No 149.00 €",
      period: "mēnesī",
      description: "Komandas konti, pielāgots zīmols un centralizēta piekļuve birojiem.",
      cta: "Pieteikt demonstrāciju",
      highlighted: false,
      features: [
        "Komandas konti",
        "Pielāgots zīmols",
        "Lomas un piekļuves",
        "Vadītāja pārskati",
      ],
    },
  ];

  const benefitCards = [
    {
      icon: <Clock3 className="h-5 w-5" />,
      title: "Ātrums, kas jūtams uzreiz",
      text: "Meklēšana ir veidota lielam datu apjomam, lai rezultātu varētu saņemt dažu sekunžu laikā.",
    },
    {
      icon: <Layers3 className="h-5 w-5" />,
      title: "Darījumi + tehniskie dati vienuviet",
      text: "Vēsturiskās cenas, būvniecības gads, materiāli, stāvi un kadastra dati vienā skatā.",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Tirgus signāli, ko var izmantot",
      text: "Saprotiet cenu dinamiku, īpašuma struktūru un darījumu intensitāti konkrētā adresē.",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Veidots Latvijai",
      text: "Datu modelis ir pielāgots Latvijas īpašumu reģistriem, adresācijai un tehniskajai klasifikācijai.",
    },
  ];

  return (
    <div className="flex-grow bg-white font-sans text-slate-900" id="search-homepage">
      <section className="grid grid-cols-12 min-h-[calc(100vh-4rem)] border-b border-slate-100">
        <div className="col-span-12 lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto lg:mx-0 w-full relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>1.5 miljoni ierakstu no oficiāliem avotiem</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif leading-[0.95] tracking-tight mb-6">
              Latvijas īpašumu vēsture
              <br />
              <span className="text-indigo-600 italic">dažu sekunžu laikā</span>
            </h1>

            <p className="text-slate-500 text-base sm:text-lg mb-10 leading-relaxed max-w-xl">
              Atrodiet vēsturiskās pārdošanas cenas, ēkas tehniskos datus un kadastra informāciju vienā ātrā meklēšanā.
            </p>

            <form onSubmit={handleSubmit} className="relative flex items-center mb-8 group">
              <div className="absolute left-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Search className="h-6 w-6" />
              </div>

              <input
                type="text"
                id="property-address-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ievadiet adresi, kadastra numuru vai novadu"
                className="w-full pl-14 pr-[8.5rem] py-5.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap"
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
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
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

            <div className="mb-10 text-left">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4">
                Ātrie piemēri
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
                    <p className="text-[10px] text-slate-400">{prop.city}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-sans border-t border-slate-100 pt-6 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Latvija
              </span>
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              <span>Oficiāli reģistra dati</span>
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              <span>Droši norēķini</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-slate-50/80 p-6 sm:p-12 lg:p-16 flex items-center justify-center border-t lg:border-t-0 border-slate-100">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200/50 overflow-hidden">
              <div className="p-8 pb-5">
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 font-mono">
                  Interaktīva karte
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight mb-1">
                  Tirgus signāli reāllaikā
                </h2>
                <p className="text-slate-400 text-xs">Rajoni, apkaimes un atsevišķi īpašumi vienā skatā.</p>
              </div>

              <div className="px-8 py-6 bg-gradient-to-br from-slate-950 to-slate-900 text-white">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-mono mb-2">Pēdējā cena</p>
                    <p className="text-2xl font-serif font-bold">87 500 €</p>
                    <p className="text-[10px] text-slate-400 mt-1">Brīvības iela 64</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-mono mb-2">Darījumi</p>
                    <p className="text-2xl font-serif font-bold">3</p>
                    <p className="text-[10px] text-slate-400 mt-1">vēsturiskie ieraksti</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-200">
                      Tehniskie dati piesaistīti darījumiem: būvniecības gads, materiāli, platība un sērija.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <button
                  type="button"
                  onClick={() => selectSample("Brīvības iela 1, Rīga")}
                  className="w-full py-4 bg-slate-950 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-[0.98] mb-4 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Atbloķēt atskaiti · 9.00 €</span>
                </button>

                <div className="flex items-center justify-center gap-4 opacity-50 grayscale text-[9px] font-mono tracking-widest text-slate-400">
                  <span>VISA</span>
                  <span>MASTERCARD</span>
                  <span>AMEX</span>
                  <span>STRIPE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 py-14 px-6 sm:px-10 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            { value: "1.5M+", label: "ierakstu" },
            { value: "100%", label: "oficiāli dati" },
            { value: "5 sek.", label: "vidējais meklēšanas laiks" },
            { value: "24/7", label: "tūlītēja piekļuve" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <div className="text-3xl font-serif font-bold text-slate-900">{stat.value}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 sm:px-10 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">Kā tas darbojas</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">No adreses līdz atskaitei 3 soļos</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Ātrs, vienkāršs process, kas palīdz no datiem nonākt līdz skaidram lēmumam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "1. Ievadiet adresi",
                text: "Meklējiet pēc adreses, kadastra numura vai novada.",
              },
              {
                title: "2. Pārskatiet atradumu",
                text: "Saņemiet kopsavilkumu par darījumiem un tehnisko informāciju.",
              },
              {
                title: "3. Atbloķējiet PDF",
                text: "Pēc apmaksas lejupielādējiet pilnu atskaiti vienā klikšķī.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <ChevronRight className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 sm:px-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">Kāpēc mēs</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">Ātrums, precizitāte un tehniskie dati vienā platformā</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Mēs savienojam darījumu vēsturi ar ēku tehnisko informāciju, lai jūs redzētu ne tikai cenu, bet arī kontekstu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefitCards.map((card) => (
              <div key={card.title} className="flex gap-4 bg-slate-50 rounded-3xl border border-slate-100 p-6">
                <div className="mt-1 w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cenas" className="py-24 px-6 sm:px-10 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">Cenas</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">Izvēlieties sev piemērotāko piekļuvi</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Vienreizēja atskaite pircējam, neierobežota piekļuve profesionāļiem un komandas risinājums aģentūrām.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-8 flex flex-col shadow-sm ${
                  plan.highlighted
                    ? "bg-slate-950 border-slate-800 text-white scale-[1.02]"
                    : "bg-white border-slate-200/80"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow">
                      Populārākais
                    </span>
                  </div>
                )}

                <h3 className={`font-serif font-bold text-2xl mb-2 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 ${plan.highlighted ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className={`text-4xl font-serif font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                    {plan.price}
                  </div>
                  <div className={`text-sm mt-1 ${plan.highlighted ? "text-slate-400" : "text-slate-400"}`}>
                    {plan.period}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.highlighted ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                      </span>
                      <span className={`text-sm ${plan.highlighted ? "text-slate-300" : "text-slate-600"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    if (query.trim()) {
                      onSearch(query.trim());
                      return;
                    }
                    document.getElementById("property-address-input")?.focus();
                    document.getElementById("search-homepage")?.scrollIntoView({ behavior: "smooth" });
                  }}
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
        </div>
      </section>

      <section id="par-mums" className="py-24 px-6 sm:px-10 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div>
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">Par mums</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight mb-6">Latvijas nekustamā īpašuma datu pārredzamība</h2>
            <p className="text-slate-500 text-base leading-relaxed mb-4">
              Mūsu mērķis ir padarīt īpašumu tirgus datus pieejamus pircējiem, pārdevējiem, aģentiem un analītiķiem.
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              Mēs apvienojam oficiālus darījumu datus ar ēku tehnisko informāciju, lai lēmumi būtu ātrāki un pamatotāki.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "500K+", label: "darījumu ieraksti" },
              { num: "100%", label: "oficiālie dati" },
              { num: "24/7", label: "tūlītēja piekļuve" },
              { num: "9.00 €", label: "sākuma cena" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-100 text-center shadow-sm">
                <div className="text-3xl font-serif font-bold text-slate-900 mb-1">{stat.num}</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white py-16 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Sāciet ar adresi</h2>
            <p className="text-slate-400 max-w-2xl">
              Atrodiet īpašuma vēsturi, tehniskos datus un tirgus signālus dažu sekunžu laikā.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => query.trim() && onSearch(query.trim())}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer"
            >
              Meklēt īpašumu
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("cenas")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer"
            >
              Skatīt cenas
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-10 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
          <p className="text-slate-500">VeriSale · Latvijas īpašumu datu platforma ātrai meklēšanai un analīzei.</p>
          <div className="flex items-center gap-5">
            <a href="#par-mums" className="text-slate-600 hover:text-slate-900 transition-colors">Par mums</a>
            <a href="#kontakti" className="text-slate-600 hover:text-slate-900 transition-colors">Kontakti</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
