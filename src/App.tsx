import React, { useState } from 'react';
import { HotelProvider } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { RoomsView } from './components/RoomsView';
import { RestaurantPosView } from './components/RestaurantPosView';
import { AIAssistantView } from './components/AIAssistantView';
import { StaffHRView } from './components/StaffHRView';
import { FinanceView } from './components/FinanceView';
import { Menu } from 'lucide-react';

const HotelApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#18332f] flex flex-col font-sans selection:bg-[#b46a36]/20 selection:text-[#b46a36]">
      {/* Top Luxury Navbar */}
      <Navbar 
        onOpenAIChat={() => setCurrentTab('ai')} 
        onNavigate={setCurrentTab}
      />

      {/* Mobile Menu Trigger Bar */}
      <div className="lg:hidden bg-[#fbfaf7] border-b border-[#e5e0d6] px-4 py-2.5 flex items-center justify-between text-xs shadow-xs">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 text-[#18332f] hover:text-[#b46a36] p-1.5 px-3 rounded-full bg-white border border-[#e5e0d6] cursor-pointer shadow-xs"
        >
          <Menu className="w-4 h-4 text-[#b46a36]" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">Navigation</span>
        </button>

        <span className="font-serif-luxury text-[#18332f] font-bold text-xs tracking-wider">
          THE GRAND GOLDEN SOVEREIGN
        </span>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f6f4ee]">
          <div className="max-w-7xl mx-auto pb-12">
            {currentTab === 'dashboard' && <DashboardView onNavigate={setCurrentTab} />}
            {currentTab === 'rooms' && <RoomsView />}
            {currentTab === 'pos' && <RestaurantPosView />}
            {currentTab === 'ai' && <AIAssistantView />}
            {currentTab === 'hr' && <StaffHRView />}
            {currentTab === 'finance' && <FinanceView />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <HotelApp />
    </HotelProvider>
  );
}
