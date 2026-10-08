import React, { useEffect, useState } from 'react';
import { DriverOffer, DriverProfile, Order } from '../../types';
import { Radio, Check, X, Clock, IndianRupee, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { sound } from '../../services/soundService';

interface GlobalDispatchBannerProps {
  offer: DriverOffer | null;
  drivers: DriverProfile[];
  activeOrder: Order | null;
  currentRole: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onForceAssignFleet: (orderId: string) => void;
  onSwitchToDriverRole: (driverId: string) => void;
}

export const GlobalDispatchBanner: React.FC<GlobalDispatchBannerProps> = ({
  offer,
  drivers,
  activeOrder,
  currentRole,
  onAcceptOffer,
  onRejectOffer,
  onForceAssignFleet,
  onSwitchToDriverRole
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25);

  useEffect(() => {
    if (!offer) return;

    const calculateRemaining = () => {
      const left = Math.max(0, Math.round((offer.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(left);
    };

    calculateRemaining();
    const timer = setInterval(calculateRemaining, 1000);
    return () => clearInterval(timer);
  }, [offer]);

  if (!offer && (!activeOrder || activeOrder.status !== 'SEARCHING_DRIVER')) {
    return null;
  }

  // Find target driver
  const targetDriver = offer
    ? drivers.find((d) => d.id === offer.driverId) || drivers[0]
    : null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 max-w-xl w-full mx-auto md:mx-0 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-950/95 text-white border-2 border-[#155EEF] rounded-2xl p-4 shadow-2xl backdrop-blur-xl ring-1 ring-blue-500/30 space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 tracking-wide uppercase">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Real-Time Dispatch Radar</span>
            </div>
          </div>

          {offer && (
            <div className="flex items-center gap-1.5 bg-slate-800/90 text-amber-300 px-2.5 py-1 rounded-full border border-slate-700 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{secondsRemaining}s to auto-cascade</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        {offer && targetDriver ? (
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src={targetDriver.photo}
                  alt={targetDriver.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#155EEF]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{targetDriver.name}</span>
                    <span className="text-[10px] bg-blue-900/80 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                      {targetDriver.vehicleModel.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Pinging partner • {offer.pickupDistanceKm} km from pickup
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">Driver Net Earning</span>
                <span className="text-base font-extrabold text-[#FF8A00] flex items-center justify-end font-mono">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {offer.estimatedEarning}
                </span>
              </div>
            </div>

            {/* Quick Trip Route Snippet */}
            <div className="text-xs text-slate-300 flex items-center justify-between px-1">
              <span className="truncate max-w-[200px] text-slate-200">
                Pickup: {offer.order.pickup.address.split(',')[0]}
              </span>
              <span className="text-slate-400">→</span>
              <span className="truncate max-w-[200px] text-slate-200 text-right">
                Drop: {offer.order.drop.address.split(',')[0]}
              </span>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => {
                  sound.playSuccess();
                  onAcceptOffer(offer.id);
                }}
                className="col-span-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2 px-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
                title="Accept trip as driver"
              >
                <Check className="w-4 h-4" />
                <span>Accept Trip</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onRejectOffer(offer.id);
                }}
                className="col-span-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 px-2 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1"
                title="Pass offer to next nearby driver in queue"
              >
                <X className="w-3.5 h-3.5 text-red-400" />
                <span>Pass to Next</span>
              </button>

              {currentRole !== 'DRIVER' ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    onSwitchToDriverRole(targetDriver.id);
                  }}
                  className="col-span-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/50 font-bold text-xs py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <span>Driver Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onForceAssignFleet(offer.orderId)}
                  className="col-span-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Instant Fleet</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Searching state without offer yet */
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Searching verified fleet partners within 10 km...
              </span>
              <button
                onClick={() => activeOrder && onForceAssignFleet(activeOrder.id)}
                className="bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-lg transition-transform"
              >
                Instant Assign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
