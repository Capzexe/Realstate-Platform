import { PropertyReport as PropertyReportType } from "../types";
import { 
  CheckCircle, FileText, Download, ShieldCheck, 
  MapPin, Landmark, ArrowLeft, Calendar, 
  Layers, BadgeCheck, Users, HelpCircle, 
  TrendingUp, Activity, DollarSign 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from "recharts";
import { motion } from "motion/react";

interface PropertyReportProps {
  report: PropertyReportType;
  onGoBack: () => void;
}

export default function PropertyReport({ report, onGoBack }: PropertyReportProps) {
  
  // Format history for the Recharts trend chart
  // Filter only 'Sale' events and sort chronologically
  const chartData = [...report.history]
    .filter(item => item.type === 'Sale')
    .map(item => ({
      date: new Date(item.date).getFullYear(),
      "Darījuma vērtība": item.price,
    }))
    .sort((a, b) => a.date - b.date);

  // Add the current estimated value to the chart trend
  if (chartData.length > 0) {
    chartData.push({
      date: 2026,
      "Darījuma vērtība": report.estimatedValue
    });
  }

  // Tax history formatting for Recharts
  const taxChartData = [...report.taxHistory]
    .map(item => ({
      Gads: item.year,
      "Novērtētā vērtība": item.totalValue,
      "Nodokļa summa": item.taxAmount
    }))
    .sort((a, b) => a.Gads - b.Gads);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const translateType = (type: string) => {
    switch (type) {
      case 'Sale': return 'Pārdošana';
      case 'Tax Assessment': return 'Nodokļu novērtējums';
      case 'Foreclosure': return 'Atsavināšana';
      case 'Refinance': return 'Pārkreditācija';
      default: return type;
    }
  };

  const translatePropertyType = (type: string) => {
    switch (type) {
      case 'Single Family Residential':
      case 'Single Family Residence':
        return 'Vienģimenes dzīvojamā māja';
      case 'Modern Craftsmanship Home':
        return 'Moderna dizaina māja';
      case 'Historic Brick Townhouse':
        return 'Vēsturiska ķieģeļu rindu māja';
      default: return type;
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

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
            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase border border-emerald-150 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Atskaites apmaksa verificēta</span>
            </div>
            
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center space-x-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-4.5 py-2.5 rounded-lg text-xs uppercase tracking-widest shadow-xs transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-white" />
              <span>Lejupielādēt PDF atskaiti</span>
            </button>
          </div>
        </div>

        {/* Certificate Watermark Block */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-md mb-8 relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center justify-center p-8 pointer-events-none">
            <Landmark className="h-48 w-48" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-[9px] font-mono tracking-widest uppercase bg-white/10 border border-white/5 px-3.5 py-1.5 rounded-md w-max mb-6">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Oficiālā reģistra kopija Nr. {report.id.substring(0, 8).toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2">
                <span className="text-[10px] text-indigo-300 block font-mono uppercase tracking-widest">ADRESE</span>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mt-1">{report.address}</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-2">
                  {report.city === "New York" ? "Ņujorka" : report.city === "Los Angeles" ? "Losandželosa" : report.city === "Chicago" ? "Čikāga" : report.city}, {report.state} {report.zip} — Verificēts ieraksta ID: <span className="font-mono text-emerald-400 font-bold">{report.id}</span>
                </p>
              </div>
              <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/5 text-left md:text-right">
                <span className="text-[9px] text-indigo-300 block font-mono uppercase tracking-widest">PĒDĒJĀ DARĪJUMA SUMMA</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold block text-emerald-400 mt-1">{formatCurrency(report.price)}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Reģistrētais īpašnieks: {report.ownerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid - Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Main Info Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs md:col-span-2">
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-6 flex items-center space-x-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <span>Akta struktūras dati</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-150">
                <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider mb-1">Īpašuma veids</span>
                <span className="text-xs font-bold text-slate-800 block truncate">{translatePropertyType(report.propertyType)}</span>
              </div>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-150">
                <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider mb-1">Izkārtojuma dati</span>
                <span className="text-xs font-bold text-slate-800 block">{report.beds} guļam. / {report.baths} vannas</span>
              </div>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-150">
                <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider mb-1">Dzīvojamā platība</span>
                <span className="text-xs font-bold text-slate-800 block">{report.sqft.toLocaleString()} kv. pēdas</span>
              </div>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-150">
                <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider mb-1">Uzcelšanas gads</span>
                <span className="text-xs font-bold text-slate-800 block">{report.yearBuilt}</span>
              </div>
            </div>

            {/* Price Trend Chart using Recharts */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-base">Vēsturiskais novērtējums un pārdošanas rādītājs</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Verificēto aktu nodošanas cenu hronoloģija</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Pašreizējais vērtējums (AVM)</span>
                  <span className="text-sm font-bold text-indigo-600 block">{formatCurrency(report.estimatedValue)}</span>
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={9} 
                      tickLine={false}
                      tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`} 
                    />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Novērtētā vērtība']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="Darījuma vērtība" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="space-y-6">
            
            {/* Owner Record Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h3 className="font-serif font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
                <Users className="h-4.5 w-4.5 text-indigo-600" />
                <span>Sertificēts tiesību statuss</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">PAŠREIZĒJAIS AKTA TURĒTĀJS</span>
                  <p className="text-sm font-bold text-slate-800">{report.ownerName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">HIPOTĒKAS STATUSS</span>
                    <p className="text-xs font-bold text-emerald-600 mt-0.5">Jā (Aktīva)</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">APGRŪTINĀJUMI</span>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">Tīrs / Nav apgrūtināts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AVM appraisal index */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-900 shadow-xs relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-5">
                <TrendingUp className="h-20 w-20 text-white" />
              </div>
              <div className="relative z-10">
                <span className="text-[9px] font-mono text-indigo-300 uppercase tracking-widest block mb-1">
                  Vērtēšanas modelis (AVM)
                </span>
                <h4 className="font-serif font-bold text-2xl tracking-tight text-white">
                  {formatCurrency(report.estimatedValue)}
                </h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Pašvaldības vērtēšanas modelis aprēķina vērtības pieaugumu <strong className="text-emerald-400 font-bold">+{Math.round(((report.estimatedValue - report.price) / report.price) * 100)}%</strong> salīdzinājumā ar pēdējo reģistrēto akta nodošanas ierakstu.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Transaction History Deed Log */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-5">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                Sertificēta zemesgrāmatu aktu nodošanas virsgrāmata
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Visaptverošs hronoloģisks visu zemes darījumu un pārkreditāciju audits</p>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-md text-[9px] font-mono font-bold text-slate-600 uppercase tracking-wider">
              Kopējais ierakstu skaits: {report.history.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse" id="deed-records-table">
              <thead>
                <tr className="border-b border-slate-250 font-mono text-slate-400 uppercase text-[10px]">
                  <th className="pb-3">Datums</th>
                  <th className="pb-3">Notikuma veids</th>
                  <th className="pb-3">Pircējs / Saņēmējs</th>
                  <th className="pb-3">Pārdēvējs / Nodevējs</th>
                  <th className="pb-3">Dokumenta numurs</th>
                  <th className="pb-3 text-right">Darījuma summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {report.history.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 font-semibold font-mono text-slate-500">
                      {tx.date}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        tx.type === 'Sale' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        tx.type === 'Tax Assessment' ? 'bg-slate-100 text-slate-700' :
                        tx.type === 'Foreclosure' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-sky-50 text-sky-700 border border-sky-100'
                      }`}>
                        {translateType(tx.type)}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">
                      {tx.buyer || "—"}
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {tx.seller || "—"}
                    </td>
                    <td className="py-3.5 font-mono text-slate-400">
                      {tx.documentNumber}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-900">
                      {tx.price > 0 ? formatCurrency(tx.price) : <span className="text-slate-400 font-mono">Tikai novērtēts</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Appraisal & Assessments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Tax History Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base mb-4 flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-indigo-600" />
              <span>Pašvaldības nodokļu novērtēšanas žurnāls</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 font-mono text-slate-400 uppercase text-[9px] tracking-wider">
                    <th className="pb-2">Gads</th>
                    <th className="pb-2">Zeme</th>
                    <th className="pb-2">Ēka</th>
                    <th className="pb-2">Kopējais novērtējums</th>
                    <th className="pb-2 text-right">Samaksātais nodoklis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {report.taxHistory.map((tax, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-bold text-slate-850">{tax.year}</td>
                      <td className="py-2.5 text-slate-500">{formatCurrency(tax.landValue)}</td>
                      <td className="py-2.5 text-slate-500">{formatCurrency(tax.buildingValue)}</td>
                      <td className="py-2.5 font-bold text-slate-800">{formatCurrency(tax.totalValue)}</td>
                      <td className="py-2.5 text-right font-bold text-emerald-600">{formatCurrency(tax.taxAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax visual bar chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h4 className="font-serif font-bold text-slate-900 text-base mb-1">Vērtības novērtējumu hronoloģija</h4>
            <p className="text-[11px] text-slate-400 mb-4">Vēsturisko nekustamā īpašuma nodokļu novērtējumu vizuālais rādītājs</p>
            
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taxChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="Gads" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={9} 
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`} 
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value)]}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend fontSize={9} wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                  <Bar dataKey="Novērtētā vērtība" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Comparable Sales Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-serif font-bold text-slate-900 text-lg">
              Salīdzinošie darījumi apkaimē (COMPs)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Pēdējie verificētie aktu iesniegšanas rādītāji 0,75 jūdžu rādiusā</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="comparables-grid">
            {report.comparableSales.map((sale, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-serif font-bold text-slate-800 text-xs truncate max-w-[170px]">
                    {sale.address}
                  </h4>
                  <span className="text-[9px] font-mono bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-bold tracking-wider uppercase">
                    {sale.distanceMiles} jūdzes
                  </span>
                </div>
                
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">REĢISTRĒTĀ SUMMA</span>
                  <span className="text-base font-bold text-slate-950 font-serif">
                    {formatCurrency(sale.price)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 border-t border-slate-150 pt-3 text-center text-[10px] text-slate-500">
                  <div>
                    <span className="block font-mono text-slate-400 text-[8px] uppercase">DATUMS</span>
                    <span className="font-bold text-slate-700 block truncate mt-0.5">{sale.date}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-slate-400 text-[8px] uppercase">GUĻAM.</span>
                    <span className="font-bold text-slate-700 block mt-0.5">{sale.beds}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-slate-400 text-[8px] uppercase">VANNAS</span>
                    <span className="font-bold text-slate-700 block mt-0.5">{sale.baths}</span>
                  </div>
                  <div>
                    <span className="block font-mono text-slate-400 text-[8px] uppercase">PLATĪBA</span>
                    <span className="font-bold text-slate-700 block mt-0.5">{sale.sqft}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
