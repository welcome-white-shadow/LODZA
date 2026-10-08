import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { LiveMapSimulator } from '../common/LiveMapSimulator';
import { StatusBadge } from '../common/StatusBadge';
import {
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  KeyRound,
  Camera,
  IndianRupee,
  ShieldCheck,
  Package,
  AlertTriangle
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface DriverActiveTripProps {
  order: Order;
  onUpdateStatus: (targetStatus: OrderStatus) => void;
  onVerifyOtp: (otp: string, receiverName: string) => { success: boolean; message: string };
  onConfirmCash: () => void;
  onFinishTrip: () => void;
}

export const DriverActiveTrip: React.FC<DriverActiveTripProps> = ({
  order,
  onUpdateStatus,
  onVerifyOtp,
  onConfirmCash,
  onFinishTrip
}) => {
  const [inputOtp, setInputOtp] = useState('');
  const [receiverNameInput, setReceiverNameInput] = useState(order.drop.contactName);
  const [otpError, setOtpError] = useState('');
  const [waitingSeconds, setWaitingSeconds] = useState(120); // 2 mins elapsed
  const [signatureDone, setSignatureDone] = useState(false);
  const [photoSnapped, setPhotoSnapped] = useState(false);

  // Timer simulation for waiting time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (order.status === 'DRIVER_ARRIVED_PICKUP' || order.status === 'LOADING') {
      interval = setInterval(() => {
        setWaitingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [order.status]);

  const formatWaitingTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    const res = onVerifyOtp(inputOtp, receiverNameInput);
    if (!res.success) {
      setOtpError(res.message);
    } else {
      sound.playSuccess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Trip Card */}
      <div className="bg-[#0B1F3A] text-white p-5 rounded-3xl shadow-lg border border-blue-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-300">
              {order.id}
            </span>
            <StatusBadge status={order.status} size="sm" />
          </div>

          <div className="flex items-center gap-1 text-sm font-extrabold text-[#FF8A00]">
            <IndianRupee className="w-4 h-4" />
            <span>₹{order.fareBreakdown.driverNetEarnings} Earning</span>
          </div>
        </div>

        {/* Customer contact banner */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            <p className="text-xs text-slate-400">Customer</p>
            <p className="font-bold text-sm text-white">{order.customerName}</p>
          </div>
          <a
            href={`tel:${order.customerPhone}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Customer</span>
          </a>
        </div>
      </div>

      {/* Map Simulator */}
      <div className="bg-white rounded-3xl p-1.5 shadow-sm border border-slate-200 overflow-hidden">
        <LiveMapSimulator
          pickup={order.pickup}
          drop={order.drop}
          stops={order.stops}
          status={order.status}
          vehicleName={order.vehicleName}
          driverName={order.driverDetails?.name || 'You'}
          height="h-64 sm:h-72"
        />
      </div>

      {/* DRIVER LIFECYCLE ACTION PANELS */}

      {/* Phase 1: Going to Pickup */}
      {(order.status === 'DRIVER_ASSIGNED' || order.status === 'DRIVER_EN_ROUTE_PICKUP') && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#155EEF] flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                Next Action: Head to Pickup
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {order.pickup.address}
              </h3>
              {order.pickup.landmark && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Landmark: {order.pickup.landmark}
                </p>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <p>
              <strong>Contact at Pickup:</strong> {order.pickup.contactName} ({order.pickup.contactPhone})
            </p>
            <p>
              <strong>Cargo:</strong> {order.goods.category} (~{order.goods.approxWeightKg} kg, {order.goods.packageCount} units)
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onUpdateStatus('DRIVER_ARRIVED_PICKUP');
            }}
            className="w-full py-4 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I HAVE ARRIVED AT PICKUP POINT</span>
          </button>
        </div>
      )}

      {/* Phase 2: Arrived at Pickup & Loading */}
      {order.status === 'DRIVER_ARRIVED_PICKUP' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Waiting Timer Active</span>
            </div>
            <span className="font-mono font-bold text-amber-900 text-sm">
              {formatWaitingTimer(waitingSeconds)}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            You are at the pickup premises. Verify items with the customer before loading onto your vehicle deck.
          </p>

          <button
            onClick={() => {
              sound.playClick();
              onUpdateStatus('LOADING');
            }}
            className="w-full py-4 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            <span>START LOADING GOODS</span>
          </button>
        </div>
      )}

      {/* Phase 3: Loading in Progress */}
      {order.status === 'LOADING' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="text-center py-2 space-y-1">
            <Package className="w-10 h-10 text-[#155EEF] mx-auto animate-bounce" />
            <h3 className="font-bold text-slate-900 text-base">Loading Goods in Progress</h3>
            <p className="text-xs text-slate-500">
              Ensure all packages are secured safely before hitting the road.
            </p>
          </div>

          {order.goods.handlingInstructions && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
              ⚠️ Handling Notes: {order.goods.handlingInstructions}
            </div>
          )}

          <button
            onClick={() => {
              sound.playSuccess();
              onUpdateStatus('IN_TRANSIT');
            }}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            <span>GOODS LOADED • START TRIP TO DROP</span>
          </button>
        </div>
      )}

      {/* Phase 4: In Transit towards Drop */}
      {(order.status === 'TRIP_STARTED' || order.status === 'IN_TRANSIT') && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                En Route to Drop Destination
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {order.drop.address}
              </h3>
              {order.drop.landmark && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Landmark: {order.drop.landmark}
                </p>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 flex justify-between">
            <span>Receiver: {order.drop.contactName}</span>
            <span className="font-mono font-bold text-slate-800">{order.drop.contactPhone}</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onUpdateStatus('DELIVERY_VERIFICATION');
            }}
            className="w-full py-4 bg-[#155EEF] hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>ARRIVED AT DROP • BEGIN VERIFICATION</span>
          </button>
        </div>
      )}

      {/* Phase 5: Delivery Verification (OTP, POD, Signature) */}
      {(order.status === 'DRIVER_ARRIVED_DROP' ||
        order.status === 'UNLOADING' ||
        order.status === 'DELIVERY_VERIFICATION') && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
            <KeyRound className="w-5 h-5" />
            <span>Delivery Verification & Handover</span>
          </div>

          <p className="text-xs text-slate-600">
            Ask the receiver/customer for the <strong>4-digit LODZA delivery security OTP</strong> displayed in their customer app.
          </p>

          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter 4-Digit Receiver OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                placeholder="e.g. 4821"
                className="w-full text-center font-mono font-bold text-2xl tracking-widest p-3 rounded-2xl border-2 border-violet-300 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-200 bg-violet-50/30"
              />
            </div>

            {otpError && (
              <p className="text-xs font-bold text-red-600 text-center">{otpError}</p>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receiver Name
              </label>
              <input
                type="text"
                value={receiverNameInput}
                onChange={(e) => setReceiverNameInput(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200"
              />
            </div>

            {/* Proof of Delivery / Signature simulation buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setPhotoSnapped(!photoSnapped);
                }}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-semibold transition-colors ${
                  photoSnapped
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{photoSnapped ? '✓ POD Photo Taken' : '+ Take POD Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSignatureDone(!signatureDone);
                }}
                className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-semibold transition-colors ${
                  signatureDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{signatureDone ? '✓ Signature Done' : '+ Sign on Screen'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>VERIFY OTP & COMPLETE DELIVERY</span>
            </button>
          </form>
        </div>
      )}

      {/* Phase 6: Cash Collection (If cash booking) */}
      {order.status === 'PAYMENT_PENDING_CASH' && (
        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4 text-center">
          <div className="w-12 h-12 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center mx-auto">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-950 text-lg">
              Collect ₹{order.fareBreakdown.finalFare} in Cash
            </h3>
            <p className="text-xs text-amber-800 mt-1">
              Customer selected Cash on Delivery. Please collect the exact fare from receiver before closing.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playSuccess();
              onConfirmCash();
            }}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:scale-[1.02]"
          >
            I HAVE COLLECTED ₹{order.fareBreakdown.finalFare} CASH
          </button>
        </div>
      )}

      {/* Phase 7: Trip Completed Celebration */}
      {order.status === 'COMPLETED' && (
        <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-300 shadow-md space-y-4 text-center">
          <div className="w-14 h-14 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-emerald-950 text-xl">Trip Completed!</h3>
            <p className="text-xs text-emerald-800 mt-1">
              Delivery verified and recorded into LODZA operations ledger.
            </p>
          </div>

          {/* Earnings summary card */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs space-y-1.5 text-left">
            <div className="flex justify-between text-slate-600">
              <span>Gross Freight Fare:</span>
              <span className="font-semibold text-slate-800">₹{order.fareBreakdown.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>LODZA Platform Commission (15%):</span>
              <span className="text-slate-800">-₹{order.fareBreakdown.platformCommissionAmount}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-emerald-800 font-extrabold text-sm">
              <span>Your Net Earning:</span>
              <span>₹{order.fareBreakdown.driverNetEarnings}</span>
            </div>
          </div>

          <button
            onClick={onFinishTrip}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Back to Driver Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
