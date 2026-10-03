import React from 'react';
import { 
  LayoutDashboard, 
  BedDouble, 
  UtensilsCrossed, 
  Sparkles, 
  Users2, 
  ReceiptText, 
  Building2
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';

export type ActiveTab = 'dashboard' | 'rooms' | 'pos' | 'ai' | 'hr' | 'finance';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  isOpenMobile, 
  onCloseMobile 
}) => {
  const { stats, pricingSuggestions } = useHotel();

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'RevPAR, ADR & daily briefing'
    },
    {
      id: 'rooms' as ActiveTab,
      label: 'Rooms & Reservations',
      icon: BedDouble,
      badge: `${stats.availableRooms} open`,
      badgeColor: 'text-[#18332f] bg-[#18332f]/10 border-[#18332f]/20',
      description: 'Grid, check-in & rate optimizer'
    },
    {
      id: 'pos' as ActiveTab,
      label: 'Restaurant POS & Kitchen',
      icon: UtensilsCrossed,
      badge: stats.activeKOTs > 0 ? `${stats.activeKOTs} active` : null,
      badgeColor: 'text-[#b46a36] bg-[#b46a36]/10 border-[#b46a36]/20',
      description: 'Tables, KOT & inventory restock'
    },
    {
      id: 'ai' as ActiveTab,
      label: 'Golden AI Assistant',
      icon: Sparkles,
      badge: pricingSuggestions.filter(p => p.status === 'Pending Approval').length > 0 
        ? `${pricingSuggestions.filter(p => p.status === 'Pending Approval').length} alerts` 
        : 'Active',
      badgeColor: 'text-[#b46a36] bg-[#b46a36]/10 border-[#b46a36]/20',
      description: 'Concierge, pricing & draft responder'
    },
    {
      id: 'hr' as ActiveTab,
      label: 'Staff & Shift Rosters',
      icon: Users2,
      badge: null,
      description: 'Roles, timeclock & scheduling'
    },
    {
      id: 'finance' as ActiveTab,
      label: 'Finance & Invoices',
      icon: ReceiptText,
      badge: 'Chapa live',
      badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
      description: 'Folios, audit & RevPAR reporting'
    }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-40
        w-72 bg-[#fcfbf8] border-r border-[#e5e0d6]
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out shadow-xs
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation list */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Section Label */}
          <div className="px-3 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#88938c]">
              Operations Center
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between
                    transition-all duration-200 cursor-pointer group
                    ${isActive 
                      ? 'bg-white border border-[#e5e0d6] text-[#18332f] shadow-xs' 
                      : 'text-[#5f6a65] hover:text-[#18332f] hover:bg-[#f6f4ee]'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-[#18332f] text-white shadow-xs' 
                        : 'bg-white border border-[#e5e0d6] text-[#5f6a65] group-hover:text-[#18332f]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${isActive ? 'text-[#18332f]' : 'text-[#2b3a35] group-hover:text-[#18332f]'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-[#88938c] mt-0.5 font-normal">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || 'border-[#e5e0d6] text-[#5f6a65]'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Property Stats Widget */}
          <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#f0ece3]">
              <span className="font-semibold text-[#18332f] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#b46a36]" />
                Property Inventory
              </span>
              <span className="text-[10px] text-[#18332f] font-mono font-medium">Floor 1 - 4</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#f8f6f1] border border-[#e5e0d6]">
                <span className="text-[#88938c] block text-[10px]">Occupied Suites</span>
                <span className="font-bold text-[#18332f] text-sm">{stats.occupiedRooms}</span>
                <span className="text-[10px] text-[#88938c]"> of {stats.totalRooms}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8f6f1] border border-[#e5e0d6]">
                <span className="text-[#88938c] block text-[10px]">Ready to Clean</span>
                <span className="font-bold text-[#b46a36] text-sm">{stats.cleaningRooms}</span>
                <span className="text-[10px] text-[#88938c]"> suites</span>
              </div>
            </div>

            {/* Occupancy bar */}
            <div>
              <div className="flex justify-between text-[10px] text-[#5f6a65] mb-1">
                <span>Occupancy Rate</span>
                <span className="font-mono text-[#18332f] font-semibold">{stats.occupancyRate}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#f0ece3] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#18332f] to-[#2d5550] rounded-full transition-all duration-500"
                  style={{ width: `${stats.occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI & System Telemetry Footer */}
        <div className="p-4 border-t border-[#e5e0d6] bg-[#f8f6f1] space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#18332f]"></div>
              <span className="text-[#18332f] font-semibold">Gemini 3.8 Flash AI</span>
            </div>
            <span className="text-[10px] text-[#b46a36] font-mono font-medium">v2.4 Active</span>
          </div>
          <p className="text-[10px] text-[#88938c] leading-tight">
            Encrypted guest folios • PCI DSS • Real-time KOT sync
          </p>
        </div>
      </aside>
    </>
  );
};
