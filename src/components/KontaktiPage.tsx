import { useState } from "react";
import { Mail, MessageSquare, Clock } from "lucide-react";

export default function KontaktiPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would POST to an API endpoint
    setSent(true);
  };

  const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors";
  const labelCls = "text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2";

  return (
    <div className="flex-grow bg-white font-sans">

      {/* Hero */}
      <section className="border-b border-slate-100 py-24 px-6 sm:px-10 text-center bg-gradient-to-b from-indigo-50/30 to-white">
        <div className="max-w-2xl mx-auto">
          <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block mb-4">Kontakti</span>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Sazinieties<br />
            <span className="text-indigo-600 italic">ar mums</span>
          </h1>
          <p className="text-slate-500 text-base">
            Jautājumi par datiem, maksājumiem, tehniskām problēmām vai sadarbības iespējām — rakstiet mums.
          </p>
        </div>
      </section>

      {/* Info cards + form */}
      <section className="py-20 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact info */}
          <div className="space-y-5">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">E-pasts</h3>
              <a href="mailto:info@verisale.ai" className="text-indigo-600 text-sm hover:underline font-semibold">
                info@verisale.ai
              </a>
              <p className="text-slate-400 text-xs mt-1">Atbildam 1–2 darba dienu laikā</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Darba laiks</h3>
              <p className="text-slate-600 text-sm">Pirmdiena – Piektdiena</p>
              <p className="text-slate-400 text-xs mt-0.5">9:00 – 18:00 (EET)</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Biežāk uzdotie</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Atbildes uz visbiežāk uzdotajiem jautājumiem atradīsiet <span className="text-indigo-600 font-semibold">Cenas</span> sadaļā.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-emerald-600 text-2xl">✓</span>
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-2xl mb-3">Ziņojums nosūtīts!</h3>
                <p className="text-slate-500 text-sm max-w-xs">Atbildēsim uz jūsu e-pastu 1–2 darba dienu laikā.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-8 text-indigo-600 text-sm font-semibold hover:underline cursor-pointer"
                >
                  Nosūtīt vēl vienu ziņojumu
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 shadow-sm rounded-3xl p-8 sm:p-10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Vārds, Uzvārds</label>
                    <input
                      type="text"
                      required
                      placeholder="Jānis Bērziņš"
                      className={inputCls}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>E-pasts</label>
                    <input
                      type="email"
                      required
                      placeholder="janis@example.com"
                      className={inputCls}
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Temats</label>
                  <input
                    type="text"
                    required
                    placeholder="Jautājums par maksājumu"
                    className={inputCls}
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelCls}>Ziņojums</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Aprakstiet savu jautājumu vai problēmu..."
                    className={`${inputCls} resize-none`}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Nosūtīt ziņojumu
                </button>
                <p className="text-slate-400 text-xs text-center">
                  Vai rakstiet tieši: <a href="mailto:info@verisale.ai" className="text-indigo-600 hover:underline font-semibold">info@verisale.ai</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
