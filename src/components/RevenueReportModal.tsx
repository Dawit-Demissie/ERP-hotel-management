import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Printer, 
  Download, 
  X, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  FileSpreadsheet, 
  Building, 
  BarChart3,
  ArrowLeft,
  Check,
  RotateCcw
} from 'lucide-react';
import { MonthlyRevenuePoint } from './DashboardView';

interface RevenueReportModalProps {
  data: MonthlyRevenuePoint[];
  timeframeLabel: string;
  totalYtdRevenue: number;
  totalYtdTarget: number;
  targetVariancePercent: string;
  onClose: () => void;
  onExportCSV: () => void;
}

export const RevenueReportModal: React.FC<RevenueReportModalProps> = ({
  data,
  timeframeLabel,
  totalYtdRevenue,
  totalYtdTarget,
  targetVariancePercent,
  onClose,
  onExportCSV
}) => {
  const [autoReturnAfterPrint, setAutoReturnAfterPrint] = useState(true);
  const [isPrintCompleted, setIsPrintCompleted] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

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

  // Listen for browser print completion event
  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrinting(false);
      setIsPrintCompleted(true);
      if (autoReturnAfterPrint) {
        // Return smoothly to the dashboard
        setTimeout(() => {
          onClose();
        }, 400);
      }
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, [autoReturnAfterPrint, onClose]);

  const handlePrintPDF = () => {
    setIsPrinting(true);
    try {
      window.print();
      // For desktop browsers where window.print() synchronously blocks until the dialog is closed:
      setIsPrinting(false);
      setIsPrintCompleted(true);
      if (autoReturnAfterPrint) {
        setTimeout(() => {
          onClose();
        }, 350);
      }
    } catch (err) {
      console.warn('Browser print invocation note:', err);
      setIsPrinting(false);
      setIsPrintCompleted(true);
    }
  };

  const handleDownloadHtmlReport = () => {
    const element = document.getElementById('printable-revenue-report');
    if (!element) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Grand Golden Sovereign - Revenue Trends Performance Report (${timeframeLabel})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #18332f; background: #fff; }
    h1 { font-family: Georgia, serif; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px 0; color: #18332f; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px; }
    th, td { border: 1px solid #e5e0d6; padding: 8px 12px; text-align: right; }
    th:first-child, td:first-child { text-align: left; }
    th { background: #f8f6f1; color: #5f6a65; font-weight: 600; text-transform: uppercase; font-size: 10px; }
    tfoot { background: #fbf9f5; font-weight: bold; }
    .kpis { display: flex; gap: 16px; margin: 24px 0; }
    .kpi { flex: 1; padding: 14px; border: 1px solid #e5e0d6; border-radius: 12px; background: #fbf9f5; }
    .kpi-title { font-size: 10px; text-transform: uppercase; color: #88938c; font-weight: bold; }
    .kpi-value { font-size: 20px; font-weight: bold; margin-top: 4px; color: #18332f; font-family: Georgia, serif; }
  </style>
</head>
<body>
  ${element.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Revenue_Trends_Report_${timeframeLabel.replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalSuitesRevenue = data.reduce((sum, d) => sum + d.roomRevenue, 0);
  const totalFnbRevenue = data.reduce((sum, d) => sum + d.fnbRevenue, 0);
  const avgOccupancy = Math.round(data.reduce((sum, d) => sum + d.occupancy, 0) / (data.length || 1));
  const avgAdr = Math.round(data.reduce((sum, d) => sum + d.adr, 0) / (data.length || 1));

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        // Clicking backdrop directly returns to dashboard
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white border border-[#e5e0d6] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-[#18332f] my-6 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0ece3] print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-full border border-[#18332f] hover:bg-[#18332f] text-[#18332f] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs group"
              title="Return directly back to executive dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Return to Dashboard</span>
            </button>

            <div className="h-4 w-px bg-[#e5e0d6] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-[#f4efe6] text-[#b46a36]">
                <BarChart3 className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#b46a36] block">
                  Executive Financial Review
                </span>
                <span className="text-[11px] text-[#5f6a65]">
                  Revenue Trends & Variance Report ({timeframeLabel})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onExportCSV}
              className="px-3.5 py-1.5 rounded-full border border-[#e5e0d6] hover:bg-[#f6f4ee] text-[#18332f] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Download CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleDownloadHtmlReport}
              className="px-3.5 py-1.5 rounded-full border border-[#e5e0d6] hover:bg-[#f6f4ee] text-[#18332f] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Save report as standalone HTML document"
            >
              <Download className="w-3.5 h-3.5 text-[#b46a36]" />
              <span>Save HTML</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-4 py-1.5 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Print document or save as PDF via system dialog"
            >
              <Printer className="w-3.5 h-3.5 text-[#f5d77f]" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#5f6a65] hover:text-[#18332f] rounded-full hover:bg-[#f6f4ee] transition-colors cursor-pointer ml-1"
              aria-label="Close and return to dashboard"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post-Print Return Feedback Banner (shown after user prints or cancels print) */}
        {isPrintCompleted && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 print:hidden animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Print / Export action finished.</strong> You can now return to the live dashboard or continue reviewing.
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Dashboard Now</span>
            </button>
          </div>
        )}

        {/* Printable Financial Report Sheet */}
        <div id="printable-revenue-report" className="space-y-6">
          
          {/* Header & Crest */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#e5e0d6]">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-9 h-9 rounded-full border border-[#18332f] flex items-center justify-center bg-[#fbfaf7] shadow-xs">
                  <span className="font-serif-luxury text-base font-bold text-[#18332f]">A</span>
                </div>
                <div>
                  <h1 className="font-serif-luxury text-xl font-bold tracking-[0.14em] text-[#18332f] uppercase leading-tight">
                    The Grand Golden Sovereign
                  </h1>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#b46a36] font-semibold block">
                    Luxury Resort & Sovereign Suites · Financial Intelligence
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#5f6a65]">
                100 Sovereign Way, Coastal Riviera · General Manager & Financial Controller's Office
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <span className="font-serif-luxury font-bold text-base text-[#18332f] block">
                MONTHLY PERFORMANCE AUDIT
              </span>
              <span className="text-[#b46a36] font-semibold text-xs block mt-0.5">
                Period: {timeframeLabel}
              </span>
              <span className="text-[10px] text-[#88938c] block mt-0.5">
                Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-[10px] font-sans text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold inline-block mt-1">
                Audited & Reconciled
              </span>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
              <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">Total Booked</span>
              <span className="text-lg font-serif-luxury font-bold text-[#18332f]">
                ${totalYtdRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                +{targetVariancePercent}% vs target
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
              <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">Budget Target</span>
              <span className="text-lg font-serif-luxury font-bold text-[#b46a36]">
                ${totalYtdTarget.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#5f6a65] block mt-0.5">
                Benchmark Plan
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
              <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">Suites vs Dining</span>
              <div className="text-xs font-semibold text-[#18332f] mt-1 space-y-0.5">
                <div>Suites: ${(totalSuitesRevenue / 1000).toFixed(0)}k</div>
                <div className="text-[#b46a36]">F&B: ${(totalFnbRevenue / 1000).toFixed(0)}k</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
              <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">Yield Index</span>
              <span className="text-lg font-serif-luxury font-bold text-[#18332f]">
                {avgOccupancy}% Occ
              </span>
              <span className="text-[10px] text-[#5f6a65] block mt-0.5">
                Average ADR: ${avgAdr}
              </span>
            </div>
          </div>

          {/* Performance Data Matrix Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-xs uppercase tracking-wider text-[#18332f] font-serif-luxury">
                Monthly Performance Telemetry Matrix
              </span>
              <span className="text-[10px] text-[#88938c]">Currency in USD ($)</span>
            </div>

            <div className="overflow-x-auto border border-[#e5e0d6] rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3 text-right">Booked ($)</th>
                    <th className="py-2.5 px-3 text-right">Budget ($)</th>
                    <th className="py-2.5 px-3 text-right">Variance ($)</th>
                    <th className="py-2.5 px-3 text-right">Suites ($)</th>
                    <th className="py-2.5 px-3 text-right">F&B ($)</th>
                    <th className="py-2.5 px-3 text-center">Occ (%)</th>
                    <th className="py-2.5 px-3 text-right">ADR ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece3] text-[#2b3a35]">
                  {data.map((row) => {
                    const diff = row.revenue - row.target;
                    const isPositive = diff >= 0;

                    return (
                      <tr key={row.month} className="hover:bg-[#fcfbf9]">
                        <td className="py-2.5 px-3 font-semibold text-[#18332f]">
                          {row.month}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#18332f]">
                          ${row.revenue.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[#5f6a65]">
                          ${row.target.toLocaleString()}
                        </td>
                        <td className={`py-2.5 px-3 text-right font-mono font-semibold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isPositive ? '+' : ''}${diff.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[#5f6a65]">
                          ${row.roomRevenue.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[#b46a36]">
                          ${row.fnbRevenue.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-medium">
                          {row.occupancy}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#18332f]">
                          ${row.adr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-[#fbf9f5] border-t-2 border-[#18332f] font-bold text-xs text-[#18332f]">
                  <tr>
                    <td className="py-3 px-3 uppercase tracking-wider font-serif-luxury">Period Totals / Avg</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">${totalYtdRevenue.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono">${totalYtdTarget.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-700">+${(totalYtdRevenue - totalYtdTarget).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono">${totalSuitesRevenue.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#b46a36]">${totalFnbRevenue.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center font-mono">{avgOccupancy}%</td>
                    <td className="py-3 px-3 text-right font-mono">${avgAdr}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Audit Certification & Signatures */}
          <div className="pt-6 border-t border-[#f0ece3] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">
                Executive Verification & Governance
              </span>
              <p className="text-[11px] text-[#5f6a65] leading-relaxed">
                Revenues, room nights, and dining sales documented herein are reconciled against PMS folios and Chapa banking webhooks in accordance with Grand Sovereign luxury hospitality financial standards.
              </p>
            </div>

            <div className="flex flex-col justify-end text-left sm:text-right">
              <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block mb-4">
                Executive Authorization Sign-off
              </span>
              <div className="border-b border-[#18332f] w-full max-w-[220px] ml-auto mb-1"></div>
              <span className="text-[10px] font-semibold text-[#18332f] block">Julian Montgomery</span>
              <span className="text-[9px] text-[#88938c]">General Manager · The Grand Golden Sovereign</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f0ece3] print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border-2 border-[#18332f] hover:bg-[#18332f] text-[#18332f] hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs group"
              title="Return directly back to executive dashboard view"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Return to Dashboard</span>
            </button>

            <label className="flex items-center gap-2 text-xs text-[#5f6a65] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoReturnAfterPrint}
                onChange={(e) => setAutoReturnAfterPrint(e.target.checked)}
                className="rounded border-[#c2baa9] text-[#18332f] focus:ring-0 cursor-pointer"
              />
              <span>Auto-return to dashboard after printing</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="px-4 py-2.5 rounded-full border border-[#e5e0d6] hover:bg-[#f6f4ee] text-xs font-semibold text-[#18332f] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="px-6 py-2.5 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.01]"
            >
              <Printer className="w-4 h-4 text-[#f5d77f]" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
