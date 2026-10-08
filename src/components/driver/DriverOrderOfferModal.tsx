import React, { useEffect, useState } from 'react';
import { DriverOffer } from '../../types';
import { MapPin, Navigation, Clock, Check, X, IndianRupee, Truck } from 'lucide-react';
import { sound } from '../../services/soundService';

interface DriverOrderOfferModalProps {
  offer: DriverOffer;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
}

export const DriverOrderOfferModal: React.FC<DriverOrderOfferModalProps> = ({
  offer,
  onAccept,
  onReject
}) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    sound.playIncomingOffer();
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onReject(offer.id); // Timeout rejection
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [offer.id, onReject]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div className="bg-slate-900 border-2 border-[#155EEF] rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

        {/* Top Header: Badge & Countdown Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              New Trip Request
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 font-mono text-xs font-bold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Net Earning Highlight Card */}
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/40 rounded-2xl p-4 text-center">
          <span className="text-xs text-blue-200 font-medium">Estimated Net Earning</span>
          <div className="flex items-center justify-center gap-1 mt-1 text-3xl font-extrabold text-[#FF8A00]">
            <IndianRupee className="w-7 h-7" />
            <span>{offer.estimatedEarning}</span>
          </div>
          <span className="text-[11px] text-slate-300">
            {offer.order.fareBreakdown.distanceKm} km trip • {offer.order.vehicleName}
          </span>
        </div>

        {/* Pickup & Drop Points */}
        <div className="space-y-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                Pickup ({offer.pickupDistanceKm} km away)
              </span>
              <p className="font-semibold text-slate-100 text-sm">
                {offer.order.pickup.address}
              </p>
            </div>
          </div>

          <div className="w-0.5 h-3 bg-slate-600 ml-3" />

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-red-400 font-bold uppercase block">
                Destination Drop
              </span>
              <p className="font-semibold text-slate-100 text-sm">
                {offer.order.drop.address}
              </p>
            </div>
          </div>
        </div>

        {/* Goods Cargo info */}
        <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>{offer.order.goods.category}</span>
          </div>
          <span className="font-semibold text-slate-200">
            ~{offer.order.goods.approxWeightKg} kg
          </span>
        </div>

        {/* Action Buttons: Accept / Reject */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onReject(offer.id);
            }}
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-2xl border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5 text-red-400" />
            <span>Reject</span>
          </button>

          <button
            onClick={() => {
              sound.playSuccess();
              onAccept(offer.id);
            }}
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:scale-105"
          >
            <Check className="w-5 h-5" />
            <span>ACCEPT TRIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
