import React, { useState } from 'react';
import { X, Smartphone, QrCode, Check, Copy, Wifi, ExternalLink, ShieldCheck } from 'lucide-react';

interface PhoneConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneConnectModal: React.FC<PhoneConnectModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const localUrl = "http://192.168.0.195:5173/";

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(localUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(localUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-bold shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                Redmi Note 13 Setup
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                  MIUI 14 / Android 13
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan & practice directly on your smartphone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-center">
          {/* QR Code Container */}
          <div className="inline-block p-4 rounded-3xl bg-white shadow-lg border border-slate-200 mx-auto">
            <img
              src={qrImageUrl}
              alt="Scan to open on Redmi Note 13"
              className="w-48 h-48 rounded-xl mx-auto"
            />
          </div>

          {/* Wi-Fi Info */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>Connect your <strong>Redmi Note 13</strong> to the same Wi-Fi</span>
          </div>

          {/* Direct URL copy bar */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="flex-1 font-mono font-bold text-slate-800 dark:text-slate-200 truncate select-all">
              {localUrl}
            </span>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-bold border border-slate-200 dark:border-slate-600 shadow-sm transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Step-by-Step Instructions tailored for Redmi Note 13 */}
          <div className="text-left bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              How to install on Redmi Note 13 (MIUI 14):
            </div>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal list-inside leading-relaxed">
              <li>Open your <strong>Camera</strong> or <strong>Mi Scanner</strong> on your phone and scan the QR code above.</li>
              <li>Tap to open the link in <strong>Chrome</strong>.</li>
              <li>When prompted, tap <strong>"Allow"</strong> for microphone permissions.</li>
              <li>Tap Chrome's 3 dots (<span className="font-mono font-bold">⋮</span>) at the top right, and select <strong>"Add to Home screen"</strong> (Установить на главный экран).</li>
              <li>It will launch full-screen as a native Android app without any browser URL bars!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
          >
            Got it, Let's Practice!
          </button>
        </div>
      </div>
    </div>
  );
};
