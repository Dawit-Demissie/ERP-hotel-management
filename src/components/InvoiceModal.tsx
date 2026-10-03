import React from 'react';
import { Crown, Printer, Download, X, CheckCircle2 } from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#e5e0d6] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#18332f] my-8">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ece3] print:hidden">
          <div className="flex items-center gap-2 text-xs text-[#b46a36] font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4" />
            <span>Official Hospitality Folio & Tax Invoice</span>
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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

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
      </div>
    </div>
  );
};
