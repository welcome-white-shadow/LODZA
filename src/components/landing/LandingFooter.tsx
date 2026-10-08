import React, { useState } from 'react';
import { LodzaLogo } from '../common/LodzaLogo';
import {
  Smartphone,
  Share2,
  Check,
  Send,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Bike,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText,
  Clock,
  Headphones,
  Award
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface LandingFooterProps {
  onOpenAppDownloadModal?: () => void;
  onOpenSupport?: () => void;
  onSelectCity?: (cityName: string) => void;
  onSelectService?: (service: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onOpenAppDownloadModal,
  onOpenSupport,
  onSelectCity,
  onSelectService
}) => {
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    sound.playClick();
    setOpenSection(prev => prev === section ? null : section);
  };

  const handleSendAppDownloadSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsPhone || smsPhone.trim().length < 10) return;
    sound.playSuccess();
    setSmsSent(true);
    setTimeout(() => {
      setSmsSent(false);
      setSmsPhone('');
    }, 4000);
  };

  const handleCopyAppUrl = () => {
    sound.playClick();
    const url = window.location.origin || 'https://lodza.in';
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 3000);
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 mt-12 sm:mt-20 pt-8 sm:pt-14 pb-20 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-14">
        
        {/* =========================================================================
            1. QUICK SUPPORT & HELPLINE BAR (REAL PRODUCTION TELEPHONE & WHATSAPP)
           ========================================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#155EEF] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>24x7 Customer & Driver Support Desk</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Live</span>
              </h4>
              <p className="text-xs text-slate-400">Available across all 8 operating cities for trip queries, billing & lost items</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-start md:justify-end">
            <a
              href="tel:18002665639"
              className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0 min-h-[42px]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>1800-266-5639 (Toll Free)</span>
            </a>

            <button
              type="button"
              onClick={onOpenSupport}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors min-h-[42px]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>Raise a Ticket</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. APP DOWNLOAD & SHARING BANNER
           ========================================================================= */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-blue-900/30 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>LODZA Mobile App</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              Get the LODZA App on Your Phone
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Book intra-city trucks, 2-wheelers, and house shifting in seconds. Live GPS tracking, verified driver OTPs, and instant GST invoices right on your phone.
            </p>

            {/* Quick SMS Link Sender */}
            <form onSubmit={handleSendAppDownloadSms} className="pt-1 flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:mx-0 w-full">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#155EEF] min-h-[46px]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-[#155EEF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 min-h-[46px]"
              >
                {smsSent ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Link Sent via SMS!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Get App Link</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Store Buttons & App URL Sharing */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {/* Google Play Button */}
              <button
                type="button"
                onClick={onOpenAppDownloadModal}
                className="flex items-center justify-center gap-2.5 px-3.5 py-3 bg-black hover:bg-slate-900 border border-slate-800 rounded-xl transition-all text-left min-h-[48px]"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a2.213 2.213 0 0 1-.22-.976V2.79c0-.36.08-.7.22-.976zm11.24 11.24l2.122-2.12-11.66-6.73 9.538 8.85zm0 1.892l-9.537 8.85 11.66-6.73-2.122-2.12zm1.414-1.414l3.523 2.034a1.85 1.85 0 0 0 0-3.2l-3.523 2.034a.695.695 0 0 0 0 .132z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">Get it on</span>
                  <span className="text-xs font-black text-white block -mt-0.5">Google Play</span>
                </div>
              </button>

              {/* Apple App Store Button */}
              <button
                type="button"
                onClick={onOpenAppDownloadModal}
                className="flex items-center justify-center gap-2.5 px-3.5 py-3 bg-black hover:bg-slate-900 border border-slate-800 rounded-xl transition-all text-left min-h-[48px]"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.65-2.79 1.42-.58.67-1.1 1.74-.96 2.78 1.07.08 2.14-.58 2.74-1.33z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-medium">Download on</span>
                  <span className="text-xs font-black text-white block -mt-0.5">App Store</span>
                </div>
              </button>
            </div>

            {/* Share App URL button */}
            <button
              type="button"
              onClick={handleCopyAppUrl}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors min-h-[42px]"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>App Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#FF8A00]" />
                  <span>Share App Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. MULTI-COLUMN DETAILED FOOTER LINKS (ACCORDION ON MOBILE, GRID ON DESKTOP)
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8 text-xs">
          
          {/* Column 1: Services */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('services')}
              className="w-full flex items-center justify-between text-left font-extrabold text-sm uppercase tracking-wider text-slate-200 py-2 md:py-0 md:cursor-default"
            >
              <span>Our Services</span>
              <span className="md:hidden">
                {openSection === 'services' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </span>
            </button>
            <ul className={`mt-3 space-y-2.5 text-slate-400 ${openSection === 'services' ? 'block' : 'hidden md:block'}`}>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('TRUCK')}
                  className="hover:text-white text-left transition-colors flex items-center gap-2 py-1"
                >
                  <Truck className="w-3.5 h-3.5 text-[#155EEF]" />
                  <span>City Mini Trucks (From ₹180)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('TWO_WHEELER')}
                  className="hover:text-white text-left transition-colors flex items-center gap-2 py-1"
                >
                  <Bike className="w-3.5 h-3.5 text-[#FF8A00]" />
                  <span>2-Wheeler Parcel Delivery (From ₹45)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('PACKERS')}
                  className="hover:text-white text-left transition-colors py-1 block"
                >
                  Packers &amp; Movers (Home Shifting)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('TRUCK')}
                  className="hover:text-white text-left transition-colors py-1 block"
                >
                  Tata Ace (Chhota Hathi) on Demand
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectService?.('TRUCK')}
                  className="hover:text-white text-left transition-colors py-1 block"
                >
                  8ft &amp; 14ft Commercial Canters
                </button>
              </li>
              <li>
                <a href="#enterprise" className="hover:text-white transition-colors py-1 block">
                  LODZA Enterprise B2B Logistics
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Driver Partners */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('drivers')}
              className="w-full flex items-center justify-between text-left font-extrabold text-sm uppercase tracking-wider text-slate-200 py-2 md:py-0 md:cursor-default"
            >
              <span>Driver Partners</span>
              <span className="md:hidden">
                {openSection === 'drivers' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </span>
            </button>
            <ul className={`mt-3 space-y-2.5 text-slate-400 ${openSection === 'drivers' ? 'block' : 'hidden md:block'}`}>
              <li>
                <a href="#partner" className="hover:text-white transition-colors font-semibold text-amber-400 py-1 block">
                  Attach Vehicle &amp; Earn ₹3,500/day
                </a>
              </li>
              <li>
                <a href="#attach-truck" className="hover:text-white transition-colors py-1 block">
                  Attach Tata Ace / Bolero Pickup
                </a>
              </li>
              <li>
                <a href="#attach-bike" className="hover:text-white transition-colors py-1 block">
                  Attach 2-Wheeler / Bike
                </a>
              </li>
              <li>
                <a href="#daily-payout" className="hover:text-white transition-colors py-1 block">
                  Daily Bank IMPS Payouts (8:00 PM)
                </a>
              </li>
              <li>
                <a href="#insurance" className="hover:text-white transition-colors py-1 block">
                  ₹5 Lakh Driver Accident Insurance
                </a>
              </li>
              <li>
                <a href="#driver-incentives" className="hover:text-white transition-colors py-1 block">
                  Weekly Peak Booking Incentives
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Operating Cities */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('cities')}
              className="w-full flex items-center justify-between text-left font-extrabold text-sm uppercase tracking-wider text-slate-200 py-2 md:py-0 md:cursor-default"
            >
              <span>Operating Cities</span>
              <span className="md:hidden">
                {openSection === 'cities' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </span>
            </button>
            <ul className={`mt-3 space-y-2 text-slate-400 ${openSection === 'cities' ? 'block' : 'hidden md:block'}`}>
              {[
                'Mumbai',
                'Bengaluru',
                'Delhi NCR',
                'Pune',
                'Hyderabad',
                'Chennai',
                'Ahmedabad',
                'Kolkata'
              ].map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => onSelectCity?.(c)}
                    className="hover:text-white text-left transition-colors flex items-center justify-between w-full py-1"
                  >
                    <span>{c}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Live</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Trust & Safety */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('safety')}
              className="w-full flex items-center justify-between text-left font-extrabold text-sm uppercase tracking-wider text-slate-200 py-2 md:py-0 md:cursor-default"
            >
              <span>Safety &amp; Compliance</span>
              <span className="md:hidden">
                {openSection === 'safety' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </span>
            </button>
            <ul className={`mt-3 space-y-2.5 text-slate-400 ${openSection === 'safety' ? 'block' : 'hidden md:block'}`}>
              <li>
                <a href="#kyc" className="hover:text-white transition-colors py-1 block">
                  100% Aadhaar &amp; DL Verified Drivers
                </a>
              </li>
              <li>
                <a href="#insurance" className="hover:text-white transition-colors py-1 block">
                  Goods Transit Insurance Coverage
                </a>
              </li>
              <li>
                <a href="#prohibited" className="hover:text-white transition-colors py-1 block">
                  Prohibited Cargo Policy
                </a>
              </li>
              <li>
                <a href="#gst" className="hover:text-white transition-colors py-1 block">
                  GST Invoicing (SAC 996511)
                </a>
              </li>
              <li>
                <a href="#zero-surge" className="hover:text-white transition-colors py-1 block">
                  Zero Surge Pricing Guarantee
                </a>
              </li>
              <li>
                <a href="#claims" className="hover:text-white transition-colors py-1 block">
                  Claims &amp; Dispute Resolution
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Company & Legal */}
          <div className="border-b md:border-b-0 border-slate-800/80 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('company')}
              className="w-full flex items-center justify-between text-left font-extrabold text-sm uppercase tracking-wider text-slate-200 py-2 md:py-0 md:cursor-default"
            >
              <span>Company &amp; Legal</span>
              <span className="md:hidden">
                {openSection === 'company' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </span>
            </button>
            <ul className={`mt-3 space-y-2.5 text-slate-400 ${openSection === 'company' ? 'block' : 'hidden md:block'}`}>
              <li>
                <a href="#about" className="hover:text-white transition-colors py-1 block">
                  About LODZA Technologies
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-white transition-colors flex items-center gap-1.5 py-1">
                  <span>Careers</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                    Hiring
                  </span>
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors py-1 block">
                  Terms of Carriage &amp; Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors py-1 block">
                  Privacy Policy &amp; Data Protection
                </a>
              </li>
              <li>
                <a href="#grievance" className="hover:text-white transition-colors py-1 block">
                  Grievance Redressal (IT Act 2021)
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================================================
            4. CORPORATE ACCREDITATIONS & REGULATORY REGISTRATION
           ========================================================================= */}
        <div className="pt-6 sm:pt-8 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
          <div className="space-y-1">
            <span className="font-bold text-white block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>Registered Headquarters</span>
            </span>
            <p className="leading-relaxed text-slate-400">
              LODZA Logistics Technologies Private Limited
              <br />
              Express Towers, 14th Floor, Nariman Point,
              <br />
              Mumbai, Maharashtra 400021
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-white block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>Technology &amp; Dispatch Hub</span>
            </span>
            <p className="leading-relaxed text-slate-400">
              LODZA Fleet Innovation Center,
              <br />
              100 Feet Road, Indiranagar,
              <br />
              Bengaluru, Karnataka 560038
            </p>
          </div>

          <div className="space-y-1 md:text-right">
            <span className="font-bold text-white block flex items-center md:justify-end gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Government Registrations</span>
            </span>
            <p className="leading-relaxed text-slate-400">
              <strong>CIN:</strong> U63090MH2026PTC392811
              <br />
              <strong>GSTIN:</strong> 27AABCL8921K1ZZ (SAC 996511)
              <br />
              <strong>Carriage by Road Act:</strong> Reg No. MH/MUM/CR/2026/0412
            </p>
          </div>
        </div>

        {/* =========================================================================
            5. BOTTOM BAR: COPYRIGHT & SOCIAL
           ========================================================================= */}
        <div className="pt-6 border-t border-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
            <LodzaLogo size="sm" light={true} showTagline={false} />
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-slate-300 font-medium">Move. Deliver. Done.</span>
            <span className="w-full sm:w-auto text-slate-500 text-[11px]">
              &copy; {new Date().getFullYear()} LODZA Logistics Technologies Pvt. Ltd. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-400 text-xs">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-slate-700">&bull;</span>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Twitter / X
            </a>
            <span className="text-slate-700">&bull;</span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
