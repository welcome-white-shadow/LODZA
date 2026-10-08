import React, { useState, useEffect } from 'react';
import { CustomerProfile, User } from '../../types';
import { LodzaLogo } from '../common/LodzaLogo';
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  UserCheck,
  Building,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface CustomerAuthProps {
  existingCustomers: CustomerProfile[];
  onLoginSuccess: (user: User, customerProfile?: CustomerProfile) => void;
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({
  existingCustomers,
  onLoginSuccess
}) => {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE'>('PHONE');
  const [phone, setPhone] = useState('9876543210');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('4821');
  const [resendTimer, setResendTimer] = useState(30);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  // Profile setup fields for new customer
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [defaultAddress, setDefaultAddress] = useState('12th Main, Indiranagar, Bengaluru, 560038');

  // Resend countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'OTP' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!termsAgreed) {
      setErrorMessage('Please agree to the Terms of Service to proceed.');
      return;
    }

    // Generate random 4-digit OTP or standard 4821
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setResendTimer(30);
    setStep('OTP');
    setShowSmsBanner(true);
    sound.playSuccess();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '4821') {
      setErrorMessage('Invalid OTP. Please check the code sent in the SMS banner above.');
      return;
    }

    sound.playSuccess();

    // Check if phone matches existing customer
    const cleanPhone = phone.replace(/\D/g, '');
    const matched = existingCustomers.find(
      (c) => c.phone.replace(/\D/g, '').endsWith(cleanPhone) || cleanPhone.endsWith(c.phone.replace(/\D/g, ''))
    );

    if (matched) {
      // Existing customer login
      const user: User = {
        id: matched.userId,
        name: matched.name,
        phone: matched.phone,
        email: matched.email,
        role: 'CUSTOMER',
        createdAt: '2026-01-15'
      };
      onLoginSuccess(user, matched);
    } else {
      // New customer profile setup
      setStep('PROFILE');
    }
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    sound.playSuccess();

    const formattedPhone = `+91 ${phone.replace(/\D/g, '')}`;
    const newUserId = `cust_${Date.now()}`;

    const newProfile: CustomerProfile = {
      userId: newUserId,
      name: fullName.trim(),
      phone: formattedPhone,
      email: email.trim() || undefined,
      companyName: companyName.trim() || undefined,
      gstNumber: gstNumber.trim() || undefined,
      walletBalance: 200, // Welcome credits
      totalOrders: 0,
      isEnterprise: !!gstNumber.trim(),
      savedAddresses: [
        {
          id: `addr_${Date.now()}`,
          label: 'Home',
          address: defaultAddress,
          lat: 12.9784,
          lng: 77.6408,
          contactName: fullName.trim(),
          contactPhone: formattedPhone
        }
      ]
    };

    const newUser: User = {
      id: newUserId,
      name: fullName.trim(),
      phone: formattedPhone,
      email: email.trim() || undefined,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(newUser, newProfile);
  };

  const handleQuickFill = (presetPhone: string, presetName: string) => {
    sound.playClick();
    setPhone(presetPhone);
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6 animate-in fade-in duration-200">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <LodzaLogo size="lg" showTagline={true} />
        </div>
        <p className="text-xs text-slate-500">
          India&apos;s on-demand hyperlocal logistics & goods delivery platform
        </p>
      </div>

      {/* Simulated SMS Notification Banner */}
      {showSmsBanner && step === 'OTP' && (
        <div className="bg-blue-900 text-white p-3.5 rounded-2xl shadow-lg border border-blue-700 flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
          <MessageSquare className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-200 uppercase tracking-wide text-[10px]">
                SMS • LODZA OTP Service
              </span>
              <span className="text-[10px] text-slate-300 font-mono">Just now</span>
            </div>
            <p className="text-white font-medium">
              Your LODZA verification code is{' '}
              <strong className="font-mono text-base font-extrabold text-[#FF8A00] tracking-wider px-1">
                {generatedOtp}
              </strong>
              . Valid for 10 minutes. Do not share with anyone.
            </p>
          </div>
        </div>
      )}

      {/* Card Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-slate-200/80 space-y-5 sm:space-y-6">
        {/* STEP 1: MOBILE NUMBER INPUT */}
        {step === 'PHONE' && (
          <form onSubmit={handleRequestOtp} className="space-y-4 sm:space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Sign in or Register</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your 10-digit mobile number to access instant truck & bike delivery.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs sm:text-sm font-medium border border-red-200">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#155EEF] focus-within:border-transparent min-h-[48px]">
                <div className="bg-slate-50 px-3.5 py-3 border-r border-slate-300 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 select-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="flex-1 px-3.5 py-3 text-sm sm:text-base font-semibold tracking-wider text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
              <input
                type="checkbox"
                id="authTerms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[#155EEF] focus:ring-[#155EEF] shrink-0"
              />
              <label htmlFor="authTerms" className="text-xs text-slate-600 leading-relaxed">
                I agree to LODZA&apos;s{' '}
                <span className="font-semibold text-slate-800 underline">Terms of Service</span>,{' '}
                <span className="font-semibold text-slate-800 underline">Privacy Policy</span>, and Goods Carriage Guidelines.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>Get OTP</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Quick Demo Accounts Helper */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Quick Demo Test Accounts (Click to Auto-Fill):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('9876543210', 'Rahul Sharma')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 text-left transition-colors"
                >
                  <strong className="text-xs text-slate-900 block">Rahul Sharma</strong>
                  <span className="text-[10px] text-slate-500 block">Existing User • Indiranagar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('9811122334', 'Ananya Iyer')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 text-left transition-colors"
                >
                  <strong className="text-xs text-slate-900 block">New Customer</strong>
                  <span className="text-[10px] text-slate-500 block">Fresh Profile Setup</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 hover:text-slate-800 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Change Number</span>
              </button>
              <span className="text-xs sm:text-sm font-mono text-slate-500 font-bold">+91 {phone}</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Verify Mobile Number</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter the 4-digit OTP sent to <strong className="text-slate-800">+91 {phone}</strong>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs sm:text-sm font-medium border border-red-200">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 text-center">
                Enter 4-Digit Verification OTP
              </label>
              <input
                type="text"
                maxLength={4}
                required
                autoFocus
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full text-center font-mono font-black text-3xl tracking-[0.4em] sm:tracking-[1em] p-3.5 rounded-2xl border-2 border-slate-300 focus:outline-none focus:border-[#155EEF] focus:ring-2 focus:ring-blue-100 bg-slate-50/50 text-slate-900 min-h-[56px]"
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
              <span>Didn&apos;t receive code?</span>
              {resendTimer > 0 ? (
                <span className="font-mono text-slate-400">Resend in {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                    setGeneratedOtp(newOtp);
                    setResendTimer(30);
                    setShowSmsBanner(true);
                    sound.playSuccess();
                  }}
                  className="font-bold text-[#155EEF] hover:underline"
                >
                  Resend OTP Now
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 min-h-[48px]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Verify & Continue</span>
            </button>

            {/* Quick Autofill Helper */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setOtpInput(generatedOtp);
                  sound.playClick();
                }}
                className="text-xs sm:text-sm text-[#155EEF] font-bold hover:underline"
              >
                Auto-fill received OTP ({generatedOtp})
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: NEW CUSTOMER PROFILE SETUP */}
        {step === 'PROFILE' && (
          <form onSubmit={handleCompleteProfile} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Complete Your Profile</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Welcome to LODZA! Please enter your details to set up your delivery account.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs sm:text-sm font-medium border border-red-200">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Iyer"
                className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Email Address (For Tax Invoices)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@example.com"
                className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Company Name & GSTIN (Optional for B2B)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Business Name"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
                />
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  placeholder="29ABCDE1234F1Z5"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm sm:text-base uppercase font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Default Pickup Address
              </label>
              <input
                type="text"
                value={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.value)}
                className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#155EEF] min-h-[46px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 mt-2 min-h-[48px]"
            >
              <span>Save & Start Booking</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        )}
      </div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit Encrypted OTP</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Verified Fleet</span>
        </span>
      </div>
    </div>
  );
};
