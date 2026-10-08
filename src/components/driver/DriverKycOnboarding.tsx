import React, { useState } from 'react';
import { DriverProfile, DocumentStatus } from '../../types';
import {
  FileText,
  ShieldCheck,
  Clock,
  AlertCircle,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Building,
  CreditCard
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface DriverKycOnboardingProps {
  driver: DriverProfile;
}

export const DriverKycOnboarding: React.FC<DriverKycOnboardingProps> = ({ driver }) => {
  const [activeTab, setActiveTab] = useState<'DOCUMENTS' | 'VEHICLE' | 'BANK'>('DOCUMENTS');
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);

  const getStatusBadge = (st: DocumentStatus) => {
    switch (st) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Under Review</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
            <AlertCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            <span>Pending</span>
          </span>
        );
    }
  };

  const handleSimulateUpload = (docTitle: string) => {
    sound.playClick();
    setUploadedDoc(docTitle);
    setTimeout(() => {
      alert(`Document "${docTitle}" uploaded successfully. Sent to LODZA Operations for KYC verification.`);
      setUploadedDoc(null);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Driver KYC & Compliance</h1>
          <p className="text-xs text-slate-500">
            Statutory vehicle and identity documentation verified by LODZA Safety & Trust team
          </p>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(driver.kycStatus)}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'DOCUMENTS'
              ? 'border-[#155EEF] text-[#155EEF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Identity & License
        </button>
        <button
          onClick={() => setActiveTab('VEHICLE')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'VEHICLE'
              ? 'border-[#155EEF] text-[#155EEF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Vehicle & Fitness
        </button>
        <button
          onClick={() => setActiveTab('BANK')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'BANK'
              ? 'border-[#155EEF] text-[#155EEF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Payout Bank Account
        </button>
      </div>

      {/* Tab: Identity Documents */}
      {activeTab === 'DOCUMENTS' && (
        <div className="space-y-3">
          {driver.documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                  <p className="font-mono text-slate-600 mt-0.5">Doc No: {doc.docNumber}</p>
                  {doc.expiryDate && (
                    <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Valid until: {doc.expiryDate}</span>
                    </p>
                  )}
                  {doc.rejectionReason && (
                    <p className="text-red-600 font-medium text-[11px] mt-1">
                      Rejection note: {doc.rejectionReason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {getStatusBadge(doc.status)}
                {doc.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleSimulateUpload(doc.title)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Re-upload</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Vehicle */}
      {activeTab === 'VEHICLE' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{driver.vehicleModel}</h3>
              <p className="font-mono text-slate-500 font-bold mt-0.5">{driver.vehicleNumber}</p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs">
              Commercial RC Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px]">Commercial Insurance:</span>
              <strong className="text-slate-800">Bajaj Allianz Goods Carrier</strong>
              <span className="text-slate-500 block text-[11px] mt-0.5">Expires: 28 Feb 2027</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pollution Under Control (PUC):</span>
              <strong className="text-slate-800">PUC Validated</strong>
              <span className="text-slate-500 block text-[11px] mt-0.5">Expires: 30 Nov 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Bank */}
      {activeTab === 'BANK' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{driver.bankAccount.bankName}</h3>
              <p className="text-slate-500">Account Holder: {driver.bankAccount.accountHolder}</p>
              <p className="font-mono font-bold text-slate-800 mt-1">
                A/C: {driver.bankAccount.accountNumber} • IFSC: {driver.bankAccount.ifsc}
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Penny-drop validation complete. Ready for instant daily payout transfers.</span>
          </div>
        </div>
      )}
    </div>
  );
};
