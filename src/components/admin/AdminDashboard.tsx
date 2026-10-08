import React, { useState } from 'react';
import {
  Order,
  DriverProfile,
  VehicleConfig,
  SupportTicket,
  DamageClaim,
  AuditLog
} from '../../types';
import { AdminOrders } from './AdminOrders';
import { AdminDrivers } from './AdminDrivers';
import { AdminVehiclesPricing } from './AdminVehiclesPricing';
import { AdminSupportClaims } from './AdminSupportClaims';
import { AdminAuditLogs } from './AdminAuditLogs';
import { LiveMapSimulator } from '../common/LiveMapSimulator';
import { StatusBadge } from '../common/StatusBadge';
import {
  LayoutDashboard,
  Navigation,
  Package,
  Users,
  Truck,
  IndianRupee,
  LifeBuoy,
  ShieldAlert,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  drivers: DriverProfile[];
  vehicles: VehicleConfig[];
  tickets: SupportTicket[];
  claims: DamageClaim[];
  auditLogs: AuditLog[];
  onSelectOrder: (order: Order) => void;
  onAssignDriver: (orderId: string, driverId: string) => void;
  onCancelOrder: (orderId: string, reason: string) => void;
  onUpdateKyc: (driverId: string, docId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
  onUpdatePricing: (vehicleId: string, updates: Partial<VehicleConfig>) => void;
  onReplyTicket: (ticketId: string, message: string) => void;
  onUpdateClaimStatus: (claimId: string, status: DamageClaim['status'], notes?: string, compensation?: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  drivers,
  vehicles,
  tickets,
  claims,
  auditLogs,
  onSelectOrder,
  onAssignDriver,
  onCancelOrder,
  onUpdateKyc,
  onUpdatePricing,
  onReplyTicket,
  onUpdateClaimStatus
}) => {
  const [activeMenu, setActiveMenu] = useState<
    'OVERVIEW' | 'LIVE_FLEET' | 'ORDERS' | 'DRIVERS' | 'PRICING' | 'SUPPORT' | 'AUDIT'
  >('OVERVIEW');

  // Compute real metrics from actual store data
  const totalOrders = orders.length;
  const activeTrips = orders.filter(
    (o) => o.status !== 'COMPLETED' && !o.status.startsWith('CANCELLED')
  );
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const cancelledOrders = orders.filter((o) => o.status.startsWith('CANCELLED'));

  const grossBookingValue = orders.reduce((acc, o) => acc + o.fareBreakdown.finalFare, 0);
  const totalDriverPayouts = completedOrders.reduce(
    (acc, o) => acc + o.fareBreakdown.driverNetEarnings,
    0
  );
  const totalLodzaCommission = completedOrders.reduce(
    (acc, o) => acc + o.fareBreakdown.platformCommissionAmount,
    0
  );

  const pendingKycCount = drivers.filter((d) => d.kycStatus === 'UNDER_REVIEW').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const openClaimsCount = claims.filter((c) => c.status === 'REPORTED' || c.status === 'UNDER_REVIEW').length;

  const primaryActiveTrip = activeTrips[0] || orders[0];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 space-y-2">
        <div className="bg-[#0B1F3A] text-white p-4 rounded-3xl shadow-sm border border-blue-900/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block mb-1">
            Operations Center
          </span>
          <h2 className="font-extrabold text-base text-white">LODZA Command</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Control Tower • Bengaluru HQ</p>
        </div>

        <nav className="bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm space-y-1 text-xs font-bold">
          {[
            { id: 'OVERVIEW', label: 'Command Overview', icon: LayoutDashboard },
            { id: 'LIVE_FLEET', label: 'Live Trips & Radar', icon: Navigation },
            { id: 'ORDERS', label: `Orders (${orders.length})`, icon: Package },
            { id: 'DRIVERS', label: `Driver Fleet & KYC (${drivers.length})`, icon: Users },
            { id: 'PRICING', label: 'Vehicle & Pricing Engine', icon: Truck },
            { id: 'SUPPORT', label: `Support & Claims (${tickets.length + claims.length})`, icon: LifeBuoy },
            { id: 'AUDIT', label: 'Compliance Audit Logs', icon: ShieldAlert }
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id as typeof activeMenu)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all text-left ${
                  isCurrent
                    ? 'bg-[#155EEF] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0">
        {/* VIEW 1: OVERVIEW */}
        {activeMenu === 'OVERVIEW' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Logistics Command Center</h1>
              <p className="text-xs text-slate-500">
                Live operational KPIs across fleet demand, driver capacity, and dispatch metrics
              </p>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold">Gross Booking Value</span>
                <span className="text-2xl font-extrabold text-slate-900 block">
                  ₹{grossBookingValue}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Platform GMV</span>
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold">LODZA Revenue (15%)</span>
                <span className="text-2xl font-extrabold text-[#155EEF] block">
                  ₹{totalLodzaCommission}
                </span>
                <span className="text-[10px] text-blue-600 font-bold">
                  Net platform commission
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold">Active Trips</span>
                <span className="text-2xl font-extrabold text-emerald-600 block">
                  {activeTrips.length}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold animate-pulse">
                  ● On-duty road telemetry
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold">Action Items</span>
                <span className="text-2xl font-extrabold text-amber-600 block">
                  {pendingKycCount + openClaimsCount}
                </span>
                <span className="text-[10px] text-amber-700 font-bold">
                  {pendingKycCount} KYC • {openClaimsCount} Claims
                </span>
              </div>
            </div>

            {/* Middle Section: Live Trip Radar snippet & Quick Actions */}
            {primaryActiveTrip && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Live Telemetry Spotlight: {primaryActiveTrip.id}
                    </h3>
                  </div>
                  <StatusBadge status={primaryActiveTrip.status} size="sm" />
                </div>

                <LiveMapSimulator
                  pickup={primaryActiveTrip.pickup}
                  drop={primaryActiveTrip.drop}
                  stops={primaryActiveTrip.stops}
                  status={primaryActiveTrip.status}
                  vehicleName={primaryActiveTrip.vehicleName}
                  driverName={primaryActiveTrip.driverDetails?.name || 'Assigned Driver'}
                  height="h-64 sm:h-80"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-slate-100">
                  <span className="text-slate-600">
                    Customer: <strong>{primaryActiveTrip.customerName}</strong> ({primaryActiveTrip.customerPhone})
                  </span>
                  <button
                    onClick={() => setActiveMenu('ORDERS')}
                    className="font-bold text-[#155EEF] hover:underline flex items-center gap-1"
                  >
                    <span>View in Full Order Dispatch Grid →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LIVE FLEET RADAR */}
        {activeMenu === 'LIVE_FLEET' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Live Fleet Radar & Active Trips</h2>
              <p className="text-xs text-slate-500">
                Monitor on-duty drivers, real-time vehicle routes, and current drop trajectories
              </p>
            </div>

            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {trip.id} • {trip.vehicleName}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Partner: {trip.driverDetails?.name || 'Searching...'} ({trip.driverDetails?.vehicleNumber})
                      </p>
                    </div>
                    <StatusBadge status={trip.status} size="sm" />
                  </div>

                  <LiveMapSimulator
                    pickup={trip.pickup}
                    drop={trip.drop}
                    stops={trip.stops}
                    status={trip.status}
                    vehicleName={trip.vehicleName}
                    driverName={trip.driverDetails?.name || 'Dispatched Partner'}
                    height="h-60"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ORDERS */}
        {activeMenu === 'ORDERS' && (
          <AdminOrders
            orders={orders}
            drivers={drivers}
            onSelectOrder={onSelectOrder}
            onAssignDriver={onAssignDriver}
            onCancelOrder={onCancelOrder}
          />
        )}

        {/* VIEW 4: DRIVERS */}
        {activeMenu === 'DRIVERS' && (
          <AdminDrivers drivers={drivers} onUpdateKyc={onUpdateKyc} />
        )}

        {/* VIEW 5: PRICING */}
        {activeMenu === 'PRICING' && (
          <AdminVehiclesPricing vehicles={vehicles} onUpdatePricing={onUpdatePricing} />
        )}

        {/* VIEW 6: SUPPORT & CLAIMS */}
        {activeMenu === 'SUPPORT' && (
          <AdminSupportClaims
            tickets={tickets}
            claims={claims}
            onReplyTicket={onReplyTicket}
            onUpdateClaimStatus={onUpdateClaimStatus}
          />
        )}

        {/* VIEW 7: AUDIT LOGS */}
        {activeMenu === 'AUDIT' && (
          <AdminAuditLogs logs={auditLogs} />
        )}
      </main>
    </div>
  );
};
