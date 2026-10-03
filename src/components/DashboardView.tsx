import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Bed, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  AlertCircle, 
  Calendar, 
  Users, 
  Utensils, 
  ChevronRight, 
  Zap, 
  Luggage, 
  Check, 
  Star,
  LineChart as LineChartIcon,
  BarChart3,
  Layers,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  Heart
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useHotel } from '../context/HotelContext';
import { ActiveTab } from './Sidebar';

export interface MonthlyRevenuePoint {
  month: string;
  shortMonth: string;
  revenue: number;
  target: number;
  roomRevenue: number;
  fnbRevenue: number;
  occupancy: number;
  adr: number;
}

export const MONTHLY_REVENUE_TRENDS: MonthlyRevenuePoint[] = [
  { month: 'January', shortMonth: 'Jan', revenue: 295000, target: 280000, roomRevenue: 228000, fnbRevenue: 67000, occupancy: 74, adr: 335 },
  { month: 'February', shortMonth: 'Feb', revenue: 312000, target: 290000, roomRevenue: 242000, fnbRevenue: 70000, occupancy: 78, adr: 345 },
  { month: 'March', shortMonth: 'Mar', revenue: 348000, target: 320000, roomRevenue: 268000, fnbRevenue: 80000, occupancy: 82, adr: 360 },
  { month: 'April', shortMonth: 'Apr', revenue: 365000, target: 340000, roomRevenue: 281000, fnbRevenue: 84000, occupancy: 84, adr: 368 },
  { month: 'May', shortMonth: 'May', revenue: 388000, target: 360000, roomRevenue: 299000, fnbRevenue: 89000, occupancy: 87, adr: 380 },
  { month: 'June', shortMonth: 'Jun', revenue: 415000, target: 390000, roomRevenue: 320000, fnbRevenue: 95000, occupancy: 91, adr: 395 },
  { month: 'July', shortMonth: 'Jul', revenue: 442000, target: 410000, roomRevenue: 341000, fnbRevenue: 101000, occupancy: 95, adr: 415 },
  { month: 'August', shortMonth: 'Aug', revenue: 438000, target: 410000, roomRevenue: 337000, fnbRevenue: 101000, occupancy: 94, adr: 410 },
  { month: 'September', shortMonth: 'Sep', revenue: 376000, target: 350000, roomRevenue: 290000, fnbRevenue: 86000, occupancy: 83, adr: 372 },
  { month: 'October (Current)', shortMonth: 'Oct', revenue: 392000, target: 365000, roomRevenue: 304000, fnbRevenue: 88000, occupancy: 85, adr: 375 },
  { month: 'November (Forecast)', shortMonth: 'Nov', revenue: 420000, target: 390000, roomRevenue: 324000, fnbRevenue: 96000, occupancy: 89, adr: 390 },
  { month: 'December (Festive)', shortMonth: 'Dec', revenue: 475000, target: 430000, roomRevenue: 368000, fnbRevenue: 107000, occupancy: 98, adr: 445 },
];

interface TooltipItem {
  name: string;
  value: number;
  color: string;
  payload: MonthlyRevenuePoint;
}

const CustomRevenueTrendsTooltip: React.FC<{
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
}> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md border border-[#e5e0d6] rounded-2xl p-4 shadow-xl text-xs space-y-2 min-w-[220px]">
        <div className="flex items-center justify-between border-b border-[#f0ece3] pb-2">
          <span className="font-serif-luxury font-bold text-[#18332f] text-sm">
            {data.month}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#18332f]/10 text-[#18332f] font-semibold">
            {data.occupancy}% Occ
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#5f6a65]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#18332f]" />
              Gross Booked:
            </span>
            <span className="font-mono font-bold text-[#18332f]">
              ${data.revenue.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#5f6a65]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b46a36]" />
              Budget Target:
            </span>
            <span className="font-mono font-medium text-[#b46a36]">
              ${data.target.toLocaleString()}
            </span>
          </div>

          <div className="pt-2 border-t border-[#f0ece3] flex items-center justify-between text-[11px] text-[#88938c]">
            <span>Suites: ${Math.round(data.roomRevenue / 1000)}k</span>
            <span>·</span>
            <span>F&B: ${Math.round(data.fnbRevenue / 1000)}k</span>
            <span>·</span>
            <span>ADR: ${data.adr}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenCheckInModal?: (resId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenCheckInModal }) => {
  const { 
    stats, 
    reservations, 
    rooms, 
    insights: initialContextInsights, 
    activeRole, 
    activityLogs, 
    approvePricingSuggestion,
    pricingSuggestions,
    checkInGuest,
    updateRoomStatus,
    restockInventory,
    inventory,
    favorites,
    toggleFavorite,
    isFavorite
  } = useHotel();

  const [revenueTimeframe, setRevenueTimeframe] = useState<'7d' | '30d'>('7d');
  const [trendRange, setTrendRange] = useState<'12m' | 'h2' | 'h1'>('12m');
  const [trendMetric, setTrendMetric] = useState<'all' | 'departments'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // AI Daily Operational Insight Widget State
  const [aiExecutiveSummary, setAiExecutiveSummary] = useState<string>(
    "Morning Executive Telemetry: Occupancy index is optimal at 85% with RevPAR pacing at $318.50 (+14.2% over comp-set). High-rate direct bookings are capturing 71% of demand. Critical attention is required on A5 Wagyu inventory replenishment and expedited sanitization for Suite 404 ahead of afternoon VIP arrivals."
  );

  const [aiInsightsList, setAiInsightsList] = useState<{
    id: string;
    type: 'Revenue' | 'VIP' | 'Kitchen' | 'Staffing' | 'Occupancy';
    title: string;
    description: string;
    severity: 'Urgent' | 'Warning' | 'Info' | 'Success';
    suggestedAction: string;
    impactMetric: string;
    categoryBadge: string;
    urgency: string;
    timestamp: string;
  }[]>([
    {
      id: 'ins-1',
      type: 'Revenue',
      title: 'Penthouse Rate Surge (+18.4%) Opportunity',
      description: 'International Sovereign Gala has compressed regional luxury suites. Floor 4 Royal Penthouse is currently priced at $950 against competitor ADR of $1,180.',
      severity: 'Warning',
      suggestedAction: 'Authorize +18.4% rate adjustment on Royal Penthouse to $1,125/night.',
      impactMetric: '+$5,250 net incremental ADR',
      categoryBadge: 'Yield Optimization',
      urgency: 'High Yield Opportunity',
      timestamp: 'Just now'
    },
    {
      id: 'ins-2',
      type: 'VIP',
      title: 'Lord Sterling & Ambassador Vance Arrivals',
      description: 'Two Black Diamond VIPs arriving between 14:00 and 16:00. Room 401 requires 2012 Dom Pérignon on ice and hypoallergenic bedding verification.',
      severity: 'Urgent',
      suggestedAction: 'Dispatch Butler Concierge escort and pre-encode VIP keycards for Suites 401 and 404.',
      impactMetric: 'Zero lobby wait & 100% CSAT',
      categoryBadge: 'VIP Experience',
      urgency: 'Immediate Action Required',
      timestamp: '3 mins ago'
    },
    {
      id: 'ins-3',
      type: 'Kitchen',
      title: 'A5 Miyazaki Wagyu Stock Buffer Critical',
      description: 'Current stock is 4.8 kg against weekend dinner reservation forecast of 14.5 kg. Supplier cut-off is 13:00 today.',
      severity: 'Urgent',
      suggestedAction: 'Approve PO-8892 for 15 kg Wagyu ribeye express delivery from Tokyo Prime Imports.',
      impactMetric: 'Secures $8,500 banquet revenue',
      categoryBadge: 'Culinary Stock',
      urgency: 'Immediate Action Required',
      timestamp: '8 mins ago'
    },
    {
      id: 'ins-4',
      type: 'Staffing',
      title: 'Housekeeping Turn-down Fast-Track for Floor 4',
      description: 'Suite 404 departed at 11:15 with incoming VIP arrival at 14:30. Requires two housekeeping leads for accelerated sanitization.',
      severity: 'Success',
      suggestedAction: 'Reassign Beatriz Morales & 1 specialist to Suite 404 for VIP Rush turnover.',
      impactMetric: '30-min turnover standard',
      categoryBadge: 'Housekeeping Dispatch',
      urgency: 'Operational Guard',
      timestamp: '14 mins ago'
    }
  ]);

  const [executedActionIds, setExecutedActionIds] = useState<string[]>([]);
  const [isRegeneratingInsights, setIsRegeneratingInsights] = useState<boolean>(false);
  const [insightCategoryFilter, setInsightCategoryFilter] = useState<string>('All');
  const [lastBriefingTime, setLastBriefingTime] = useState<string>('08:15 AM (Live)');

  const handleRegenerateBriefing = async () => {
    setIsRegeneratingInsights(true);
    try {
      const res = await fetch('/api/ai/operational-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occupancyRate: stats.occupancyRate,
          revPar: stats.revPar,
          todayRevenue: stats.todayRevenue,
          adr: stats.adr,
          pendingCheckIns: stats.pendingCheckIns,
          activeRole
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.executiveSummary) {
          setAiExecutiveSummary(data.executiveSummary);
        }
        if (data.insights && Array.isArray(data.insights)) {
          setAiInsightsList(data.insights.map((ins: any) => ({
            ...ins,
            categoryBadge: ins.categoryBadge || (ins.type === 'Revenue' ? 'Yield Optimization' : ins.type === 'VIP' ? 'VIP Experience' : ins.type === 'Kitchen' ? 'Culinary Stock' : 'Housekeeping Dispatch'),
            urgency: ins.urgency || (ins.severity === 'Urgent' ? 'Immediate Action Required' : ins.severity === 'Warning' ? 'High Yield Opportunity' : 'Operational Guard')
          })));
        }
        const now = new Date();
        setLastBriefingTime(`${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Live)`);
        setActionFeedback('AI Daily Operational Briefing regenerated with live property telemetry.');
        setTimeout(() => setActionFeedback(null), 3500);
      }
    } catch (err) {
      console.error('Failed to regenerate operational insights:', err);
      setActionFeedback('Failed to reach AI service, using cached telemetry.');
      setTimeout(() => setActionFeedback(null), 3000);
    } finally {
      setIsRegeneratingInsights(false);
    }
  };

  const handleExecuteInsightAction = (insight: { id: string; suggestedAction: string }) => {
    if (executedActionIds.includes(insight.id)) return;

    setExecutedActionIds(prev => [...prev, insight.id]);

    const actionText = insight.suggestedAction.toLowerCase();

    if (actionText.includes('rate') || actionText.includes('surge') || actionText.includes('penthouse')) {
      const pendingPricing = pricingSuggestions.find(p => p.status === 'Pending Approval');
      if (pendingPricing) {
        approvePricingSuggestion(pendingPricing.id);
      }
    }

    if (actionText.includes('wagyu') || actionText.includes('restock') || actionText.includes('po-8892')) {
      const wagyuItem = inventory.find(i => i.name.includes('Wagyu'));
      if (wagyuItem) {
        restockInventory(wagyuItem.id, 15);
      }
    }

    if (actionText.includes('suite 404') || actionText.includes('housekeeping') || actionText.includes('turnover') || actionText.includes('rush')) {
      const rm404 = rooms.find(r => r.roomNumber === '404');
      if (rm404) {
        updateRoomStatus(rm404.id, 'Cleaning', 'VIP Rush');
      }
    }

    setActionFeedback(`Action Executed: ${insight.suggestedAction}`);
    setTimeout(() => setActionFeedback(null), 4500);
  };

  const filteredTrendData = MONTHLY_REVENUE_TRENDS.filter((_, idx) => {
    if (trendRange === 'h1') return idx < 6;
    if (trendRange === 'h2') return idx >= 6;
    return true;
  });

  const totalYtdRevenue = MONTHLY_REVENUE_TRENDS.reduce((sum, d) => sum + d.revenue, 0);
  const totalYtdTarget = MONTHLY_REVENUE_TRENDS.reduce((sum, d) => sum + d.target, 0);
  const targetVariancePercent = (((totalYtdRevenue - totalYtdTarget) / totalYtdTarget) * 100).toFixed(1);

  // Revenue chart dataset (historical 7d)
  const weeklyData = [
    { day: 'Mon', revenue: 38400, occupancy: 78, adr: 340 },
    { day: 'Tue', revenue: 41200, occupancy: 82, adr: 355 },
    { day: 'Wed', revenue: 39900, occupancy: 80, adr: 350 },
    { day: 'Thu', revenue: 44500, occupancy: 86, adr: 370 },
    { day: 'Fri', revenue: 52800, occupancy: 96, adr: 420 },
    { day: 'Sat', revenue: 54100, occupancy: 98, adr: 435 },
    { day: 'Sun (Today)', revenue: 42850, occupancy: stats.occupancyRate, adr: stats.adr },
  ];

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));

  // Today arrivals & departures
  const todayArrivals = reservations.filter(r => r.status === 'Confirmed');
  const todayDepartures = reservations.filter(r => r.status === 'Checked In' && r.checkOutDate <= '2026-10-03');

  const handleApplyInsight = (insightId: string, actionText: string) => {
    setActionFeedback(`Executed: ${actionText}`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e5e0d6]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#b46a36] mb-1 font-bold tracking-[0.16em] uppercase">
            <span>Executive Overview</span>
            <span aria-hidden="true" className="text-[#c7bfb1]">·</span>
            <span>Role: {activeRole}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#18332f]">
            Hotel Revenue & Operations Command
          </h1>
          <p className="text-xs text-[#5f6a65] mt-1">
            The Grand Sovereign Resort & Suites · 28 Luxury Keys · Real-time Operational Telemetry
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('rooms')}
            className="px-5 py-2.5 rounded-full border border-[#18332f] bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Bed className="w-3.5 h-3.5" />
            <span>Manage Suites & Folios</span>
          </button>
          <button
            onClick={() => onNavigate('pos')}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-[#f6f4ee] border border-[#e5e0d6] text-[#18332f] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Utensils className="w-3.5 h-3.5 text-[#b46a36]" />
            <span>Restaurant POS</span>
          </button>
          <button
            onClick={() => onNavigate('ai')}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-[#f6f4ee] border border-[#b46a36] text-[#b46a36] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b46a36]" />
            <span>AI Revenue Advisor</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3.5 bg-[#f4efe6] border border-[#b46a36]/40 rounded-2xl text-xs text-[#18332f] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#18332f]" />
            <span className="font-medium">{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-[#5f6a65] hover:text-[#18332f] text-xs font-medium cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Primary Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* KPI 1: Real-time Revenue */}
        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-[#5f6a65] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Gross Booked Revenue</span>
            <div className="p-2 rounded-full bg-[#f4efe6] text-[#b46a36]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif-luxury text-[#18332f]">
              ${stats.todayRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-[#18332f] font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2% pace
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0ece3] flex items-center justify-between text-xs text-[#5f6a65]">
            <span>Rooms: ${Math.round(stats.todayRevenue * 0.78).toLocaleString()}</span>
            <span aria-hidden="true" className="text-[#c7bfb1]">·</span>
            <span>F&B: ${Math.round(stats.todayRevenue * 0.22).toLocaleString()}</span>
          </div>
        </div>

        {/* KPI 2: Occupancy Rate */}
        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-[#5f6a65] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Occupancy Index</span>
            <div className="p-2 rounded-full bg-[#f4efe6] text-[#18332f]">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif-luxury text-[#18332f]">
              {stats.occupancyRate}%
            </span>
            <span className="text-xs text-[#88938c]">
              ({stats.occupiedRooms} of {stats.totalRooms} suites)
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0ece3] flex items-center justify-between text-xs text-[#5f6a65]">
            <span className="text-[#18332f] font-medium">{stats.availableRooms} Open for Walk-In</span>
            <span aria-hidden="true" className="text-[#c7bfb1]">·</span>
            <span className="text-[#b46a36] font-medium">{stats.cleaningRooms} Cleaning</span>
          </div>
        </div>

        {/* KPI 3: RevPAR & ADR */}
        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-[#5f6a65] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">RevPAR & ADR Yield</span>
            <div className="p-2 rounded-full bg-[#f4efe6] text-[#b46a36]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif-luxury text-[#b46a36]">
              ${stats.revPar}
            </span>
            <span className="text-xs text-[#5f6a65]">
              RevPAR (ADR ${stats.adr})
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0ece3] flex items-center justify-between text-xs text-[#5f6a65]">
            <span>Benchmark: $280</span>
            <span aria-hidden="true" className="text-[#c7bfb1]">·</span>
            <span className="text-[#18332f] font-semibold">+13.7%</span>
          </div>
        </div>

        {/* KPI 4: Today Arrivals / Departures */}
        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-[#5f6a65] mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Front Desk Pacing</span>
            <div className="p-2 rounded-full bg-[#f4efe6] text-[#18332f]">
              <Luggage className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-2xl font-bold font-serif-luxury text-[#18332f]">{stats.pendingCheckIns}</span>
              <span className="text-xs text-[#88938c] ml-1">Arrivals</span>
            </div>
            <span className="text-[#c7bfb1]">/</span>
            <div>
              <span className="text-2xl font-bold font-serif-luxury text-[#b46a36]">{stats.pendingCheckOuts || 1}</span>
              <span className="text-xs text-[#88938c] ml-1">Departures</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0ece3] flex items-center justify-between text-xs text-[#5f6a65]">
            <span>VIP Arrivals: 2</span>
            <span aria-hidden="true" className="text-[#c7bfb1]">·</span>
            <span className="text-[#18332f] font-medium">{stats.activeKOTs} Kitchen Tickets</span>
          </div>
        </div>
      </div>

      {/* Property Experience Showcase: Suites, Gourmet Dining, & Vintage Cellar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b46a36]">CURATED EXPERIENCES</span>
            <h2 className="text-2xl font-serif-luxury font-bold text-[#18332f]">
              Signature Hospitality & Culinary Portfolio
            </h2>
            <p className="text-xs text-[#5f6a65]">High-yield suites, Michelin-caliber gastronomy and vintage cellar assets</p>
          </div>
          <button
            onClick={() => onNavigate('pos')}
            className="px-4 py-2 rounded-full border border-[#18332f] text-[#18332f] hover:bg-[#18332f] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Full Menu & POS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Presidential Suites */}
          <div 
            onClick={() => onNavigate('rooms')}
            className="rounded-3xl bg-white border border-[#e5e0d6] hover:shadow-lg transition-all overflow-hidden group cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="relative h-44 w-full overflow-hidden bg-[#f0ece3]">
              <img
                src="/src/assets/images/luxury_hotel_suite_1791012847273.jpg"
                alt="Presidential Suite Interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-semibold text-[#18332f] shadow-xs">
                Guest favorite
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite('showcase-1', 'Presidential Ocean Suites');
                }}
                aria-label={isFavorite('showcase-1') ? "Remove from favorites" : "Add to favorites"}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer z-10 ${
                  isFavorite('showcase-1')
                    ? 'bg-rose-500 text-white scale-105'
                    : 'bg-white/90 text-[#5f6a65] hover:text-rose-500 hover:bg-white hover:scale-105'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite('showcase-1') ? 'fill-white stroke-white' : 'stroke-current'}`} />
              </button>
              <span className="absolute bottom-3 right-3 font-serif-luxury text-white font-bold text-sm bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                From $1,250/n
              </span>
            </div>
            <div className="p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b46a36]">ACCOMMODATION</span>
              <h3 className="font-serif-luxury font-bold text-base text-[#18332f] group-hover:text-[#b46a36] transition-colors">
                Presidential Ocean Suites
              </h3>
              <p className="text-xs text-[#5f6a65] line-clamp-1">
                Panoramic ocean views, private butler & helipad access
              </p>
            </div>
          </div>

          {/* Card 2: A5 Wagyu Ribeye */}
          <div 
            onClick={() => onNavigate('pos')}
            className="rounded-3xl bg-white border border-[#e5e0d6] hover:shadow-lg transition-all overflow-hidden group cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="relative h-44 w-full overflow-hidden bg-[#f0ece3]">
              <img
                src="/src/assets/images/wagyu_steak_dish_1791012861226.jpg"
                alt="A5 Wagyu Ribeye Steak"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-semibold text-[#18332f] shadow-xs">
                Chef's choice
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite('showcase-2', 'A5 Miyazaki Wagyu Ribeye');
                }}
                aria-label={isFavorite('showcase-2') ? "Remove from favorites" : "Add to favorites"}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer z-10 ${
                  isFavorite('showcase-2')
                    ? 'bg-rose-500 text-white scale-105'
                    : 'bg-white/90 text-[#5f6a65] hover:text-rose-500 hover:bg-white hover:scale-105'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite('showcase-2') ? 'fill-white stroke-white' : 'stroke-current'}`} />
              </button>
              <span className="absolute bottom-3 right-3 font-serif-luxury text-white font-bold text-sm bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                $185
              </span>
            </div>
            <div className="p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b46a36]">GASTRONOMY</span>
              <h3 className="font-serif-luxury font-bold text-base text-[#18332f] group-hover:text-[#b46a36] transition-colors">
                A5 Miyazaki Wagyu Ribeye
              </h3>
              <p className="text-xs text-[#5f6a65] line-clamp-1">
                Black garlic truffle glaze, roasted marrow & maitake
              </p>
            </div>
          </div>

          {/* Card 3: Pan-Seared Turbot */}
          <div 
            onClick={() => onNavigate('pos')}
            className="rounded-3xl bg-white border border-[#e5e0d6] hover:shadow-lg transition-all overflow-hidden group cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="relative h-44 w-full overflow-hidden bg-[#f0ece3]">
              <img
                src="/src/assets/images/pan_seared_turbot_1791012873342.jpg"
                alt="Pan-Seared Brittany Turbot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-semibold text-[#18332f] shadow-xs">
                Seafood
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite('showcase-3', 'Pan-Seared Brittany Turbot');
                }}
                aria-label={isFavorite('showcase-3') ? "Remove from favorites" : "Add to favorites"}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer z-10 ${
                  isFavorite('showcase-3')
                    ? 'bg-rose-500 text-white scale-105'
                    : 'bg-white/90 text-[#5f6a65] hover:text-rose-500 hover:bg-white hover:scale-105'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite('showcase-3') ? 'fill-white stroke-white' : 'stroke-current'}`} />
              </button>
              <span className="absolute bottom-3 right-3 font-serif-luxury text-white font-bold text-sm bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                $110
              </span>
            </div>
            <div className="p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b46a36]">FINE DINING</span>
              <h3 className="font-serif-luxury font-bold text-base text-[#18332f] group-hover:text-[#b46a36] transition-colors">
                Pan-Seared Brittany Turbot
              </h3>
              <p className="text-xs text-[#5f6a65] line-clamp-1">
                Champagne velouté & royal Oscietra caviar
              </p>
            </div>
          </div>

          {/* Card 4: Vintage Cocktails */}
          <div 
            onClick={() => onNavigate('pos')}
            className="rounded-3xl bg-white border border-[#e5e0d6] hover:shadow-lg transition-all overflow-hidden group cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
          >
            <div className="relative h-44 w-full overflow-hidden bg-[#f0ece3]">
              <img
                src="/src/assets/images/vintage_smoked_cocktail_1791012884144.jpg"
                alt="Smoked Old Fashioned & Vintage Cellar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-semibold text-[#18332f] shadow-xs">
                Vintage Cellar
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite('showcase-4', 'Artisan Smoked Libations');
                }}
                aria-label={isFavorite('showcase-4') ? "Remove from favorites" : "Add to favorites"}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer z-10 ${
                  isFavorite('showcase-4')
                    ? 'bg-rose-500 text-white scale-105'
                    : 'bg-white/90 text-[#5f6a65] hover:text-rose-500 hover:bg-white hover:scale-105'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite('showcase-4') ? 'fill-white stroke-white' : 'stroke-current'}`} />
              </button>
              <span className="absolute bottom-3 right-3 font-serif-luxury text-white font-bold text-sm bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                $32 - $360
              </span>
            </div>
            <div className="p-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b46a36]">SOMMELIER</span>
              <h3 className="font-serif-luxury font-bold text-base text-[#18332f] group-hover:text-[#b46a36] transition-colors">
                Artisan Smoked Libations
              </h3>
              <p className="text-xs text-[#5f6a65] line-clamp-1">
                24k gold Old Fashioned & Dom Pérignon Vintage
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Daily Operational Insight Widget */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_24px_-4px_rgba(24,51,47,0.06)] space-y-6">
        {/* Widget Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#f0ece3]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#18332f] text-white flex items-center justify-center shadow-xs shrink-0 relative">
              <Sparkles className="w-5 h-5 text-[#f5d77f]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b46a36]">
                  AUTONOMOUS HOSPITALITY TELEMETRY
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#18332f]/10 text-[#18332f] font-bold">
                  Gemini Flash 3.8 Engine
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#18332f] mt-0.5">
                Daily Operational Insights & Action Center
              </h2>
              <p className="text-xs text-[#5f6a65]">
                Real-time synthesis of property telemetry, occupancy pacing, VIP arrivals, and inventory stock
              </p>
            </div>
          </div>

          {/* Top Widget Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] text-[#88938c] font-medium hidden sm:inline-block">
              Updated: {lastBriefingTime}
            </span>
            <button
              onClick={handleRegenerateBriefing}
              disabled={isRegeneratingInsights}
              className="px-4 py-2 rounded-full border border-[#18332f] bg-white hover:bg-[#f6f4ee] text-[#18332f] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#b46a36] ${isRegeneratingInsights ? 'animate-spin' : ''}`} />
              <span>{isRegeneratingInsights ? 'Analyzing Telemetry...' : 'Regenerate Briefing'}</span>
            </button>
            <button
              onClick={() => onNavigate('ai')}
              className="px-4 py-2 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>AI Dialogue Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Executive Performance Metrics Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-[#fcfbf8] border border-[#e5e0d6]">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">Occupancy Index</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif-luxury font-bold text-[#18332f]">{stats.occupancyRate}%</span>
              <span className="text-[11px] text-[#18332f] font-medium font-mono">({stats.totalRooms - stats.availableRooms}/28 keys)</span>
            </div>
            <span className="text-[10px] text-[#88938c] block">{stats.availableRooms} open for high-rate walk-in</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">RevPAR Velocity</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif-luxury font-bold text-[#18332f]">${stats.revPar}</span>
              <span className="text-[11px] text-emerald-700 font-semibold font-mono">+14.2%</span>
            </div>
            <span className="text-[10px] text-[#88938c] block">ADR benchmark: ${stats.adr}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">Gross Booked Today</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif-luxury font-bold text-[#18332f]">${stats.todayRevenue.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-[#88938c] block">Rooms: 78% · Dining: 22%</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">VIP Arrivals</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif-luxury font-bold text-[#b46a36]">2 Inbound</span>
              <span className="text-[11px] text-[#18332f] font-mono">Black Diamond</span>
            </div>
            <span className="text-[10px] text-[#88938c] block">Suites 401 & 404 assigned</span>
          </div>

          <div className="space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[#88938c] uppercase font-bold tracking-wider block">Critical Supply Buffer</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif-luxury font-bold text-rose-700">4.8 kg</span>
              <span className="text-[11px] text-rose-700 font-semibold font-mono">Wagyu Low</span>
            </div>
            <span className="text-[10px] text-[#88938c] block">Supplier cutoff: 13:00 today</span>
          </div>
        </div>

        {/* AI Executive Synthesis Briefing Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#fbf9f5] border border-[#b46a36]/30 flex flex-col sm:flex-row items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#f4efe6] text-[#b46a36] flex items-center justify-center shrink-0 border border-[#b46a36]/30">
            <Lightbulb className="w-5 h-5 text-[#b46a36]" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-serif-luxury font-bold text-[#18332f] uppercase tracking-wider">
                Morning Operational Synthesis & Executive Directive
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#18332f] text-white font-semibold">
                Autonomous Briefing
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#2b3a35] leading-relaxed font-sans">
              {aiExecutiveSummary}
            </p>
          </div>
        </div>

        {/* Category Filters for Insight Action Cards */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Revenue', 'VIP', 'Kitchen', 'Staffing'].map((cat) => (
              <button
                key={cat}
                onClick={() => setInsightCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  insightCategoryFilter === cat
                    ? 'bg-[#18332f] text-white shadow-xs'
                    : 'bg-white border border-[#e5e0d6] text-[#5f6a65] hover:text-[#18332f]'
                }`}
              >
                {cat === 'All' ? `All Action Items (${aiInsightsList.length})` :
                 cat === 'Revenue' ? 'Yield & Dynamic Rates' :
                 cat === 'VIP' ? 'VIP Guest Operations' :
                 cat === 'Kitchen' ? 'Kitchen & Stock Buffer' : 'Housekeeping Roster'}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-[#88938c]">
            {executedActionIds.length} of {aiInsightsList.length} Immediate Actions Executed
          </span>
        </div>

        {/* Actionable Insight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {aiInsightsList
            .filter(ins => insightCategoryFilter === 'All' || ins.type === insightCategoryFilter)
            .map((ins) => {
              const isExecuted = executedActionIds.includes(ins.id);

              return (
                <div 
                  key={ins.id} 
                  className={`p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between space-y-3.5 ${
                    isExecuted 
                      ? 'bg-[#f8fbf9] border border-emerald-300 shadow-xs' 
                      : 'bg-[#fbf9f5] border border-[#e5e0d6] hover:border-[#b46a36]/50 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header: Urgency and Category Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        ins.severity === 'Urgent' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                        ins.severity === 'Warning' ? 'text-[#b46a36] bg-[#f4efe6] border-[#b46a36]/30' :
                        'text-[#18332f] bg-[#18332f]/10 border-[#18332f]/20'
                      }`}>
                        {ins.categoryBadge || ins.type}
                      </span>
                      <span className="text-[10px] text-[#88938c] font-mono">{ins.timestamp}</span>
                    </div>

                    <h3 className="font-bold text-sm text-[#18332f] leading-snug">
                      {ins.title}
                    </h3>

                    <p className="text-xs text-[#5f6a65] leading-relaxed">
                      {ins.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#f0ece3]">
                    {/* Projected Impact Pill */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] text-[#88938c] font-semibold uppercase">Impact:</span>
                      <span className="font-mono text-xs font-bold text-[#18332f] bg-white px-2 py-0.5 rounded-md border border-[#e5e0d6]">
                        {ins.impactMetric}
                      </span>
                    </div>

                    {/* Immediate Action Execution Button */}
                    {ins.suggestedAction && (
                      <button
                        onClick={() => handleExecuteInsightAction(ins)}
                        disabled={isExecuted}
                        className={`w-full py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                          isExecuted
                            ? 'bg-emerald-700 text-white cursor-default'
                            : 'bg-[#18332f] hover:bg-[#112421] text-white hover:scale-[1.01]'
                        }`}
                      >
                        {isExecuted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>Action Executed & Logged</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-[#f5d77f]" />
                            <span className="truncate">{ins.suggestedAction}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Main Grid: Revenue Pacing Chart & Arrivals/Check-In Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recharts Revenue Trends & Monthly Performance */}
        <div className="xl:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#f0ece3]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase text-[#b46a36] mb-0.5">
                <LineChartIcon className="w-3.5 h-3.5" />
                <span>Financial Telemetry & Forecasting</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#18332f]">
                Revenue Trends & Monthly Performance
              </h2>
              <p className="text-xs text-[#5f6a65]">
                Monthly performance trajectory comparing booked revenues against budget benchmarks
              </p>
            </div>

            {/* Filter controls: Metric view and Range */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Metric Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#f8f6f1] border border-[#e5e0d6] rounded-full text-xs">
                <button
                  onClick={() => setTrendMetric('all')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    trendMetric === 'all'
                      ? 'bg-[#18332f] text-white shadow-xs'
                      : 'text-[#5f6a65] hover:text-[#18332f]'
                  }`}
                >
                  Total vs Budget
                </button>
                <button
                  onClick={() => setTrendMetric('departments')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    trendMetric === 'departments'
                      ? 'bg-[#18332f] text-white shadow-xs'
                      : 'text-[#5f6a65] hover:text-[#18332f]'
                  }`}
                >
                  Suites vs F&B
                </button>
              </div>

              {/* Range Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#f8f6f1] border border-[#e5e0d6] rounded-full text-xs">
                <button
                  onClick={() => setTrendRange('12m')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    trendRange === '12m'
                      ? 'bg-[#18332f] text-white shadow-xs'
                      : 'text-[#5f6a65] hover:text-[#18332f]'
                  }`}
                >
                  12M Full Year
                </button>
                <button
                  onClick={() => setTrendRange('h2')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    trendRange === 'h2'
                      ? 'bg-[#18332f] text-white shadow-xs'
                      : 'text-[#5f6a65] hover:text-[#18332f]'
                  }`}
                >
                  H2 (Jul - Dec)
                </button>
                <button
                  onClick={() => setTrendRange('h1')}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    trendRange === 'h1'
                      ? 'bg-[#18332f] text-white shadow-xs'
                      : 'text-[#5f6a65] hover:text-[#18332f]'
                  }`}
                >
                  H1 (Jan - Jun)
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
              <span className="text-[10px] text-[#88938c] font-semibold uppercase tracking-wider block">YTD Gross Revenue</span>
              <span className="text-base sm:text-lg font-serif-luxury font-bold text-[#18332f]">
                ${(totalYtdRevenue / 1000000).toFixed(2)}M
              </span>
              <span className="text-[10px] text-[#18332f] font-semibold block">
                +{targetVariancePercent}% vs target
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
              <span className="text-[10px] text-[#88938c] font-semibold uppercase tracking-wider block">Monthly Average</span>
              <span className="text-base sm:text-lg font-serif-luxury font-bold text-[#18332f]">
                ${Math.round(totalYtdRevenue / 12 / 1000)}k / mo
              </span>
              <span className="text-[10px] text-[#5f6a65] block">
                Base ADR: $381.00
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
              <span className="text-[10px] text-[#88938c] font-semibold uppercase tracking-wider block">Peak Month</span>
              <span className="text-base sm:text-lg font-serif-luxury font-bold text-[#b46a36]">
                Dec ($475k)
              </span>
              <span className="text-[10px] text-[#88938c] block">
                98% Festive Occupancy
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6]">
              <span className="text-[10px] text-[#88938c] font-semibold uppercase tracking-wider block">Target Achievement</span>
              <span className="text-base sm:text-lg font-serif-luxury font-bold text-[#18332f]">
                {((totalYtdRevenue / totalYtdTarget) * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                Exceeding budget
              </span>
            </div>
          </div>

          {/* Recharts Line Chart Container */}
          <div className="h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredTrendData}
                margin={{ top: 12, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece3" vertical={false} />
                <XAxis
                  dataKey="shortMonth"
                  stroke="#88938c"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e0d6' }}
                />
                <YAxis
                  stroke="#88938c"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e0d6' }}
                  tickFormatter={(val: number) => `$${Math.round(val / 1000)}k`}
                  domain={['dataMin - 35000', 'dataMax + 25000']}
                />
                <Tooltip content={<CustomRevenueTrendsTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                />
                {trendMetric === 'all' ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Booked Revenue ($)"
                      stroke="#18332f"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#18332f', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: '#b46a36', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Budget Target ($)"
                      stroke="#b46a36"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3, fill: '#b46a36', stroke: '#ffffff', strokeWidth: 1.5 }}
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey="roomRevenue"
                      name="Suites & Accommodations ($)"
                      stroke="#18332f"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#18332f', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#18332f', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fnbRevenue"
                      name="Dining, Wine & Cellar ($)"
                      stroke="#b46a36"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#b46a36', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#b46a36', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Footnote & Pacing Insights */}
          <div className="pt-2 border-t border-[#f0ece3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#5f6a65]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                <strong>October pace:</strong> $392,000 (+7.4% above budget). High-rate suites and corporate buyouts driving margin expansion.
              </span>
            </div>
            <span className="font-mono text-[#18332f] text-[11px] font-bold shrink-0">
              Q4 Target: $1,287,000
            </span>
          </div>

          {/* Quick Dynamic Pricing Recommendations Highlight */}
          <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#b46a36]/10 text-[#b46a36]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#18332f]">
                  AI Dynamic Pricing Recommendations Available
                </h3>
                <p className="text-[11px] text-[#5f6a65]">
                  3 room categories have pending yield adjustments with +$8,050 projected revenue.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('rooms')}
              className="px-4 py-2 rounded-full border border-[#18332f] text-[#18332f] hover:bg-[#18332f] hover:text-white text-xs font-semibold cursor-pointer shrink-0 transition-colors"
            >
              Review & Approve Rates
            </button>
          </div>
        </div>

        {/* Right Col: Today Arrivals & Check-In Action Queue */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3]">
              <div>
                <h2 className="text-lg font-serif-luxury font-bold text-[#18332f]">
                  Front Desk Arrivals
                </h2>
                <p className="text-xs text-[#5f6a65]">Pending arrivals for today</p>
              </div>
              <span className="text-xs font-mono text-[#b46a36] bg-[#b46a36]/10 px-2.5 py-0.5 rounded-full border border-[#b46a36]/20 font-bold">
                {todayArrivals.length} Confirmed
              </span>
            </div>

            <div className="divide-y divide-[#f0ece3] mt-3 max-h-96 overflow-y-auto pr-1">
              {todayArrivals.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#88938c]">
                  All today arrivals have been checked in successfully!
                </div>
              ) : (
                todayArrivals.map((res) => (
                  <div key={res.id} className="py-3 text-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-[#18332f] flex items-center gap-1.5">
                          {res.guest.name}
                          {res.guest.vipStatus && (
                            <span className="text-[9px] font-bold tracking-wider text-[#b46a36] bg-[#b46a36]/10 px-1.5 py-0.2 rounded-full border border-[#b46a36]/30">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5f6a65] mt-0.5">
                          Suite {res.roomNumber} · {res.roomCategory}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[#18332f] font-bold">${res.totalRoomCost}</span>
                        <div className="text-[10px] text-[#88938c]">{res.nights} nights</div>
                      </div>
                    </div>

                    {res.guest.specialRequests && (
                      <p className="text-[11px] text-[#5f6a65] italic bg-[#fbf9f5] p-2 rounded-xl border border-[#e5e0d6]">
                        "{res.guest.specialRequests}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#88938c]">
                        Ref: {res.confirmationCode}
                      </span>
                      <button
                        onClick={() => checkInGuest(res.id, 500)}
                        className="px-4 py-1.5 bg-[#18332f] hover:bg-[#112421] text-white rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        Check-In Guest
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Operational Activity Stream */}
          <div className="pt-4 border-t border-[#f0ece3]">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#88938c] block mb-2">
              Recent Activity Feed
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto text-[11px]">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-start gap-2 text-[#5f6a65]">
                  <span className="font-mono text-[10px] text-[#88938c] shrink-0">{log.time}</span>
                  <span className="text-[#c7bfb1]">·</span>
                  <span className="truncate">{log.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
