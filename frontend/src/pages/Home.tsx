import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Wallet, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900 flex flex-col font-sans">
      <header className="px-6 lg:px-12 py-4 flex items-center justify-between border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="text-2xl font-black tracking-tight">
          AIKORA<span className="text-[#9e2a2b]">.</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#9e2a2b] text-white hover:bg-[#7d1f20] transition-colors shadow-sm"
          >
            Create account
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-6">
          PayPal + AI Hackathon Edition
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-900 leading-tight">
          One Global Family. <br />
          <span className="text-[#9e2a2b]">Autonomous Gifting & AI.</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-neutral-600 max-w-2xl">
          Voice-activated festive shopping, cross-border PayPal Shagun transfers, multi-currency family wallets, and smart cultural reminders.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3.5 rounded-2xl bg-[#9e2a2b] text-white font-bold text-sm flex items-center gap-2 hover:bg-[#7d1f20] shadow-lg transition-all"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3.5 rounded-2xl bg-white border border-neutral-300 text-neutral-800 font-bold text-sm hover:bg-neutral-50 transition-all"
          >
            Already have an account? Login
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full text-left">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
            <Sparkles className="w-6 h-6 text-[#9e2a2b] mb-3" />
            <h3 className="font-bold text-sm">Voice Agentic AI</h3>
            <p className="text-xs text-neutral-500 mt-1">Bol kar festive gifts search karein aur 1-click PayPal checkout karein.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
            <Wallet className="w-6 h-6 text-amber-600 mb-3" />
            <h3 className="font-bold text-sm">Digital Shagun & WhatsApp</h3>
            <p className="text-xs text-neutral-500 mt-1">Payment ke baad sundar festive envelope card direct WhatsApp par share karein.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
            <Globe className="w-6 h-6 text-emerald-600 mb-3" />
            <h3 className="font-bold text-sm">Multi-Currency NRI Support</h3>
            <p className="text-xs text-neutral-500 mt-1">USD, INR, AED, GBP aur EUR me live rate switching aur Neon DB ledger.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
