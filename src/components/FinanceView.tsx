import React, { useState } from 'react';
import { 
  ReceiptText, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Search, 
  Building, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Invoice } from '../types';
import { InvoiceModal } from './InvoiceModal';

export const FinanceView: React.FC = () => {
  const { invoices, stats, markInvoicePaid } = useHotel();
  const [activeTab, setActiveTab] = useState<'invoices' | 'statements' | 'gateway' | 'forecasting'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Paid' | 'Outstanding'>('all');

  // Chapa simulator state
  const [chapaAmount, setChapaAmount] = useState<number>(1250);
  const [chapaCustomerEmail, setChapaCustomerEmail] = useState('guest.vip@sovereign.com');
  const [chapaCurrency, setChapaCurrency] = useState<'USD' | 'ETB'>('USD');
  const [chapaStatus, setChapaStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [chapaTxRef, setChapaTxRef] = useState<string>('');

  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.guestName.toLowerCase().includes(q) ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.roomNumber.includes(q) ||
        inv.paymentReference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalGrossInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.totalAmount, 0);
  const totalOutstanding = invoices.filter(i => i.status === 'Outstanding').reduce((acc, i) => acc + i.totalAmount, 0);

  const handleSimulateChapaPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setChapaStatus('processing');

    setTimeout(() => {
      const fakeTxRef = `CHP-${Date.now().toString().slice(-6)}`;
      setChapaTxRef(fakeTxRef);
      setChapaStatus('success');

      // Auto settle first outstanding invoice
      const firstPending = invoices.find(i => i.status === 'Outstanding');
      if (firstPending) {
        markInvoicePaid(firstPending.id, 'Chapa');
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#b46a36] mb-1 font-bold tracking-[0.2em] uppercase">
            <ReceiptText className="w-3.5 h-3.5" />
            <span>Treasury & Intelligence</span>
          </div>
          <h1 className="text-3xl font-serif-luxury font-bold text-[#18332f]">
            Finance & Business Intelligence
          </h1>
          <p className="text-xs text-[#5f6a65] mt-1">
            Real-time RevPAR & GOPPAR Analytics · Chapa Payment Gateway · Official Tax Folios
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e5e0d6] rounded-full shadow-xs">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'invoices' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            Folios & Invoices
          </button>
          <button
            onClick={() => setActiveTab('statements')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'statements' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            P&L Financials
          </button>
          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'gateway' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            Chapa Gateway
          </button>
          <button
            onClick={() => setActiveTab('forecasting')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'forecasting' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b46a36]" />
            <span>AI 90-Day Outlook</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-2">
          <span className="text-[10px] text-[#5f6a65] block font-semibold uppercase tracking-wider">Total Invoiced MTD</span>
          <div className="text-3xl font-serif-luxury font-bold text-[#18332f]">
            ${totalGrossInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#18332f] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#18332f]" /> +16.8% vs last month
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-2">
          <span className="text-[10px] text-[#5f6a65] block font-semibold uppercase tracking-wider">Settled Collections</span>
          <div className="text-3xl font-serif-luxury font-bold text-[#18332f]">
            ${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#5f6a65]">Via Chapa, Card & Wire</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-2">
          <span className="text-[10px] text-[#5f6a65] block font-semibold uppercase tracking-wider">Pending Settlement</span>
          <div className="text-3xl font-serif-luxury font-bold text-[#b46a36]">
            ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-[#88938c]">In-house open guest folios</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-2">
          <span className="text-[10px] text-[#5f6a65] block font-semibold uppercase tracking-wider">GOPPAR & Operating Margin</span>
          <div className="text-2xl font-serif-luxury font-bold text-[#18332f]">
            $172.50 <span className="text-xs font-sans font-normal text-[#88938c]">(42.1% margin)</span>
          </div>
          <p className="text-[11px] text-[#18332f] font-medium">+3.4% above luxury compset</p>
        </div>
      </div>

      {/* VIEW 1: INVOICES & GUEST FOLIOS */}
      {activeTab === 'invoices' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0ece3]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#88938c] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search invoice number, guest name, suite, ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#fcfbf8] border border-[#e5e0d6] rounded-full pl-10 pr-4 py-2 text-xs text-[#18332f] placeholder-[#88938c] focus:outline-none focus:border-[#18332f]"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#f8f6f1] border border-[#e5e0d6] rounded-full">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  filterStatus === 'all' ? 'bg-[#18332f] text-white shadow-xs' : 'text-[#5f6a65] hover:text-[#18332f]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('Paid')}
                className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  filterStatus === 'Paid' ? 'bg-[#18332f] text-white shadow-xs' : 'text-[#5f6a65] hover:text-[#18332f]'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilterStatus('Outstanding')}
                className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  filterStatus === 'Outstanding' ? 'bg-[#18332f] text-white shadow-xs' : 'text-[#5f6a65] hover:text-[#18332f]'
                }`}
              >
                Outstanding
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Invoice #</th>
                  <th className="py-3 px-4">Guest & Suite</th>
                  <th className="py-3 px-4">Issue / Due Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece3] text-[#2b3a35]">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#fcfbf8] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#b46a36]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#18332f]">{inv.guestName}</div>
                      <div className="text-[10px] text-[#88938c]">Suite {inv.roomNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#5f6a65]">
                      <div>{inv.issueDate}</div>
                      <div className="text-[10px] text-[#88938c]">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#18332f]">{inv.paymentMethod}</div>
                      <div className="text-[10px] font-mono text-[#88938c]">{inv.paymentReference}</div>
                    </td>
                    <td className="py-3.5 px-4 font-serif-luxury font-bold text-sm text-[#18332f]">
                      ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                        inv.status === 'Paid' 
                          ? 'text-[#18332f] border-[#18332f]/30 bg-[#18332f]/10' 
                          : 'text-[#b46a36] border-[#b46a36]/30 bg-[#f4efe6]'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === 'Outstanding' && (
                          <button
                            onClick={() => markInvoicePaid(inv.id, 'Chapa')}
                            className="px-3 py-1 bg-[#18332f] hover:bg-[#112421] text-white rounded-full text-xs font-semibold cursor-pointer shadow-xs"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1 bg-white hover:bg-[#f6f4ee] border border-[#e5e0d6] text-[#18332f] rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <FileText className="w-3 h-3 text-[#b46a36]" />
                          <span>View Folio</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: P&L FINANCIAL STATEMENTS */}
      {activeTab === 'statements' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0ece3]">
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-[#18332f]">
                Operating Income & Expense Statement (MTD)
              </h2>
              <p className="text-xs text-[#5f6a65]">Audited hospitality ledger with departmental margin attribution</p>
            </div>
            <span className="font-serif-luxury text-[#18332f] text-sm font-bold bg-[#f4efe6] px-3.5 py-1.5 rounded-full border border-[#b46a36]/30">
              Net Operating Margin: 42.1%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Stream Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b46a36] block">
                Departmental Gross Revenues
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] flex justify-between">
                  <span className="text-[#5f6a65]">Room Accommodation Revenue</span>
                  <span className="font-serif-luxury font-bold text-[#18332f] text-sm">$242,500.00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] flex justify-between">
                  <span className="text-[#5f6a65]">Food & Beverage (Dining & In-Room)</span>
                  <span className="font-serif-luxury font-bold text-[#18332f] text-sm">$54,800.00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] flex justify-between">
                  <span className="text-[#5f6a65]">Imperial Spa & Wellness Treatments</span>
                  <span className="font-serif-luxury font-bold text-[#18332f] text-sm">$14,250.00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] flex justify-between">
                  <span className="text-[#5f6a65]">Chauffeur, Helipad & Concierge Fees</span>
                  <span className="font-serif-luxury font-bold text-[#18332f] text-sm">$6,900.00</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#f4efe6] border border-[#b46a36]/40 flex justify-between font-bold text-[#b46a36] text-sm">
                  <span>Gross Operating Revenue (GOR)</span>
                  <span className="font-serif-luxury text-base text-[#18332f]">$318,450.00</span>
                </div>
              </div>
            </div>

            {/* Expenses Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#88938c] block">
                Operating Expenses & Cost of Sales
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] flex justify-between">
                  <span className="text-[#5f6a65]">Workforce Salaries & Executive Payroll</span>
                  <span className="font-serif-luxury font-bold text-rose-700 text-sm">-$40,000.00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] flex justify-between">
                  <span className="text-[#5f6a65]">Culinary Inventory & Vintage Cellar COGS</span>
                  <span className="font-serif-luxury font-bold text-rose-700 text-sm">-$18,400.00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] flex justify-between">
                  <span className="text-[#5f6a65]">Property Utilities, Starlink & HVAC</span>
                  <span className="font-serif-luxury font-bold text-rose-700 text-sm">-$12,800.00</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] flex justify-between">
                  <span className="text-[#5f6a65]">Linen Laundry, Amenities & Maintenance</span>
                  <span className="font-serif-luxury font-bold text-rose-700 text-sm">-$13,000.00</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#18332f] text-white flex justify-between font-bold text-sm shadow-xs">
                  <span>Net Operating Profit (EBITDA)</span>
                  <span className="font-serif-luxury text-base text-[#f5d77f]">$234,250.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CHAPA PAYMENT GATEWAY ARCHITECTURE */}
      {activeTab === 'gateway' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simulator Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f0ece3]">
              <div className="p-2.5 rounded-full bg-[#f4efe6] text-[#b46a36]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif-luxury font-bold text-[#18332f]">
                  Chapa Gateway Payment Simulator
                </h2>
                <p className="text-xs text-[#5f6a65]">
                  Interactive real-time transaction sandbox for hospitality settlement
                </p>
              </div>
            </div>

            <form onSubmit={handleSimulateChapaPayment} className="space-y-4 text-xs">
              <div>
                <label className="text-[#5f6a65] block mb-1 font-medium">Customer / Guest Email</label>
                <input
                  type="email"
                  value={chapaCustomerEmail}
                  onChange={(e) => setChapaCustomerEmail(e.target.value)}
                  className="w-full bg-[#fcfbf8] border border-[#e5e0d6] rounded-full px-4 py-2 text-[#18332f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#5f6a65] block mb-1 font-medium">Amount</label>
                  <input
                    type="number"
                    value={chapaAmount}
                    onChange={(e) => setChapaAmount(Number(e.target.value))}
                    className="w-full bg-[#fcfbf8] border border-[#e5e0d6] rounded-full px-4 py-2 text-[#18332f] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#5f6a65] block mb-1 font-medium">Currency</label>
                  <select
                    value={chapaCurrency}
                    onChange={(e) => setChapaCurrency(e.target.value as any)}
                    className="w-full bg-[#fcfbf8] border border-[#e5e0d6] rounded-full px-4 py-2 text-[#18332f]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ETB">ETB (Br)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f4efe6] border border-[#b46a36]/30 text-[#18332f] text-[11px] leading-relaxed">
                Connects directly to Chapa's multi-payment rail supporting Telebirr, CBE Birr, Visa, and Mastercard with automatic webhooks.
              </div>

              <button
                type="submit"
                disabled={chapaStatus === 'processing'}
                className="w-full py-3 rounded-full bg-[#18332f] hover:bg-[#112421] disabled:bg-[#f8f6f1] disabled:text-[#88938c] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {chapaStatus === 'processing' ? (
                  <span>Authorizing via Chapa API...</span>
                ) : (
                  <span>Process Instant Chapa Transaction</span>
                )}
              </button>
            </form>
          </div>

          {/* Simulator Terminal Response */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#f0ece3]">
                <span className="text-xs font-bold text-[#18332f]">Webhook Response & Security Log</span>
                <span className="text-[10px] font-mono font-bold text-[#18332f] px-2 py-0.5 rounded-full bg-[#18332f]/10">Status: 200 OK</span>
              </div>

              {chapaStatus === 'success' ? (
                <div className="space-y-3 pt-3 text-xs">
                  <div className="p-3.5 bg-[#f4efe6] border border-[#b46a36]/40 rounded-2xl text-[#18332f] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#18332f] shrink-0" />
                    <div>
                      <div className="font-bold">Transaction Successfully Authorized!</div>
                      <div className="text-[11px] text-[#5f6a65]">Reference: {chapaTxRef}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#f8f6f1] border border-[#e5e0d6] rounded-2xl font-mono text-[11px] text-[#2b3a35] space-y-1">
                    <div>{`{`}</div>
                    <div className="pl-4">"status": "success",</div>
                    <div className="pl-4">"message": "Payment verified",</div>
                    <div className="pl-4">"amount": {chapaAmount},</div>
                    <div className="pl-4">"currency": "{chapaCurrency}",</div>
                    <div className="pl-4">"tx_ref": "{chapaTxRef}",</div>
                    <div className="pl-4">"gateway": "Chapa API v1"</div>
                    <div>{`}`}</div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-[#88938c] italic">
                  Initiate a transaction to witness live webhook payload verification and automatic folio ledger reconciliation.
                </div>
              )}
            </div>

            <div className="text-[10px] text-[#88938c] border-t border-[#f0ece3] pt-3">
              PCI DSS Tier 1 Compliant · 256-Bit TLS Encryption
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: AI 90-DAY FORECASTING */}
      {activeTab === 'forecasting' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#f0ece3]">
            <div className="p-2.5 rounded-full bg-[#f4efe6] text-[#b46a36]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-[#18332f]">
                AI Financial Forecasting & Cash Flow Model (90-Day Outlook)
              </h2>
              <p className="text-xs text-[#5f6a65]">
                Quarterly trajectory projecting $1,280,000 gross revenue with 43.5% EBITDA margin
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b46a36] block">Q4 Projected Topline</span>
              <span className="text-2xl font-serif-luxury font-bold text-[#18332f]">$1,284,500</span>
              <p className="text-xs text-[#5f6a65]">
                Driven by 92% holiday festive season pacing and high-rate Penthouse buyouts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#18332f] block">Target RevPAR Trajectory</span>
              <span className="text-2xl font-serif-luxury font-bold text-[#18332f]">$348.00 / key</span>
              <p className="text-xs text-[#5f6a65]">
                +$29.50 uplift over current quarter achieved through automated dynamic rate surge.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfaf7] border border-[#e5e0d6] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#88938c] block">Net Free Cash Flow</span>
              <span className="text-2xl font-serif-luxury font-bold text-[#18332f]">$542,000</span>
              <p className="text-xs text-[#5f6a65]">
                Optimal liquidity for scheduled Q1 spa pavilion expansion and wine cellar acquisitions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};
