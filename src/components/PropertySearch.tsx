import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Building2,
  MapPin,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Lock,
  Check,
  TrendingUp,
  Users,
  FileText,
  Zap,
  Globe,
  Star,
  ChevronRight,
  Clock,
  Award,
  BarChart3,
  Home,
  ExternalLink,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { motion } from "motion/react";

interface PropertySearchProps {
  onSearch: (address: string) => void;
  isLoading: boolean;
}

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function PropertySearch({
  onSearch,
  isLoading,
}: PropertySearchProps) {
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
    { address: "Krišjāņa Valdemāra 5, Rīga", city: "Rīga", badge: "Centrs" },
  ];

  const stats = [
    { icon: Building2, value: 500000, label: "Darījumu ieraksti", suffix: "+" },
    { icon: MapPin, value: 120, label: "Aptvertās pilsētas", suffix: "+" },
    { icon: Users, value: 15000, label: "Aktīvi lietotāji", suffix: "+" },
    { icon: Star, value: 98, label: "Apmierinātība", suffix: "%" },
  ];

  const testimonials = [
    {
      name: "Māris K.",
      role: "Nekustamā īpašuma māklaris",
      text: "VeriSale man ietaupa stundām ilgu darbu pie darījumu vēstures izpētes. Viss, kas man vajadzīgs, ir pāris klikšķu attālumā.",
      rating: 5,
    },
    {
      name: "Ilze B.",
      role: "Privātpersona — pircēja",
      text: "Pirms mājas pirkšanas varēju uzzināt visu iepriekšējo darījumu vēsturi un pārliecināties, ka cena ir godīga. Ļoti noderīgi!",
      rating: 5,
    },
    {
      name: "Artūrs L.",
      role: "Investors",
      text: "Investēju nekustamajā īpašumā un regulāri izmantoju šo platformu, lai analizētu tirgus tendences un pieņemtu datos balstītus lēmumus.",
      rating: 5,
    },
  ];

  const howItWorks = [
    {
      icon: Search,
      step: "01",
      title: "Meklējiet adresi",
      desc: "Ievadiet jebkuru Latvijas nekustamā īpašuma adresi vai kadastra numuru.",
    },
    {
      icon: Lock,
      step: "02",
      title: "Atbloķējiet atskaiti",
      desc: "Veiciet vienreizēju maksājumu €9.99 un saņemiet tūlītēju piekļuvi pilnai darījumu vēsturei.",
    },
    {
      icon: FileText,
      step: "03",
      title: "Lejupielādējiet PDF",
      desc: "Iegūstiet pilnu atskaiti ar visiem darījumiem, cenām, kadastra datiem un tehniskajiem parametriem.",
    },
  ];

  const propertyTypes = [
    { icon: Home, label: "Dzīvokļi" },
    { icon: Building2, label: "Mājas" },
    { icon: Landmark, label: "Zemes gabali" },
    { icon: Building2, label: "Komerciālie" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Tūlītēja piekļuve",
      desc: "Pēc apmaksas atskaite ir pieejama uzreiz — nav jāgaida epastā.",
    },
    {
      icon: BarChart3,
      title: "Cenu analītika",
      desc: "Redziet visu darījumu cenu dinamiku vienuviet ar skaidru laika grafiku.",
    },
    {
      icon: Globe,
      title: "Visa Latvija",
      desc: "Dati no visiem Latvijas reģioniem, pilsētām un pagastiem, kas ir publiskajā reģistrā.",
    },
    {
      icon: ShieldCheck,
      title: "Oficiāli dati",
      desc: "Atskaites balstītas uz oficiālajiem zemesgrāmatu un kadastra reģistra datiem.",
    },
    {
      icon: Smartphone,
      title: "Pieejams jebkur",
      desc: "Mobilā versija — piekļūstiet atskaitēm no jebkuras ierīces, jebkurā vietā.",
    },
    {
      icon: CreditCard,
      title: "Droši maksājumi",
      desc: "Maksājumi tiek apstrādāti caur Stripe ar AES-256 šifrēšanu.",
    },
  ];

  return (
    <>
      {/* ═══ HERO SECTION ═══ */}
      <div
        className="flex-grow grid grid-cols-12 bg-white font-sans overflow-hidden"
        id="search-homepage"
      >
        {/* Left Main Section */}
        <section className="col-span-12 lg:col-span-7 p-6 sm:p-12 lg:p-16 flex flex-col justify-center border-r border-slate-100 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-white pointer-events-none" />
          <div className="absolute top-10 -left-20 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -right-10 w-72 h-72 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl mx-auto lg:mx-0 w-full relative z-10">
            {/* Live search counter */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-3.5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>
                <AnimatedCounter target={2874} /> meklējumi šodien
              </span>
            </motion.div>

            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
              <Award className="h-3.5 w-3.5" />
              <span>Sertificēti zemesgrāmatu ieraksti</span>
            </div>

            {/* High impact Editorial Serif Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif leading-[0.95] tracking-tight text-slate-900 mb-6">
              Katrs īpašums.
              <br />
              <span className="text-indigo-600 italic">Katra cena.</span>
              <br />
              Atšifrēts.
            </h1>

            <p className="text-slate-500 text-base sm:text-lg mb-10 leading-relaxed">
              Droša, nerediģēta piekļuve darījumu vēsturei un reģistrētajiem
              aktiem Latvijas nekustamā īpašuma tirgū.
            </p>

            {/* Property type quick filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {propertyTypes.map((pt) => (
                <span
                  key={pt.label}
                  className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <pt.icon className="w-3 h-3" />
                  {pt.label}
                </span>
              ))}
            </div>

            {/* Elegant Search Bar */}
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center mb-8 group"
            >
              <div className="absolute left-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-10">
                <Search className="h-6 w-6" />
              </div>

              <input
                type="text"
                id="property-address-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ievadiet īpašuma adresi vai kadastra numuru..."
                className="w-full pl-14 pr-[9.5rem] py-5.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm shadow-slate-200/50 text-sm sm:text-base"
                disabled={isLoading}
              />

              <div className="absolute right-3 z-10">
                <button
                  type="submit"
                  id="search-button"
                  disabled={isLoading || !query.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 disabled:bg-indigo-300 cursor-pointer text-xs uppercase tracking-wider active:scale-95"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-1.5">
                      <svg
                        className="animate-spin h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
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

            {/* Quick Core Sample Badges */}
            <div className="mb-6 text-left">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-3">
                Izmēģiniet ar populārām adresēm
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleProperties.map((prop, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSample(prop.address)}
                    className="bg-white hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-xl p-3.5 text-left transition-all duration-200 group flex flex-col justify-between shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5"
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

            {/* Coverage Stats indicator */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-sans border-t border-slate-100 pt-6 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Visa Latvija
              </span>
              <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
              <span>Oficiāli reģistra dati</span>
              <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
              <span>Droši norēķini</span>
            </div>
          </div>
        </section>

        {/* Right Column - 5 Columns with Preview + Stats */}
        <section className="col-span-12 lg:col-span-5 bg-slate-50/75 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center border-t lg:border-t-0 border-slate-100">
          <div className="w-full max-w-sm">
            {/* Live counter badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mb-6 bg-white/80 px-4 py-2 rounded-full border border-slate-200/60"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Reālā laika dati no zemesgrāmatas</span>
            </motion.div>

            {/* Preview Mockup Card */}
            <div className="bg-white rounded-[32px] shadow-xl border border-slate-200/40 overflow-hidden transition-shadow hover:shadow-2xl">
              <div className="p-8 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">
                    Atrasts darījumu ieraksts
                  </span>
                  <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    3 darījumi
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight mb-1">
                  Brīvības iela 1
                </h2>
                <p className="text-slate-400 text-xs">Rīga, Latvija</p>
              </div>

              <div className="px-8 py-5 bg-slate-50/80 border-y border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Pēdējo reizi pārdots par
                  </span>
                  <div className="relative">
                    <span className="text-base font-bold text-slate-800 filter blur-[5px] select-none">
                      €87,500
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-slate-900 text-white px-2.5 py-1.5 rounded-md text-[9px] font-bold tracking-widest flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" />
                        <span>BLOĶĒTS</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Akta nodošanas
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    3 reģistrēti
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/60 pt-3">
                  <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Cenu tendence
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +26%
                  </span>
                </div>
              </div>

              <div className="p-8">
                <button
                  type="button"
                  onClick={() => selectSample("Brīvības iela 1, Rīga")}
                  className="w-full py-4 bg-slate-950 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-[0.98] mb-4 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Atbloķēt atskaiti • €9.99</span>
                </button>

                <div className="flex items-center justify-center gap-4 opacity-50 grayscale text-[9px] font-mono tracking-widest text-slate-400">
                  <span>VISA</span>
                  <span>MASTERCARD</span>
                  <span>AMEX</span>
                  <span>STRIPE</span>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 flex items-center justify-center gap-6 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>AES-256 šifrēts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-500" />
                <span>24h piekļuve</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══ STATS BANNER ═══ */}
      <section className="bg-slate-950 border-t border-slate-800 py-12 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-3 text-indigo-400" />
              <div className="text-3xl sm:text-4xl font-serif font-bold text-white mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-slate-100 border-t border-slate-200 py-24 px-6 sm:px-10 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">
              Kā tas strādā
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Trīs vienkārši soļi
            </h2>
            <p className="text-slate-500 mt-4 text-base max-w-xl mx-auto">
              Iegūstiet pilnu īpašuma darījumu vēsturi mazāk nekā 2 minūtēs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, idx) => (
              <div
                key={item.step}
                className="relative bg-slate-50/80 rounded-3xl p-8 border border-slate-100/80 text-center group hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-sm font-bold font-mono shadow-lg">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-indigo-100 transition-colors">
                  <item.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="bg-white py-24 px-6 sm:px-10 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">
              Funkcijas
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Kāpēc izvēlēties VeriSale?
            </h2>
            <p className="text-slate-500 mt-4 text-base max-w-xl mx-auto">
              Mēs padarām nekustamā īpašuma datus caurskatāmus un viegli
              pieejamus ikvienam.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <feature.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CENAS ─────────────────────────────────────────────── */}
      <section
        id="cenas"
        className="bg-slate-100 border-t border-slate-200 py-24 px-6 sm:px-10 font-sans scroll-mt-16"
      >
        <div className="max-w-4xl mx-auto text-center mb-14">
          <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">
            Cenas
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Vienkārša, caurspīdīga cena
          </h2>
          <p className="text-slate-500 mt-4 text-base max-w-xl mx-auto">
            Nav abonementu. Nav slēpto maksu. Maksājiet tikai par to, ko
            faktiski izmantojat.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {[
            {
              name: "Parastais Pircējs",
              price: "9.00",
              period: "par atskaiti",
              description:
                "Ideāli, ja pērc vai pārdod sev vienu konkrētu īpašumu.",
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
              description:
                "Mākleriem, vērtētājiem un investoriem ikdienas darbam.",
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
              description:
                "Komandu pakete nekustamā īpašuma birojiem un uzņēmumiem.",
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
          ].map((plan) => (
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
                <h2
                  className={`font-serif font-bold text-xl mb-1 ${plan.highlighted ? "text-white" : "text-slate-900"}`}
                >
                  {plan.name}
                </h2>
                <p
                  className={`text-sm leading-relaxed ${plan.highlighted ? "text-slate-400" : "text-slate-500"}`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div
                  className={`flex items-baseline gap-1 ${plan.highlighted ? "text-white" : "text-slate-900"}`}
                >
                  <span className="text-4xl font-serif font-bold">
                    {plan.price}
                  </span>
                  <span
                    className={`text-base ${plan.highlighted ? "text-slate-300" : "text-slate-400"}`}
                  >
                    €
                  </span>
                  <span
                    className={`text-sm ml-1 ${plan.highlighted ? "text-slate-400" : "text-slate-400"}`}
                  >
                    / {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.highlighted
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span
                      className={`text-sm ${plan.highlighted ? "text-slate-300" : "text-slate-600"}`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
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

      {/* ── ATSKAITES PIEMĒRS ─────────────────────────────────── */}
      <section
        id="atskaites-piemers"
        className="bg-white py-24 px-6 sm:px-10 font-sans scroll-mt-16"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">
              Atskaites piemērs
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Ko iegūstat?
            </h2>
            <p className="text-slate-500 mt-4 text-base max-w-xl mx-auto">
              Pilna reālas atskaites priekšskatījums — tieši tāds, kādu
              saņemsiet pēc apmaksas.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Mock report header */}
            <div className="bg-slate-950 text-white p-8">
              <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest uppercase bg-white/10 border border-white/10 px-3 py-1.5 rounded-md w-max mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Reģistra kopija · Verificēts
              </div>
              <h3 className="text-2xl font-serif font-bold mb-1">
                Brīvības iela 64 - 12
              </h3>
              <p className="text-slate-400 text-sm">
                Rīga, Latvija · Kadastra nr.:{" "}
                <span className="text-emerald-400 font-mono">01000640001</span>
              </p>
            </div>
            {/* Mock data rows */}
            <div className="divide-y divide-slate-100">
              {[
                {
                  label: "Pēdējā darījuma summa",
                  value: "87 500 €",
                  blur: false,
                },
                { label: "Darījuma datums", value: "15.03.2023", blur: false },
                {
                  label: "Iepriekšējā darījuma summa",
                  value: "██████ €",
                  blur: true,
                },
                { label: "Darījumu skaits", value: "3 darījumi", blur: false },
                { label: "Ēkas platība", value: "54,2 m²", blur: false },
                { label: "Celšanas gads", value: "1967", blur: false },
                {
                  label: "Sienu materiāls",
                  value: "Ķieģeļu mūris",
                  blur: false,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center px-8 py-4 text-sm"
                >
                  <span className="text-slate-500 font-medium">
                    {row.label}
                  </span>
                  <span
                    className={`font-bold ${row.blur ? "blur-sm select-none text-slate-400" : "text-slate-900"}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Pilna atskaite pieejama pēc apmaksas
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                9,99 €
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-slate-100 border-t border-slate-200 py-24 px-6 sm:px-10 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">
              Atsauksmes
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
              Ko saka mūsu lietotāji
            </h2>
            <p className="text-slate-500 mt-4 text-base max-w-xl mx-auto">
              Tūkstošiem cilvēku jau izmanto VeriSale, lai pieņemtu pārdomātus
              lēmumus.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100/80 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAR MUMS ──────────────────────────────────────────── */}
      <section
        id="par-mums"
        className="bg-white py-24 px-6 sm:px-10 font-sans scroll-mt-16"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-3">
              Par Mums
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Latvijas nekustamā īpašuma datu pārredzamība
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-4">
              VeriSale nodrošina piekļuvi oficiālajai Latvijas nekustamā īpašuma
              darījumu vēsturei, ko apkopo no publiski pieejamiem reģistriem.
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              Mūsu mērķis ir padarīt īpašumu tirgus datus pieejamus ikvienam —
              pircējiem, pārdevējiem, investoriem un tirgus analītiķiem.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { num: "500K+", label: "Darījumu ieraksti" },
              { num: "100%", label: "Oficiālie dati" },
              { num: "9,99€", label: "Vienreizēja maksa" },
              { num: "24/7", label: "Tūlītēja piekļuve" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center"
              >
                <div className="text-3xl font-serif font-bold text-slate-900 mb-1">
                  {stat.num}
                </div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-t border-slate-800 py-24 px-6 sm:px-10 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              <Award className="w-3.5 h-3.5" />
              Sāciet tagad
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
              Gatavs uzzināt īpašuma vēsturi?
            </h2>
            <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto">
              Ievadiet adresi un saņemiet pilnu darījumu atskaiti dažu minūšu
              laikā. Tikai €9.99 par vienu īpašumu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() =>
                  document.getElementById("property-address-input")?.focus()
                }
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-xl text-sm uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-indigo-900/30 hover:shadow-indigo-800/40 active:scale-95"
              >
                Meklēt īpašumu
              </button>
              <a
                href="#cenas"
                className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Skatīt cenas
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Droši maksājumi
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-500" />
                Tūlītēja piegāde
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-emerald-500" />
                PDF izdruka
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
