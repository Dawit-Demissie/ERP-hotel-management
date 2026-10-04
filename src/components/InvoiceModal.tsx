import React, { useState, useEffect } from 'react';
import { Crown, Printer, Download, X, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const [autoReturnAfterPrint, setAutoReturnAfterPrint] = useState(true);
  const [isPrintCompleted, setIsPrintCompleted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle browser afterprint event
  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrintCompleted(true);
      if (autoReturnAfterPrint) {
        setTimeout(() => {
          onClose();
        }, 350);
      }
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, [autoReturnAfterPrint, onClose]);

  const handlePrint = () => {
    try {
      window.print();
      setIsPrintCompleted(true);
      if (autoReturnAfterPrint) {
        setTimeout(() => {
          onClose();
        }, 300);
      }
    } catch (err) {
      console.warn('Print invocation note:', err);
      setIsPrintCompleted(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white border border-[#e5e0d6] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#18332f] my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ece3] print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full border border-[#18332f] hover:bg-[#18332f] text-[#18332f] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs group"
              title="Return to Dashboard / Previous View"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-[#b46a36] font-bold uppercase tracking-wider">
              <Crown className="w-4 h-4" />
              <span>Hospitality Folio & Tax Invoice</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#5f6a65] hover:text-[#18332f] rounded-full hover:bg-[#f6f4ee] cursor-pointer"
              aria-label="Close and return"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post-Print Feedback Banner */}
        {isPrintCompleted && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2 text-xs text-emerald-900 print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Invoice print dispatched.</span>
            </div>
            <button
              onClick={onClose}
              className="px-3.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-semibold text-xs transition-colors cursor-pointer"
            >
              Return Now
            </button>
          </div>
        )}

        {/* Printable Folio Content */}
        <div className="space-y-6">
          {/* Hotel Crest & Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#f0ece3]">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-full border border-[#18332f] flex items-center justify-center bg-[#fbfaf7]">
                  <span className="font-serif-luxury text-sm font-bold text-[#18332f]">A</span>
                </div>
                <span className="font-serif-luxury text-xl font-bold text-[#18332f] tracking-wider">
                  THE GRAND GOLDEN SOVEREIGN
                </span>
              </div>
              <p className="text-xs text-[#5f6a65]">
                Luxury Resort & Suites · 100 Sovereign Way, Coastal Riviera
              </p>
              <p className="text-xs text-[#88938c]">
                VAT Reg: VAT-889104-SOV · reservations@goldenhotel.com
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <span className="text-base font-bold text-[#b46a36] font-serif-luxury block">{invoice.invoiceNumber}</span>
              <span className="text-[#5f6a65] block mt-1">Date: {invoice.issueDate}</span>
              <span className="text-[#88938c] block">Due: {invoice.dueDate}</span>
              <span className="text-[10px] text-[#18332f] font-semibold px-2.5 py-0.5 rounded-full bg-[#18332f]/10 border border-[#18332f]/20 inline-block mt-1 font-sans">
                STATUS: {invoice.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Guest and Suite Information */}
          <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6]">
            <div>
              <span className="text-[#88938c] text-[10px] block uppercase font-bold tracking-wider">Billed To (Guest)</span>
              <span className="font-bold text-[#18332f] text-sm block mt-0.5">{invoice.guestName}</span>
              <span className="text-[#5f6a65]">Allocated: Suite {invoice.roomNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[#88938c] text-[10px] block uppercase font-bold tracking-wider">Payment Details</span>
              <span className="font-semibold text-[#18332f] block mt-0.5">Gateway: {invoice.paymentMethod}</span>
              <span className="font-mono text-[10px] text-[#88938c] block">Ref: {invoice.paymentReference}</span>
            </div>
          </div>

          {/* Itemized Folio Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right rounded-r-xl">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece3] text-[#2b3a35]">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fcfbf8]">
                    <td className="py-2.5 px-3 font-mono text-[#88938c]">{item.date}</td>
                    <td className="py-2.5 px-3 font-medium text-[#18332f]">{item.description}</td>
                    <td className="py-2.5 px-3 text-[#5f6a65]">{item.category}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#18332f]">
                      ${item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-[#f0ece3] flex justify-end">
            <div className="w-72 space-y-1.5 text-xs text-[#5f6a65]">
              <div className="flex justify-between">
                <span className="text-[#88938c]">Subtotal:</span>
                <span className="font-medium text-[#18332f]">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88938c]">Government VAT (15%):</span>
                <span className="font-medium text-[#18332f]">${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#88938c]">Luxury Hospitality Fee (10%):</span>
                <span className="font-medium text-[#18332f]">${invoice.serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#18332f] pt-2 border-t border-[#e5e0d6] font-serif-luxury">
                <span>Total Settled:</span>
                <span className="text-[#b46a36]">${invoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Luxury Stamp & Sign-off */}
          <div className="pt-6 border-t border-[#f0ece3] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#88938c]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#18332f]" />
              <span>Electronically authorized and settled via {invoice.paymentMethod}</span>
            </div>
            <span className="font-serif-luxury italic text-[#5f6a65]">
              The Grand Golden Sovereign Hospitality Group
            </span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f0ece3] print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border-2 border-[#18332f] hover:bg-[#18332f] text-[#18332f] hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Dashboard</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-[#f5d77f]" />
            <span>Print Folio Invoice</span>
          </button>
        </div>

      </div>
    </div>
  );
};
