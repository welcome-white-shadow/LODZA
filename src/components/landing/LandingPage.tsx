import React, { useState, useEffect } from 'react';
import { VehicleConfig, Coupon } from '../../types';
import { LodzaLogo } from '../common/LodzaLogo';
import { FareCalculationService } from '../../services/fareService';
import { INDIAN_CITIES, CityConfig, CityHub } from '../../data/cityData';
import { LocationService, LocationSuggestion } from '../../services/locationService';
import { LandingFooter } from './LandingFooter';
import porterStyleHeroImg from '../../assets/images/lodza_porter_style_hero_1791403721994.jpg';
import tataAceImg from '../../assets/images/lodza_tata_ace_1791402464110.jpg';
import packersMoversImg from '../../assets/images/lodza_packers_movers_1791402476477.jpg';
import enterpriseB2bImg from '../../assets/images/lodza_enterprise_b2b_1791402488351.jpg';
import heroFleetImg from '../../assets/images/lodza_hero_fleet_1791402450391.jpg';
import {
  Truck,
  Bike,
  Package,
  Building2,
  ShieldCheck,
  Clock,
  Navigation,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Star,
  MapPin,
  IndianRupee,
  Phone,
  FileText,
  Weight,
  Layers,
  Sparkles,
  HelpCircle,
  Smartphone,
  Sofa,
  Box,
  Lamp,
  ShieldAlert,
  Sliders,
  Check,
  Send,
  Zap,
  Play,
  ArrowUpDown,
  Search,
  X
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface LandingPageProps {
  vehicles: VehicleConfig[];
  coupons: Coupon[];
  isCustomerLoggedIn: boolean;
  onStartBookingWithParams: (params: {
    pickupAddress: string;
    dropAddress: string;
    vehicleId: string;
    serviceCategory?: string;
  }) => void;
  onTrackOrderClick: () => void;
  onSwitchToDriver: () => void;
  onSwitchToAdmin: () => void;
  onOpenSupport: () => void;
  onOpenAppDownloadModal: () => void;
  onOpenMobileSimulator: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  vehicles,
  coupons,
  isCustomerLoggedIn,
  onStartBookingWithParams,
  onTrackOrderClick,
  onSwitchToDriver,
  onSwitchToAdmin,
  onOpenSupport,
  onOpenAppDownloadModal,
  onOpenMobileSimulator,
  onOpenAuth
}) => {
  // Active city selection from INDIAN_CITIES
  const [selectedCityId, setSelectedCityId] = useState('mumbai');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const activeCity: CityConfig =
    INDIAN_CITIES.find((c) => c.id === selectedCityId) || INDIAN_CITIES[0];

  // Selected Service category
  const [selectedService, setSelectedService] = useState<'TRUCK' | 'TWO_WHEELER' | 'PACKERS' | 'ENTERPRISE'>('TRUCK');

  // Custom Pickup & Drop addresses
  const [pickupInput, setPickupInput] = useState(activeCity.defaultPickup);
  const [dropInput, setDropInput] = useState(activeCity.defaultDrop);

  // Autocomplete Suggestions State
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion[]>([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);

  // Dynamic Route calculation
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMin: number;
    routeVia: string;
  }>({
    distanceKm: activeCity.defaultDistanceKm,
    durationMin: Math.round(activeCity.defaultDistanceKm * 2.8),
    routeVia: 'Western Express Hwy / JVLR'
  });

  // Rate Estimator distance slider widget state
  const [calcDistanceKm, setCalcDistanceKm] = useState(14);
  const [calcVehicleId, setCalcVehicleId] = useState('veh_mini_truck');

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Recalculate route whenever pickup or drop changes
  useEffect(() => {
    const route = LocationService.calculateRoute(pickupInput, dropInput, selectedCityId);
    setRouteInfo(route);
  }, [pickupInput, dropInput, selectedCityId]);

  const handleCitySelect = (city: CityConfig) => {
    sound.playClick();
    setSelectedCityId(city.id);
    setIsCityDropdownOpen(false);
    setPickupInput(city.defaultPickup);
    setDropInput(city.defaultDrop);
  };

  const handlePickupChange = (val: string) => {
    setPickupInput(val);
    if (val.trim().length > 1) {
      setPickupSuggestions(LocationService.search(val, selectedCityId));
      setShowPickupDropdown(true);
    } else {
      setShowPickupDropdown(false);
    }
  };

  const handleDropChange = (val: string) => {
    setDropInput(val);
    if (val.trim().length > 1) {
      setDropSuggestions(LocationService.search(val, selectedCityId));
      setShowDropDropdown(true);
    } else {
      setShowDropDropdown(false);
    }
  };

  const handleSwapAddresses = () => {
    sound.playClick();
    const temp = pickupInput;
    setPickupInput(dropInput);
    setDropInput(temp);
  };

  const getVehicleForService = () => {
    switch (selectedService) {
      case 'TWO_WHEELER':
        return vehicles.find((v) => v.category === 'two_wheeler') || vehicles[0];
      case 'PACKERS':
        return vehicles.find((v) => v.id === 'veh_pickup_8ft') || vehicles[2] || vehicles[0];
      case 'ENTERPRISE':
        return vehicles.find((v) => v.id === 'veh_truck_14ft') || vehicles[3] || vehicles[0];
      case 'TRUCK':
      default:
        return vehicles.find((v) => v.id === 'veh_mini_truck') || vehicles[1] || vehicles[0];
    }
  };

  const heroVehicle = getVehicleForService();
  const heroFareEstimate = FareCalculationService.calculateFare({
    vehicle: heroVehicle,
    distanceKm: routeInfo.distanceKm,
    durationMin: routeInfo.durationMin
  });

  const handleHeroEstimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();

    onStartBookingWithParams({
      pickupAddress: pickupInput,
      dropAddress: dropInput,
      vehicleId: heroVehicle.id,
      serviceCategory: selectedService
    });
  };

  const calcVehicle = vehicles.find((v) => v.id === calcVehicleId) || vehicles[1] || vehicles[0];
  const calcFare = FareCalculationService.calculateFare({
    vehicle: calcVehicle,
    distanceKm: calcDistanceKm,
    durationMin: Math.round(calcDistanceKm * 2.8)
  });

  return (
    <div className="space-y-16 lg:space-y-24 text-slate-900 -mt-2">
      {/* =========================================================================
          1. HERO SECTION WITH ACCURATE DYNAMIC RATE ESTIMATOR CARD
         ========================================================================= */}
      <section className="relative">
        {/* Panoramic Banner Container */}
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900">
          <img
            src={porterStyleHeroImg}
            alt="LODZA Fleet"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/lodza_porter_style_hero_1791403721994.jpg';
            }}
            className="w-full h-full object-cover object-center"
          />

          {/* Atmospheric gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />

          {/* Headline Text Overlay */}
          <div className="absolute top-6 sm:top-12 md:top-16 left-4 sm:left-10 md:left-16 max-w-xl text-white space-y-2 sm:space-y-3 z-10 pr-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-orange-500/40 text-[11px] sm:text-xs font-extrabold text-[#FF8A00] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>LODZA • Move. Deliver. Done.</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
              <span className="block font-medium text-slate-100">Delivery Aapki,</span>
              <span className="block font-extrabold text-white">Transport Hamara</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 max-w-md pt-0.5 sm:pt-1 drop-shadow leading-relaxed">
              On-demand intra-city mini trucks, 2-wheelers, and house shifting services across {activeCity.name}. Regulated per-km rates with zero surge pricing.
            </p>

            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ~{activeCity.avgPickupTimeMin} mins arrival
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Live GPS tracking
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                GST compliant
              </span>
            </div>
          </div>
        </div>

        {/* Floating Estimate Card (Overlapping Banner exactly like Porter.in) */}
        <div className="relative -mt-16 sm:-mt-24 md:-mt-32 max-w-5xl mx-auto px-2 sm:px-4 z-20">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl border border-slate-200 space-y-4 sm:space-y-5">
            {/* Top Bar: City Selector & Dispatch Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-2.5 sm:gap-3">
              {/* Interactive City Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800 hover:text-[#155EEF] px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 sm:border-transparent hover:border-slate-200"
                >
                  <MapPin className="w-4 h-4 text-[#155EEF]" />
                  <span>City:</span>
                  <span className="text-[#155EEF] font-black underline decoration-blue-300 underline-offset-4">
                    {activeCity.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isCityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Choose Operating City
                    </div>
                    {INDIAN_CITIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleCitySelect(c)}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          selectedCityId === c.id
                            ? 'text-[#155EEF] bg-blue-50/70 font-bold'
                            : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <span className="block font-bold">{c.name}</span>
                          <span className="block text-[10px] text-slate-400">{c.state}</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {c.activeVehiclesCount}+ fleet
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Dispatch Badge & Shortcuts */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Instant Dispatch in {activeCity.name}</span>
                </div>

                {/* Driver Partner Shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSwitchToDriver();
                  }}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-[#155EEF] px-3 py-1 rounded-full border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <Truck className="w-3.5 h-3.5 text-[#FF8A00]" />
                  <span>Attach Vehicle</span>
                </button>

                {/* Mobile Simulator Shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenMobileSimulator();
                  }}
                  className="hidden md:flex items-center gap-1.5 text-xs font-extrabold text-[#155EEF] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full border border-blue-200 transition-colors"
                  title="Preview in Mobile App View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile Mode</span>
                </button>
              </div>
            </div>

            {/* Service Category Buttons (Truck, Two Wheeler, Packers & Movers, Enterprise) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {/* Option 1: Truck */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedService('TRUCK');
                }}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 ${
                  selectedService === 'TRUCK'
                    ? 'border-[#155EEF] bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#155EEF]">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#155EEF]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Truck</h3>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 block">From ₹180</span>
                </div>
              </button>

              {/* Option 2: Two Wheeler */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedService('TWO_WHEELER');
                }}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 ${
                  selectedService === 'TWO_WHEELER'
                    ? 'border-[#155EEF] bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#155EEF]">
                  <Bike className="w-5 h-5 sm:w-6 sm:h-6 text-[#155EEF]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Two Wheeler</h3>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 block">From ₹45</span>
                </div>
              </button>

              {/* Option 3: Packers & Movers */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedService('PACKERS');
                }}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 ${
                  selectedService === 'PACKERS'
                    ? 'border-[#155EEF] bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <Sofa className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Packers & Movers</h3>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 block">House Shifting</span>
                </div>
              </button>

              {/* Option 4: Enterprise B2B */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedService('ENTERPRISE');
                }}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 ${
                  selectedService === 'ENTERPRISE'
                    ? 'border-[#155EEF] bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Enterprise B2B</h3>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 block">Bulk Cargo</span>
                </div>
              </button>
            </div>

            {/* Custom Location Inputs with Real-time Autocomplete & Dynamic Distance */}
            <form onSubmit={handleHeroEstimateSubmit} className="space-y-3 sm:space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center relative">
                {/* Pickup Address Input */}
                <div className="md:col-span-5 space-y-1.5 relative">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      Pickup Point ({activeCity.name})
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Sender locality</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pickupInput}
                      onChange={(e) => handlePickupChange(e.target.value)}
                      onFocus={() => {
                        setPickupSuggestions(LocationService.search(pickupInput, selectedCityId));
                        setShowPickupDropdown(true);
                      }}
                      placeholder={`Type any custom pickup in ${activeCity.name}...`}
                      className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 min-h-[48px]"
                      required
                    />
                    {pickupInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setPickupInput('');
                          setShowPickupDropdown(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showPickupDropdown && pickupSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 max-h-52 overflow-y-auto animate-in fade-in">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                        <span>Matching Hubs in {activeCity.name}</span>
                        <button
                          type="button"
                          onClick={() => setShowPickupDropdown(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          Close
                        </button>
                      </div>
                      {pickupSuggestions.map((sug) => (
                        <div
                          key={sug.id}
                          onClick={() => {
                            sound.playClick();
                            setPickupInput(sug.fullAddress);
                            setShowPickupDropdown(false);
                          }}
                          className="px-3.5 py-2.5 hover:bg-blue-50/70 cursor-pointer text-left transition-colors border-b border-slate-50 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">{sug.title}</span>
                            <span className="text-[10px] font-semibold text-slate-400 capitalize px-1.5 py-0.5 rounded bg-slate-100">
                              {sug.type}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate">{sug.landmark} • {sug.area}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Hub Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">Popular:</span>
                    {activeCity.popularHubs.slice(0, 3).map((hub) => (
                      <button
                        key={hub.name}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setPickupInput(hub.fullAddress);
                          setShowPickupDropdown(false);
                        }}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition-colors"
                      >
                        {hub.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Swap Button in Center */}
                <div className="md:col-span-2 flex items-center justify-center my-0.5 md:my-0 md:pt-4">
                  <button
                    type="button"
                    onClick={handleSwapAddresses}
                    className="p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#155EEF] border border-slate-200 shadow-xs transition-transform hover:scale-110 flex items-center gap-1.5 text-xs font-bold"
                    title="Swap Pickup and Drop Locations"
                  >
                    <ArrowUpDown className="w-4 h-4 text-[#155EEF]" />
                    <span className="md:hidden">Swap Points</span>
                  </button>
                </div>

                {/* Drop Address Input */}
                <div className="md:col-span-5 space-y-1.5 relative">
                  <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                      Drop Point ({activeCity.name})
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Receiver locality</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={dropInput}
                      onChange={(e) => handleDropChange(e.target.value)}
                      onFocus={() => {
                        setDropSuggestions(LocationService.search(dropInput, selectedCityId));
                        setShowDropDropdown(true);
                      }}
                      placeholder={`Type any custom drop in ${activeCity.name}...`}
                      className="w-full px-3.5 sm:px-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 text-sm sm:text-base focus:outline-none focus:border-[#155EEF] focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50 min-h-[48px]"
                      required
                    />
                    {dropInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setDropInput('');
                          setShowDropDropdown(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Drop Autocomplete Dropdown */}
                  {showDropDropdown && dropSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 max-h-52 overflow-y-auto animate-in fade-in">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                        <span>Matching Destination Hubs in {activeCity.name}</span>
                        <button
                          type="button"
                          onClick={() => setShowDropDropdown(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          Close
                        </button>
                      </div>
                      {dropSuggestions.map((sug) => (
                        <div
                          key={sug.id}
                          onClick={() => {
                            sound.playClick();
                            setDropInput(sug.fullAddress);
                            setShowDropDropdown(false);
                          }}
                          className="px-3.5 py-2.5 hover:bg-blue-50/70 cursor-pointer text-left transition-colors border-b border-slate-50 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">{sug.title}</span>
                            <span className="text-[10px] font-semibold text-slate-400 capitalize px-1.5 py-0.5 rounded bg-slate-100">
                              {sug.type}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate">{sug.landmark} • {sug.area}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Drop Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">Popular:</span>
                    {activeCity.popularHubs.slice(3, 6).map((hub) => (
                      <button
                        key={hub.name}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setDropInput(hub.fullAddress);
                          setShowDropDropdown(false);
                        }}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition-colors"
                      >
                        {hub.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Live Route Intelligence Bar & Action */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                {/* Real-time Calculation Summary */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Fleet</span>
                    <span className="font-extrabold text-slate-900">{heroVehicle.name}</span>
                  </div>

                  <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Dynamic Distance</span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {routeInfo.distanceKm} km ({routeInfo.durationMin} mins)
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                      {routeInfo.routeVia}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Regulated Tariff</span>
                    <div className="flex items-baseline gap-1 text-base sm:text-lg font-black text-[#155EEF] font-mono">
                      <span>₹</span>
                      <span>{heroFareEstimate.finalFare}</span>
                      <span className="text-[10px] text-slate-400 font-sans font-normal">(incl. 5% GST)</span>
                    </div>
                  </div>
                </div>

                {/* Big Action Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 group shrink-0 min-h-[48px]"
                >
                  <span>Get an Estimate (~2 mins)</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. WHY CHOOSE LODZA (PORTER STANDARD)
         ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>~</span>
            <span className="text-slate-700">Why choose LODZA</span>
            <span>~</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            India&apos;s Most Reliable Logistics Experience
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered for seamless small-business freight, retail stock transport, and family home moves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Instant Dispatch</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nearby verified partner drivers matched in seconds. Average pickup arrival in 8-10 minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#155EEF] flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Economical & Regulated</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent per-km tariffs starting from ₹45. Zero hidden fees and zero monsoon surge multipliers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FF8A00] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Aadhaar &amp; Police KYC Verified</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every driver undergoes UIDAI Aadhaar verification, commercial DL validity checks, and OTP handoff at receiver doorstep.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-indigo-700 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Instant GST Invoices &amp; ITC</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated B2B tax invoices under SAC 996511 with input tax credit support sent immediately upon trip completion.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. OUR FLEET BREAKDOWN CARDS
         ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>~</span>
            <span className="text-slate-700">Fleet & Services</span>
            <span>~</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            A Vehicle for Every Weight & Volume
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: 2-Wheeler */}
          <div
            onClick={() => {
              sound.playClick();
              onStartBookingWithParams({
                pickupAddress: pickupInput,
                dropAddress: dropInput,
                vehicleId: 'veh_two_wheeler',
                serviceCategory: 'TWO_WHEELER'
              });
            }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white rounded-2xl flex items-center justify-center transition-colors">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Two Wheeler Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Documents, boxed gifts, clothing, food packets, pharmacy, and small shipments up to 20 kg.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#155EEF]">
              <span>Starting from ₹45</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Tata Ace */}
          <div
            onClick={() => {
              sound.playClick();
              onStartBookingWithParams({
                pickupAddress: pickupInput,
                dropAddress: dropInput,
                vehicleId: 'veh_mini_truck',
                serviceCategory: 'TRUCK'
              });
            }}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer flex flex-col justify-between space-y-3 group overflow-hidden"
          >
            <div className="h-28 rounded-2xl overflow-hidden relative bg-slate-100">
              <img
                src={tataAceImg}
                alt="Tata Ace Gold Mini Truck"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/lodza_tata_ace_1791402464110.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white font-mono text-[10px] rounded-md font-bold">
                850 kg Payload
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base">Tata Ace (Chhota Hathi)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The gold standard of Indian city logistics. 850 kg capacity for retail goods, cartons, and appliances.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#155EEF]">
              <span>Starting from ₹280</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Packers & Movers */}
          <div
            onClick={() => {
              sound.playClick();
              onStartBookingWithParams({
                pickupAddress: pickupInput,
                dropAddress: dropInput,
                vehicleId: 'veh_pickup_8ft',
                serviceCategory: 'PACKERS'
              });
            }}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer flex flex-col justify-between space-y-3 group overflow-hidden"
          >
            <div className="h-28 rounded-2xl overflow-hidden relative bg-slate-100">
              <img
                src={packersMoversImg}
                alt="Packers and Movers House Shifting"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/lodza_packers_movers_1791402476477.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-indigo-900/80 backdrop-blur-sm text-white font-mono text-[10px] rounded-md font-bold">
                1BHK - 3BHK Moves
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base">Packers & Movers</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete home relocation with expert packing crew, bubble wrap, protective blankets, and safe placement.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#155EEF]">
              <span>Verified Helpers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Enterprise B2B */}
          <div
            onClick={() => {
              sound.playClick();
              onStartBookingWithParams({
                pickupAddress: pickupInput,
                dropAddress: dropInput,
                vehicleId: 'veh_truck_14ft',
                serviceCategory: 'ENTERPRISE'
              });
            }}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer flex flex-col justify-between space-y-3 group overflow-hidden"
          >
            <div className="h-28 rounded-2xl overflow-hidden relative bg-slate-100">
              <img
                src={enterpriseB2bImg}
                alt="Enterprise B2B Logistics Eicher Truck"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/lodza_enterprise_b2b_1791402488351.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white font-mono text-[10px] rounded-md font-bold">
                3.5 Ton Containers
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base">Enterprise Bulk Freight</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                14ft Eicher containers for manufacturers, warehouse transfer, e-commerce, and FMCG distributors.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#155EEF]">
              <span>GST SAC 9965</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE LIVE FARE ESTIMATOR WIDGET (DISTANCE SLIDER)
         ========================================================================= */}
      <section className="bg-gradient-to-br from-[#0B1F3A] to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/40 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
              Transparent Calculator
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Interactive Tariff Estimator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Select vehicle and move the distance slider to preview exact regulated fares with zero surge multipliers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-800/60 p-6 sm:p-8 rounded-2xl border border-slate-700/80">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Select Vehicle Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {vehicles.map((v) => {
                  const isCur = calcVehicleId === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setCalcVehicleId(v.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCur
                          ? 'bg-[#155EEF] border-blue-400 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="font-bold text-xs block truncate">{v.name}</span>
                      <span className="text-[10px] opacity-75 block">Up to {v.capacityKg} kg</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Trip Distance:</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {calcDistanceKm} Kilometers
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={calcDistanceKm}
                onChange={(e) => setCalcDistanceKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF8A00]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 km (Ward)</span>
                <span>30 km (Cross-city)</span>
                <span>60 km (Outskirts)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Estimated Tariff</span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                GST Inclusive (5%)
              </span>
            </div>

            <div className="flex items-baseline gap-1 text-4xl font-extrabold text-white font-mono">
              <IndianRupee className="w-8 h-8 text-[#FF8A00]" />
              <span>{calcFare.finalFare}</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Base Fare (First {calcVehicle.baseDistanceKm} km):</span>
                <span className="font-mono">₹{calcFare.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance Charge ({calcDistanceKm} km):</span>
                <span className="font-mono">₹{calcFare.distanceCharge}</span>
              </div>
              <div className="flex justify-between">
                <span>Free Loading Allowance:</span>
                <span className="font-mono text-emerald-400">{calcVehicle.freeWaitingMin} mins</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playSuccess();
                onStartBookingWithParams({
                  pickupAddress: pickupInput,
                  dropAddress: dropInput,
                  vehicleId: calcVehicleId
                });
              }}
              className="w-full py-3.5 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Book {calcVehicle.name} for ₹{calcFare.finalFare}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. DRIVER PARTNER PROGRAM (EARN WITH LODZA)
         ========================================================================= */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
            Driver Partner Program
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Have a Vehicle? Earn up to ₹3,500/day.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Attach your 2-wheeler, 3-wheeler auto, Tata Ace, or truck with LODZA. Enjoy flexible working hours, guaranteed daily trips, and instant daily IMPS bank payouts.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
            <span>✓ Instant Mobile Onboarding</span>
            <span>✓ Daily Bank Settlements</span>
            <span>✓ Low 15% Platform Commission</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onSwitchToDriver();
          }}
          className="px-6 py-4 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0"
        >
          Open Driver Partner Portal &amp; Register →
        </button>
      </section>

      {/* =========================================================================
          6. FAQS ACCORDION
         ========================================================================= */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about LODZA logistics</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does LODZA calculate trip fares?',
              a: 'LODZA fares are strictly regulated and transparent. The tariff includes a base fare for the first 2 km, followed by an economical fixed per-kilometer rate and standard 5% Goods Transport Agency (GTA) GST. There are no sudden surge multipliers.'
            },
            {
              q: 'How do I verify the delivery at the drop location?',
              a: 'Every shipment is assigned a secure 4-digit Delivery Verification OTP. Once the driver reaches the destination, the receiver inspects the cargo and shares this OTP with the driver. Only after OTP validation is the trip completed.'
            },
            {
              q: 'Can I get a tax invoice with GST input credit?',
              a: 'Yes. An itemized GST tax invoice under SAC Code 996511 is generated automatically for every completed trip, ready to download or print.'
            },
            {
              q: 'How can I become a LODZA driver partner?',
              a: 'Any commercial driver with a valid driving license, Aadhaar card, vehicle RC, and insurance can register on the LODZA Partner app and start receiving trip orders within 24 hours of KYC verification.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-[#155EEF]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. COMPLETE PORTER-STYLE FOOTER
         ========================================================================= */}
      <LandingFooter
        onOpenAppDownloadModal={onOpenAppDownloadModal}
        onOpenSupport={onOpenSupport}
        onSelectCity={(cityName) => {
          const matched = INDIAN_CITIES.find(
            (c) => c.name.toLowerCase() === cityName.toLowerCase()
          );
          if (matched) handleCitySelect(matched);
        }}
        onSelectService={(serv) => {
          setSelectedService(serv as any);
        }}
      />
    </div>
  );
};
