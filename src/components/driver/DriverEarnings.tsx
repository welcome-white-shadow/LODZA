import React from 'react';
import { DriverProfile, Order } from '../../types';
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

interface DriverEarningsProps {
  driver: DriverProfile;
  orders: Order[];
}

export const DriverEarnings: React.FC<DriverEarningsProps> = ({ driver, orders }) => {
  const driverOrders = orders.filter((o) => o.driverId === driver.id && o.status === 'COMPLETED');

  const todayEarnings = driver.todaysEarnings;
  const weeklyEarnings = todayEarnings + 4820;
  const monthlyEarnings = weeklyEarnings + 16400;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Partner Earnings</h1>
        <p className="text-xs text-slate-500">
          Transparent trip-wise earnings, platform deductions, and automated bank settlements
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">Today&apos;s Net Earnings</span>
          <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900">
            <IndianRupee className="w-6 h-6 text-emerald-600" />
            <span>₹{todayEarnings}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active on duty</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">This Week (Total)</span>
          <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900">
            <IndianRupee className="w-6 h-6 text-[#155EEF]" />
            <span>₹{weeklyEarnings}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            18 trips completed
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">This Month</span>
          <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900">
            <IndianRupee className="w-6 h-6 text-purple-600" />
            <span>₹{monthlyEarnings}</span>
          </div>
          <span className="text-[11px] text-purple-700 font-medium">
            Bank payout processed daily at 11 PM
          </span>
        </div>
      </div>

      {/* Bank Account Settlement Card */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0B1F3A] text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
            Direct Bank Settlement
          </span>
          <h3 className="text-base font-bold text-white mt-1">
            {driver.bankAccount.bankName} • {driver.bankAccount.accountNumber}
          </h3>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            IFSC: {driver.bankAccount.ifsc} • Holder: {driver.bankAccount.accountHolder}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified for IMPS/NEFT</span>
          </span>
        </div>
      </div>

      {/* Trip-wise Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Recent Trip Settlements</h3>

        {driverOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No completed trips yet today. Accept a delivery offer to start earning!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {driverOrders.map((o) => (
              <div key={o.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{o.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{o.vehicleName}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {o.pickup.address.split(',')[0]} → {o.drop.address.split(',')[0]} ({o.fareBreakdown.distanceKm} km)
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="font-bold text-sm text-emerald-600">
                    +₹{o.fareBreakdown.driverNetEarnings}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Gross ₹{o.fareBreakdown.subtotal} (Comm. -₹{o.fareBreakdown.platformCommissionAmount})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
