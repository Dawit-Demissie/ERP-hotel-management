import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  UtensilsCrossed, 
  Sparkles, 
  Building, 
  CreditCard, 
  ShieldCheck,
  ArrowLeft 
} from 'lucide-react';
import { RestaurantOrder } from '../types';

interface RestaurantInvoiceModalProps {
  order: RestaurantOrder | null;
  onClose: () => void;
}

export const RestaurantInvoiceModal: React.FC<RestaurantInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

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

  const handleDownloadText = () => {
    const lines = [
      "==================================================",
      "           THE GRAND GOLDEN SOVEREIGN             ",
      "       Aurelia Gastronomy & Wine Cellar           ",
      "          Official Customer Tax Invoice           ",
      "==================================================",
      `Invoice #: POS-${order.orderNumber}`,
      `Date/Time: ${order.createdAt}`,
      `Service:   ${order.isRoomService ? `In-Room Dining (Suite ${order.roomNumber})` : (order.tableNumber || 'Main Dining Room')}`,
      order.guestName ? `Guest:     ${order.guestName}` : '',
      `Payment:   ${order.paymentMethod || 'Room Charge'}`,
      "--------------------------------------------------",
      "ITEMS ORDERED:",
      ...order.items.map(item => 
        `  ${item.quantity}x ${item.name.padEnd(28)} $${(item.price * item.quantity).toFixed(2)}`
      ),
      "--------------------------------------------------",
      `Subtotal:                                $${order.subtotal.toFixed(2)}`,
      `State Hospitality Tax (15%):             $${order.tax.toFixed(2)}`,
      `Service Charge (10%):                    $${order.serviceCharge.toFixed(2)}`,
      "==================================================",
      `GRAND TOTAL:                             $${order.totalAmount.toFixed(2)}`,
      "==================================================",
      "        Thank you for dining with us at           ",
      "          The Grand Golden Sovereign              ",
      "=================================================="
    ].filter(Boolean).join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_POS_${order.orderNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white border border-[#e5e0d6] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#18332f] my-6 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Controls Bar (Hidden during window.print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ece3] print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full border border-[#18332f] hover:bg-[#18332f] text-[#18332f] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs group"
              title="Return to Restaurant POS"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to POS</span>
            </button>

            <div className="h-4 w-px bg-[#e5e0d6] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-[#f4efe6] text-[#b46a36]">
                <Crown className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#b46a36] block">
                  Official Dining Invoice
                </span>
                <span className="text-[11px] text-[#5f6a65]">
                  Order #{order.orderNumber} · Customer Print Preview
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadText}
              className="px-3 py-1.5 rounded-full border border-[#e5e0d6] hover:bg-[#f6f4ee] text-[#18332f] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download text receipt"
            >
              <Download className="w-3.5 h-3.5 text-[#5f6a65]" />
              <span className="hidden sm:inline">Text Receipt</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#f5d77f]" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#5f6a65] hover:text-[#18332f] rounded-full hover:bg-[#f6f4ee] transition-colors cursor-pointer"
              aria-label="Close modal and return to POS"
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
              <span>Invoice print sent.</span>
            </div>
            <button
              onClick={onClose}
              className="px-3.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-semibold text-xs transition-colors cursor-pointer"
            >
              Return to POS Now
            </button>
          </div>
        )}

        {/* Printable Dining Folio Content Container */}
        <div id="printable-pos-invoice" className="space-y-6">
          
          {/* Hotel Brand Header */}
          <div className="text-center space-y-2 border-b border-[#e5e0d6] pb-6">
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-10 h-10 rounded-full border border-[#18332f] flex items-center justify-center bg-[#fbfaf7] shadow-xs">
                <span className="font-serif-luxury text-base font-bold text-[#18332f]">A</span>
              </div>
              <div>
                <h2 className="font-serif-luxury text-xl font-bold tracking-[0.14em] text-[#18332f] uppercase">
                  The Grand Golden Sovereign
                </h2>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#b46a36] font-semibold block">
                  Aurelia Gastronomy & Wine Cellar
                </span>
              </div>
            </div>
            <p className="text-xs text-[#5f6a65]">
              100 Sovereign Way, Coastal Riviera · In-House Dining & Private Catering
            </p>
            <p className="text-[11px] text-[#88938c]">
              Tax Registration: VAT-889104-SOV · Tel: +1 (800) 555-SOVR
            </p>
          </div>

          {/* Invoice & Order Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#88938c] block">
                Invoice & Service
              </span>
              <span className="font-mono text-sm font-bold text-[#18332f] block mt-0.5">
                POS-{order.orderNumber}
              </span>
              <div className="mt-1 space-y-0.5 text-[#5f6a65]">
                <div>
                  Service: <strong className="text-[#18332f]">{order.isRoomService ? `In-Room Dining (Suite ${order.roomNumber})` : (order.tableNumber || 'Main Dining Room')}</strong>
                </div>
                {order.guestName && (
                  <div>
                    Guest: <strong className="text-[#18332f]">{order.guestName}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#88938c] block">
                Settlement & Timestamp
              </span>
              <span className="text-[#18332f] font-semibold block mt-0.5">
                {order.createdAt}
              </span>
              <div className="mt-1 space-y-0.5">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Settled · {order.paymentMethod || 'Room Charge'}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Bill Table */}
          <div className="space-y-2">
            <div className="border border-[#e5e0d6] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece3] text-[#2b3a35]">
                  {order.items.map((item, idx) => (
                    <tr key={item.menuItemId || idx} className="hover:bg-[#fcfbf9]">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#18332f]">{item.name}</div>
                        {item.notes && (
                          <div className="text-[10px] text-[#88938c] italic">{item.notes}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#5f6a65]">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#18332f]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown & Tax Details */}
          <div className="pt-2 flex justify-end">
            <div className="w-72 space-y-1.5 text-xs text-[#5f6a65]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-[#18332f]">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hospitality Sales Tax (15%):</span>
                <span className="font-mono text-[#18332f]">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sommelier & Service Charge (10%):</span>
                <span className="font-mono text-[#18332f]">${order.serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#18332f] pt-2 border-t-2 border-[#18332f] font-serif-luxury">
                <span>Total Amount:</span>
                <span className="text-[#b46a36] font-mono">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Security & Verification Stamp */}
          <div className="pt-6 border-t border-[#f0ece3] grid grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#f8f6f1] border border-[#e5e0d6] flex items-center justify-center p-1">
                {/* Simulated Fiscal Receipt QR */}
                <div className="grid grid-cols-3 gap-0.5 w-full h-full p-0.5">
                  <div className="bg-[#18332f] rounded-xs" />
                  <div className="bg-[#18332f] rounded-xs" />
                  <div className="bg-[#18332f] rounded-xs" />
                  <div className="bg-[#18332f] rounded-xs" />
                  <div className="bg-[#b46a36] rounded-xs" />
                  <div className="bg-[#b46a36] rounded-xs" />
                  <div className="bg-[#18332f] rounded-xs" />
                  <div className="bg-[#18332f] rounded-xs" />
                  <div className="bg-[#18332f] rounded-xs" />
                  <div className="bg-[#b46a36] rounded-xs" />
                  <div className="bg-[#18332f] rounded-xs" />
                </div>
              </div>
              <div className="text-[10px] text-[#5f6a65] space-y-0.5">
                <span className="font-bold text-[#18332f] block">Electronic Fiscal Receipt</span>
                <span>Verification: #TAX-SOV-8819</span>
                <span className="text-emerald-700 font-semibold block">Cryptographically Validated</span>
              </div>
            </div>

            <div className="flex flex-col justify-end text-left sm:text-right">
              <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block mb-4">
                Guest Signature / Authorization
              </span>
              <div className="border-b border-[#18332f] w-full max-w-[200px] ml-auto mb-1"></div>
              <span className="text-[9px] text-[#88938c]">Authorized by Guest / Folio Account</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2">
            <p className="font-serif-luxury text-xs text-[#18332f] font-semibold italic">
              "We trust your culinary experience at The Sovereign was extraordinary."
            </p>
            <p className="text-[10px] text-[#88938c] mt-0.5">
              The Grand Golden Sovereign & Resort · Coastal Riviera
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#f0ece3] print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full border-2 border-[#18332f] hover:bg-[#18332f] text-[#18332f] hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs group"
              title="Return to Restaurant POS"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Return to POS</span>
            </button>

            <label className="flex items-center gap-2 text-xs text-[#5f6a65] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoReturnAfterPrint}
                onChange={(e) => setAutoReturnAfterPrint(e.target.checked)}
                className="rounded border-[#c2baa9] text-[#18332f] focus:ring-0 cursor-pointer"
              />
              <span>Auto-return after printing</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-6 py-2 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-[#f5d77f]" />
              <span>Print Customer Invoice</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
