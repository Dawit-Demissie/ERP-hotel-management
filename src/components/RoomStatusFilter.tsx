import React from 'react';
import { 
  Key, 
  Users, 
  Sparkles, 
  Wrench, 
  Layers, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export interface RoomStatusCounts {
  all: number;
  available: number;
  occupied: number;
  cleaning: number;
  maintenance: number;
  reserved?: number;
}

interface RoomStatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  counts: RoomStatusCounts;
  className?: string;
}

interface FilterOptionConfig {
  id: string;
  label: string;
  shortLabel?: string;
  count: number;
  icon: React.ElementType;
  activeBg: string;
  activeText: string;
  activeBorder: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  description: string;
}

export const RoomStatusFilter: React.FC<RoomStatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  counts,
  className = ''
}) => {
  const options: FilterOptionConfig[] = [
    {
      id: 'all',
      label: 'All Suites',
      shortLabel: 'All',
      count: counts.all,
      icon: Layers,
      activeBg: 'bg-[#18332f]',
      activeText: 'text-white',
      activeBorder: 'border-[#18332f]',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      dotColor: 'bg-emerald-400',
      description: 'Entire inventory across all floors'
    },
    {
      id: 'Available',
      label: 'Available',
      count: counts.available,
      icon: Key,
      activeBg: 'bg-emerald-800',
      activeText: 'text-white',
      activeBorder: 'border-emerald-800',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      dotColor: 'bg-emerald-400',
      description: 'Ready for immediate guest reservation'
    },
    {
      id: 'Occupied',
      label: 'Occupied',
      count: counts.occupied,
      icon: Users,
      activeBg: 'bg-[#b46a36]',
      activeText: 'text-white',
      activeBorder: 'border-[#b46a36]',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      dotColor: 'bg-amber-300',
      description: 'Active in-house guests with open folios'
    },
    {
      id: 'Cleaning Required',
      label: 'Cleaning Required',
      shortLabel: 'Cleaning',
      count: counts.cleaning,
      icon: Sparkles,
      activeBg: 'bg-sky-700',
      activeText: 'text-white',
      activeBorder: 'border-sky-700',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      dotColor: 'bg-sky-300',
      description: 'Requires housekeeping inspection or VIP sanitization'
    },
    {
      id: 'Maintenance',
      label: 'Maintenance',
      count: counts.maintenance,
      icon: Wrench,
      activeBg: 'bg-rose-700',
      activeText: 'text-white',
      activeBorder: 'border-rose-700',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      dotColor: 'bg-rose-300',
      description: 'Engineering work orders or out-of-order suites'
    }
  ];

  // If there are reserved rooms, also support toggling reserved
  if (counts.reserved && counts.reserved > 0) {
    options.push({
      id: 'Reserved',
      label: 'Reserved',
      count: counts.reserved,
      icon: Clock,
      activeBg: 'bg-indigo-700',
      activeText: 'text-white',
      activeBorder: 'border-indigo-700',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      dotColor: 'bg-indigo-300',
      description: 'Guaranteed reservations awaiting check-in'
    });
  }

  const handleToggle = (id: string) => {
    // If user clicks the already active filter (except 'all'), toggle back to 'all'
    if (selectedStatus === id && id !== 'all') {
      onStatusChange('all');
    } else {
      onStatusChange(id);
    }
  };

  const activeOption = options.find(o => 
    o.id === selectedStatus || 
    (selectedStatus === 'Cleaning' && o.id === 'Cleaning Required')
  ) || options[0];

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Top Filter Container with Quick Toggle Buttons */}
      <div className="p-2 sm:p-2.5 bg-white border border-[#e5e0d6] rounded-2xl shadow-xs">
        <div className="flex items-center justify-between gap-2 pb-2 px-1 border-b border-[#f4efe6] text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#b46a36]">
            <span>Fast Status Command:</span>
            <span className="font-normal text-[#5f6a65] normal-case hidden sm:inline">
              Single-click to isolate suites for operations & dispatch
            </span>
          </div>

          {selectedStatus !== 'all' && (
            <button
              onClick={() => onStatusChange('all')}
              className="text-[11px] text-[#5f6a65] hover:text-[#18332f] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset to all suites"
            >
              <RotateCcw className="w-3 h-3 text-[#b46a36]" />
              <span>Reset filter</span>
            </button>
          )}
        </div>

        {/* Toggle Pills Row */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-2 pb-0.5 scrollbar-none">
          {options.map((opt) => {
            const isSelected = 
              selectedStatus === opt.id || 
              (selectedStatus === 'Cleaning' && opt.id === 'Cleaning Required');
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleToggle(opt.id)}
                className={`group relative shrink-0 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 border select-none ${
                  isSelected
                    ? `${opt.activeBg} ${opt.activeText} ${opt.activeBorder} shadow-sm scale-[1.01]`
                    : 'bg-[#fcfbf9] hover:bg-[#f6f4ee] text-[#2c3e38] border-[#e5e0d6] hover:border-[#18332f]/30'
                }`}
                aria-pressed={isSelected}
                title={`${opt.label}: ${opt.description} (Click to toggle)`}
              >
                {/* Status Dot / Indicator */}
                <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? opt.dotColor : 'bg-[#c2baa9] group-hover:scale-110'} transition-transform`} />
                
                {/* Status Icon */}
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#88938c] group-hover:text-[#18332f]'}`} />

                {/* Status Label */}
                <span className="whitespace-nowrap tracking-wide">
                  {opt.label}
                </span>

                {/* Dynamic Room Count Badge */}
                <span 
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 transition-colors ${
                    isSelected
                      ? opt.badgeBg + ' ' + opt.badgeText
                      : 'bg-[#ece8df] text-[#18332f] group-hover:bg-[#dfd9cd]'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Status Helper Strip when a specific status is filtered */}
      {selectedStatus !== 'all' && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-[#fbf9f5] border border-[#e5e0d6] rounded-xl text-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 text-[#18332f]">
            <span className={`w-2 h-2 rounded-full ${activeOption.dotColor}`} />
            <span>
              Showing <strong>{activeOption.count}</strong> {activeOption.label.toLowerCase()} suite{activeOption.count === 1 ? '' : 's'} — {activeOption.description}.
            </span>
          </div>

          <button
            onClick={() => onStatusChange('all')}
            className="text-[11px] font-semibold text-[#b46a36] hover:text-[#18332f] underline cursor-pointer shrink-0"
          >
            Show All ({counts.all})
          </button>
        </div>
      )}
    </div>
  );
};
