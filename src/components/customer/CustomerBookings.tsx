import React, { useState } from 'react';
import { Order } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Package,
  MapPin,
  FileText,
  Star,
  Navigation,
  LifeBuoy,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface CustomerBookingsProps {
  orders: Order[];
  onTrackOrder: (orderId: string) => void;
  onOpenInvoice: (order: Order) => void;
  onOpenRating: (order: Order) => void;
  onOpenSupport: (order: Order) => void;
  onBookAgain: () => void;
}

export const CustomerBookings: React.FC<CustomerBookingsProps> = ({
  orders,
  onTrackOrder,
  onOpenInvoice,
  onOpenRating,
  onOpenSupport,
  onBookAgain
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ACTIVE') {
      return o.status !== 'COMPLETED' && !o.status.startsWith('CANCELLED');
    }
    if (filter === 'COMPLETED') {
      return o.status === 'COMPLETED';
    }
    if (filter === 'CANCELLED') {
      return o.status.startsWith('CANCELLED');
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Your Deliveries</h1>
          <p className="text-xs text-slate-500">
            View booking lifecycle, invoices, and driver ratings
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {(['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No deliveries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your deliveries in this category will appear here once booked.
          </p>
          <button
            onClick={onBookAgain}
            className="px-5 py-2.5 bg-[#155EEF] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
          >
            Book a Delivery Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isActive = order.status !== 'COMPLETED' && !order.status.startsWith('CANCELLED');
            const isCompleted = order.status === 'COMPLETED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header: ID, Date, Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {order.id}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Body: Vehicle, Goods, Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">Pickup: </span>
                        <span className="text-slate-600">{order.pickup.address}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">Drop: </span>
                        <span className="text-slate-600">{order.drop.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle:</span>
                      <strong className="text-slate-800">{order.vehicleName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Goods:</span>
                      <span className="text-slate-700">{order.goods.category} ({order.goods.approxWeightKg} kg)</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Total Fare:</span>
                      <span className="font-bold text-sm text-[#155EEF]">
                        ₹{order.fareBreakdown.finalFare}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="text-slate-500">
                    {order.driverDetails ? (
                      <span>
                        Partner: <strong>{order.driverDetails.name}</strong> ({order.driverDetails.vehicleNumber})
                      </span>
                    ) : (
                      <span>Partner not yet assigned</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <button
                        onClick={() => onTrackOrder(order.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#155EEF] hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </button>
                    )}

                    {isCompleted && (
                      <>
                        <button
                          onClick={() => onOpenInvoice(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#155EEF] font-bold rounded-lg border border-blue-200 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                        {!order.hasCustomerRated && (
                          <button
                            onClick={() => onOpenRating(order)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-200 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>Rate</span>
                          </button>
                        )}
                      </>
                    )}

                    <button
                      onClick={() => onOpenSupport(order)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                    >
                      <LifeBuoy className="w-3.5 h-3.5" />
                      <span>Help</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
