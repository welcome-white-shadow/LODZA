import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { ShieldCheck, Search, Calendar, User } from 'lucide-react';

interface AdminAuditLogsProps {
  logs: AuditLog[];
}

export const AdminAuditLogs: React.FC<AdminAuditLogsProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entityId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">System Audit & Compliance Logs</h2>
        <p className="text-xs text-slate-500">
          Immutable audit record of all pricing changes, KYC verifications, overrides, and financial transitions
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, action (e.g. PRICING, KYC), or entity ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor & Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Entity ID</th>
                <th className="p-4">Modification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono text-[11px] text-slate-500">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{log.actor}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {log.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="inline-block font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-slate-700">{log.entity}</td>

                  <td className="p-4 font-mono text-slate-600">{log.entityId}</td>

                  <td className="p-4 text-slate-600">
                    {log.oldValue && log.newValue ? (
                      <span>
                        <span className="text-red-600 line-through mr-1">{log.oldValue}</span> →{' '}
                        <span className="text-emerald-700 font-bold">{log.newValue}</span>
                      </span>
                    ) : log.metadata ? (
                      <span className="font-mono text-[10px] text-slate-500">
                        {JSON.stringify(log.metadata).slice(0, 60)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
