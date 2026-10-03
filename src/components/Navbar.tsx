import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  ChevronDown,
  TrendingUp,
  X,
  Compass,
  Menu,
  Heart,
  Bed,
  UtensilsCrossed
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { UserRole } from '../types';
import { ActiveTab } from './Sidebar';

export const Navbar: React.FC<{ 
  onOpenAIChat?: () => void;
  onNavigate?: (tab: ActiveTab) => void;
}> = ({ onOpenAIChat, onNavigate }) => {
  const { 
    activeRole, 
    setActiveRole, 
    stats, 
    insights, 
    resetToDemo,
    favorites,
    toggleFavorite,
    rooms,
    menuItems 
  } = useHotel();
  const [time, setTime] = useState<string>('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles: { role: UserRole; icon: string; desc: string }[] = [
    { role: 'General Manager', icon: '👑', desc: 'Full Executive Oversight & Dynamic Pricing' },
    { role: 'Front Desk Receptionist', icon: '🛎️', desc: 'Check-In, Check-Out & Guest Folios' },
    { role: 'F&B & POS Manager', icon: '🍽️', desc: 'Restaurant Orders, KOT & Kitchen Stock' },
    { role: 'Housekeeping Lead', icon: '🧹', desc: 'Room Statuses, Cleaning & VIP Turndown' },
    { role: 'Financial Controller', icon: '💼', desc: 'Invoices, Payments & Audit Trail' },
  ];

  return (
    <header className="h-20 border-b border-[#e5e0d6] bg-[#f8f6f1]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between">
      {/* Brand Identity matching the user's Aurelia luxury emblem style */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3.5">
          {/* Encircled serif monogram */}
          <div className="w-10 h-10 rounded-full border border-[#18332f] flex items-center justify-center bg-white shadow-xs">
            <span className="font-serif-luxury text-base font-bold text-[#18332f]">A</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury text-lg tracking-[0.2em] font-semibold text-[#18332f]">
                AURELIA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#b46a36] font-bold border border-[#b46a36]/30 px-1.5 py-0.5 rounded-full bg-[#b46a36]/5">
                GOLDEN ERP
              </span>
            </div>
            <p className="text-[11px] text-[#5f6a65] hidden sm:block tracking-wide">
              The Grand Sovereign Resort & Villas
            </p>
          </div>
        </div>
      </div>

      {/* Center Operational Pulse */}
      <div className="hidden xl:flex items-center gap-5 text-xs text-[#5f6a65]">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e5e0d6] shadow-xs">
          <Clock className="w-3.5 h-3.5 text-[#b46a36]" />
          <span className="font-mono text-[#18332f] font-medium">{time}</span>
          <span className="text-[#c7bfb1]">·</span>
          <span>Property Time</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e5e0d6] shadow-xs">
          <TrendingUp className="w-3.5 h-3.5 text-[#18332f]" />
          <span>Occupancy:</span>
          <span className="font-semibold text-[#18332f]">{stats.occupancyRate}%</span>
          <span className="text-[#88938c]">({stats.occupiedRooms}/{stats.totalRooms})</span>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e5e0d6] shadow-xs">
          <span>RevPAR:</span>
          <span className="font-semibold text-[#b46a36]">${stats.revPar}</span>
          <span className="text-[#c7bfb1]">·</span>
          <span>ADR:</span>
          <span className="font-semibold text-[#18332f]">${stats.adr}</span>
        </div>
      </div>

      {/* Right Actions: Role Selector, AI Trigger, Notifications */}
      <div className="flex items-center gap-3">
        {/* Quick AI Trigger */}
        {onOpenAIChat && (
          <button 
            onClick={onOpenAIChat}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#b46a36] text-[#b46a36] hover:bg-[#b46a36] hover:text-white transition-all text-xs font-medium cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Ask Golden AI</span>
          </button>
        )}

        {/* Operational Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowFavorites(false);
            }}
            className="w-10 h-10 rounded-full bg-white border border-[#e5e0d6] text-[#18332f] hover:border-[#18332f] transition-colors relative cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Operational Notifications"
          >
            <Bell className="w-4 h-4" />
            {insights.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b46a36] text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {insights.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-84 bg-white border border-[#e5e0d6] rounded-2xl shadow-xl z-50 p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ece3]">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#b46a36]" />
                  <span className="text-xs font-semibold text-[#18332f]">Daily Operational Briefing</span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-[#5f6a65] hover:text-[#18332f] text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-[#f0ece3] max-h-72 overflow-y-auto mt-2">
                {insights.map(ins => (
                  <div key={ins.id} className="py-2.5 px-1 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${
                        ins.severity === 'Urgent' ? 'text-rose-700' :
                        ins.severity === 'Warning' ? 'text-[#b46a36]' :
                        ins.severity === 'Success' ? 'text-[#18332f]' : 'text-slate-700'
                      }`}>
                        {ins.title}
                      </span>
                      <span className="text-[10px] text-[#88938c]">{ins.timestamp}</span>
                    </div>
                    <p className="text-[#5f6a65] line-clamp-2 leading-relaxed">{ins.description}</p>
                    {ins.suggestedAction && (
                      <p className="text-[11px] text-[#b46a36] mt-1 font-medium">Action: {ins.suggestedAction}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Favorite Icon & Saved Items Manager */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowFavorites(!showFavorites);
              setShowNotifications(false);
            }}
            className={`w-10 h-10 rounded-full border transition-all relative cursor-pointer flex items-center justify-center shadow-xs ${
              showFavorites || favorites.length > 0
                ? 'bg-white border-[#e5e0d6] text-rose-500 hover:border-rose-400'
                : 'bg-white border-[#e5e0d6] text-[#5f6a65] hover:border-[#18332f]'
            }`}
            aria-label="Favorites & Bookmarks"
          >
            <Heart className={`w-4 h-4 transition-transform ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Favorites Dropdown */}
          {showFavorites && (
            <div className="absolute right-0 mt-2 w-84 bg-white border border-[#e5e0d6] rounded-2xl shadow-xl z-50 p-4 overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ece3]">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span className="text-xs font-semibold text-[#18332f]">
                    Saved Favorites ({favorites.length})
                  </span>
                </div>
                <button 
                  onClick={() => setShowFavorites(false)}
                  className="text-[#5f6a65] hover:text-[#18332f] text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#f0ece3] max-h-80 overflow-y-auto mt-2">
                {favorites.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#88938c]">
                    <Heart className="w-6 h-6 mx-auto mb-1.5 text-[#c7bfb1]" />
                    <p>No favorite suites or items yet.</p>
                    <p className="text-[11px] text-[#b46a36] mt-0.5">Click any heart icon on rooms or dishes to pin!</p>
                  </div>
                ) : (
                  <>
                    {/* Favorited Rooms */}
                    {rooms.filter(r => favorites.includes(r.id)).map(r => (
                      <div key={r.id} className="py-2.5 px-1 flex items-center justify-between text-xs group">
                        <div 
                          className="flex items-center gap-2.5 cursor-pointer flex-1"
                          onClick={() => {
                            if (onNavigate) onNavigate('rooms');
                            setShowFavorites(false);
                          }}
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#f0ece3] shrink-0">
                            <img src={r.imageUrl} alt={r.roomNumber} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-semibold text-[#18332f] block leading-tight group-hover:text-[#b46a36] transition-colors">
                              Suite {r.roomNumber} · {r.category}
                            </span>
                            <span className="text-[10px] text-[#5f6a65]">
                              Floor {r.floor} · ${r.pricePerNight}/night
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(r.id, `Suite ${r.roomNumber}`)}
                          className="p-1 text-[#88938c] hover:text-rose-500 cursor-pointer transition-colors"
                          title="Remove from favorites"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Favorited Menu Items */}
                    {menuItems.filter(m => favorites.includes(m.id)).map(m => (
                      <div key={m.id} className="py-2.5 px-1 flex items-center justify-between text-xs group">
                        <div 
                          className="flex items-center gap-2.5 cursor-pointer flex-1"
                          onClick={() => {
                            if (onNavigate) onNavigate('pos');
                            setShowFavorites(false);
                          }}
                        >
                          {m.imageUrl ? (
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#f0ece3] shrink-0">
                              <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#b46a36] flex items-center justify-center shrink-0">
                              <UtensilsCrossed className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-[#18332f] block leading-tight group-hover:text-[#b46a36] transition-colors truncate max-w-[170px]">
                              {m.name}
                            </span>
                            <span className="text-[10px] text-[#5f6a65]">
                              {m.category} · ${m.price}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(m.id, m.name)}
                          className="p-1 text-[#88938c] hover:text-rose-500 cursor-pointer transition-colors"
                          title="Remove from favorites"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Favorited Showcase Items */}
                    {favorites.includes('showcase-1') && (
                      <div className="py-2.5 px-1 flex items-center justify-between text-xs group">
                        <div 
                          className="flex items-center gap-2.5 cursor-pointer flex-1"
                          onClick={() => {
                            if (onNavigate) onNavigate('rooms');
                            setShowFavorites(false);
                          }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#18332f] text-white flex items-center justify-center shrink-0">
                            <Bed className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-[#18332f] block leading-tight group-hover:text-[#b46a36]">
                              Presidential Ocean Suites
                            </span>
                            <span className="text-[10px] text-[#5f6a65]">Showcase Accommodations</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite('showcase-1', 'Presidential Ocean Suites')}
                          className="p-1 text-[#88938c] hover:text-rose-500 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {favorites.length > 0 && onNavigate && (
                <div className="pt-2.5 mt-2 border-t border-[#f0ece3] flex items-center justify-between">
                  <button
                    onClick={() => {
                      onNavigate('rooms');
                      setShowFavorites(false);
                    }}
                    className="text-[11px] font-semibold text-[#18332f] hover:text-[#b46a36] cursor-pointer flex items-center gap-1"
                  >
                    <span>View Suites</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('pos');
                      setShowFavorites(false);
                    }}
                    className="text-[11px] font-semibold text-[#b46a36] hover:text-[#18332f] cursor-pointer flex items-center gap-1"
                  >
                    <span>View Restaurant POS</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Multi-Role Switcher */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#e5e0d6] hover:border-[#18332f] transition-colors text-xs text-[#18332f] cursor-pointer shadow-xs"
          >
            <div className="w-2 h-2 rounded-full bg-[#18332f]" />
            <div className="text-left">
              <span className="text-[9px] block text-[#88938c] uppercase tracking-wider font-semibold">Active Role</span>
              <span className="font-semibold text-[#18332f] flex items-center gap-1.5">
                {activeRole}
                <ChevronDown className="w-3 h-3 text-[#5f6a65]" />
              </span>
            </div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#e5e0d6] rounded-2xl shadow-xl z-50 p-2">
              <div className="px-3 py-2 text-[11px] text-[#88938c] border-b border-[#f0ece3] font-medium">
                Switch Operational Perspective:
              </div>
              <div className="py-1">
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setActiveRole(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-start gap-3 transition-colors cursor-pointer ${
                      activeRole === r.role 
                        ? 'bg-[#f4efe6] text-[#18332f] font-semibold border border-[#e5e0d6]' 
                        : 'text-[#5f6a65] hover:bg-[#f9f8f5] hover:text-[#18332f]'
                    }`}
                  >
                    <span className="text-base">{r.icon}</span>
                    <div>
                      <div className="font-semibold text-[#18332f]">{r.role}</div>
                      <div className="text-[11px] text-[#88938c] mt-0.5">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo State Reset */}
        <button
          onClick={() => setShowResetConfirm(true)}
          title="Reset to pristine luxury demo benchmark"
          className="w-10 h-10 rounded-full bg-white border border-[#e5e0d6] text-[#5f6a65] hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer text-xs flex items-center justify-center shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e0d6] rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-serif-luxury font-bold text-[#18332f] mb-2">Reset Demo Benchmark?</h3>
            <p className="text-sm text-[#5f6a65] mb-6 leading-relaxed">
              This will restore all 28 luxury rooms, reservations, kitchen KOT tickets, and financial ledgers to their initial state.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-full border border-[#e5e0d6] text-[#5f6a65] hover:bg-[#f6f4ee] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  resetToDemo();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
