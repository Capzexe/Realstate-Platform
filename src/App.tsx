import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PropertySearch from "./components/PropertySearch";
import PropertyTeaser from "./components/PropertyTeaser";
import PropertyReport from "./components/PropertyReport";
import CheckoutSimulator from "./components/CheckoutSimulator";
import { PropertyTeaser as TeaserType, PropertyReport as ReportType } from "./types";
import { AlertCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type PageState = "home" | "teaser" | "checkout" | "report";

export default function App() {
  const [page, setPage] = useState<PageState>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProperty, setCurrentProperty] = useState<TeaserType | null>(null);
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle real Stripe redirect: /?paid=true&session_id=cs_...&property_id=prop_...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get("paid");
    const urlSessionId = params.get("session_id");
    const urlPropertyId = params.get("property_id");
    if (paid !== "true" || !urlSessionId || !urlPropertyId) return;

    // Clean the URL immediately so refresh doesn't re-trigger
    window.history.replaceState({}, "", "/");

    setIsLoading(true);
    setError(null);
    fetch(`/api/get-report?session_id=${encodeURIComponent(urlSessionId)}&property_id=${encodeURIComponent(urlPropertyId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.report) {
          setActiveReport(data.report);
          setPage("report");
        } else {
          setError(data.error || "Neizdeva ielādēt atskaiti pēc maksājuma. Lūdzu, sazinieties ar atbalstu.");
        }
      })
      .catch(() => setError("Savienojuma kļūda ielādējot atskaiti pēc maksājuma."))
      .finally(() => setIsLoading(false));
  }, []);

  // Search Address handler
  const handleSearch = async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/search-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address_query: address }),
      });
      
      const data = await response.json();
      if (response.ok && data.found && data.property) {
        setSearchQuery(address);
        setCurrentProperty(data.property);
        setPage("teaser");
        setActiveReport(null); // Reset any old reports
      } else {
        setError(data.error || "Property address could not be verified in public databases. Please enter a valid street address.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reach municipal archives API. Please verify network access.");
    } finally {
      setIsLoading(false);
    }
  };

  // Secure checkout click handler
  const handleUnlockClick = async () => {
    if (!currentProperty) return;
    setIsUnlocking(true);
    setError(null);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property_id: currentProperty.id }),
      });
      
      const data = await response.json();
      if (response.ok && data.sessionId) {
        setSessionId(data.sessionId);
        setPage("checkout");
      } else {
        setError("Unable to initialize encrypted checkout session with Stripe gateway.");
      }
    } catch (err) {
      console.error(err);
      setError("Stripe API connection timed out.");
    } finally {
      setIsUnlocking(false);
    }
  };

  // Callback triggered after Stripe Simulator delivers webhook
  const handlePaymentSuccess = async (completedSessionId: string) => {
    if (!currentProperty) return;
    setIsLoading(true);
    setError(null);
    try {
      // Securely fetch full report. Backend checks if session is paid.
      // Price data is only sent in this response, preventing inspect-element leaks
      const response = await fetch(
        `/api/get-report?session_id=${completedSessionId}&property_id=${currentProperty.id}`
      );
      
      const data = await response.json();
      if (response.ok && data.success && data.report) {
        setActiveReport(data.report);
        setPage("report");
      } else {
        setError(data.error || "Deed download authorization failed. Webhook payment pending.");
        setPage("teaser");
      }
    } catch (err) {
      console.error(err);
      setError("Deed registry handshake error occurred during retrieval.");
      setPage("teaser");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    setPage("home");
    setCurrentProperty(null);
    setActiveReport(null);
    setSessionId(null);
    setError(null);
  };

  const handleCancelCheckout = () => {
    setPage("teaser");
    setSessionId(null);
  };

  // Render content based on active state
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      
      {page !== "checkout" && (
        <Navbar onGoHome={handleGoHome} sessionActive={page === "report"} />
      )}

      {/* Dismissible Error Notification Panel */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-rose-50 border-b border-rose-100 text-rose-800 py-3.5 px-4 sm:px-6 lg:px-8 text-center text-xs font-semibold flex items-center justify-center space-x-2 relative z-50 shadow-sm"
          >
            <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="ml-3 underline hover:text-rose-950 font-mono text-[10px] tracking-wide uppercase cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col">
        {page === "home" && (
          <PropertySearch onSearch={handleSearch} isLoading={isLoading} />
        )}

        {page === "teaser" && currentProperty && (
          <PropertyTeaser 
            property={currentProperty} 
            onUnlock={handleUnlockClick} 
            onGoBack={handleGoHome}
            isUnlocking={isUnlocking}
          />
        )}

        {page === "checkout" && sessionId && currentProperty && (
          <CheckoutSimulator 
            sessionId={sessionId}
            propertyId={currentProperty.id}
            address={currentProperty.address}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={handleCancelCheckout}
          />
        )}

        {page === "report" && activeReport && (
          <PropertyReport 
            report={activeReport} 
            onGoBack={handleGoHome} 
          />
        )}
      </main>

      {page !== "checkout" && <Footer />}
    </div>
  );
}
