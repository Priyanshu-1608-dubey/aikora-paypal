import React, { useState, useEffect, useRef } from "react";
import { QrCode, Send, Landmark, Smartphone, History, Eye, EyeOff, X, Camera, Upload } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface Props {
  fmt: (usd: number) => string;
  onPay: (title: string, amountUSD: number) => void;
  onSeeTransactions: () => void;
}

type ModalType = "qr" | "anyone" | "bank" | "recharge" | null;

export default function QuickPayActions({ fmt, onPay, onSeeTransactions }: Props) {
  const [modal, setModal] = useState<ModalType>(null);
  const [showBal, setShowBal] = useState(false);
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState("15");
  const [camStatus, setCamStatus] = useState<string>("Starting camera...");
  const [scanned, setScanned] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const runningRef = useRef<boolean>(false);

  const actions = [
    { id: "qr" as const, label: "Scan any QR code", icon: QrCode },
    { id: "anyone" as const, label: "Pay anyone", icon: Send },
    { id: "bank" as const, label: "Bank transfer", icon: Landmark },
    { id: "recharge" as const, label: "Mobile recharge", icon: Smartphone },
  ];

  const handleDecoded = (text: string) => {
    let clean = text;
    if (text.startsWith("upi://pay")) {
      try {
        const u = new URL(text);
        const pa = u.searchParams.get("pa");
        const pn = u.searchParams.get("pn");
        const am = u.searchParams.get("am");
        clean = pn ? `${pn} (${pa})` : pa || text;
        if (am) setAmount(am);
      } catch {}
    }
    setTarget(clean);
    setScanned(true);
    setCamStatus("QR Scanned Successfully!");
  };

  useEffect(() => {
    if (modal !== "qr") return;
    setScanned(false);
    setCamStatus("Starting camera...");
    let cancelled = false;

    const timer = setTimeout(async () => {
      if (cancelled) return;
      try {
        const scanner = new Html5Qrcode("aikora-qr-reader", {
          verbose: false,
          experimentalFeatures: { useBarCodeDetectorIfSupported: true },
        });
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 20 },
          (decodedText) => {
            if (cancelled) return;
            handleDecoded(decodedText);
            if (runningRef.current) {
              runningRef.current = false;
              scanner.stop().catch(() => {});
            }
          },
          () => {}
        );
        if (!cancelled) {
          runningRef.current = true;
          setCamStatus("Hold QR steady in front of camera");
        } else {
          scanner.stop().catch(() => {});
        }
      } catch {
        if (!cancelled) setCamStatus("Camera blocked/busy — upload QR image or enter ID below");
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (scannerRef.current && runningRef.current) {
        runningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
      scannerRef.current = null;
    };
  }, [modal]);

  const handleQrFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const temp = new Html5Qrcode("aikora-qr-file-tmp", { verbose: false });
      const decoded = await temp.scanFile(file, false);
      handleDecoded(decoded);
      if (scannerRef.current && runningRef.current) {
        runningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
    } catch {
      setCamStatus("Could not read QR from this image. Try another image.");
    }
  };

  const closeModal = () => {
    if (scannerRef.current && runningRef.current) {
      runningRef.current = false;
      scannerRef.current.stop().catch(() => {});
    }
    setModal(null);
    setTarget("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Math.max(1, parseFloat(amount) || 10);
    const titles: Record<string, string> = {
      qr: `QR Pay: ${target || "Merchant"}`,
      anyone: `Pay ${target || "Friend"}`,
      bank: `Bank Transfer: ${target || "Account"}`,
      recharge: `Mobile Recharge: ${target || "9876543210"}`,
    };
    const title = modal ? titles[modal] : "Quick Pay";
    closeModal();
    onPay(title, num);
  };

  return (
    <div className="bg-gradient-to-br from-[#5c191b] via-[#7d2426] to-[#3f0e10] text-white rounded-3xl p-6 shadow-lg border border-amber-400/20">
      <div id="aikora-qr-file-tmp" className="hidden" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => setModal(a.id)}
              className="flex flex-col items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#9e2a2b] group-hover:bg-[#b53335] border border-amber-300/30 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-neutral-100 leading-tight max-w-[90px]">
                {a.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-3">
        <button
          onClick={() => setShowBal(!showBal)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold transition-colors"
        >
          <Landmark className="w-4 h-4 text-amber-300" />
          <div className="text-left">
            <div className="text-[10px] text-neutral-400">Bank balance</div>
            <div className="font-bold flex items-center gap-1.5">
              {showBal ? fmt(1450) : "Check"}
              {showBal ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </div>
          </div>
        </button>

        <button
          onClick={onSeeTransactions}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold transition-colors"
        >
          <History className="w-4 h-4 text-emerald-400" />
          <div className="text-left">
            <div className="text-[10px] text-neutral-400">Transactions</div>
            <div className="font-bold">See all</div>
          </div>
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 text-neutral-900">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black mb-1">
              {modal === "qr" && "Scan any QR code"}
              {modal === "anyone" && "Pay anyone"}
              {modal === "bank" && "Bank transfer"}
              {modal === "recharge" && "Mobile recharge"}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">Instant checkout powered by PayPal Sandbox</p>

            {modal === "qr" && (
              <div className="mb-4 space-y-2">
                <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 relative">
                  <div id="aikora-qr-reader" className="w-full min-h-[200px]" />
                  <div className={`px-3 py-2 text-[11px] font-semibold flex items-center justify-center gap-1.5 ${scanned ? "bg-emerald-600 text-white" : "bg-neutral-900 text-neutral-300"}`}>
                    <Camera className="w-3.5 h-3.5" />
                    <span>{camStatus}</span>
                  </div>
                </div>
                <label className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Or Upload QR Code Image</span>
                  <input type="file" accept="image/*" onChange={handleQrFile} className="hidden" />
                </label>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {modal === "qr" && "Scanned QR / Merchant ID"}
                  {modal === "anyone" && "Recipient Name, Phone or Email"}
                  {modal === "bank" && "Account Number / IFSC"}
                  {modal === "recharge" && "Mobile Number"}
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={
                    modal === "qr" ? "Auto-fills on scan or enter ID" :
                    modal === "anyone" ? "rohit@gmail.com" :
                    modal === "bank" ? "HDFC0001234 • 50100234..." :
                    "+91 98765 43210"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9e2a2b]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#9e2a2b]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#9e2a2b] hover:bg-[#7d1f20] text-white font-bold text-sm transition-colors shadow-md"
              >
                Proceed to PayPal ({fmt(parseFloat(amount) || 0)})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
