import React, { useState } from 'react';
import { DriverProfile, Order, DriverOffer } from '../../types';
import { DriverActiveTrip } from './DriverActiveTrip';
import { DriverEarnings } from './DriverEarnings';
import { DriverKycOnboarding } from './DriverKycOnboarding';
import { DriverOrderOfferModal } from './DriverOrderOfferModal';
import { StatusBadge } from '../common/StatusBadge';
import {
  Power,
  Truck,
  TrendingUp,
  FileText,
  User,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  Navigation,
  ArrowRight,
  Clock
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface DriverDashboardProps {
  driver: DriverProfile;
  orders: Order[];
  incomingOffer: DriverOffer | null;
  allDrivers?: DriverProfile[];
  onSelectDriver?: (driverId: string) => void;
  onToggleOnline: () => void;
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onVerifyOtp: (orderId: string, otp: string, receiverName: string) => { success: boolean; message: string };
  onConfirmCash: (orderId: string) => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  driver,
  orders,
  incomingOffer,
  allDrivers = [],
  onSelectDriver,
  onToggleOnline,
  onAcceptOffer,
  onRejectOffer,
  onUpdateStatus,
  onVerifyOtp,
  onConfirmCash
}) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'TRIPS' | 'EARNINGS' | 'KYC'>('HOME');

  // Find if driver has an ongoing trip
  const activeTrip = orders.find(
    (o) => o.driverId === driver.id && o.status !== 'COMPLETED' && !o.status.startsWith('CANCELLED')
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Driver Profile Switcher Bar */}
      {allDrivers.length > 1 && onSelectDriver && (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-300">Active Driver Profile:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {allDrivers.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  sound.playClick();
                  onSelectDriver(d.id);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  d.id === driver.id
                    ? 'bg-[#155EEF] text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{d.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({d.vehicleModel.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Incoming Offer Modal (If dispatched to this driver or pending) */}
      {incomingOffer && (
        <DriverOrderOfferModal
          offer={incomingOffer}
          onAccept={onAcceptOffer}
          onReject={onRejectOffer}
        />
      )}

      {/* Driver Header with Big Online Toggle */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={driver.photo}
            alt={driver.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#155EEF] shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{driver.name}</h2>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{driver.rating}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {driver.vehicleModel} • <span className="font-mono">{driver.vehicleNumber}</span>
            </p>
          </div>
        </div>

        {/* Big Online/Offline Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <div className="text-right">
            <span
              className={`text-xs font-bold uppercase tracking-wider block ${
                driver.isOnline ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {driver.isOnline ? 'ONLINE (READY)' : 'OFFLINE'}
            </span>
            <span className="text-[10px] text-slate-400">
              {driver.isOnline ? 'Matching orders' : 'No requests'}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onToggleOnline();
            }}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer focus:outline-none ${
              driver.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform flex items-center justify-center ${
                driver.isOnline ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Power
                className={`w-3.5 h-3.5 ${
                  driver.isOnline ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Driver Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
        {[
          { id: 'HOME', label: 'Home Dashboard', icon: Truck },
          { id: 'TRIPS', label: 'All Trips', icon: Navigation },
          { id: 'EARNINGS', label: 'Earnings', icon: TrendingUp },
          { id: 'KYC', label: 'Documents / KYC', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Trip ongoing banner/view */}
      {activeTab === 'HOME' && activeTrip && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Current Assigned Order</span>
            </h3>
            <StatusBadge status={activeTrip.status} size="sm" />
          </div>

          <DriverActiveTrip
            order={activeTrip}
            onUpdateStatus={(st) => onUpdateStatus(activeTrip.id, st)}
            onVerifyOtp={(otp, rec) => onVerifyOtp(activeTrip.id, otp, rec)}
            onConfirmCash={() => onConfirmCash(activeTrip.id)}
            onFinishTrip={() => {
              setActiveTab('EARNINGS');
            }}
          />
        </div>
      )}

      {/* Home: When no active trip */}
      {activeTab === 'HOME' && !activeTrip && (
        <div className="space-y-6">
          {/* Status banner */}
          {driver.isOnline ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-bold text-emerald-950 text-base">You are Online & Ready</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Trip requests for <span className="font-semibold">{driver.vehicleModel}</span> in your vicinity will trigger an incoming alert with pickup details and net earnings.
              </p>
            </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-2xl flex items-center justify-center mx-auto">
                <Power className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">You are Offline</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Switch to ONLINE using the toggle at the top to receive trip dispatch requests.
              </p>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-400 font-semibold block">Today&apos;s Earnings</span>
              <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                ₹{driver.todaysEarnings}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-400 font-semibold block">Total Trips</span>
              <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                {driver.totalTrips}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-400 font-semibold block">Acceptance Rate</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-1 block">
                {driver.acceptanceRate}%
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] text-slate-400 font-semibold block">Partner Rating</span>
              <span className="text-xl font-extrabold text-amber-500 mt-1 block">
                {driver.rating} ★
              </span>
            </div>
          </div>
        </div>
      )}

      {/* All Trips Tab */}
      {activeTab === 'TRIPS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Trip History</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {orders
              .filter((o) => o.driverId === driver.id)
              .map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{o.id}</span>
                      <StatusBadge status={o.status} size="sm" />
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {o.pickup.address.split(',')[0]} → {o.drop.address.split(',')[0]}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">
                      ₹{o.fareBreakdown.driverNetEarnings}
                    </span>
                    <span className="block text-[10px] text-slate-400">{o.payment.method}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'EARNINGS' && (
        <DriverEarnings driver={driver} orders={orders} />
      )}

      {/* KYC Tab */}
      {activeTab === 'KYC' && (
        <DriverKycOnboarding driver={driver} />
      )}
    </div>
  );
};
