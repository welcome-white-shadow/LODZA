import React, { useState } from 'react';
import { LodzaLogo } from './LodzaLogo';
import {
  X,
  Smartphone,
  Download,
  Share2,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface AppDownloadModalProps {
  onClose: () => void;
  onOpenMobileSimulator?: () => void;
  onInstallPwa?: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  onClose,
  onOpenMobileSimulator,
  onInstallPwa
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [method, setMethod] = useState<'SMS' | 'WHATSAPP'>('WHATSAPP');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://lodza.in';

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    sound.playSuccess();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setPhoneNumber('');
    }, 4000);
  };

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  const handleTriggerApkDownload = () => {
    sound.playSuccess();
    setDownloadStarted(true);

    // Create a realistic simulated APK download blob with actual manifest
    const manifestBlob = new Blob(
      [
        JSON.stringify(
          {
            name: 'LODZA - Logistics & Goods Transport',
            short_name: 'LODZA',
            version: '2.4.1',
            build: '2026.10.08',
            package: 'in.lodza.logistics.customer',
            permissions: ['ACCESS_FINE_LOCATION', 'INTERNET', 'CAMERA', 'VIBRATE'],
            installer: 'LODZA Production Package Manager'
          },
          null,
          2
        )
      ],
      { type: 'application/vnd.android.package-archive' }
    );

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(manifestBlob);
    downloadLink.download = 'LODZA-Logistics-v2.4.1.apk';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => setDownloadStarted(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0B1F3A] to-[#155EEF] p-6 text-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#FF8A00] bg-black/30 px-2.5 py-0.5 rounded-full border border-orange-500/30">
              Official LODZA App
            </span>
            <span className="text-xs text-blue-200">v2.4.1 Production</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Download LODZA for Android & iOS
          </h2>
          <p className="text-xs text-blue-100 leading-relaxed">
            Experience 1-click truck and bike booking, live GPS delivery tracking, verified OTP security, and instant GST invoices right in your pocket.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: Scan QR or Direct Download APK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {/* Visual High-Res QR Code */}
            <div className="flex flex-col items-center text-center p-3 bg-white rounded-xl shadow-xs border border-slate-200">
              <div className="w-32 h-32 p-1.5 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                  <rect x="5" y="5" width="34" height="34" rx="4" fill="#0B1F3A" />
                  <rect x="11" y="11" width="22" height="22" fill="white" />
                  <rect x="16" y="16" width="12" height="12" fill="#0B1F3A" />

                  <rect x="61" y="5" width="34" height="34" rx="4" fill="#0B1F3A" />
                  <rect x="67" y="11" width="22" height="22" fill="white" />
                  <rect x="72" y="16" width="12" height="12" fill="#0B1F3A" />

                  <rect x="5" y="61" width="34" height="34" rx="4" fill="#0B1F3A" />
                  <rect x="11" y="67" width="22" height="22" fill="white" />
                  <rect x="16" y="72" width="12" height="12" fill="#0B1F3A" />

                  <rect x="44" y="8" width="10" height="10" fill="#155EEF" />
                  <rect x="44" y="24" width="10" height="10" fill="#0B1F3A" />
                  <rect x="8" y="44" width="10" height="10" fill="#FF8A00" />
                  <rect x="24" y="44" width="10" height="10" fill="#0B1F3A" />
                  <rect x="44" y="44" width="12" height="12" fill="#155EEF" rx="2" />
                  <rect x="64" y="44" width="10" height="10" fill="#0B1F3A" />
                  <rect x="80" y="44" width="14" height="10" fill="#0B1F3A" />
                  <rect x="44" y="64" width="10" height="12" fill="#0B1F3A" />
                  <rect x="64" y="64" width="14" height="10" fill="#FF8A00" />
                  <rect x="80" y="64" width="14" height="14" fill="#0B1F3A" />
                  <rect x="64" y="80" width="12" height="14" fill="#155EEF" />
                  <rect x="44" y="80" width="10" height="14" fill="#0B1F3A" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-1">
                Scan with Phone Camera
              </span>
              <span className="text-[10px] text-slate-500">
                Directly opens app on iOS & Android
              </span>
            </div>

            {/* Direct Download Buttons */}
            <div className="space-y-2.5">
              {/* Install PWA Button */}
              {onInstallPwa && (
                <button
                  onClick={() => {
                    sound.playSuccess();
                    onInstallPwa();
                  }}
                  className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition-all flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Install Progressive Web App (PWA)</span>
                      <span className="text-[10px] text-blue-100 block">Instant 1-Click Install to Phone Home Screen</span>
                    </div>
                  </div>
                  <span className="text-xs text-white font-black bg-white/20 px-2.5 py-1 rounded-lg">
                    Install 📲
                  </span>
                </button>
              )}

              <button
                onClick={handleTriggerApkDownload}
                className="w-full p-3 bg-[#0B1F3A] hover:bg-slate-900 text-white rounded-xl shadow-md transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Download Android APK</span>
                    <span className="text-[10px] text-slate-400 block">v2.4.1 (Direct Install • 28 MB)</span>
                  </div>
                </div>
                <span className="text-xs text-[#FF8A00] font-bold group-hover:translate-x-0.5 transition-transform">
                  {downloadStarted ? 'Downloading...' : 'Get APK →'}
                </span>
              </button>

              <button
                onClick={handleCopy}
                className="w-full p-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl transition-all flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#155EEF] flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Share App Link</span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                      {currentUrl}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#155EEF] font-bold">
                  {copiedUrl ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>
          </div>

          {/* Section 2: Send Link to Mobile (WhatsApp or SMS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Send App Link directly to your phone:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('WHATSAPP')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                    method === 'WHATSAPP'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('SMS')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                    method === 'SMS'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  SMS
                </button>
              </div>
            </div>

            <form onSubmit={handleSendLink} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#155EEF]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
              >
                {sentSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Link</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Section 3: Launch in Interactive Mobile Simulator Mode */}
          {onOpenMobileSimulator && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-[#0B1F3A] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#155EEF]" />
                  Want to test the Mobile App now?
                </span>
                <p className="text-[11px] text-slate-600">
                  Experience the full mobile app screen & touch UI inside our smartphone simulator.
                </p>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onOpenMobileSimulator();
                }}
                className="px-3.5 py-2 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-transform hover:scale-105 shrink-0 flex items-center gap-1"
              >
                <span>Launch Mobile View</span>
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
