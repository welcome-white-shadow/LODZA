import React from 'react';
import { VehicleConfig, Order, Coupon } from '../../types';
import { LodzaLogo } from '../common/LodzaLogo';
import { StatusBadge } from '../common/StatusBadge';
import {
  ArrowRight,
  Truck,
  Bike,
  ShieldCheck,
  Clock,
  Compass,
  MapPin,
  CheckCircle,
  Tag,
  Headphones,
  Navigation,
  FileCheck
} from 'lucide-react';

interface CustomerHomeProps {
  vehicles: VehicleConfig[];
  coupons: Coupon[];
  activeOrder?: Order | null;
  onStartBooking: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  vehicles,
  coupons,
  activeOrder,
  onStartBooking,
  onTrackOrder
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Active Trip Sticky Alert Banner (if customer has an ongoing delivery) */}
      {activeOrder && activeOrder.status !== 'COMPLETED' && !activeOrder.status.startsWith('CANCELLED') && (
        <div
          onClick={() => onTrackOrder(activeOrder.id)}
          className="bg-gradient-to-r from-blue-700 via-[#155EEF] to-indigo-800 text-white p-4 rounded-2xl shadow-lg border border-blue-400/30 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Active Shipment in Progress</span>
                <StatusBadge status={activeOrder.status} size="sm" />
              </div>
              <p className="text-xs text-blue-100 font-mono mt-0.5">
                {activeOrder.id} • {activeOrder.vehicleName} • Drop: {activeOrder.drop.address.split(',')[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold bg-white text-[#155EEF] px-3.5 py-2 rounded-xl group-hover:scale-105 transition-transform shadow-sm">
            <span>Track Live</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#102a4e] to-[#0B1F3A] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-blue-900/50">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
            <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
            <span>India&apos;s Smart Hyperlocal Goods Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Move anything. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#FF8A00]">
              Anywhere nearby.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From two-wheelers for parcels to 14ft heavy trucks for house shifting & business cargo. Verified drivers, instant dispatch, transparent per-KM billing.
          </p>

          {/* Quick CTA cluster */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartBooking}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#155EEF] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              <span>Book a Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {activeOrder && (
              <button
                onClick={() => onTrackOrder(activeOrder.id)}
                className="flex items-center gap-2 px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-colors"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Track Current Trip</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient subtle vehicle graphic in background */}
        <div className="absolute -right-8 -bottom-10 opacity-10 sm:opacity-20 pointer-events-none">
          <Truck className="w-80 h-80 text-blue-300" />
        </div>
      </section>

      {/* Fleet Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Choose Your Vehicle Fleet</h2>
            <p className="text-xs text-slate-500">
              Select tailored vehicles matching your cargo volume and weight
            </p>
          </div>
          <button
            onClick={onStartBooking}
            className="text-xs font-bold text-[#155EEF] hover:underline flex items-center gap-1"
          >
            <span>View Pricing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              onClick={onStartBooking}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-50 text-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                    {v.category === 'two_wheeler' ? (
                      <Bike className="w-6 h-6" />
                    ) : (
                      <Truck className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {v.etaMinutes} mins ETA
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{v.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{v.subtitle}</p>

                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <strong className="text-slate-800">Up to {v.capacityKg} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span className="text-slate-800">{v.dimensions}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Starting from</span>
                  <span className="font-extrabold text-slate-900 text-base">₹{v.minFare}</span>
                </div>
                <div className="text-xs font-bold text-[#155EEF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-xl font-bold text-slate-900">How LODZA Works</h2>
          <p className="text-xs text-slate-500">
            Hassle-free 4-step on-demand delivery for individuals and businesses
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Enter Locations',
              desc: 'Provide pickup point, drop location, and optional intermediate stops.',
              icon: MapPin
            },
            {
              step: '2',
              title: 'Pick Vehicle',
              desc: 'Select from 2-wheelers up to 14ft container trucks with transparent pricing.',
              icon: Truck
            },
            {
              step: '3',
              title: 'Instant Match',
              desc: 'A nearby verified partner accepts and heads to your pickup promptly.',
              icon: Clock
            },
            {
              step: '4',
              title: 'Track & Verify',
              desc: 'Watch live GPS route. Release goods using the 4-digit receiver OTP.',
              icon: ShieldCheck
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="text-center space-y-2.5 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="w-10 h-10 bg-[#155EEF] text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto shadow-sm">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Offers & Coupons Carousel */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#FF8A00]" />
          <h2 className="text-xl font-bold text-slate-900">Active Freight Offers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-5 border border-amber-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-extrabold text-sm text-[#0B1F3A] bg-amber-200/70 px-2.5 py-1 rounded-md border border-amber-300">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold uppercase">
                    Save {coupon.discountValue}{coupon.discountType === 'PERCENTAGE' ? '%' : '₹'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{coupon.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{coupon.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Min Order: ₹{coupon.minOrderValue}</span>
                <button
                  onClick={onStartBooking}
                  className="font-bold text-[#155EEF] hover:underline"
                >
                  Use Code →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-center">The LODZA Trust Guarantee</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm">100% KYC Verified</strong>
              Aadhaar, commercial DL, RC, and background verification for every partner.
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl">
            <Navigation className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm">Live GPS Beacon</strong>
              Continuous real-time coordinates, estimated arrival time, and speed telemetry.
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-xl">
            <FileCheck className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm">GST Invoicing & POD</strong>
              Instant SAC 9965 compliant tax invoices with receiver OTP proof of delivery.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
