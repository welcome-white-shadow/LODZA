import React, { useState } from 'react';
import { DriverProfile, DocumentStatus } from '../../types';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Star,
  FileText,
  X,
  Check,
  Ban
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface AdminDriversProps {
  drivers: DriverProfile[];
  onUpdateKyc: (driverId: string, docId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
}

export const AdminDrivers: React.FC<AdminDriversProps> = ({ drivers, onUpdateKyc }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null);

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm)
  );

  const handleDocDecision = (docId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!selectedDriver) return;
    let reason = '';
    if (status === 'REJECTED') {
      reason = prompt('Reason for document rejection (e.g. Blurry photo, expired license):') || 'Document unclear';
    }
    sound.playClick();
    onUpdateKyc(selectedDriver.id, docId, status, reason);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Driver Partner & KYC Operations</h2>
          <p className="text-xs text-slate-500">
            Verify driver statutory documents, track compliance, and manage fleet authorization
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search partners by name, vehicle number, phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Driver Fleet Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Partner</th>
                <th className="p-4">Vehicle Model & Plate</th>
                <th className="p-4">KYC Compliance</th>
                <th className="p-4">Duty Status</th>
                <th className="p-4">Trips & Rating</th>
                <th className="p-4">Today&apos;s Earnings</th>
                <th className="p-4 text-right">Review KYC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDrivers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={d.photo}
                        alt={d.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{d.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{d.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-slate-800 block">{d.vehicleModel}</span>
                    <span className="font-mono text-[11px] text-slate-500 font-bold">
                      {d.vehicleNumber}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        d.kycStatus === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {d.kycStatus === 'APPROVED' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>{d.kycStatus.replace('_', ' ')}</span>
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        d.isOnline ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          d.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                        }`}
                      />
                      <span>{d.isOnline ? 'Online' : 'Offline'}</span>
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-900 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{d.rating}</span>
                      <span className="text-slate-400 text-[11px] font-normal">
                        ({d.totalTrips} trips)
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900">₹{d.todaysEarnings}</span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedDriver(d)}
                      className="px-3 py-1.5 bg-[#155EEF] hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs shadow-sm"
                    >
                      Audit KYC ({d.documents.length})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Review Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedDriver(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <img
                src={selectedDriver.photo}
                alt={selectedDriver.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#155EEF]"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedDriver.name}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedDriver.vehicleModel} • {selectedDriver.vehicleNumber}
                </p>
                <span className="text-[11px] font-semibold text-emerald-600">
                  Bank IFSC: {selectedDriver.bankAccount.ifsc} ({selectedDriver.bankAccount.bankName})
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Submitted Verification Documents
              </h4>

              {selectedDriver.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[#155EEF] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{doc.title}</h5>
                      <p className="font-mono text-slate-600 mt-0.5">Doc No: {doc.docNumber}</p>
                      {doc.expiryDate && (
                        <p className="text-slate-400 text-[11px]">Valid till: {doc.expiryDate}</p>
                      )}
                      {doc.rejectionReason && (
                        <p className="text-red-600 text-[11px] mt-0.5">Reason: {doc.rejectionReason}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        doc.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>

                    {doc.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleDocDecision(doc.id, 'APPROVED')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDocDecision(doc.id, 'REJECTED')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedDriver(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
