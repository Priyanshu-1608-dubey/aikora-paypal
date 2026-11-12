import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users, Brain, Wallet, Sparkles, HeartHandshake, LayoutDashboard,
  Mic, MicOff, Bell, ArrowRight, ShieldCheck, Send, Plus, Gift,
  MessageCircle, TrendingUp, X, LogOut
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { QUICK_PROMPTS, matchAiProducts, type AiProduct } from "../data/aiCatalog";
import QuickPayActions from "../components/QuickPayActions";

const RATES: Record<string, { symbol: string; rate: number; name: string }> = {
  USD: { symbol: "$", rate: 1.0, name: "USD ($)" },
  INR: { symbol: "₹", rate: 86.5, name: "INR (₹)" },
  AED: { symbol: "د.إ", rate: 3.67, name: "AED (د.إ)" },
  GBP: { symbol: "£", rate: 0.79, name: "GBP (£)" },
  EUR: { symbol: "€", rate: 0.92, name: "EUR (€)" },
};

interface Msg {
  sender: "user" | "ai";
  text: string;
  cards?: AiProduct[];
}

interface Shagun {
  recipient: string; amountUSD: number; occasion: string; note: string; txId: string; date: string;
}

export default function Dashboard() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const valid = ["overview", "family", "ai", "wallet", "celebrations", "seva"];
  const activeTab = (tab && valid.includes(tab) ? tab : "overview") as any;
  const goTab = (t: string) => navigate(t === "overview" ? "/dashboard" : `/dashboard/${t}`);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("aikora_user") || "{}"); } catch { return {}; }
  })();

  const [currency, setCurrency] = useState("USD");
  const [showAlert, setShowAlert] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { sender: "ai", text: "Namaste! Main Apnaa AI hoon. Niche diye options me se choose karein ya mic dabakar bolein!" }
  ]);
  const [payPalModal, setPayPalModal] = useState<{ title: string; amountUSD: number } | null>(null);
  const [shagunCard, setShagunCard] = useState<Shagun | null>(null);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const r = new SR();
      r.lang = "en-IN";
      r.onresult = (e: any) => { handleSend(e.results[0][0].transcript); setIsListening(false); };
      r.onerror = () => setIsListening(false);
      r.onend = () => setIsListening(false);
      recRef.current = r;
    }
  }, []);

  const toggleMic = () => {
    if (!recRef.current) return alert("Use Google Chrome for Voice Search.");
    if (isListening) { recRef.current.stop(); setIsListening(false); }
    else { setIsListening(true); recRef.current.start(); }
  };

  const fmt = (usd: number) => {
    const c = RATES[currency] || RATES.USD;
    return `${c.symbol}${(usd * c.rate).toFixed(c.symbol === "₹" ? 0 : 2)}`;
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const next: Msg[] = [...messages, { sender: "user", text }];
    setMessages(next);
    setChatInput("");
    setTimeout(() => {
      const res = matchAiProducts(text);
      setMessages([...next, { sender: "ai", text: res.reply, cards: res.items }]);
    }, 300);
  };

  const onPaySuccess = (details: any, title: string, amountUSD: number) => {
    setPayPalModal(null);
    setShagunCard({
      recipient: user?.name || "Family Circle",
      amountUSD,
      occasion: title,
      note: "May this festival bring abundance, health, and joy to our family!",
      txId: details?.id || `PAYID-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
  };

  const shareWhatsApp = (s: Shagun) => {
    const msg = encodeURIComponent(
      `🪔 *AIKORA Digital Shagun!* 🪔\nSent *${fmt(s.amountUSD)}* for *${s.occasion}* via PayPal!\nTX: ${s.txId}\n"${s.note}"`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  const logout = () => { localStorage.removeItem("aikora_user"); navigate("/login"); };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "family", label: "Family Circle", icon: Users },
    { id: "ai", label: "Apnaa AI (Voice)", icon: Brain },
    { id: "wallet", label: "UtsavPay & Wallet", icon: Wallet },
    { id: "celebrations", label: "Celebrations", icon: Sparkles },
    { id: "seva", label: "SevaConnect", icon: HeartHandshake },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-xl">
          AIKORA<span className="text-[#9e2a2b]">.</span>
          <span className="hidden md:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">PayPal + AI</span>
        </div>
        <div className="flex items-center gap-2.5">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-neutral-100 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-pointer">
            {Object.keys(RATES).map((c) => <option key={c} value={c}>{RATES[c].name}</option>)}
          </select>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /><span>{user?.name || "Connected"}</span>
          </div>
          <button onClick={logout} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 text-xs font-semibold border border-neutral-200">
            <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-4 flex md:flex-col gap-1.5 overflow-x-auto">
          {navItems.map((it) => {
            const Icon = it.icon;
            const active = activeTab === it.id;
            return (
              <button key={it.id} onClick={() => goTab(it.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm whitespace-nowrap text-left transition-all ${active ? "bg-rose-50 text-rose-700 font-semibold shadow-sm" : "text-neutral-600 hover:bg-neutral-100"}`}>
                <Icon className={`w-4 h-4 ${active ? "text-rose-600" : "text-neutral-400"}`} />
                <span>{it.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 p-4 lg:p-8 max-w-6xl">
          {showAlert && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-white"><Bell className="w-5 h-5" /></div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">Autonomous AI Alert</span>
                  <h4 className="font-bold text-sm mt-1">Diwali in 4 days! Recommend sending {fmt(21)} Shagun to Family Circle</h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPayPalModal({ title: "Diwali Shagun", amountUSD: 21 })} className="px-4 py-2 rounded-xl bg-[#9e2a2b] text-white font-semibold text-xs flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> Approve & Pay ({fmt(21)})
                </button>
                <button onClick={() => setShowAlert(false)} className="p-1.5 text-neutral-400 hover:text-neutral-700"><X className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black">Family Command Center</h1>
              <QuickPayActions fmt={fmt} onPay={(title, amountUSD) => setPayPalModal({ title, amountUSD })} onSeeTransactions={() => goTab("wallet")} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                  <div className="text-xs font-semibold text-neutral-400 uppercase">Family Balance</div>
                  <div className="text-2xl font-black mt-1">{fmt(1450)}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% festive growth</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                  <div className="text-xs font-semibold text-neutral-400 uppercase">Connected Relatives</div>
                  <div className="text-2xl font-black mt-1">8 Members</div>
                  <div className="text-xs text-neutral-500 mt-1">USA, India, UAE, UK</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                  <div className="text-xs font-semibold text-neutral-400 uppercase">Seva Impact</div>
                  <div className="text-2xl font-black mt-1">{fmt(240)}</div>
                  <div className="text-xs text-neutral-500 mt-1">Meals & tree planting</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-900 text-white p-6 rounded-3xl">
                  <h3 className="text-lg font-black">Voice Shopping with Apnaa AI</h3>
                  <p className="text-xs text-neutral-300 mt-1">Say: "Diwali ke liye sweet box dikhao under $25"</p>
                  <button onClick={() => goTab("ai")} className="mt-4 px-4 py-2 rounded-xl bg-white text-neutral-900 font-bold text-xs flex items-center gap-2">
                    <Mic className="w-4 h-4 text-rose-600" /> Open Voice Assistant
                  </button>
                </div>
                <div className="bg-white border border-neutral-200 p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Send Digital Shagun</h3>
                    <p className="text-xs text-neutral-500 mt-1">Instant PayPal transfer + WhatsApp festive card.</p>
                  </div>
                  <button onClick={() => setPayPalModal({ title: "Auspicious Festive Shagun", amountUSD: 51 })} className="mt-4 px-4 py-2 rounded-xl bg-[#9e2a2b] text-white font-bold text-xs flex items-center justify-between">
                    <span>Send {fmt(51)} Shagun</span><ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="bg-white rounded-3xl border border-neutral-200 flex flex-col h-[620px] overflow-hidden">
              <div className="p-4 border-b border-neutral-200 bg-neutral-50 font-bold text-sm flex items-center gap-2">
                <Brain className="w-5 h-5 text-rose-600" /> Apnaa AI — Voice Agentic Commerce
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-md px-4 py-2.5 rounded-2xl text-sm ${m.sender === "user" ? "bg-rose-600 text-white" : "bg-neutral-100 text-neutral-800"}`}>{m.text}</div>
                    {m.cards && m.cards.length > 0 && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                        {m.cards.map((card, idx) => (
                          <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-md flex flex-col justify-between">
                            <div>
                              <img src={card.image} alt={card.title} className="w-full h-28 object-cover rounded-xl mb-2" />
                              <div className="flex justify-between gap-2 font-bold text-xs"><span>{card.title}</span><span className="text-rose-600 whitespace-nowrap">{fmt(card.priceUSD)}</span></div>
                              <p className="text-[11px] text-neutral-500 my-1.5">{card.desc}</p>
                            </div>
                            <button onClick={() => setPayPalModal({ title: card.title, amountUSD: card.priceUSD })} className="w-full py-2 rounded-xl bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs mt-1">
                              Buy with PayPal ({fmt(card.priceUSD)})
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-3 pt-2 pb-1 border-t border-neutral-200 flex gap-1.5 overflow-x-auto bg-neutral-50">
                {QUICK_PROMPTS.map((qp) => (
                  <button key={qp} onClick={() => handleSend(qp)} className="px-2.5 py-1 rounded-full bg-white border border-neutral-300 hover:border-rose-400 hover:text-rose-700 text-[11px] font-semibold whitespace-nowrap transition-colors">
                    {qp}
                  </button>
                ))}
              </div>
              <div className="p-3 flex items-center gap-2">
                <button onClick={toggleMic} className={`p-3 rounded-xl ${isListening ? "bg-rose-600 text-white animate-pulse" : "bg-neutral-100 text-neutral-700"}`}>
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend(chatInput)}
                  placeholder={isListening ? "Listening..." : "Type or speak: 'Diwali sweet box under $25'..."}
                  className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none" />
                <button onClick={() => handleSend(chatInput)} className="p-3 rounded-xl bg-neutral-900 text-white"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {activeTab === "family" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Family Circle</h2>
                <button onClick={() => alert("Invite link copied!")} className="px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Member</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Priyanshu Dubey", rel: "Admin • Nagpur, India" },
                  { name: "Anita Sharma", rel: "Mother • Delhi, India" },
                  { name: "Rajesh Dubey", rel: "Father • Nagpur, India" },
                  { name: "Rohit Dubey", rel: "Brother (NRI) • San Francisco, USA" },
                ].map((f, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center justify-between">
                    <div><div className="font-bold text-sm">{f.name}</div><div className="text-xs text-neutral-500">{f.rel}</div></div>
                    <button onClick={() => setPayPalModal({ title: `Shagun to ${f.name}`, amountUSD: 25 })} className="px-3 py-1.5 rounded-lg bg-neutral-100 text-xs font-bold">Send {fmt(25)}</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="space-y-4">
              <div className="bg-neutral-900 text-white p-6 rounded-3xl">
                <div className="text-xs text-neutral-400 uppercase">UtsavPay Reserve</div>
                <div className="text-3xl font-black mt-1">{fmt(1450)}</div>
                <button onClick={() => setPayPalModal({ title: "Add Funds to UtsavPay", amountUSD: 50 })} className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs">
                  + Add {fmt(50)} via PayPal
                </button>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 space-y-2">
                <h3 className="font-bold text-sm mb-2">Recent Transactions</h3>
                {[
                  { t: "Diwali Shagun to Rohit", a: -21, s: "Verified on PayPal" },
                  { t: "Haldiram Sweet Box", a: -22, s: "Delivered" },
                  { t: "Family Pool Deposit", a: 200, s: "Completed" },
                ].map((tx, i) => (
                  <div key={i} className="flex justify-between p-3 rounded-xl bg-neutral-50 text-xs">
                    <div><div className="font-bold">{tx.t}</div><div className="text-neutral-500">{tx.s}</div></div>
                    <div className={`font-bold ${tx.a > 0 ? "text-emerald-600" : ""}`}>{tx.a > 0 ? `+${fmt(tx.a)}` : `-${fmt(Math.abs(tx.a))}`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "celebrations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Diwali & Bhai Dooj", date: "In 4 Days", amt: 21, img: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80" },
                { title: "New Year Gathering", date: "In 50 Days", amt: 50, img: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=600&q=80" },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold text-sm">{c.title}</h4>
                    <div className="text-xs text-rose-600 font-semibold">{c.date}</div>
                    <button onClick={() => setPayPalModal({ title: c.title, amountUSD: c.amt })} className="mt-3 w-full py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs">
                      Send {fmt(c.amt)} Gift
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "seva" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Annadanam (Mid-Day Meals)", min: 5 },
                { title: "Vriksharopan (Trees)", min: 10 },
                { title: "Beti Shiksha (Education)", min: 15 },
              ].map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col justify-between">
                  <div>
                    <HeartHandshake className="w-6 h-6 text-emerald-600 mb-2" />
                    <h4 className="font-bold text-sm">{s.title}</h4>
                  </div>
                  <button onClick={() => setPayPalModal({ title: `Seva: ${s.title}`, amountUSD: s.min })} className="mt-4 w-full py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs">
                    Donate {fmt(s.min)}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {payPalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
            <button onClick={() => setPayPalModal(null)} className="absolute top-4 right-4 text-neutral-400"><X className="w-5 h-5" /></button>
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">PayPal Sandbox</span>
              <h3 className="text-lg font-black mt-2">{payPalModal.title}</h3>
              <div className="text-2xl font-black mt-1">{fmt(payPalModal.amountUSD)}</div>
            </div>
            <PayPalScriptProvider options={{ clientId: "sb", currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect", borderRadius: 12 }}
                createOrder={(_d, actions) => actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [{ amount: { currency_code: "USD", value: payPalModal.amountUSD.toFixed(2) }, description: payPalModal.title }]
                })}
                onApprove={async (_d, actions) => {
                  if (actions.order) onPaySuccess(await actions.order.capture(), payPalModal.title, payPalModal.amountUSD);
                }}
                onError={() => onPaySuccess({ id: "SIM-" + Date.now() }, payPalModal.title, payPalModal.amountUSD)}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      )}

      {shagunCard && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-rose-900 to-neutral-950 text-white rounded-3xl max-w-sm w-full p-6 border-2 border-amber-400 text-center">
            <div className="text-xs font-bold text-amber-300 mb-2">शुभ शगुन • Digital Shagun Card</div>
            <div className="text-3xl my-2">🪔</div>
            <h3 className="text-xl font-black text-amber-200">{shagunCard.occasion}</h3>
            <div className="text-3xl font-black my-3">{fmt(shagunCard.amountUSD)}</div>
            <p className="text-xs text-rose-100 italic mb-3">"{shagunCard.note}"</p>
            <div className="text-[11px] text-neutral-300 mb-4">TX: {shagunCard.txId} • {shagunCard.date}</div>
            <button onClick={() => shareWhatsApp(shagunCard)} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4" /> Share on WhatsApp
            </button>
            <button onClick={() => setShagunCard(null)} className="w-full py-2 rounded-xl bg-white/10 text-xs font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
