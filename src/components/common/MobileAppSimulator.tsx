import React, { useState } from 'react';
import { VehicleConfig, Order, Coupon, User, DriverProfile, DriverOffer } from '../../types';
import { LodzaLogo } from './LodzaLogo';
import { FareCalculationService } from '../../services/fareService';
import { INDIAN_CITIES } from '../../data/cityData';
import { LocationService } from '../../services/locationService';
import {
  Smartphone,
  Truck,
  MapPin,
  Navigation,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Star,
  FileText,
  User as UserIcon,
  Bell,
  Search,
  X,
  CreditCard,
  Radio,
  Power,
  Package,
  KeyRound,
  Phone,
  IndianRupee,
  Zap,
  TrendingUp,
  Download
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface MobileAppSimulatorProps {
  vehicles: VehicleConfig[];
  orders: Order[];
  coupons: Coupon[];
  currentUser: User;
  isCustomerLoggedIn: boolean;
  drivers?: DriverProfile[];
  incomingOffer?: DriverOffer | null;
  onCloseSimulator: () => void;
  onTriggerBooking: (params: { pickup: string; drop: string; vehicleId: string }) => void;
  onOpenAuth: () => void;
  onOpenDriverApp: () => void;
  onAcceptOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
  onUpdateTripStatus?: (orderId: string, status: Order['status']) => void;
  onVerifyOtp?: (orderId: string, otp: string, receiverName: string) => { success: boolean; message: string };
  onConfirmCash?: (orderId: string) => void;
  onInstallPwa?: () => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  vehicles,
  orders,
  coupons,
  currentUser,
  isCustomerLoggedIn,
  drivers = [],
  incomingOffer = null,
  onCloseSimulator,
  onTriggerBooking,
  onOpenAuth,
  onOpenDriverApp,
  onAcceptOffer,
  onRejectOffer,
  onUpdateTripStatus,
  onVerifyOtp,
  onConfirmCash,
  onInstallPwa
}) => {
  const [appMode, setAppMode] = useState<'CUSTOMER' | 'DRIVER'>('CUSTOMER');
  const [customerTab, setCustomerTab] = useState<'HOME' | 'ACTIVITY' | 'ACCOUNT'>('HOME');
  const [selectedCityId, setSelectedCityId] = useState('mumbai');
  const [selectedVehicleId, setSelectedVehicleId] = useState('veh_mini_truck');

  // Driver mode specific state
  const activeDriver = drivers[0] || {
    id: 'drv_ramesh',
    name: 'Ramesh Kumar',
    phone: '+91 98190 44211',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    vehicleModel: 'Tata Ace Gold',
    vehicleNumber: 'MH 02 BG 4421',
    rating: 4.88,
    isOnline: true,
    todaysEarnings: 1450,
    totalTrips: 342
  };
  const [driverOnline, setDriverOnline] = useState(true);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Customer inputs
  const currentCity = INDIAN_CITIES.find((c) => c.id === selectedCityId) || INDIAN_CITIES[0];
  const [pickup, setPickup] = useState(currentCity.defaultPickup);
  const [drop, setDrop] = useState(currentCity.defaultDrop);

  const dynamicRoute = LocationService.calculateRoute(pickup, drop, selectedCityId);
  const distanceKm = dynamicRoute.distanceKm;

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[1] || vehicles[0];
  const mobileFare = FareCalculationService.calculateFare({
    vehicle: selectedVehicle,
    distanceKm: distanceKm,
    durationMin: Math.round(distanceKm * 2.8)
  });

  const activeTrip = orders.find(
    (o) => o.status !== 'COMPLETED' && !o.status.startsWith('CANCELLED')
  ) || orders[0];

  const handleCityChange = (cityId: string) => {
    sound.playClick();
    setSelectedCityId(cityId);
    const newCity = INDIAN_CITIES.find((c) => c.id === cityId);
    if (newCity) {
      setPickup(newCity.defaultPickup);
      setDrop(newCity.defaultDrop);
    }
  };

  const handleConfirmMobileBook = () => {
    sound.playSuccess();
    if (!isCustomerLoggedIn) {
      onOpenAuth();
    } else {
      onTriggerBooking({
        pickup,
        drop,
        vehicleId: selectedVehicleId
      });
      setCustomerTab('ACTIVITY');
    }
  };

  const handleOtpVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !onVerifyOtp) return;
    const res = onVerifyOtp(activeTrip.id, enteredOtp, activeTrip.customerName);
    if (res.success) {
      sound.playSuccess();
      setOtpError('');
      setEnteredOtp('');
    } else {
      setOtpError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      {/* Top Floating Controls Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/95 text-white px-4 py-2 rounded-full border border-slate-700 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Smartphone className="w-4 h-4 text-[#155EEF]" />
          <span>Mobile Device Preview</span>
        </div>

        {/* Mode Selector inside Top Bar */}
        <div className="flex bg-slate-800 p-0.5 rounded-full border border-slate-700 text-xs font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setAppMode('CUSTOMER');
            }}
            className={`px-3 py-1 rounded-full transition-all ${
              appMode === 'CUSTOMER'
                ? 'bg-[#155EEF] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer App
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setAppMode('DRIVER');
            }}
            className={`px-3 py-1 rounded-full transition-all ${
              appMode === 'DRIVER'
                ? 'bg-[#FF8A00] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Driver Partner App
          </button>
        </div>

        {onInstallPwa && (
          <button
            onClick={() => {
              sound.playSuccess();
              onInstallPwa();
            }}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800"
            title="Install Real PWA to Home Screen"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install PWA</span>
          </button>
        )}

        <div className="h-4 w-px bg-slate-700" />
        <button
          onClick={onCloseSimulator}
          className="text-xs font-extrabold text-slate-400 hover:text-white flex items-center gap-1"
        >
          <span>Exit</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-800 flex flex-col my-auto mt-14 sm:mt-auto">
        {/* Phone Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Inner Phone Screen */}
        <div className="w-full h-full bg-[#F8FAFC] rounded-[40px] overflow-hidden flex flex-col relative shadow-inner text-slate-900 select-none">
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-slate-800 shrink-0 z-30">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-slate-800 rounded-xs p-0.5 flex items-center">
                <div className="w-3 h-1.5 bg-slate-800 rounded-xs" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* A. CUSTOMER MOBILE APP VIEW                              */}
          {/* ======================================================== */}
          {appMode === 'CUSTOMER' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Customer Header */}
              <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <LodzaLogo size="sm" showTagline={false} />
                  <span className="text-[10px] font-bold text-[#155EEF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {currentCity.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <select
                    value={selectedCityId}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="text-[10px] font-bold bg-slate-100 border border-slate-200 rounded-lg py-1 px-1.5 text-slate-700"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Body Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                {/* TAB 1: BOOK */}
                {customerTab === 'HOME' && (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Vehicle Slider Chips */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Select Vehicle Fleet
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {vehicles.slice(0, 4).map((v) => {
                          const isSel = v.id === selectedVehicleId;
                          return (
                            <button
                              key={v.id}
                              onClick={() => {
                                sound.playClick();
                                setSelectedVehicleId(v.id);
                              }}
                              className={`p-2.5 rounded-2xl border text-left transition-all ${
                                isSel
                                  ? 'bg-blue-50/70 border-[#155EEF] ring-1 ring-[#155EEF]'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <Truck className={`w-4 h-4 ${isSel ? 'text-[#155EEF]' : 'text-slate-500'}`} />
                                <span className="font-mono font-bold text-xs text-slate-900">
                                  ₹{v.minFare}
                                </span>
                              </div>
                              <h4 className="font-bold text-xs text-slate-900 truncate">{v.name}</h4>
                              <p className="text-[10px] text-slate-500">Cap: {v.capacityKg} kg</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Pickup
                        </label>
                        <input
                          type="text"
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          className="w-full mt-1 p-2 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs focus:outline-none focus:border-[#155EEF]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Drop Point
                        </label>
                        <input
                          type="text"
                          value={drop}
                          onChange={(e) => setDrop(e.target.value)}
                          className="w-full mt-1 p-2 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-900 text-xs focus:outline-none focus:border-[#155EEF]"
                        />
                      </div>
                    </div>

                    {/* Fare Summary & CTA */}
                    <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-2 shadow-md">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Tariff ({distanceKm} km trip)</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md">
                          GST Included
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-0.5 text-2xl font-black text-[#FF8A00] font-mono">
                          <span>₹</span>
                          <span>{mobileFare.finalFare}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {selectedVehicle.name} • ~{selectedVehicle.etaMinutes} mins arrival
                        </span>
                      </div>

                      <button
                        onClick={handleConfirmMobileBook}
                        className="w-full py-2.5 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>{isCustomerLoggedIn ? `Book ${selectedVehicle.name}` : 'Login to Book Ride'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: ACTIVITY */}
                {customerTab === 'ACTIVITY' && (
                  <div className="space-y-3 animate-in fade-in">
                    {activeTrip ? (
                      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-slate-400">
                              {activeTrip.id}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-xs">
                              {activeTrip.vehicleName}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#155EEF]">
                            {activeTrip.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Driver Card */}
                        {activeTrip.driverDetails ? (
                          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2">
                              <img
                                src={activeTrip.driverDetails.photo}
                                alt={activeTrip.driverDetails.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-300"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block text-xs">
                                  {activeTrip.driverDetails.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono block">
                                  {activeTrip.driverDetails.vehicleNumber}
                                </span>
                              </div>
                            </div>

                            <a
                              href={`tel:${activeTrip.driverDetails.phone}`}
                              className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          </div>
                        ) : (
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center space-y-1">
                            <div className="flex items-center justify-center gap-1 text-amber-800 font-bold text-[11px]">
                              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                              <span>Searching Nearby Partner...</span>
                            </div>
                            <p className="text-[10px] text-amber-700">
                              Dispatched to nearest driver. Acceptance window 25s.
                            </p>
                          </div>
                        )}

                        {/* Delivery OTP Badge */}
                        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-amber-800 font-bold block">
                              Delivery Verification OTP
                            </span>
                            <span className="text-[9px] text-amber-700 block">
                              Share with driver at drop
                            </span>
                          </div>
                          <span className="font-mono text-base font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-xs">
                            {activeTrip.verification.otp}
                          </span>
                        </div>

                        {/* Locations */}
                        <div className="space-y-1.5 text-[11px] text-slate-600">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{activeTrip.pickup.address}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{activeTrip.drop.address}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400 space-y-2">
                        <Package className="w-10 h-10 mx-auto text-slate-300" />
                        <p className="text-xs">No active deliveries currently.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: ACCOUNT */}
                {customerTab === 'ACCOUNT' && (
                  <div className="space-y-3 animate-in fade-in text-xs">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#155EEF] text-white flex items-center justify-center font-bold text-base">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{currentUser.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">{currentUser.phone}</p>
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                          Verified Customer
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      <div className="p-3 flex items-center justify-between">
                        <span className="font-semibold text-slate-700">LODZA Wallet</span>
                        <span className="font-mono font-bold text-slate-900">₹450.00</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Saved Addresses</span>
                        <span className="text-slate-400">3 Saved ›</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Bottom Navigation Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 flex items-center justify-between z-30">
                <button
                  onClick={() => {
                    sound.playClick();
                    setCustomerTab('HOME');
                  }}
                  className={`flex flex-col items-center gap-0.5 transition-colors ${
                    customerTab === 'HOME' ? 'text-[#155EEF]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Book</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setCustomerTab('ACTIVITY');
                  }}
                  className={`flex flex-col items-center gap-0.5 relative transition-colors ${
                    customerTab === 'ACTIVITY' ? 'text-[#155EEF]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Navigation className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Activity</span>
                  {activeTrip && (
                    <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-[#FF8A00]" />
                  )}
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setCustomerTab('ACCOUNT');
                  }}
                  className={`flex flex-col items-center gap-0.5 transition-colors ${
                    customerTab === 'ACCOUNT' ? 'text-[#155EEF]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Account</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* B. DRIVER PARTNER MOBILE APP VIEW                        */}
          {/* ======================================================== */}
          {appMode === 'DRIVER' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 text-white">
              {/* Driver Native Header */}
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeDriver.photo}
                    alt={activeDriver.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#155EEF]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white leading-tight">{activeDriver.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activeDriver.vehicleModel}
                    </span>
                  </div>
                </div>

                {/* Driver Online Toggle */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      driverOnline ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {driverOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setDriverOnline(!driverOnline);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      driverOnline ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        driverOnline ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Driver Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-6">
                {/* Driver Earnings & Trips Bar */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                    <span className="text-[10px] text-slate-400 font-medium">Today's Earnings</span>
                    <div className="flex items-center gap-0.5 text-lg font-black text-[#FF8A00] font-mono mt-0.5">
                      <IndianRupee className="w-4 h-4" />
                      <span>{activeDriver.todaysEarnings || 1450}</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                    <span className="text-[10px] text-slate-400 font-medium">Rating & Trips</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white mt-1">
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {activeDriver.rating}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span>{activeDriver.totalTrips || 342} trips</span>
                    </div>
                  </div>
                </div>

                {/* 1. INCOMING OFFER POPUP CARD (IF DISPATCHED) */}
                {incomingOffer ? (
                  <div className="bg-slate-950 border-2 border-[#155EEF] rounded-3xl p-4 text-white shadow-2xl space-y-3 relative overflow-hidden animate-in zoom-in-95">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Incoming Trip Alert</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                        25s countdown
                      </span>
                    </div>

                    <div className="bg-blue-900/40 p-3 rounded-2xl border border-blue-500/30 text-center">
                      <span className="text-[10px] text-blue-200">Trip Earnings</span>
                      <div className="text-2xl font-black text-[#FF8A00] font-mono flex items-center justify-center">
                        <IndianRupee className="w-5 h-5" />
                        <span>{incomingOffer.estimatedEarning}</span>
                      </div>
                      <span className="text-[10px] text-slate-300">
                        {incomingOffer.order.fareBreakdown.distanceKm} km • {incomingOffer.order.vehicleName}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{incomingOffer.order.pickup.address}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{incomingOffer.order.drop.address}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          onRejectOffer && onRejectOffer(incomingOffer.id);
                        }}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          onAcceptOffer && onAcceptOffer(incomingOffer.id);
                        }}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg"
                      >
                        ACCEPT TRIP
                      </button>
                    </div>
                  </div>
                ) : activeTrip && activeTrip.status !== 'COMPLETED' ? (
                  /* 2. ON-TRIP DRIVER WORKFLOW CONTROLS */
                  <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="font-mono text-slate-400 font-bold">{activeTrip.id}</span>
                      <span className="font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md">
                        {activeTrip.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">
                        Customer: {activeTrip.customerName}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">{activeTrip.customerPhone}</p>
                    </div>

                    {/* Step-by-Step Progress Actions */}
                    <div className="space-y-2 pt-1">
                      {activeTrip.status === 'DRIVER_ASSIGNED' && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpdateTripStatus && onUpdateTripStatus(activeTrip.id, 'DRIVER_ARRIVED_PICKUP');
                          }}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                        >
                          Arrived at Pickup Location →
                        </button>
                      )}

                      {activeTrip.status === 'DRIVER_ARRIVED_PICKUP' && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpdateTripStatus && onUpdateTripStatus(activeTrip.id, 'LOADING');
                          }}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl"
                        >
                          Confirm Goods Loaded →
                        </button>
                      )}

                      {activeTrip.status === 'LOADING' && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpdateTripStatus && onUpdateTripStatus(activeTrip.id, 'IN_TRANSIT');
                          }}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                        >
                          Start Journey (In Transit) →
                        </button>
                      )}

                      {activeTrip.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpdateTripStatus && onUpdateTripStatus(activeTrip.id, 'DRIVER_ARRIVED_DROP');
                          }}
                          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                        >
                          Arrived at Destination Drop →
                        </button>
                      )}

                      {(activeTrip.status === 'DRIVER_ARRIVED_DROP' ||
                        activeTrip.status === 'UNLOADING' ||
                        activeTrip.status === 'DELIVERY_VERIFICATION') && (
                        <form onSubmit={handleOtpVerifySubmit} className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-700">
                          <label className="text-[11px] font-bold text-amber-300 block">
                            Enter Customer Delivery OTP:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={enteredOtp}
                              onChange={(e) => setEnteredOtp(e.target.value)}
                              placeholder={`Try OTP: ${activeTrip.verification.otp}`}
                              className="flex-1 p-2 bg-slate-800 rounded-lg border border-slate-600 text-white font-mono text-center text-sm font-bold tracking-widest focus:outline-none focus:border-amber-400"
                            />
                            <button
                              type="submit"
                              className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                            >
                              Verify
                            </button>
                          </div>
                          {otpError && <p className="text-[10px] text-red-400">{otpError}</p>}
                        </form>
                      )}

                      {activeTrip.status === 'DELIVERY_VERIFICATION' && activeTrip.verification.isOtpVerified && (
                        <button
                          onClick={() => {
                            sound.playPaymentCollected();
                            onUpdateTripStatus && onUpdateTripStatus(activeTrip.id, 'COMPLETED');
                          }}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg"
                        >
                          Complete Delivery & Collect Fare ₹{activeTrip.fareBreakdown.finalFare}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* 3. RADAR SEARCHING FOR TRIPS */
                  <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 text-center space-y-3">
                    <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Radio className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Online & Ready in Mumbai</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        LODZA Dispatch Algorithm is scanning for orders matching your {activeDriver.vehicleModel}.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        sound.playIncomingOffer();
                        // Trigger dispatch simulation if user wants
                        if (orders[0]) {
                          onAcceptOffer && onAcceptOffer('demo_test');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-bold text-slate-200 rounded-xl transition-colors"
                    >
                      Pinging nearby hubs
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 rounded-full z-40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
