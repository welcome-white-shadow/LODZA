import React, { useState } from 'react';
import { VehicleConfig, DriverProfile, DocumentStatus } from '../../types';
import { LodzaLogo } from '../common/LodzaLogo';
import { INDIAN_CITIES } from '../../data/cityData';
import {
  Truck,
  Bike,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  IndianRupee,
  Calendar,
  Smartphone,
  Phone,
  ArrowRight,
  ArrowLeft,
  Star,
  Zap,
  Clock,
  Building,
  CreditCard,
  Camera,
  Check,
  X,
  UserCheck,
  Lock,
  ChevronDown
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface DriverPartnerPortalProps {
  vehicles: VehicleConfig[];
  existingDrivers: DriverProfile[];
  onDriverRegisteredAndApproved: (driver: DriverProfile) => void;
  onLoginExistingDriver: (driver: DriverProfile) => void;
  onBackToCustomer: () => void;
}

export const DriverPartnerPortal: React.FC<DriverPartnerPortalProps> = ({
  vehicles,
  existingDrivers,
  onDriverRegisteredAndApproved,
  onLoginExistingDriver,
  onBackToCustomer
}) => {
  const [viewMode, setViewMode] = useState<'OVERVIEW' | 'REGISTER' | 'LOGIN' | 'STATUS'>('OVERVIEW');

  // Calculator State
  const [calcVehicleType, setCalcVehicleType] = useState<'two_wheeler' | 'three_wheeler' | 'mini_truck' | 'pickup_8ft' | 'truck_14ft'>('mini_truck');
  const [calcTripsPerDay, setCalcTripsPerDay] = useState(5);

  // Driver Login State
  const [loginPhone, setLoginPhone] = useState('9819044211');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginStep, setLoginStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [generatedLoginOtp, setGeneratedLoginOtp] = useState('4821');

  // Driver Registration Form States (Comprehensive RTO Compliant)
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [regPhone, setRegPhone] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Step 2: City & Vehicle
  const [regCity, setRegCity] = useState('Mumbai');
  const [regVehicleCategory, setRegVehicleCategory] = useState<'two_wheeler' | 'three_wheeler' | 'mini_truck' | 'pickup_8ft' | 'truck_14ft'>('mini_truck');
  const [regVehicleNumber, setRegVehicleNumber] = useState('MH 02 CR 4492');
  const [regVehicleModel, setRegVehicleModel] = useState('Tata Ace Gold Petrol (White)');

  // Step 3: Personal Details
  const [regFullName, setRegFullName] = useState('Anil Shankar Patil');
  const [regFatherName, setRegFatherName] = useState('Shankar Patil');
  const [regDob, setRegDob] = useState('1992-06-14');
  const [regBloodGroup, setRegBloodGroup] = useState('B+');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('9820011223');
  const [regAddress, setRegAddress] = useState('Room 12, Chawl No 4, Chembur East, Mumbai 400071');

  // Step 4: Mandatory Statutory Documents
  const [regDlNumber, setRegDlNumber] = useState('MH022018009412');
  const [regDlExpiry, setRegDlExpiry] = useState('2032-05-18');
  const [regAadhaarNumber, setRegAadhaarNumber] = useState('891244018821');
  const [regRcNumber, setRegRcNumber] = useState('MH02CR4492');
  const [regInsurancePolicy, setRegInsurancePolicy] = useState('BAJAJ-COMM-99482');
  const [regInsuranceExpiry, setRegInsuranceExpiry] = useState('2027-02-28');
  const [regPucNumber, setRegPucNumber] = useState('PUC-MH02-8821');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    AADHAAR: true,
    DRIVING_LICENSE: true,
    RC: true,
    INSURANCE: true,
    PUC: true,
    FITNESS: true,
    VEHICLE_PHOTO: true
  });

  // Step 5: Bank Account
  const [regBankName, setRegBankName] = useState('State Bank of India');
  const [regAccountHolder, setRegAccountHolder] = useState('Anil Shankar Patil');
  const [regAccountNumber, setRegAccountNumber] = useState('38940128912');
  const [regIfsc, setRegIfsc] = useState('SBIN0004018');

  // Step 6: Submitted driver profile & fast track activation
  const [createdDriver, setCreatedDriver] = useState<DriverProfile | null>(null);

  // Calculate earnings
  const getDailyRate = () => {
    switch (calcVehicleType) {
      case 'two_wheeler':
        return 220; // avg per trip net
      case 'three_wheeler':
        return 420;
      case 'mini_truck':
        return 640;
      case 'pickup_8ft':
        return 820;
      case 'truck_14ft':
        return 1250;
      default:
        return 600;
    }
  };

  const netEarningPerTrip = getDailyRate();
  const dailyEarning = netEarningPerTrip * calcTripsPerDay;
  const monthlyEarning = dailyEarning * 26; // 26 working days

  const handleSendRegOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPhone || regPhone.length < 10) return;
    sound.playSuccess();
    setRegOtp('4821');
    setIsPhoneVerified(true);
    setRegStep(2);
  };

  const handleDocumentSimulateUpload = (docKey: string) => {
    sound.playClick();
    setUploadedDocs((prev) => ({ ...prev, [docKey]: true }));
  };

  const handleFinalSubmitRegistration = (fastTrackApprove: boolean = true) => {
    sound.playSuccess();

    // Map selected vehicle ID
    let vehicleId = 'veh_mini_truck';
    if (regVehicleCategory === 'two_wheeler') vehicleId = 'veh_two_wheeler';
    if (regVehicleCategory === 'three_wheeler') vehicleId = 'veh_three_wheeler';
    if (regVehicleCategory === 'pickup_8ft') vehicleId = 'veh_pickup_8ft';
    if (regVehicleCategory === 'truck_14ft') vehicleId = 'veh_truck_14ft';

    const newDriver: DriverProfile = {
      id: `drv_${Date.now()}`,
      userId: `user_drv_${Date.now()}`,
      name: regFullName,
      phone: `+91 ${regPhone || '9820044112'}`,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      ratingCount: 0,
      isOnline: fastTrackApprove,
      isOnTrip: false,
      status: fastTrackApprove ? 'ACTIVE' : 'PENDING_APPROVAL',
      vehicleId,
      vehicleNumber: regVehicleNumber,
      vehicleModel: regVehicleModel,
      currentLat: 19.0760,
      currentLng: 72.8777,
      heading: 0,
      speedKmph: 0,
      kycStatus: fastTrackApprove ? 'APPROVED' : 'UNDER_REVIEW',
      todaysEarnings: 0,
      totalTrips: 0,
      acceptanceRate: 100,
      documents: [
        {
          id: `doc_aadhaar_${Date.now()}`,
          type: 'AADHAAR',
          title: 'Aadhaar Card (UIDAI)',
          docNumber: `XXXX-XXXX-${regAadhaarNumber.slice(-4) || '8912'}`,
          status: fastTrackApprove ? 'APPROVED' : 'UNDER_REVIEW'
        },
        {
          id: `doc_dl_${Date.now()}`,
          type: 'DRIVING_LICENSE',
          title: 'Commercial Driving License (TR)',
          docNumber: regDlNumber,
          status: fastTrackApprove ? 'APPROVED' : 'UNDER_REVIEW',
          expiryDate: regDlExpiry
        },
        {
          id: `doc_rc_${Date.now()}`,
          type: 'RC',
          title: 'Commercial RC Certificate (Form 23)',
          docNumber: regRcNumber,
          status: fastTrackApprove ? 'APPROVED' : 'UNDER_REVIEW'
        },
        {
          id: `doc_ins_${Date.now()}`,
          type: 'INSURANCE',
          title: 'Commercial Comprehensive Insurance',
          docNumber: regInsurancePolicy,
          status: fastTrackApprove ? 'APPROVED' : 'UNDER_REVIEW',
          expiryDate: regInsuranceExpiry
        },
        {
          id: `doc_puc_${Date.now()}`,
          type: 'PUC',
          title: 'Pollution Under Control (PUC)',
          docNumber: regPucNumber,
          status: fastTrackApprove ? 'APPROVED' : 'UNDER_REVIEW'
        }
      ],
      bankAccount: {
        accountHolder: regAccountHolder,
        accountNumber: `••••••••${regAccountNumber.slice(-4) || '8912'}`,
        ifsc: regIfsc,
        bankName: regBankName,
        isVerified: true
      }
    };

    setCreatedDriver(newDriver);
    setViewMode('STATUS');
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-16 text-slate-900 animate-in fade-in duration-200">
      {/* Top Navigation Bar for Driver Portal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <button
            type="button"
            onClick={onBackToCustomer}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Customer App</span>
          </button>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#155EEF] uppercase tracking-wider">
              LODZA Partner Portal
            </span>
            <span className="hidden sm:inline-block text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Fleet Onboarding
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end">
          {viewMode !== 'OVERVIEW' && (
            <button
              type="button"
              onClick={() => setViewMode('OVERVIEW')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors min-h-[38px]"
            >
              Overview
            </button>
          )}
          {viewMode !== 'LOGIN' && (
            <button
              type="button"
              onClick={() => setViewMode('LOGIN')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors min-h-[38px]"
            >
              Partner Login
            </button>
          )}
          {viewMode !== 'REGISTER' && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setViewMode('REGISTER');
                setRegStep(1);
              }}
              className="px-4 py-2 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 text-xs font-extrabold rounded-xl shadow-xs transition-transform hover:scale-105 min-h-[38px] flex items-center gap-1.5"
            >
              <span>Attach Vehicle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: OVERVIEW & EARNINGS CALCULATOR
         ========================================================================= */}
      {viewMode === 'OVERVIEW' && (
        <div className="space-y-12 animate-in fade-in">
          {/* Hero Banner */}
          <section className="bg-gradient-to-br from-[#0B1F3A] via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl border border-blue-900/40 space-y-6">
            <div className="max-w-2xl space-y-3">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#FF8A00] bg-black/40 px-3 py-1 rounded-full border border-orange-500/30">
                LODZA Driver Partner Network
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Attach Your Vehicle. Earn up to <span className="text-[#FF8A00]">₹90,000/month</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect your 2-Wheeler, 3-Wheeler Auto, Tata Ace, or Commercial Container with India&apos;s fastest growing intra-city logistics platform. Daily bank IMPS payouts, low 15% platform commission, and guaranteed daily rides in your city.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('REGISTER');
                  setRegStep(1);
                }}
                className="px-6 py-3.5 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <span>Register Your Vehicle Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('LOGIN')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-colors"
              >
                Already a Partner? Login →
              </button>
            </div>

            {/* Key Value Propositions */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-extrabold text-white block">Daily IMPS Payout</span>
                <span className="text-slate-400">Direct transfer to bank every night</span>
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-white block">Low 15% Commission</span>
                <span className="text-slate-400">Keep 85% of every single trip fare</span>
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-white block">₹5,00,000 Insurance</span>
                <span className="text-slate-400">Accidental medical & life cover</span>
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-white block">Flexible Working</span>
                <span className="text-slate-400">Work full-time or part-time anytime</span>
              </div>
            </div>
          </section>

          {/* Interactive Daily & Monthly Earnings Calculator */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#155EEF] uppercase tracking-wider">
                Partner Income Estimator
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                How Much Can You Earn with LODZA?
              </h2>
              <p className="text-xs text-slate-500">
                Calculate realistic net earnings based on your vehicle model and daily trip capacity.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="lg:col-span-7 space-y-6">
                {/* Vehicle Selection Chips */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">1. Select Your Vehicle</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'two_wheeler', name: '2-Wheeler (Bike)', sub: 'Parcel / Courier' },
                      { id: 'three_wheeler', name: '3-Wheeler Auto', sub: 'Piaggio Ape 500kg' },
                      { id: 'mini_truck', name: 'Tata Ace (Chhota Hathi)', sub: '750kg Mini Truck' },
                      { id: 'pickup_8ft', name: 'Pickup 8ft', sub: 'Mahindra Bolero 1.2T' },
                      { id: 'truck_14ft', name: '14ft Truck', sub: 'Eicher Pro Container' }
                    ].map((v) => {
                      const isSel = calcVehicleType === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setCalcVehicleType(v.id as any);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSel
                              ? 'border-[#155EEF] bg-blue-50 text-slate-900 shadow-xs ring-1 ring-blue-500'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-extrabold text-xs block truncate">{v.name}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{v.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Trips Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">2. Trips Completed Per Day:</span>
                    <span className="text-[#155EEF] font-mono text-base">{calcTripsPerDay} Trips/Day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={calcTripsPerDay}
                    onChange={(e) => setCalcTripsPerDay(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#155EEF]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 Trip (Part-time)</span>
                    <span>5 Trips (Standard Shift)</span>
                    <span>10 Trips (Pro Partner)</span>
                  </div>
                </div>
              </div>

              {/* Earnings Result Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1F3A] to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400">Net Estimated Earnings</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    After 15% Platform Share
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Daily Take-Home:</span>
                    <div className="flex items-baseline gap-1 text-2xl font-black text-white font-mono">
                      <IndianRupee className="w-5 h-5 text-[#FF8A00]" />
                      <span>{dailyEarning.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-400 font-sans font-normal">/ day</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Monthly Take-Home (26 Days):</span>
                    <div className="flex items-baseline gap-1 text-4xl font-black text-[#FF8A00] font-mono">
                      <IndianRupee className="w-8 h-8 text-[#FF8A00]" />
                      <span>{monthlyEarning.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-400 font-sans font-normal">/ month</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    setViewMode('REGISTER');
                    setRegVehicleCategory(calcVehicleType);
                    setRegStep(1);
                  }}
                  className="w-full py-3 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Onboarding for this Vehicle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Documents Required to Attach Vehicle - Genuine Human Logistics Guide */}
          <section className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#155EEF] uppercase tracking-wider">
                Paperless Fleet Attachment
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950">
                Documents Required to Attach Vehicle
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Simple 4-step paperless attachment. Upload clear photos directly from your phone camera &mdash; no physical RTO submissions or branch visits required. Fast verification within 15 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    Identity &amp; License
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">1. Commercial Driving License</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Valid LMV-TR / Transport commercial license (or non-transport for 2-wheelers). Ensure photo and license validity are clearly readable.
                </p>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Original photo or DigiLocker copy accepted</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    KYC Clearance
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">2. Aadhaar Card (UIDAI)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Front and back photo of 12-digit Aadhaar card for instant digital identity confirmation and police background clearance.
                </p>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Fast OTP verification in under 60 seconds</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FF8A00] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    Vehicle Registration
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">3. Vehicle RC (Form 23)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Commercial yellow-plate Registration Certificate. Shows chassis number, engine number, and active road tax validity.
                </p>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Both physical RC card and mParivahan valid</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    Transit Cover
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">4. Commercial Insurance</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Active commercial motor insurance policy covering third-party liability and comprehensive transit risks.
                </p>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Assistance available if policy renewal needed</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    Fitness &amp; Green
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">5. Fitness Certificate &amp; PUC</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Valid RTO Fitness Certificate (Form 38) and active Pollution Under Control certificate (Electric Vehicles are exempt).
                </p>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>EV 2-wheelers &amp; electric autos exempt</span>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Daily Payout
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">6. Bank Passbook / Cheque</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Cancelled cheque or first page of bank passbook with your name, account number, and IFSC code for daily IMPS settlements.
                </p>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automated bank credit every evening at 8:00 PM</span>
                </div>
              </div>
            </div>

            {/* Practical Help & Support Callout */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Need Help Attaching Your Vehicle?
                </h4>
                <p className="text-xs text-slate-600">
                  Our fleet onboarding managers in your city assist with permit verification, insurance renewal, and document guidance.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href="tel:18002665639"
                  className="px-4 py-2.5 bg-[#155EEF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 min-h-[42px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 1800-266-5639</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setViewMode('REGISTER');
                    setRegStep(1);
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors min-h-[42px]"
                >
                  Start Online &rarr;
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: STEP-BY-STEP DRIVER ONBOARDING & REGISTRATION WIZARD
         ========================================================================= */}
      {viewMode === 'REGISTER' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-slate-200 shadow-sm space-y-6 sm:space-y-8 animate-in fade-in">
          {/* Wizard Header & Stepper */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Driver Partner Onboarding Application
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Step {regStep} of 5 • Complete in 3 minutes to activate daily trip dispatches
                </p>
              </div>

              <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-slate-100 px-2.5 sm:px-3 py-1 rounded-full self-start sm:self-auto">
                {regStep === 1 && 'Phone Verification'}
                {regStep === 2 && 'Vehicle & City'}
                {regStep === 3 && 'Personal Info'}
                {regStep === 4 && 'Document Verification'}
                {regStep === 5 && 'Bank & Settlements'}
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-2 rounded-full transition-all ${
                    regStep >= stepNum ? 'bg-[#155EEF]' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: MOBILE NUMBER & OTP */}
          {regStep === 1 && (
            <div className="max-w-md mx-auto space-y-5 py-2 sm:py-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#155EEF] mx-auto flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">Enter Your Mobile Number</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  We will send a 4-digit verification code to initiate your partner registration.
                </p>
              </div>

              <form onSubmit={handleSendRegOtp} className="space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">
                    Mobile Number (Primary Driver SIM)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98XXXXXXXX"
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-3 sm:p-3.5 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                  <span className="font-bold block">Testing Sandbox Active:</span>
                  <span>OTP is auto-verified. Click &quot;Verify &amp; Continue&quot; to proceed.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <span>Verify Phone &amp; Continue</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: CITY & VEHICLE SPECIFICATION */}
          {regStep === 2 && (
            <div className="space-y-5 sm:space-y-6 max-w-xl mx-auto py-1 sm:py-2">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Select Your Operating City &amp; Vehicle</h3>
                <p className="text-xs sm:text-sm text-slate-500">Choose the city where you will receive ride requests and your vehicle model.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Operating City</label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Vehicle Category</label>
                  <select
                    value={regVehicleCategory}
                    onChange={(e) => setRegVehicleCategory(e.target.value as any)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                  >
                    <option value="mini_truck">Tata Ace (Chhota Hathi 750kg)</option>
                    <option value="three_wheeler">3-Wheeler Auto (Piaggio / Bajaj 500kg)</option>
                    <option value="two_wheeler">2-Wheeler (Bike / Parcel 20kg)</option>
                    <option value="pickup_8ft">Pickup 8ft (Mahindra Bolero 1.2T)</option>
                    <option value="truck_14ft">14ft Truck (Eicher Container 2.5T)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Commercial Plate Number (Yellow Plate)</label>
                  <input
                    type="text"
                    value={regVehicleNumber}
                    onChange={(e) => setRegVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. MH 02 CR 4492"
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Vehicle Make &amp; Model</label>
                  <input
                    type="text"
                    value={regVehicleModel}
                    onChange={(e) => setRegVehicleModel(e.target.value)}
                    placeholder="e.g. Tata Ace Gold Petrol (White)"
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <button
                  type="button"
                  onClick={() => setRegStep(1)}
                  className="px-4 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 min-h-[46px]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setRegStep(3);
                  }}
                  className="px-6 py-3 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs min-h-[48px]"
                >
                  Continue to Personal Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PERSONAL INFORMATION */}
          {regStep === 3 && (
            <div className="space-y-5 sm:space-y-6 max-w-xl mx-auto py-1 sm:py-2">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Driver Personal Information</h3>
                <p className="text-xs sm:text-sm text-slate-500">Provide details matching your Driving License and Aadhaar Card.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Full Name (as on DL)</label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Father&apos;s / Husband&apos;s Name</label>
                  <input
                    type="text"
                    value={regFatherName}
                    onChange={(e) => setRegFatherName(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Blood Group</label>
                  <select
                    value={regBloodGroup}
                    onChange={(e) => setRegBloodGroup(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                  >
                    <option value="A+">A+ Positive</option>
                    <option value="B+">B+ Positive</option>
                    <option value="O+">O+ Positive</option>
                    <option value="AB+">AB+ Positive</option>
                    <option value="O-">O- Negative</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Permanent Residential Address</label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Emergency Contact Number</label>
                  <input
                    type="tel"
                    value={regEmergencyPhone}
                    onChange={(e) => setRegEmergencyPhone(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <button
                  type="button"
                  onClick={() => setRegStep(2)}
                  className="px-4 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 min-h-[46px]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setRegStep(4);
                  }}
                  className="px-6 py-3 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs min-h-[48px]"
                >
                  Continue to Documents Verification →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VEHICLE & DRIVER VERIFICATION DOCUMENTS */}
          {regStep === 4 && (
            <div className="space-y-5 sm:space-y-6 max-w-2xl mx-auto py-1 sm:py-2">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Upload Vehicle &amp; Driver Documents</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Upload clear smartphone photos or enter numbers for instant digital verification within 15 minutes.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-3.5">
                {/* Document 1: DL */}
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#155EEF] shrink-0" />
                      Commercial Driving License (TR)
                    </span>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={regDlNumber}
                        onChange={(e) => setRegDlNumber(e.target.value.toUpperCase())}
                        placeholder="DL Number (e.g. MH022018009412)"
                        className="p-2 sm:p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold min-h-[42px]"
                      />
                      <input
                        type="date"
                        value={regDlExpiry}
                        onChange={(e) => setRegDlExpiry(e.target.value)}
                        className="p-2 sm:p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium min-h-[42px]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDocumentSimulateUpload('DRIVING_LICENSE')}
                    className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 self-stretch sm:self-center min-h-[44px]"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>DL Uploaded (Front &amp; Back)</span>
                  </button>
                </div>

                {/* Document 2: Aadhaar Card */}
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      Aadhaar Card (12-digit UIDAI)
                    </span>
                    <input
                      type="text"
                      value={regAadhaarNumber}
                      onChange={(e) => setRegAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      placeholder="Enter 12-digit UIDAI Number"
                      className="p-2 sm:p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold w-full max-w-xs min-h-[42px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDocumentSimulateUpload('AADHAAR')}
                    className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 self-stretch sm:self-center min-h-[44px]"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Aadhaar Uploaded</span>
                  </button>
                </div>

                {/* Document 3: RC Book */}
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#FF8A00] shrink-0" />
                      Vehicle Registration Certificate (RC Form 23)
                    </span>
                    <input
                      type="text"
                      value={regRcNumber}
                      onChange={(e) => setRegRcNumber(e.target.value.toUpperCase())}
                      placeholder="RC Number (e.g. MH02CR4492)"
                      className="p-2 sm:p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold w-full max-w-xs min-h-[42px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDocumentSimulateUpload('RC')}
                    className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 self-stretch sm:self-center min-h-[44px]"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>RC Book Uploaded</span>
                  </button>
                </div>

                {/* Document 4: Commercial Insurance Policy */}
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                      Commercial Vehicle Insurance Policy
                    </span>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={regInsurancePolicy}
                        onChange={(e) => setRegInsurancePolicy(e.target.value.toUpperCase())}
                        placeholder="Policy Number"
                        className="p-2 sm:p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono font-bold min-h-[42px]"
                      />
                      <input
                        type="date"
                        value={regInsuranceExpiry}
                        onChange={(e) => setRegInsuranceExpiry(e.target.value)}
                        className="p-2 sm:p-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium min-h-[42px]"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDocumentSimulateUpload('INSURANCE')}
                    className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 self-stretch sm:self-center min-h-[44px]"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Policy Uploaded</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <button
                  type="button"
                  onClick={() => setRegStep(3)}
                  className="px-4 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 min-h-[46px]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setRegStep(5);
                  }}
                  className="px-6 py-3 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs min-h-[48px]"
                >
                  Continue to Bank Payout Setup →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: BANK ACCOUNT & SUBMIT */}
          {regStep === 5 && (
            <div className="space-y-5 sm:space-y-6 max-w-xl mx-auto py-1 sm:py-2">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Bank Account for Daily IMPS Payouts</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Every day by 11:00 PM, your trip earnings will be credited directly to this verified bank account.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Bank Name</label>
                  <select
                    value={regBankName}
                    onChange={(e) => setRegBankName(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                  >
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Axis Bank">Axis Bank</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Account Holder Name</label>
                  <input
                    type="text"
                    value={regAccountHolder}
                    onChange={(e) => setRegAccountHolder(e.target.value)}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">IFSC Code</label>
                  <input
                    type="text"
                    value={regIfsc}
                    onChange={(e) => setRegIfsc(e.target.value.toUpperCase())}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">Bank Account Number</label>
                  <input
                    type="password"
                    value={regAccountNumber}
                    onChange={(e) => setRegAccountNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                    required
                  />
                </div>
              </div>

              {/* Code of Conduct & Commission agreement */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-600 space-y-2">
                <span className="font-extrabold text-slate-900 block">LODZA Partner Commitment:</span>
                <ul className="space-y-1 list-disc pl-4 text-xs text-slate-600">
                  <li>I agree to a flat 15% platform commission on completed trips.</li>
                  <li>I agree to handle customer goods carefully without dropping or damaging packages.</li>
                  <li>I will verify the delivery OTP with the customer at destination before completing the ride.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <button
                  type="button"
                  onClick={() => setRegStep(4)}
                  className="px-4 py-3 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 min-h-[46px] order-2 sm:order-1 text-center"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={() => handleFinalSubmitRegistration(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-lg transition-transform hover:scale-105 min-h-[48px] order-1 sm:order-2 text-center"
                >
                  Submit &amp; Fast-Track Activate Partner Account →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 3: SUBMITTED APPLICATION TRACKER & FAST ACTIVATION
         ========================================================================= */}
      {viewMode === 'STATUS' && createdDriver && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 max-w-xl mx-auto text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Application #LDZ-DRV-{createdDriver.id.slice(-4)} Verified
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Welcome to LODZA, {createdDriver.name}!
            </h2>
            <p className="text-xs text-slate-500">
              Your Commercial Driving License, Aadhaar UIDAI, RC Book ({createdDriver.vehicleNumber}), and Bank IMPS have been verified successfully.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Partner ID:</span>
              <span className="font-mono font-bold text-slate-900">{createdDriver.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicle Attached:</span>
              <span className="font-bold text-slate-900">{createdDriver.vehicleModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Plate Number:</span>
              <span className="font-mono font-bold text-slate-900">{createdDriver.vehicleNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Payout Bank:</span>
              <span className="font-bold text-emerald-700">{createdDriver.bankAccount.bankName} (Verified)</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSuccess();
              onDriverRegisteredAndApproved(createdDriver);
            }}
            className="w-full py-4 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Open Driver Partner App &amp; Go Online Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: EXISTING DRIVER LOGIN (WITH OTP)
         ========================================================================= */}
      {viewMode === 'LOGIN' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-md mx-auto space-y-6 animate-in fade-in">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FF8A00] mx-auto flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Driver Partner Login</h2>
            <p className="text-xs text-slate-500">
              Sign in with your registered mobile number to receive trips.
            </p>
          </div>

          {loginStep === 'PHONE' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Registered Driver Mobile
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-none focus:border-[#155EEF]"
                  />
                </div>
              </div>

              {/* Quick Select Pre-Registered Drivers */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Or Test with Verified Demo Partner:
                </span>
                <div className="space-y-1.5">
                  {existingDrivers.slice(0, 3).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onLoginExistingDriver(d);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-[#155EEF] bg-slate-50 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={d.photo}
                          alt={d.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <span className="text-xs font-bold block text-slate-900">{d.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {d.vehicleModel} • {d.vehicleNumber}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#155EEF]">Login →</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  setGeneratedLoginOtp('4821');
                  setLoginStep('OTP');
                }}
                className="w-full py-3.5 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all min-h-[48px]"
              >
                Request OTP to Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 p-3 sm:p-3.5 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-800 flex items-center justify-between">
                <span>OTP sent to +91 {loginPhone}:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                  {generatedLoginOtp}
                </span>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-1.5">
                  Enter 4-Digit Verification OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value)}
                  placeholder="4821"
                  className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-300 font-mono font-bold text-center text-xl text-slate-900 focus:outline-none focus:border-[#155EEF] min-h-[48px]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  const targetDriver =
                    existingDrivers.find((d) => d.phone.includes(loginPhone)) || existingDrivers[0];
                  onLoginExistingDriver(targetDriver);
                }}
                className="w-full py-3.5 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all min-h-[48px]"
              >
                Verify &amp; Open Partner App
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
