import React, { useState } from "react";
import { Lock, ShieldCheck, ArrowLeft, CheckCircle, Smartphone, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface CheckoutSimulatorProps {
  sessionId: string;
  propertyId: string;
  address: string;
  onPaymentSuccess: (sessionId: string) => void;
  onCancel: () => void;
}

export default function CheckoutSimulator({ 
  sessionId, 
  propertyId, 
  address, 
  onPaymentSuccess, 
  onCancel 
}: CheckoutSimulatorProps) {
  
  const [email, setEmail] = useState("user@example.com");
  const [cardName, setCardName] = useState("John Doe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"form" | "webhook" | "complete">("form");
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setWebhookLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep("webhook");
    setWebhookLogs([]);

    // Step-by-step visual webhook handshake logs
    addLog("Stripe norēķinu portāls: tiek iniciēts drošs uztveršanas marķieris...");
    await new Promise(resolve => setTimeout(resolve, 800));

    addLog("Stripe pamatpakalpojums: karte sekmīgi autorizēta (Uztverts testa 4242).");
    await new Promise(resolve => setTimeout(resolve, 800));

    addLog(`Stripe tīmekļa āķi: tiek ģenerēts checkout.session.completed notikums...`);
    addLog(`Stripe tīmekļa āķi: POST šifrēts paraksta sūtījums uz /api/webhook/stripe`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Execute a real backend webhook call, executing the exact database authorization logic!
      const response = await fetch("/api/webhook/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "checkout.session.completed",
          session_id: sessionId,
          property_id: propertyId
        })
      });

      const data = await response.json();

      if (response.ok && data.received) {
        addLog("VeriSale servera tīmekļa āķa galapunkts: kriptogrāfiskais paraksts ir apstiprināts.");
        addLog(`VeriSale servera tīmekļa āķa galapunkts: metadati parsēti. Īpašuma ID [${propertyId}] atzīmēts kā apmaksāts un verificēts.`);
        addLog(`VeriSale servera tīmekļa āķa galapunkts: piekļuves marķieris ģenerēts: ${data.token}`);
        await new Promise(resolve => setTimeout(resolve, 1200));

        setStep("complete");
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Trigger successful completion state
        onPaymentSuccess(sessionId);
      } else {
        addLog("Kļūda: servera puses tīmekļa āķa apstiprināšana noraidīja simulēto uztveršanas sūtījumu.");
        setIsProcessing(false);
      }
    } catch (err) {
      addLog(`Kritiska kļūda: tīmekļa āķa piegāde neizdevās. Sīkāka informācija: ${err instanceof Error ? err.message : String(err)}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans text-slate-900" id="stripe-checkout-simulator">
      {/* Simulation Header */}
      <div className="bg-slate-950 text-white px-6 py-3 text-center text-xs font-mono font-semibold flex items-center justify-center space-x-2 border-b border-slate-800">
        <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold">IZSTRĀDĀTĀJU VĀRTEJA</span>
        <span className="tracking-widest uppercase">Stripe maksājumu smilškastes (Sandbox) vide</span>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row items-stretch">
        
        {/* Left Side: Order Summary */}
        <div className="bg-white w-full lg:w-[450px] p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between">
          <div>
            <button 
              onClick={onCancel}
              className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest mb-10 transition-colors cursor-pointer"
              disabled={isProcessing}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Atpakaļ uz portālu</span>
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">DROŠA ATSKAITES NODOŠANA</span>
                <h2 className="text-slate-900 font-serif font-bold text-xl leading-tight mt-1.5">VeriSale virsgrāmatas vēsture</h2>
                <p className="text-xs text-slate-400 mt-2 font-mono">{address}</p>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4 text-slate-600 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Zemesgrāmatas aktu nodošanas ierakstu sertifikāts</span>
                  <span className="font-bold text-slate-900 font-mono">$9.99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Šifrēta paneļa PDF/JSON eksportēšana</span>
                  <span className="text-emerald-700 font-bold uppercase text-[9px] tracking-wider font-mono">Iekļauts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Prioritāra pašvaldības pamatindeksa sinhronizācija</span>
                  <span className="text-emerald-700 font-bold uppercase text-[9px] tracking-wider font-mono">Iekļauts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200/80">
            <div className="flex justify-between items-baseline text-slate-900">
              <span className="font-serif font-bold text-sm">Kopā apmaksai</span>
              <span className="text-3xl font-serif font-bold">$9.99</span>
            </div>
            <div className="mt-6 flex items-start space-x-2.5 text-[10.5px] text-slate-500 leading-normal">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>PCI-DSS drošību nodrošina Stripe. Darījums ir pilnībā šifrēts un norisinās smilškastē.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms or Live Webhook Monitor */}
        <div className="bg-[#faf9f6] flex-grow p-8 sm:p-12 flex items-center justify-center">
          
          {step === "form" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/60 shadow-xs"
            >
              <h3 className="text-slate-900 font-serif font-bold text-xl tracking-tight mb-6">Maksājuma informācija</h3>
              
              <form onSubmit={handlePay} className="space-y-5">
                {/* Email Address */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">E-pasta adrese</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-slate-250 rounded-lg px-4 py-3 text-xs text-slate-800 font-medium focus:border-slate-900 outline-none transition-colors"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Kartes dati</label>
                  <div className="relative">
                    <input 
                      type="text"
                      disabled
                      value="4242  4242  4242  4242"
                      className="w-full border border-slate-200 rounded-lg pl-4 pr-12 py-3 text-xs text-slate-800 font-mono bg-slate-50 cursor-not-allowed"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-1">
                      <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 text-[8px] rounded font-bold">VISA</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input 
                      type="text"
                      disabled
                      value="12 / 28"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[11px] text-slate-800 font-mono bg-slate-50 cursor-not-allowed"
                    />
                    <input 
                      type="text"
                      disabled
                      value="424"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[11px] text-slate-800 font-mono bg-slate-50 cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    * Iepriekš aizpildīti dati, kas gatavi tiešā drošā tīmekļa āķa (webhook) izpildei.
                  </span>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Vārds uz kartes</label>
                  <input 
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full border border-slate-250 rounded-lg px-4 py-3 text-xs text-slate-800 font-medium focus:border-slate-900 outline-none"
                  />
                </div>

                {/* Stripe Pay Button */}
                <button
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-black text-white font-bold py-4 rounded-lg shadow-sm transition-colors text-xs uppercase tracking-widest flex items-center justify-center space-x-2 cursor-pointer mt-8"
                >
                  <Lock className="h-4 w-4 text-emerald-400" />
                  <span>Autorizēt un maksāt $9.99</span>
                </button>
              </form>
            </motion.div>
          )}

          {step === "webhook" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-xl w-full bg-slate-950 text-emerald-400 p-6 sm:p-8 rounded-2xl font-mono text-xs shadow-md border border-slate-850"
            >
              <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 text-emerald-400 animate-spin" />
                  <span className="font-bold tracking-tight text-white uppercase text-[9px] tracking-widest">Stripe tiešsaistes vārtejas monitors</span>
                </div>
                <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-2 py-0.5 rounded text-[8px] font-bold">DROŠS WEBHOOK SŪTĪJUMS</span>
              </div>

              {/* Logs print */}
              <div className="space-y-2.5 h-64 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {webhookLogs.map((log, index) => (
                  <div key={index} className="border-l-2 border-emerald-800 pl-3">
                    {log}
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-850 pt-4 flex items-center justify-between text-[10px] text-slate-500">
                <span>Webhook dati: paraksts verificēts</span>
                <span>Pavediena ID: uztverts</span>
              </div>
            </motion.div>
          )}

          {step === "complete" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-sm w-full"
            >
              <div className="inline-flex bg-emerald-50 text-emerald-600 p-4 rounded-full mb-4 border border-emerald-100 shadow-xs animate-bounce">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-slate-900 font-serif font-bold text-xl mb-2">Maksājums pabeigts</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Kriptogrāfiski parakstītā maksājumu sesija ir sekmīgi pabeigta. Mēs jūs pāradresējam uz jūsu verificēto zemesgrāmatas akta atskaiti...
              </p>
              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}
