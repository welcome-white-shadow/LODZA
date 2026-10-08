import React, { useState } from 'react';
import { Order, OrderStatus, DriverProfile } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  XCircle,
  Clock,
  IndianRupee,
  MapPin,
  ChevronRight,
  FileText
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface AdminOrdersProps {
  orders: Order[];
  drivers: DriverProfile[];
  onSelectOrder: (order: Order) => void;
  onAssignDriver: (orderId: string, driverId: string) => void;
  onCancelOrder: (orderId: string, reason: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  drivers,
  onSelectOrder,
  onAssignDriver,
  onCancelOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>(drivers[0]?.id || '');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.pickup.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.drop.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningOrderId || !selectedDriverId) return;
    sound.playSuccess();
    onAssignDriver(assigningOrderId, selectedDriverId);
    setAssigningOrderId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Trip Order Management</h2>
          <p className="text-xs text-slate-500">
            Real-time monitor, manual dispatch overrides, lifecycle audits
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer name, locality..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SEARCHING_DRIVER">Searching Partner</option>
            <option value="DRIVER_ASSIGNED">Partner Assigned</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="COMPLETED">Completed</option>
            <option value="PAYMENT_PENDING_CASH">Cash Pending</option>
            <option value="CANCELLED_BY_CUSTOMER">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vehicle & Route</th>
                <th className="p-4">Status</th>
                <th className="p-4">Partner</th>
                <th className="p-4">Fare</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {o.id}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{o.customerName}</span>
                      <span className="text-[11px] text-slate-500">{o.customerPhone}</span>
                    </td>

                    <td className="p-4 max-w-xs truncate">
                      <span className="font-semibold text-slate-800 block">
                        {o.vehicleName}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {o.pickup.address.split(',')[0]} → {o.drop.address.split(',')[0]}
                      </span>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={o.status} size="sm" />
                    </td>

                    <td className="p-4">
                      {o.driverDetails ? (
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {o.driverDetails.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {o.driverDetails.vehicleNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-semibold text-[11px]">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">
                        ₹{o.fareBreakdown.finalFare}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {o.payment.method} ({o.payment.status})
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectOrder(o)}
                          title="View order details"
                          className="p-1.5 bg-blue-50 text-[#155EEF] hover:bg-blue-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {!o.driverId && o.status !== 'COMPLETED' && !o.status.startsWith('CANCELLED') && (
                          <button
                            onClick={() => {
                              setAssigningOrderId(o.id);
                            }}
                            title="Manually assign driver"
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}

                        {o.status !== 'COMPLETED' && !o.status.startsWith('CANCELLED') && (
                          <button
                            onClick={() => {
                              const reason = prompt('Admin cancellation reason:');
                              if (reason) onCancelOrder(o.id, reason);
                            }}
                            title="Cancel trip"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Driver Assignment Modal */}
      {assigningOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">
              Manual Partner Assignment Override
            </h3>
            <p className="text-slate-600">
              Select an active verified partner to dispatch for order{' '}
              <strong className="font-mono">{assigningOrderId}</strong>:
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Partner
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {drivers
                    .filter((d) => d.kycStatus === 'APPROVED')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.vehicleModel} - {d.vehicleNumber}) - {d.rating}★
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningOrderId(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#155EEF] text-white rounded-xl font-bold"
                >
                  Assign Partner Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
