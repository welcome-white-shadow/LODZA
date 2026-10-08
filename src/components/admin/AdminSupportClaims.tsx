import React, { useState } from 'react';
import { SupportTicket, DamageClaim } from '../../types';
import {
  LifeBuoy,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IndianRupee,
  Camera,
  MessageSquare
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface AdminSupportClaimsProps {
  tickets: SupportTicket[];
  claims: DamageClaim[];
  onReplyTicket: (ticketId: string, message: string) => void;
  onUpdateClaimStatus: (claimId: string, status: DamageClaim['status'], notes?: string, compensation?: number) => void;
}

export const AdminSupportClaims: React.FC<AdminSupportClaimsProps> = ({
  tickets,
  claims,
  onReplyTicket,
  onUpdateClaimStatus
}) => {
  const [tab, setTab] = useState<'TICKETS' | 'CLAIMS'>('TICKETS');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyText, setReplyText] = useState('');

  const [selectedClaim, setSelectedClaim] = useState<DamageClaim | null>(claims[0] || null);
  const [compensationInput, setCompensationInput] = useState<number>(claims[0]?.estimatedValue || 1000);
  const [adminNotesInput, setAdminNotesInput] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    sound.playSuccess();
    onReplyTicket(selectedTicket.id, replyText.trim());
    setReplyText('');
  };

  const handleClaimDecision = (status: DamageClaim['status']) => {
    if (!selectedClaim) return;
    sound.playSuccess();
    onUpdateClaimStatus(selectedClaim.id, status, adminNotesInput, compensationInput);
    alert(`Claim ${selectedClaim.id} updated to ${status}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Support & Claims Resolution</h2>
          <p className="text-xs text-slate-500">
            Handle customer inquiries, transit disputes, and damage insurance compensation
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTab('TICKETS')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              tab === 'TICKETS'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LifeBuoy className="w-4 h-4 text-[#155EEF]" />
            <span>Support Tickets ({tickets.length})</span>
          </button>
          <button
            onClick={() => setTab('CLAIMS')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
              tab === 'CLAIMS'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Damage Claims ({claims.length})</span>
          </button>
        </div>
      </div>

      {/* TICKETS TAB */}
      {tab === 'TICKETS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* List of tickets */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">All Customer Tickets</h3>
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  selectedTicket?.id === t.id
                    ? 'border-[#155EEF] bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{t.id}</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {t.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 truncate">{t.subject}</h4>
                <p className="text-slate-500 text-[11px]">
                  Customer: {t.customerName} ({t.customerPhone})
                </p>
              </div>
            ))}
          </div>

          {/* Ticket Thread */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between">
            {selectedTicket ? (
              <>
                <div className="space-y-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-400">
                        {selectedTicket.id} • Order: {selectedTicket.orderId}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {selectedTicket.subject}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Category: {selectedTicket.category} • Customer: {selectedTicket.customerName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages conversation scroll */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 text-xs">
                  {selectedTicket.messages.map((m) => {
                    const isAgent = m.senderRole === 'SUPPORT_AGENT' || m.senderRole === 'ADMIN';
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl max-w-md ${
                          isAgent
                            ? 'bg-[#155EEF] text-white ml-auto'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1 text-[10px] opacity-75">
                          <span className="font-bold">{m.senderName}</span>
                          <span>
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="leading-relaxed">{m.text}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official response to customer..."
                    className="flex-1 p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 px-5 py-3 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a support ticket to view conversation history.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CLAIMS TAB */}
      {tab === 'CLAIMS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Claims List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Reported Claims</h3>
            {claims.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedClaim(c)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  selectedClaim?.id === c.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{c.id}</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                    {c.status}
                  </span>
                </div>
                <p className="font-bold text-slate-900">{c.claimType} Claim</p>
                <p className="text-slate-500 text-[11px] truncate">{c.description}</p>
                <p className="text-emerald-700 font-bold text-[11px]">
                  Claimed: ₹{c.estimatedValue}
                </p>
              </div>
            ))}
          </div>

          {/* Claim Investigation Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 text-xs">
            {selectedClaim ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-slate-400 font-bold">
                      {selectedClaim.id} • Order: {selectedClaim.orderId}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {selectedClaim.claimType} Claim by {selectedClaim.customerName}
                    </h3>
                  </div>
                  <span className="font-mono font-bold text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-800">
                    Est. Value: ₹{selectedClaim.estimatedValue}
                  </span>
                </div>

                <div className="space-y-2">
                  <strong className="text-slate-700 block">Reported Description:</strong>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed">
                    {selectedClaim.description}
                  </p>
                </div>

                {selectedClaim.photoUrls.length > 0 && (
                  <div className="space-y-2">
                    <strong className="text-slate-700 block">Uploaded Evidence Photo:</strong>
                    <div className="flex gap-3">
                      {selectedClaim.photoUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt="Evidence"
                          className="w-32 h-24 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Settlement Controls */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900">Claims Resolution Decision</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Approved Compensation Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={compensationInput}
                        onChange={(e) => setCompensationInput(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Investigation Notes
                      </label>
                      <input
                        type="text"
                        value={adminNotesInput}
                        onChange={(e) => setAdminNotesInput(e.target.value)}
                        placeholder="E.g. Inspection verified partial moisture damage"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleClaimDecision('APPROVED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                    >
                      Approve Full Settlement
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClaimDecision('PARTIALLY_APPROVED')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                    >
                      Approve Partial Compensation
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClaimDecision('REJECTED')}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl"
                    >
                      Reject Claim
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select a damage claim to investigate.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
