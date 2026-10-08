import React, { useState } from 'react';
import { TicketCategory } from '../../types';
import { LifeBuoy, AlertTriangle, Send, X, ShieldAlert, Camera } from 'lucide-react';
import { sound } from '../../services/soundService';

interface CustomerSupportModalProps {
  orderId: string;
  customerName: string;
  customerId: string;
  customerPhone: string;
  onClose: () => void;
  onSubmitTicket: (ticket: {
    orderId: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    category: TicketCategory;
    subject: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    initialMessage: string;
  }) => void;
  onSubmitClaim?: (claim: {
    orderId: string;
    customerId: string;
    customerName: string;
    claimType: 'DAMAGE' | 'LOSS' | 'THEFT' | 'DELAY';
    description: string;
    estimatedValue: number;
    photoUrls: string[];
  }) => void;
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  orderId,
  customerName,
  customerId,
  customerPhone,
  onClose,
  onSubmitTicket,
  onSubmitClaim
}) => {
  const [category, setCategory] = useState<TicketCategory>('Wrong fare / extra charged');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isDamageClaim, setIsDamageClaim] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState(1500);
  const [photoAdded, setPhotoAdded] = useState(false);

  const categories: TicketCategory[] = [
    'Wrong fare / extra charged',
    'Goods damaged during transit',
    'Items missing from shipment',
    'Driver didn\'t arrive',
    'Driver cancelled after acceptance',
    'Payment or refund issue',
    'Rude driver behavior',
    'App or booking glitch',
    'Other'
  ];

  const handleCategoryChange = (val: TicketCategory) => {
    setCategory(val);
    if (val === 'Goods damaged during transit' || val === 'Items missing from shipment') {
      setIsDamageClaim(true);
    } else {
      setIsDamageClaim(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sound.playSuccess();

    if (isDamageClaim && onSubmitClaim) {
      onSubmitClaim({
        orderId,
        customerId,
        customerName,
        claimType: category === 'Items missing from shipment' ? 'LOSS' : 'DAMAGE',
        description: message,
        estimatedValue: Number(estimatedValue) || 1000,
        photoUrls: photoAdded
          ? ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80']
          : []
      });
    }

    onSubmitTicket({
      orderId,
      customerId,
      customerName,
      customerPhone,
      category,
      subject: subject.trim() || `${category} - Order ${orderId}`,
      priority: isDamageClaim ? 'HIGH' : 'MEDIUM',
      initialMessage: message
    });

    alert(
      isDamageClaim
        ? 'Damage claim registered! A LODZA Claims Officer will review the evidence within 2 hours.'
        : 'Support ticket raised. Support agent will respond shortly.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 text-[#155EEF] rounded-xl flex items-center justify-center shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Need Help with Order?</h2>
            <p className="text-xs text-slate-500 font-mono">ID: {orderId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Issue Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as TicketCategory)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {isDamageClaim && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Damage / Goods Protection Claim</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                LODZA offers shipment goods coverage. Please provide realistic value of damaged/lost goods and attach photo proof.
              </p>

              <div>
                <label className="block font-semibold text-amber-900 mb-1">
                  Estimated Goods Value (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  max="100000"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-amber-300 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoAdded(!photoAdded);
                    sound.playClick();
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    photoAdded
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100/50'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{photoAdded ? '✓ Damage Photo Attached' : '+ Attach Damage Photo Proof'}</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Subject Summary
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what happened clearly with timestamps or driver details..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#155EEF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
