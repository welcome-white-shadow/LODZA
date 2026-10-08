import React, { useState, useEffect } from 'react';
import { Order, DriverOffer, DriverProfile } from '../../types';
import { LiveMapSimulator } from '../common/LiveMapSimulator';
import { StatusBadge } from '../common/StatusBadge';
import { getStatusStepNumber } from '../../services/orderStateMachine';
import { dispatchEngine } from '../../services/dispatchEngine';
import {
  Phone,
  Shield,
  KeyRound,
  Clock,
  AlertCircle,
  FileText,
  Star,
  LifeBuoy,
  XCircle,
  ChevronRight,
  CheckCircle2,
  Radio,
  Check,
  X,
  Zap,
  Bell,
  Truck,
  ArrowRight
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface LiveTrackingViewProps {
  order: Order;
  incomingOffer?: DriverOffer | null;
  drivers?: DriverProfile[];
  onOpenInvoice: () => void;
  onOpenRating: () => void;
  onOpenSupport: () => void;
  onCancelOrder: (reason: string) => void;
  onInstantAssign?: () => void;
  onAcceptOffer?: (offerId: string) => void;
  onRejectOffer?: (offerId: string) => void;
  onSwitchToDriver?: (driverId: string) => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  order,
  incomingOffer,
  drivers = [],
  onOpenInvoice,
  onOpenRating,
  onOpenSupport,
  onCancelOrder,
  onInstantAssign,
  onAcceptOffer,
  onRejectOffer,
  onSwitchToDriver
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed plans');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25);

  const dispatchState = dispatchEngine.getDispatchState(order.id);
  const activeOffer = incomingOffer || dispatchState?.currentOffer || null;

  useEffect(() => {
    if (!activeOffer) return;

    const tick = () => {
      const left = Math.max(0, Math.round((activeOffer.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(left);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeOffer]);

  const targetDriver = activeOffer
    ? drivers.find((d) => d.id === activeOffer.driverId) ||
      (dispatchState?.candidates[dispatchState.currentIndex]?.driver)
    : null;

  const currentStep = getStatusStepNumber(order.status);
  const isTripFinished = order.status === 'COMPLETED';
  const isCancelled = order.status.startsWith('CANCELLED');

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onCancelOrder(cancelReason);
    setShowCancelModal(false);
  };

  const handleEnableAlerts = async () => {
    sound.playIncomingOffer();
    await sound.requestNotificationPermission();
    sound.sendNotification('LODZA Dispatch Radar Active', {
      body: 'Real-time cascading audio and notification alerts are ready.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-slate-500 font-bold">
              {order.id}
            </span>
            <StatusBadge status={order.status} size="sm" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            {order.vehicleName} • {order.goods.category}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Booked on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Fare: ₹{order.fareBreakdown.finalFare} ({order.payment.method})
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          {isTripFinished && (
            <>
              <button
                onClick={onOpenInvoice}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#155EEF] font-bold text-xs rounded-xl border border-blue-200 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
              {!order.hasCustomerRated && (
                <button
                  onClick={onOpenRating}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Rate Driver</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>

          {!isTripFinished && !isCancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Live Map Simulator */}
      <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 overflow-hidden">
        <LiveMapSimulator
          pickup={order.pickup}
          drop={order.drop}
          stops={order.stops}
          status={order.status}
          vehicleName={order.vehicleName}
          driverName={order.driverDetails?.name || 'Searching Partner'}
          height="h-80 md:h-96"
        />
      </div>

      {/* 2-Column Grid: Left Driver & Verification, Right Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Driver Info & Delivery OTP */}
        <div className="space-y-4">
          {/* Driver Card */}
          {order.driverDetails ? (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Assigned Partner
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{order.driverDetails.rating}</span>
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <img
                  src={order.driverDetails.photo}
                  alt={order.driverDetails.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#155EEF] shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {order.driverDetails.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {order.driverDetails.vehicleModel}
                  </p>
                  <span className="inline-block font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded mt-1 border border-slate-200">
                    {order.driverDetails.vehicleNumber}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span>Contact Partner: </span>
                  <span className="font-mono font-semibold text-slate-800">
                    {order.driverDetails.phone}
                  </span>
                </div>
                <a
                  href={`tel:${order.driverDetails.phone}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 to-[#0B1F3A] text-white rounded-3xl p-5 border-2 border-[#155EEF] shadow-xl space-y-4 relative overflow-hidden">
              {/* Radar ambient glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Radar Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Live Dispatch Algorithm Active</span>
                  </span>
                </div>

                {activeOffer && (
                  <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>{secondsRemaining}s</span>
                  </div>
                )}
              </div>

              {/* Currently Pinging Driver Candidate Card */}
              {activeOffer && targetDriver ? (
                <div className="space-y-3 bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span className="font-bold text-blue-300">
                      Pinging Candidate #{activeOffer.attemptNumber || 1} of {activeOffer.totalCandidates || 5}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      Match Score: {activeOffer.matchScore || 94}/100
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={targetDriver.photo}
                      alt={targetDriver.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#155EEF] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white truncate">
                          {targetDriver.name}
                        </h4>
                        <span className="text-[10px] bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded font-mono font-bold">
                          {targetDriver.vehicleModel.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        {targetDriver.vehicleModel} • <span className="font-mono">{targetDriver.vehicleNumber}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-amber-300 font-bold">⭐ {targetDriver.rating}</span>
                        <span>•</span>
                        <span>{activeOffer.pickupDistanceKm} km from pickup</span>
                        <span>•</span>
                        <span className="text-emerald-400">~{Math.round(activeOffer.pickupDistanceKm * 2.5 + 2)} min ETA</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Earnings & Pickup Snippet */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Offer Earnings:</span>
                      <span className="font-extrabold text-[#FF8A00] text-sm">
                        ₹{activeOffer.estimatedEarning} net
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Pickup Location:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[180px] block">
                        {order.pickup.address.split(',')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Simulation Controls */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {onAcceptOffer && (
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          onAcceptOffer(activeOffer.id);
                        }}
                        className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Simulate partner accepting the trip"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept as Partner</span>
                      </button>
                    )}

                    {onRejectOffer && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          onRejectOffer(activeOffer.id);
                        }}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-red-300 hover:text-red-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Simulate partner declining — cascades offer to next candidate!"
                      >
                        <X className="w-4 h-4 text-red-400" />
                        <span>Decline (Cascade)</span>
                      </button>
                    )}
                  </div>

                  {/* Secondary shortcuts */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    {onSwitchToDriver && (
                      <button
                        onClick={() => onSwitchToDriver(targetDriver.id)}
                        className="text-blue-300 hover:text-blue-200 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Switch to Driver App View →</span>
                      </button>
                    )}

                    <button
                      onClick={handleEnableAlerts}
                      className="text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 font-semibold ml-auto"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Sound / Notification</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center space-y-3">
                  <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40"></span>
                    <div className="relative w-10 h-10 bg-[#155EEF] text-white rounded-full flex items-center justify-center shadow-lg">
                      <Clock className="w-5 h-5 animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">
                      Scanning Nearby {order.vehicleName} Fleet...
                    </h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1">
                      Connecting with verified driver partners in your locality. Each partner gets 25s window.
                    </p>
                  </div>
                </div>
              )}

              {/* Cascade Attempt History Log */}
              {dispatchState && dispatchState.attempts.length > 0 && (
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Dispatch Waterfall Audit:
                  </span>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {dispatchState.attempts.map((att, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-300">
                        <span>
                          #{i + 1} {att.driverName} ({att.distanceKm} km)
                        </span>
                        <span
                          className={`font-mono font-bold px-1.5 py-0.2 rounded text-[10px] ${
                            att.action === 'ACCEPTED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : att.action === 'DISPATCHED'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {att.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instant Force Assign Backup Fleet Button */}
              {onInstantAssign && (
                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onInstantAssign();
                    }}
                    className="w-full py-2.5 px-4 bg-[#FF8A00] hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Instant Fast-Track Fleet Allocation</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Secure Delivery OTP Box */}
          <div className="bg-gradient-to-br from-blue-900 to-[#0B1F3A] text-white rounded-2xl p-5 shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Delivery Security Code
                </span>
              </div>
              <span className="text-[10px] bg-blue-800/80 text-blue-200 px-2 py-0.5 rounded">
                Required at drop
              </span>
            </div>

            <div className="text-center py-2">
              <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
                <span className="text-3xl font-extrabold tracking-widest font-mono text-white">
                  {order.verification.otp}
                </span>
              </div>
              <p className="text-[11px] text-blue-200 mt-2">
                🔒 Share this 4-digit OTP with the driver <strong>only when goods are physically received</strong> at destination.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Timeline Events */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Trip Lifecycle Timeline</h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Step {currentStep} of 6
            </span>
          </div>

          <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-2">
            {order.events.map((evt, idx) => (
              <div key={evt.id || idx} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#155EEF] border-2 border-white shadow-sm" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      {evt.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cancellation Info (if cancelled) */}
          {isCancelled && order.cancellationReason && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800">
              <strong>Cancellation Reason:</strong> {order.cancellationReason}
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>Cancel Delivery</span>
            </h3>
            <p className="text-slate-600">
              Are you sure you want to cancel booking <span className="font-mono font-bold">{order.id}</span>? Please let us know the reason.
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              {[
                'Changed plans / Not needed',
                'Driver taking too long to arrive',
                'Entered incorrect pickup address',
                'Need different vehicle category',
                'Found alternative transport',
                'Other reason'
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="text-[#155EEF]"
                  />
                  <span className="font-medium text-slate-800">{reason}</span>
                </label>
              ))}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
