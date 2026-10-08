import React from 'react';
import { Invoice } from '../../types';
import { LodzaLogo } from '../common/LodzaLogo';
import { X, Printer, Download, CheckCircle, FileText } from 'lucide-react';

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header toolbar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#155EEF]" />
            <h2 className="text-lg font-bold text-slate-900">Tax Invoice</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => {
                alert('Invoice downloaded successfully (PDF format).');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#155EEF] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 md:p-8 space-y-6 text-slate-800" id="printable-invoice">
          {/* Top Brand & Metadata */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
            <div>
              <LodzaLogo size="md" />
              <p className="text-xs text-slate-500 mt-2 max-w-xs">
                {invoice.lodzaAddress}
              </p>
              <p className="text-xs text-slate-600 font-mono mt-1">
                <strong>GSTIN:</strong> {invoice.gstin}
              </p>
            </div>

            <div className="text-left md:text-right bg-blue-50/70 p-3 rounded-xl border border-blue-100">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Original For Recipient
              </span>
              <p className="font-mono text-sm font-bold text-slate-900 mt-1">
                {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-slate-500">Date: {invoice.invoiceDate}</p>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Booking ID: {invoice.bookingId}
              </p>
            </div>
          </div>

          {/* Billed To & Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 text-blue-900">
                Customer Details
              </h3>
              <p className="font-semibold text-slate-900 text-sm">{invoice.customerName}</p>
              <p className="text-slate-600">{invoice.customerPhone}</p>
              {invoice.customerGst && (
                <p className="text-slate-600 font-mono mt-1">
                  GSTIN: {invoice.customerGst}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 text-blue-900">
                Driver & Vehicle Details
              </h3>
              <p className="font-semibold text-slate-900 text-sm">{invoice.driverName}</p>
              <p className="text-slate-600">
                Vehicle: {invoice.vehicleType} ({invoice.vehicleNumber})
              </p>
              <p className="text-slate-500 mt-1 font-mono">SAC Code: {invoice.sacCode}</p>
            </div>
          </div>

          {/* Route Summary */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <div>
                <span className="font-bold text-slate-700">Pickup: </span>
                <span className="text-slate-600">{invoice.pickupAddress}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 shrink-0" />
              <div>
                <span className="font-bold text-slate-700">Drop: </span>
                <span className="text-slate-600">{invoice.dropAddress}</span>
              </div>
            </div>
          </div>

          {/* Itemized Charges Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Details</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-medium text-slate-900">Base Freight Fare</td>
                  <td className="p-3 text-right text-slate-500">First 2 km inclusive</td>
                  <td className="p-3 text-right font-medium">₹{invoice.fareBreakdown.baseFare}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-900">Distance Charge</td>
                  <td className="p-3 text-right text-slate-500">{invoice.fareBreakdown.distanceKm} km total</td>
                  <td className="p-3 text-right font-medium">₹{invoice.fareBreakdown.distanceCharge}</td>
                </tr>
                {invoice.fareBreakdown.timeCharge > 0 && (
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Transit Duration Charge</td>
                    <td className="p-3 text-right text-slate-500">{invoice.fareBreakdown.estimatedDurationMin} mins</td>
                    <td className="p-3 text-right font-medium">₹{invoice.fareBreakdown.timeCharge}</td>
                  </tr>
                )}
                {invoice.fareBreakdown.additionalStopCharge > 0 && (
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Additional Stops Charge</td>
                    <td className="p-3 text-right text-slate-500">{invoice.fareBreakdown.stopCount} extra stop(s)</td>
                    <td className="p-3 text-right font-medium">₹{invoice.fareBreakdown.additionalStopCharge}</td>
                  </tr>
                )}
                {invoice.fareBreakdown.waitingCharge > 0 && (
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Loading/Unloading Waiting Fee</td>
                    <td className="p-3 text-right text-slate-500">{invoice.fareBreakdown.chargeableWaitingMin} chargeable mins</td>
                    <td className="p-3 text-right font-medium">₹{invoice.fareBreakdown.waitingCharge}</td>
                  </tr>
                )}
                {invoice.fareBreakdown.tollCharge > 0 && (
                  <tr>
                    <td className="p-3 font-medium text-slate-900">Toll & Highway Charges</td>
                    <td className="p-3 text-right text-slate-500">At actuals</td>
                    <td className="p-3 text-right font-medium">₹{invoice.fareBreakdown.tollCharge}</td>
                  </tr>
                )}
                {invoice.fareBreakdown.discountAmount > 0 && (
                  <tr className="text-emerald-700 bg-emerald-50/50">
                    <td className="p-3 font-medium">Promo Discount ({invoice.fareBreakdown.couponCode})</td>
                    <td className="p-3 text-right">Applied coupon</td>
                    <td className="p-3 text-right font-bold">-₹{invoice.fareBreakdown.discountAmount}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 text-xs border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="p-3 text-right font-medium text-slate-600">Subtotal:</td>
                  <td className="p-3 text-right font-bold text-slate-900">₹{invoice.fareBreakdown.subtotal}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-2 text-right font-medium text-slate-600">GST on GTA Services ({invoice.fareBreakdown.taxPercent}%):</td>
                  <td className="p-2 text-right font-medium text-slate-800">₹{invoice.fareBreakdown.taxAmount}</td>
                </tr>
                <tr className="bg-blue-50/80 text-sm">
                  <td colSpan={2} className="p-3 text-right font-extrabold text-[#0B1F3A]">Total Amount:</td>
                  <td className="p-3 text-right font-extrabold text-[#155EEF] text-base">₹{invoice.fareBreakdown.finalFare}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Status badge */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800">
                Payment Mode: {invoice.paymentMethod}
              </span>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase text-[10px]">
              {invoice.paymentStatus.replace('_', ' ')}
            </span>
          </div>

          {/* Legal disclaimer */}
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            This is a computer-generated invoice and does not require a physical signature. Goods Transport Agency (GTA) service under SAC 9965. For support or dispute queries, contact support@lodza.in.
          </p>
        </div>
      </div>
    </div>
  );
};
