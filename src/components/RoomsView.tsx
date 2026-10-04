import React, { useState } from 'react';
import { 
  Bed, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Key, 
  X, 
  ChevronRight,
  TrendingUp,
  Percent,
  Layers,
  FileText,
  Star,
  Maximize2,
  Users,
  Heart,
  Filter,
  ShieldAlert,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Room, Reservation, RoomStatus, RoomCategory } from '../types';
import { RoomStatusFilter } from './RoomStatusFilter';

export const RoomsView: React.FC<{ onOpenInvoice?: (invId: string) => void }> = ({ onOpenInvoice }) => {
  const { 
    rooms, 
    reservations, 
    updateRoomStatus, 
    checkInGuest, 
    checkOutGuest, 
    createReservation, 
    cancelReservation,
    pricingSuggestions,
    approvePricingSuggestion,
    rejectPricingSuggestion,
    favorites,
    toggleFavorite,
    isFavorite
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'grid' | 'reservations' | 'pricing' | 'forecast'>('grid');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showNewBookingModal, setShowNewBookingModal] = useState<boolean>(false);
  const [checkInTarget, setCheckInTarget] = useState<Reservation | null>(null);
  const [checkOutTarget, setCheckOutTarget] = useState<Reservation | null>(null);
  const [selectedRoomDetail, setSelectedRoomDetail] = useState<Room | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<'Chapa' | 'Credit Card' | 'Cash'>('Chapa');

  // Booking feedback state
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<string | null>(null);

  // New Booking form state
  const [newBookingData, setNewBookingData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    vipStatus: false,
    vipTier: 'Gold' as 'Silver' | 'Gold' | 'Black Diamond',
    roomId: rooms.find(r => r.status === 'Available')?.id || rooms[0]?.id || '',
    nights: 3,
    adults: 2,
    specialRequests: '',
    channel: 'Direct Website' as const
  });

  // Open booking modal with pre-selected room and validation check
  const handleOpenNewBooking = (targetRoomId?: string) => {
    setBookingError(null);
    const availableRooms = rooms.filter(
      r => r.status === 'Available' && 
           !reservations.some(res => (res.roomId === r.id || res.roomNumber === r.roomNumber) && (res.status === 'Confirmed' || res.status === 'Checked In'))
    );

    let selectedId = '';
    if (targetRoomId && rooms.some(r => r.id === targetRoomId && r.status === 'Available')) {
      selectedId = targetRoomId;
    } else if (availableRooms.length > 0) {
      selectedId = availableRooms[0].id;
    } else {
      selectedId = rooms[0]?.id || '';
    }

    setNewBookingData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      vipStatus: false,
      vipTier: 'Gold',
      roomId: selectedId,
      nights: 3,
      adults: 2,
      specialRequests: '',
      channel: 'Direct Website'
    });
    setShowNewBookingModal(true);
  };

  // Room status counts for fast toggle badges
  const roomStatusCounts = {
    all: rooms.length,
    available: rooms.filter(r => r.status === 'Available').length,
    occupied: rooms.filter(r => r.status === 'Occupied').length,
    cleaning: rooms.filter(r => r.status === 'Cleaning').length,
    maintenance: rooms.filter(r => r.status === 'Maintenance').length,
    reserved: rooms.filter(r => r.status === 'Reserved').length
  };

  // Filtered rooms
  const filteredRooms = rooms.filter(rm => {
    if (onlyFavorites && !isFavorite(rm.id)) return false;
    if (selectedFloor !== 'all' && rm.floor !== selectedFloor) return false;
    if (selectedCategory !== 'all' && rm.category !== selectedCategory) return false;
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'Cleaning Required' || selectedStatus === 'Cleaning') {
        if (rm.status !== 'Cleaning') return false;
      } else if (rm.status !== selectedStatus) {
        return false;
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rm.roomNumber.includes(q) || 
        rm.category.toLowerCase().includes(q) ||
        rm.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered reservations
  const filteredReservations = reservations.filter(res => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        res.guest.name.toLowerCase().includes(q) ||
        res.confirmationCode.toLowerCase().includes(q) ||
        res.roomNumber.includes(q) ||
        res.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!newBookingData.guestName.trim()) {
      setBookingError('Please enter the guest name.');
      return;
    }

    const targetRoom = rooms.find(r => r.id === newBookingData.roomId);
    if (!targetRoom) {
      setBookingError('Please select a valid suite.');
      return;
    }

    // STRICT DOUBLE-BOOKING CHECK:
    // Verify no two guests can hold or reserve the same room!
    const activeConflictingReservation = reservations.find(
      r => (r.roomId === targetRoom.id || r.roomNumber === targetRoom.roomNumber) &&
           (r.status === 'Confirmed' || r.status === 'Checked In')
    );

    if (activeConflictingReservation || targetRoom.status !== 'Available') {
      const activeHolder = activeConflictingReservation 
        ? activeConflictingReservation.guest.name 
        : (targetRoom.status === 'Occupied' ? 'in-house guest' : 'existing reservation');
      setBookingError(
        `Double-Booking Prevented: Suite ${targetRoom.roomNumber} (${targetRoom.category}) is already ${targetRoom.status.toLowerCase()} by ${activeHolder}. Two guests cannot hold the same room simultaneously.`
      );
      return;
    }

    const created = createReservation({
      roomId: newBookingData.roomId,
      nights: Number(newBookingData.nights),
      adults: Number(newBookingData.adults),
      bookingChannel: newBookingData.channel,
      notes: newBookingData.specialRequests,
      guest: {
        name: newBookingData.guestName.trim(),
        email: newBookingData.guestEmail.trim() || 'guest@sovereignhotel.com',
        phone: newBookingData.guestPhone.trim() || '+1 555-SOVR',
        vipStatus: newBookingData.vipStatus,
        vipTier: newBookingData.vipStatus ? newBookingData.vipTier : undefined,
        specialRequests: newBookingData.specialRequests
      }
    });

    if (!created) {
      setBookingError(
        `Double-Booking Prevented: Suite ${targetRoom.roomNumber} cannot be booked because it is already held by another guest.`
      );
      return;
    }

    setShowNewBookingModal(false);
    setBookingError(null);
    setBookingSuccessNotice(
      `✓ Confirmed Reservation ${created.confirmationCode} for ${created.guest.name} in Suite ${targetRoom.roomNumber}. Suite is now locked to this guest.`
    );
    setTimeout(() => setBookingSuccessNotice(null), 6000);

    // Reset form with next available room
    const nextAvailable = rooms.find(r => r.id !== targetRoom.id && r.status === 'Available');
    setNewBookingData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      vipStatus: false,
      vipTier: 'Gold',
      roomId: nextAvailable?.id || rooms[0]?.id || '',
      nights: 3,
      adults: 2,
      specialRequests: '',
      channel: 'Direct Website'
    });
  };

  const handleConfirmCheckIn = () => {
    if (!checkInTarget) return;
    checkInGuest(checkInTarget.id, depositAmount);
    setCheckInTarget(null);
  };

  const handleConfirmCheckOut = () => {
    if (!checkOutTarget) return;
    checkOutGuest(checkOutTarget.id, paymentMethod);
    setCheckOutTarget(null);
  };

  // 14-day forecasting data
  const forecastDays = [
    { day: 'Day 1 (Today)', occ: 85, adr: 375, rev: 42850, notes: 'VIP Gala arrivals' },
    { day: 'Day 2', occ: 89, adr: 385, rev: 44900, notes: 'Corporate retreat' },
    { day: 'Day 3', occ: 93, adr: 410, rev: 49800, notes: 'High weekend leisure' },
    { day: 'Day 4', occ: 96, adr: 450, rev: 54600, notes: 'Diplomatic summit' },
    { day: 'Day 5', occ: 96, adr: 450, rev: 54600, notes: 'Summit peak' },
    { day: 'Day 6', occ: 78, adr: 350, rev: 38500, notes: 'Sunday checkout compression' },
    { day: 'Day 7', occ: 75, adr: 340, rev: 36200, notes: 'Weekday baseline' },
    { day: 'Day 8', occ: 82, adr: 360, rev: 40100, notes: 'Regional medical conference' },
    { day: 'Day 9', occ: 85, adr: 370, rev: 42500, notes: 'Corporate steady' },
    { day: 'Day 10', occ: 88, adr: 380, rev: 44200, notes: 'Pre-weekend ramp' },
    { day: 'Day 11', occ: 95, adr: 440, rev: 52400, notes: 'Autumn luxury festival' },
    { day: 'Day 12', occ: 98, adr: 460, rev: 55200, notes: 'Festival peak' },
    { day: 'Day 13', occ: 80, adr: 355, rev: 39100, notes: 'Post-festival checkouts' },
    { day: 'Day 14', occ: 76, adr: 345, rev: 37200, notes: 'Seasonal shoulder' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b46a36]">
            ACCOMMODATIONS & SUITES
          </span>
          <h1 className="text-3xl font-serif-luxury font-bold text-[#18332f] mt-0.5">
            Suites & Reservation Command
          </h1>
          <p className="text-xs text-[#5f6a65] mt-1">
            28 Luxury Keys · Dynamic Pricing · Folio Billing & Keycard Allocation
          </p>
        </div>

        {/* Tab switcher & New Booking */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white border border-[#e5e0d6] rounded-full shadow-xs">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'grid' 
                  ? 'bg-[#18332f] text-white shadow-xs' 
                  : 'text-[#5f6a65] hover:text-[#18332f]'
              }`}
            >
              Room Matrix
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'reservations' 
                  ? 'bg-[#18332f] text-white shadow-xs' 
                  : 'text-[#5f6a65] hover:text-[#18332f]'
              }`}
            >
              Reservations & Folios
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'pricing' 
                  ? 'bg-[#18332f] text-white shadow-xs' 
                  : 'text-[#5f6a65] hover:text-[#18332f]'
              }`}
            >
              Dynamic Rates
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'forecast' 
                  ? 'bg-[#18332f] text-white shadow-xs' 
                  : 'text-[#5f6a65] hover:text-[#18332f]'
              }`}
            >
              AI 14-Day Forecast
            </button>
          </div>

          <button
            onClick={() => handleOpenNewBooking()}
            className="px-5 py-2.5 rounded-full border border-[#18332f] bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Reservation</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {bookingSuccessNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium">{bookingSuccessNotice}</span>
          </div>
          <button 
            onClick={() => setBookingSuccessNotice(null)} 
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#88938c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by suite number, guest name, confirmation code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-full pl-10 pr-4 py-2 text-xs text-[#18332f] placeholder-[#88938c] focus:outline-none focus:border-[#18332f]"
          />
        </div>

        {activeTab === 'grid' && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Floor filter */}
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              aria-label="Filter suites by floor"
              className="bg-[#f8f6f1] border border-[#e5e0d6] rounded-full px-4 py-2 text-[#18332f] font-medium focus:outline-none focus:border-[#18332f]"
            >
              <option value="all">All Floors (1-4)</option>
              <option value="4">Floor 4: Presidential Penthouses</option>
              <option value="3">Floor 3: Executive Suites</option>
              <option value="2">Floor 2: Oceanfront Kings</option>
              <option value="1">Floor 1: Garden Villas</option>
            </select>

            {/* Status filter dropdown */}
            <select
              value={selectedStatus === 'Cleaning' ? 'Cleaning Required' : selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter suites by status"
              className="bg-[#f8f6f1] border border-[#e5e0d6] rounded-full px-4 py-2 text-[#18332f] font-medium focus:outline-none focus:border-[#18332f]"
            >
              <option value="all">All Statuses ({roomStatusCounts.all})</option>
              <option value="Available">Available ({roomStatusCounts.available})</option>
              <option value="Occupied">Occupied ({roomStatusCounts.occupied})</option>
              <option value="Cleaning Required">Cleaning Required ({roomStatusCounts.cleaning})</option>
              <option value="Maintenance">Maintenance ({roomStatusCounts.maintenance})</option>
              {roomStatusCounts.reserved > 0 && (
                <option value="Reserved">Reserved ({roomStatusCounts.reserved})</option>
              )}
            </select>

            {/* Favorite toggle filter button */}
            <button
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                onlyFavorites
                  ? 'bg-rose-500 text-white border border-rose-500'
                  : 'bg-[#f8f6f1] border border-[#e5e0d6] text-[#5f6a65] hover:text-[#18332f]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white stroke-white' : 'text-rose-500'}`} />
              <span>Favorites ({rooms.filter(r => isFavorite(r.id)).length})</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: ROOM MATRIX & GRID - Styled exactly like the Aurelia screenshot */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          {/* Fast Status Toggle Filter Component */}
          <RoomStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            counts={roomStatusCounts}
          />

          {/* Empty state when no rooms match the filter */}
          {filteredRooms.length === 0 && (
            <div className="p-12 text-center bg-white border border-[#e5e0d6] rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f8f6f1] text-[#b46a36] flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#18332f]">
                No Suites Match This Filter
              </h3>
              <p className="text-xs text-[#5f6a65] max-w-sm mx-auto">
                No suites currently have status &ldquo;{selectedStatus}&rdquo; matching your active floor and search parameters.
              </p>
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedFloor('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyFavorites(false);
                }}
                className="px-5 py-2 rounded-full bg-[#18332f] text-white text-xs font-semibold hover:bg-[#112421] transition-colors cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Room Cards Grid in the exact 2-column or 3-column Aurelia luxury format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRooms.map((rm, idx) => {
              const activeRes = reservations.find(r => (r.roomId === rm.id || r.roomNumber === rm.roomNumber) && r.status === 'Checked In');
              const isFav = isFavorite(rm.id);

              return (
                <div
                  key={rm.id}
                  className="rounded-3xl bg-white border border-[#e5e0d6] overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Image Container */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#f0ece3]">
                    <img
                      src={rm.imageUrl || '/src/assets/images/luxury_hotel_suite_1791012847273.jpg'}
                      alt={`Suite ${rm.roomNumber}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    />

                    {/* Floating Pills on top-left: Status badge + Guest favorite */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5 z-10">
                      {isFav && (
                        <span className="bg-white/95 backdrop-blur-md text-[#18332f] text-xs font-semibold px-3 py-1 rounded-full shadow-xs border border-white/40 flex items-center gap-1.5">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                          <span>Favorite</span>
                        </span>
                      )}

                      {/* Explicit Status Badge Pill */}
                      <span className={`backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow-xs border flex items-center gap-1.5 ${
                        rm.status === 'Available'
                          ? 'bg-emerald-950/85 text-white border-emerald-600/50'
                          : rm.status === 'Occupied'
                          ? 'bg-[#b46a36]/90 text-white border-[#b46a36]/50'
                          : rm.status === 'Cleaning'
                          ? 'bg-sky-950/85 text-white border-sky-600/50'
                          : rm.status === 'Maintenance'
                          ? 'bg-rose-950/85 text-white border-rose-600/50'
                          : 'bg-indigo-950/85 text-white border-indigo-600/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          rm.status === 'Available' ? 'bg-emerald-400' :
                          rm.status === 'Occupied' ? 'bg-amber-300' :
                          rm.status === 'Cleaning' ? 'bg-sky-300' :
                          rm.status === 'Maintenance' ? 'bg-rose-300' : 'bg-indigo-300'
                        }`} />
                        <span>{rm.status === 'Cleaning' ? 'Cleaning Required' : rm.status}</span>
                      </span>
                    </div>

                    {/* Interactive Favorite Icon button on top-right */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(rm.id, `Suite ${rm.roomNumber} (${rm.category})`);
                      }}
                      aria-label={isFav ? "Remove suite from favorites" : "Add suite to favorites"}
                      className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-md cursor-pointer z-10 ${
                        isFav
                          ? 'bg-rose-500 text-white scale-105 hover:bg-rose-600'
                          : 'bg-white/90 text-[#5f6a65] hover:text-rose-500 hover:bg-white hover:scale-105'
                      }`}
                    >
                      <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-white stroke-white scale-110' : 'stroke-current'}`} />
                    </button>

                    {/* Star rating pill on bottom-right like in screenshot */}
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-[#18332f]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{idx % 2 === 0 ? '4.9' : '4.8'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area matching Aurelia typography */}
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Header: Category kicker, title and price */}
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#b46a36] block mb-1">
                            {rm.category.toUpperCase()} · SUITE {rm.roomNumber}
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#18332f]">
                            {rm.category === 'Presidential Suite' ? 'Presidential Sovereign' :
                             rm.category === 'Royal Penthouse' ? 'Penthouse Terrace' :
                             rm.category === 'Executive Suite' ? 'Courtyard Suite' :
                             rm.category === 'Deluxe Ocean King' ? 'Garden King' :
                             rm.category === 'Premier Garden Villa' ? 'Riviera Villa' : 'Classic Deluxe'}
                          </h2>
                        </div>

                        {/* Price aligned to top right */}
                        <div className="text-right shrink-0">
                          <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#18332f]">
                            ${rm.pricePerNight}
                          </div>
                          <span className="text-xs text-[#88938c] font-normal block -mt-0.5">
                            per night
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#5f6a65] mt-2.5 leading-relaxed">
                        {rm.category.includes('Presidential') 
                          ? 'Panoramic ocean terrace, private 24hr butler salon, jacuzzi spa, and helipad access.'
                          : rm.category.includes('Penthouse')
                          ? 'Expansive private balcony, climate-controlled wine cellar, and marble fragrance bar.'
                          : 'A tranquil sanctuary with warm natural textures, fine Italian linens, and courtyard garden vistas.'}
                      </p>
                    </div>

                    {/* Specifications row with subtle icons */}
                    <div className="pt-3 border-t border-[#e5e0d6] flex items-center gap-5 text-xs text-[#5f6a65]">
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-[#88938c]" />
                        <span>{rm.category.includes('Presidential') ? '180 m²' : '52 m²'}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-[#88938c]" />
                        <span>1 king bed</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#88938c]" />
                        <span>Up to {rm.maxGuests} guests</span>
                      </span>
                    </div>

                    {/* Active guest notice if occupied */}
                    {activeRes && (
                      <div className="p-3 rounded-2xl bg-[#f8f6f1] border border-[#e5e0d6] text-xs flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[#18332f] block">{activeRes.guest.name}</span>
                          <span className="text-[11px] text-[#88938c]">Departing: {activeRes.checkOutDate} ({activeRes.nights}n)</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#18332f] text-white text-[10px] font-semibold">
                          In-House
                        </span>
                      </div>
                    )}

                    {/* Bottom Action Row: Amenities pills + Rounded-full "Reserve >" button */}
                    <div className="pt-4 border-t border-[#e5e0d6] flex items-center justify-between gap-4">
                      {/* Left: Soft rounded pills */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#f4efe6] text-[#5f6a65] text-xs font-medium">
                          Breakfast included
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-[#f4efe6] text-[#5f6a65] text-xs font-medium hidden sm:inline-block">
                          Rain shower
                        </span>
                      </div>

                      {/* Right: Dynamic status action button */}
                      <div className="flex items-center gap-2">
                        {rm.status === 'Available' ? (
                          <button
                            onClick={() => handleOpenNewBooking(rm.id)}
                            className="px-5 py-2.5 rounded-full border border-[#18332f] bg-[#18332f] text-white hover:bg-[#112421] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-[1.01]"
                          >
                            <span>Reserve Suite</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : rm.status === 'Reserved' ? (
                          <button
                            onClick={() => {
                              const res = reservations.find(r => (r.roomId === rm.id || r.roomNumber === rm.roomNumber) && r.status === 'Confirmed');
                              if (res) setCheckInTarget(res);
                              else setSelectedRoomDetail(rm);
                            }}
                            className="px-4 py-2.5 rounded-full border border-indigo-700 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Suite is reserved. Click to check in guest."
                          >
                            <Key className="w-3.5 h-3.5 text-indigo-700" />
                            <span>Check-In</span>
                          </button>
                        ) : rm.status === 'Occupied' ? (
                          <button
                            onClick={() => {
                              const res = reservations.find(r => (r.roomId === rm.id || r.roomNumber === rm.roomNumber) && r.status === 'Checked In');
                              if (res) setCheckOutTarget(res);
                              else setSelectedRoomDetail(rm);
                            }}
                            className="px-4 py-2.5 rounded-full border border-[#b46a36] bg-[#fbf9f5] text-[#b46a36] hover:bg-[#f4efe6] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            title="Guest in-house. Click to view folio or settle."
                          >
                            <FileText className="w-3.5 h-3.5 text-[#b46a36]" />
                            <span>Folio & Settle</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedRoomDetail(rm)}
                            className="px-4 py-2.5 rounded-full border border-[#e5e0d6] text-[#5f6a65] hover:bg-[#f6f4ee] hover:text-[#18332f] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: RESERVATIONS & FOLIOS */}
      {activeTab === 'reservations' && (
        <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3]">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-[#18332f]">
                Active Bookings & Guest Folio Settlement
              </h2>
              <p className="text-xs text-[#5f6a65]">Manage arrivals, departures and incidentals</p>
            </div>
            <span className="text-xs font-mono text-[#88938c]">
              {filteredReservations.length} records found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Guest Details</th>
                  <th className="py-3 px-4">Suite / Category</th>
                  <th className="py-3 px-4">Dates & Nights</th>
                  <th className="py-3 px-4">Folio Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece3] text-[#18332f]">
                {filteredReservations.map((res) => {
                  const folioSum = res.roomCharges.reduce((acc, c) => acc + c.amount, 0) || res.totalRoomCost;

                  return (
                    <tr key={res.id} className="hover:bg-[#fbf9f5] transition-colors">
                      <td className="py-4 px-4 font-mono font-medium text-[#b46a36]">
                        {res.confirmationCode}
                        <div className="text-[10px] text-[#88938c] font-sans">{res.bookingChannel}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold flex items-center gap-1.5 text-[#18332f]">
                          {res.guest.name}
                          {res.guest.vipStatus && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#b46a36]/10 text-[#b46a36] font-bold border border-[#b46a36]/30">
                              {res.guest.vipTier || 'VIP'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#88938c]">{res.guest.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#18332f] flex items-center gap-1.5">
                          <span>Suite {res.roomNumber}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-0.5" title="Single occupancy verified. Suite is exclusively locked to this guest.">
                            <Lock className="w-2.5 h-2.5 text-emerald-700" />
                            <span>Exclusive Lock</span>
                          </span>
                        </div>
                        <div className="text-[10px] text-[#88938c]">{res.roomCategory}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div>{res.checkInDate} → {res.checkOutDate}</div>
                        <div className="text-[10px] text-[#88938c]">{res.nights} Nights ({res.adults} Adults)</div>
                      </td>
                      <td className="py-4 px-4 font-mono">
                        <div className="font-semibold text-[#18332f]">${folioSum.toLocaleString()}</div>
                        <div className={`text-[10px] ${res.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-[#b46a36]'}`}>
                          {res.paymentStatus}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                          res.status === 'Checked In' ? 'text-[#18332f] border-[#18332f]/20 bg-[#18332f]/10' :
                          res.status === 'Confirmed' ? 'text-[#b46a36] border-[#b46a36]/30 bg-[#b46a36]/10' :
                          res.status === 'Checked Out' ? 'text-slate-700 border-slate-300 bg-slate-100' :
                          'text-rose-700 border-rose-300 bg-rose-50'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {res.status === 'Confirmed' && (
                            <button
                              onClick={() => setCheckInTarget(res)}
                              className="px-3 py-1.5 bg-[#18332f] hover:bg-[#112421] text-white rounded-full text-xs font-semibold cursor-pointer shadow-xs"
                            >
                              Check-In
                            </button>
                          )}
                          {res.status === 'Checked In' && (
                            <button
                              onClick={() => setCheckOutTarget(res)}
                              className="px-3 py-1.5 bg-[#b46a36] hover:bg-[#965427] text-white rounded-full text-xs font-semibold cursor-pointer shadow-xs"
                            >
                              Settle & Check Out
                            </button>
                          )}
                          {res.status === 'Confirmed' && (
                            <button
                              onClick={() => cancelReservation(res.id)}
                              className="px-2 py-1 text-rose-600 hover:text-rose-700 text-xs cursor-pointer font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: DYNAMIC PRICING */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#f0ece3]">
              <div className="p-2.5 rounded-full bg-[#b46a36]/10 text-[#b46a36]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif-luxury font-bold text-[#18332f]">
                  AI Dynamic Pricing Recommendations
                </h2>
                <p className="text-xs text-[#5f6a65]">
                  Powered by Gemini 3.8 Flash revenue engine · Comp-set rate indexing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingSuggestions.map((sug) => (
                <div key={sug.id} className="p-5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#18332f]">{sug.roomCategory}</span>
                      <span className="text-[10px] font-mono text-[#18332f] font-semibold bg-[#18332f]/10 px-2 py-0.5 rounded-full border border-[#18332f]/20">
                        {sug.confidence}% Confidence
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3 my-2">
                      <span className="text-xs text-[#88938c] line-through">${sug.currentRate}</span>
                      <span className="text-2xl font-bold font-serif-luxury text-[#18332f]">${sug.suggestedRate}</span>
                      <span className="text-xs font-semibold text-[#b46a36]">+{sug.adjustmentPercent}%</span>
                    </div>

                    <p className="text-xs text-[#5f6a65] leading-relaxed">
                      {sug.reason}
                    </p>

                    <div className="text-[11px] text-[#88938c] mt-2">
                      Projected Gain: <span className="font-mono text-[#18332f] font-bold">+${sug.projectedRevenueIncrease.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e5e0d6] flex items-center justify-end gap-2">
                    {sug.status === 'Pending Approval' ? (
                      <>
                        <button
                          onClick={() => rejectPricingSuggestion(sug.id)}
                          className="px-3.5 py-1.5 rounded-full border border-[#e5e0d6] text-[#5f6a65] hover:bg-[#f6f4ee] text-xs cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => approvePricingSuggestion(sug.id)}
                          className="px-4 py-1.5 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          Approve & Apply
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-[#18332f] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Rate Applied
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: AI 14-DAY FORECAST */}
      {activeTab === 'forecast' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ece3]">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-[#18332f]">
                14-Day Forward Occupancy & ADR Forecast
              </h2>
              <p className="text-xs text-[#5f6a65]">
                AI predictive modeling taking into account historical demand curves and regional events
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-[#88938c]">Projected 14-Day Revenue:</span>
              <span className="font-mono text-[#18332f] font-bold ml-2 text-base">$644,150</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4">Predicted Occupancy</th>
                  <th className="py-3 px-4">ADR Expectation</th>
                  <th className="py-3 px-4">Projected Revenue</th>
                  <th className="py-3 px-4">Demand Driver / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece3] text-[#18332f]">
                {forecastDays.map((fc) => (
                  <tr key={fc.day} className="hover:bg-[#fbf9f5] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#18332f]">{fc.day}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#18332f] w-10">{fc.occ}%</span>
                        <div className="w-24 h-1.5 bg-[#f0ece3] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#18332f] to-[#2d5550] rounded-full" 
                            style={{ width: `${fc.occ}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#5f6a65]">${fc.adr}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#18332f]">${fc.rev.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-[#5f6a65]">{fc.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE NEW BOOKING */}
      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e0d6] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3] mb-4">
              <h3 className="text-xl font-serif-luxury font-bold text-[#18332f]">Create New Reservation</h3>
              <button onClick={() => setShowNewBookingModal(false)} className="text-[#88938c] hover:text-[#18332f] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const availableSuites = rooms.filter(
                r => r.status === 'Available' && 
                     !reservations.some(res => (res.roomId === r.id || res.roomNumber === r.roomNumber) && (res.status === 'Confirmed' || res.status === 'Checked In'))
              );

              const unavailableSuites = rooms.filter(
                r => r.status !== 'Available' || 
                     reservations.some(res => (res.roomId === r.id || res.roomNumber === r.roomNumber) && (res.status === 'Confirmed' || res.status === 'Checked In'))
              );

              const selectedRoomObj = rooms.find(r => r.id === newBookingData.roomId);
              const activeHoldingConflict = reservations.find(
                r => (r.roomId === newBookingData.roomId || r.roomNumber === selectedRoomObj?.roomNumber) &&
                     (r.status === 'Confirmed' || r.status === 'Checked In')
              );

              const isDoubleBookingBlocked = Boolean(
                selectedRoomObj && (selectedRoomObj.status !== 'Available' || activeHoldingConflict)
              );

              return (
                <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
                  {/* Single Occupancy Policy Banner */}
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span><strong>Single Occupancy Policy:</strong> Each suite is exclusively reserved for one guest. Double-booking is strictly prohibited.</span>
                    </div>
                  </div>

                  {/* Booking Error Banner */}
                  {bookingError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-2.5 text-xs text-rose-950 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{bookingError}</span>
                    </div>
                  )}

                  {/* Overbooking Prevention Alert if selected suite is unavailable */}
                  {isDoubleBookingBlocked && (
                    <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-2.5 text-xs text-rose-950 animate-in fade-in">
                      <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                          <span>Double-Booking Blocked</span>
                          <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full uppercase font-mono">Policy Enforced</span>
                        </span>
                        <p className="leading-relaxed text-[11px] text-rose-900">
                          Suite {selectedRoomObj?.roomNumber} ({selectedRoomObj?.category}) cannot be reserved because it is currently{' '}
                          <strong>{selectedRoomObj?.status}</strong>
                          {activeHoldingConflict ? ` by guest "${activeHoldingConflict.guest.name}" (Ref: ${activeHoldingConflict.confirmationCode})` : ''}.
                          Two guests cannot reserve the same room. Please select an available suite from the dropdown below.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Full Occupancy Warning */}
                  {availableSuites.length === 0 && (
                    <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-2.5 text-xs text-amber-950">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                      <span><strong>Hotel Sold Out:</strong> 100% of suites are currently occupied or reserved. New bookings are blocked to prevent overbooking.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#5f6a65] font-medium block mb-1">Guest Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lord Charles Kensington"
                        value={newBookingData.guestName}
                        onChange={(e) => {
                          setBookingError(null);
                          setNewBookingData({ ...newBookingData, guestName: e.target.value });
                        }}
                        className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none focus:border-[#18332f]"
                      />
                    </div>
                    <div>
                      <label className="text-[#5f6a65] font-medium block mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="charles@kensington.com"
                        value={newBookingData.guestEmail}
                        onChange={(e) => setNewBookingData({ ...newBookingData, guestEmail: e.target.value })}
                        className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none focus:border-[#18332f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#5f6a65] font-medium block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+44 20 7946 0192"
                        value={newBookingData.guestPhone}
                        onChange={(e) => setNewBookingData({ ...newBookingData, guestPhone: e.target.value })}
                        className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none focus:border-[#18332f]"
                      />
                    </div>
                    <div>
                      <label className="text-[#5f6a65] font-medium block mb-1">Booking Channel</label>
                      <select
                        value={newBookingData.channel}
                        onChange={(e) => setNewBookingData({ ...newBookingData, channel: e.target.value as any })}
                        className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none"
                      >
                        <option value="Direct Website">Direct Website</option>
                        <option value="Booking.com">Booking.com</option>
                        <option value="Expedia">Expedia</option>
                        <option value="Corporate">Corporate Partner</option>
                        <option value="Concierge">VIP Concierge</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[#5f6a65] font-medium block">Assign Suite *</label>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          {availableSuites.length} Available Suite{availableSuites.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <select
                        value={newBookingData.roomId}
                        onChange={(e) => {
                          setBookingError(null);
                          setNewBookingData({ ...newBookingData, roomId: e.target.value });
                        }}
                        className={`w-full border rounded-xl px-3.5 py-2.5 text-xs text-[#18332f] focus:outline-none transition-colors ${
                          isDoubleBookingBlocked ? 'bg-rose-50 border-rose-400 font-medium' : 'bg-[#f8f6f1] border-[#e5e0d6]'
                        }`}
                      >
                        {availableSuites.length > 0 ? (
                          <optgroup label="Available Suites (Eligible for Single-Guest Booking)">
                            {availableSuites.map(r => (
                              <option key={r.id} value={r.id}>
                                ✓ Suite {r.roomNumber} — {r.category} (${r.pricePerNight}/night) [AVAILABLE]
                              </option>
                            ))}
                          </optgroup>
                        ) : (
                          <option value="" disabled>No suites available (100% capacity)</option>
                        )}

                        {unavailableSuites.length > 0 && (
                          <optgroup label="Unavailable Suites (Cannot Reserve - Double Booking Prevention)">
                            {unavailableSuites.map(r => {
                              const holder = reservations.find(
                                res => (res.roomId === r.id || res.roomNumber === r.roomNumber) &&
                                       (res.status === 'Confirmed' || res.status === 'Checked In')
                              );
                              const reason = holder ? `Held by ${holder.guest.name} (${holder.status})` : r.status;
                              return (
                                <option key={r.id} value={r.id} disabled className="text-gray-400 bg-gray-100">
                                  ✗ Suite {r.roomNumber} — {r.category} [{reason} - LOCKED]
                                </option>
                              );
                            })}
                          </optgroup>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-[#5f6a65] font-medium block mb-1">Nights</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={newBookingData.nights}
                        onChange={(e) => setNewBookingData({ ...newBookingData, nights: Number(e.target.value) })}
                        className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* VIP Toggle */}
                  <div className="p-4 bg-[#f8f6f1] rounded-2xl border border-[#e5e0d6] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-[#18332f] block">VIP Ambassador Protocol</span>
                      <span className="text-[11px] text-[#5f6a65]">Enables champagne welcome & butler allocation</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={newBookingData.vipStatus}
                      onChange={(e) => setNewBookingData({ ...newBookingData, vipStatus: e.target.checked })}
                      className="w-4 h-4 accent-[#18332f] rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[#5f6a65] font-medium block mb-1">Special Preferences / Requests</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Feather-free bedding, quiet high floor, vintage champagne on arrival"
                      value={newBookingData.specialRequests}
                      onChange={(e) => setNewBookingData({ ...newBookingData, specialRequests: e.target.value })}
                      className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0ece3]">
                    <button
                      type="button"
                      onClick={() => setShowNewBookingModal(false)}
                      className="px-5 py-2 rounded-full border border-[#e5e0d6] text-[#5f6a65] hover:bg-[#f6f4ee] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isDoubleBookingBlocked || availableSuites.length === 0}
                      className={`px-6 py-2.5 rounded-full font-semibold text-xs flex items-center gap-2 transition-all shadow-sm ${
                        isDoubleBookingBlocked || availableSuites.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                          : 'bg-[#18332f] hover:bg-[#112421] text-white cursor-pointer hover:scale-[1.01]'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isDoubleBookingBlocked ? 'Double-Booking Blocked' : 'Confirm & Lock Reservation'}</span>
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 2: CHECK-IN */}
      {checkInTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e0d6] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3]">
              <h3 className="text-xl font-serif-luxury font-bold text-[#18332f]">
                Automated Guest Check-In
              </h3>
              <button onClick={() => setCheckInTarget(null)} className="text-[#88938c] hover:text-[#18332f] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#f8f6f1] rounded-2xl border border-[#e5e0d6] text-xs space-y-1.5">
              <div className="text-[#5f6a65]">Guest: <span className="text-[#18332f] font-semibold">{checkInTarget.guest.name}</span></div>
              <div className="text-[#5f6a65]">Suite Allocated: <span className="text-[#b46a36] font-semibold">Suite {checkInTarget.roomNumber} ({checkInTarget.roomCategory})</span></div>
              <div className="text-[#5f6a65]">Duration: <span className="text-[#18332f]">{checkInTarget.nights} Nights</span></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#5f6a65] font-medium block mb-1">Pre-Authorize Incidental Deposit ($)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2 text-[#18332f] font-mono"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f4efe6] border border-[#e5e0d6] text-[#18332f] flex items-center gap-2.5">
                <Key className="w-4 h-4 shrink-0 text-[#b46a36]" />
                <span className="text-[11px] font-medium">RFID Digital Keycard #GLD-KEY-{checkInTarget.roomNumber} ready for encoding</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0ece3]">
              <button
                onClick={() => setCheckInTarget(null)}
                className="px-5 py-2 rounded-full border border-[#e5e0d6] text-[#5f6a65] hover:bg-[#f6f4ee] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckIn}
                className="px-6 py-2 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Authorize & Check-In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHECK-OUT */}
      {checkOutTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e0d6] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3]">
              <h3 className="text-xl font-serif-luxury font-bold text-[#18332f]">
                Check-Out & Folio Settlement
              </h3>
              <button onClick={() => setCheckOutTarget(null)} className="text-[#88938c] hover:text-[#18332f] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#f8f6f1] rounded-2xl border border-[#e5e0d6] text-xs space-y-1">
              <div className="font-semibold text-[#18332f] text-sm">{checkOutTarget.guest.name} · Suite {checkOutTarget.roomNumber}</div>
              <div className="text-[#5f6a65]">Total Charges Accumulated:</div>
            </div>

            {/* Folio Items List */}
            <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
              {checkOutTarget.roomCharges.length > 0 ? (
                checkOutTarget.roomCharges.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-[#f8f6f1] border border-[#e5e0d6] flex items-center justify-between text-[#18332f]">
                    <div>
                      <span className="font-medium">{item.description}</span>
                      <span className="text-[10px] text-[#88938c] block">{item.category} · {item.date}</span>
                    </div>
                    <span className="font-mono text-[#18332f] font-bold">${item.amount.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-xl bg-[#f8f6f1] border border-[#e5e0d6] flex items-center justify-between text-[#18332f]">
                  <span>Room Accommodation ({checkOutTarget.nights} Nights)</span>
                  <span className="font-mono text-[#18332f] font-bold">${checkOutTarget.totalRoomCost.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total calculation */}
            {(() => {
              const subtotal = checkOutTarget.roomCharges.reduce((acc, c) => acc + c.amount, 0) || checkOutTarget.totalRoomCost;
              const tax = subtotal * 0.15;
              const service = subtotal * 0.10;
              const grand = subtotal + tax + service;

              return (
                <div className="pt-3 border-t border-[#f0ece3] space-y-1 text-xs">
                  <div className="flex justify-between text-[#5f6a65]">
                    <span>Subtotal:</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#5f6a65]">
                    <span>VAT (15%):</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#5f6a65]">
                    <span>Luxury Hospitality Service Charge (10%):</span>
                    <span className="font-mono">${service.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#18332f] font-bold text-base pt-2 border-t border-[#f0ece3]">
                    <span>Final Amount Due:</span>
                    <span className="font-mono text-[#18332f] text-lg font-serif-luxury">${grand.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}

            {/* Payment method selector */}
            <div className="space-y-1.5 text-xs">
              <label className="text-[#5f6a65] font-medium block">Select Settlement Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Chapa', 'Credit Card', 'Cash'] as const).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 rounded-full border text-center transition-colors cursor-pointer text-xs font-semibold ${
                      paymentMethod === method
                        ? 'bg-[#18332f] border-[#18332f] text-white shadow-xs'
                        : 'bg-[#f8f6f1] border-[#e5e0d6] text-[#5f6a65] hover:text-[#18332f]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0ece3]">
              <button
                onClick={() => setCheckOutTarget(null)}
                className="px-5 py-2 rounded-full border border-[#e5e0d6] text-[#5f6a65] hover:bg-[#f6f4ee] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckOut}
                className="px-6 py-2 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Settle & Print Final Folio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ROOM DETAIL INSPECTOR */}
      {selectedRoomDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e0d6] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b46a36]">SUITE SPECIFICATIONS</span>
                <h3 className="text-2xl font-serif-luxury font-bold text-[#18332f]">
                  Suite {selectedRoomDetail.roomNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedRoomDetail(null)} className="text-[#88938c] hover:text-[#18332f] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suite Photography Hero */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#f0ece3]">
              <img
                src={selectedRoomDetail.imageUrl || '/src/assets/images/luxury_hotel_suite_1791012847273.jpg'}
                alt={`Suite ${selectedRoomDetail.roomNumber}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <div className="font-serif-luxury text-base font-bold">{selectedRoomDetail.category}</div>
                <div className="text-xs text-slate-200">Floor {selectedRoomDetail.floor} · Max {selectedRoomDetail.maxGuests} guests</div>
              </div>
              <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#18332f] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                ${selectedRoomDetail.pricePerNight} / night
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#f8f6f1] rounded-2xl border border-[#e5e0d6] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#5f6a65]">Operational Status:</span>
                  <span className="font-bold text-[#18332f]">{selectedRoomDetail.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6a65]">Standard Nightly Rate:</span>
                  <span className="font-mono text-[#18332f] font-bold">${selectedRoomDetail.pricePerNight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6a65]">Last Housekeeping Inspection:</span>
                  <span className="text-[#18332f] font-medium">{selectedRoomDetail.lastCleaned || 'Today 11:30'}</span>
                </div>
              </div>

              <div>
                <span className="text-[#5f6a65] font-medium block mb-1.5">Suite Amenities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoomDetail.amenities.map(a => (
                    <span key={a} className="px-3 py-1 rounded-full bg-[#f4efe6] text-[#5f6a65] text-[11px] font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Update Quick Toggles */}
              <div className="pt-2 border-t border-[#f0ece3] space-y-2">
                <span className="text-[#5f6a65] font-medium block">Update Operational Status:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      updateRoomStatus(selectedRoomDetail.id, 'Available');
                      setSelectedRoomDetail(null);
                    }}
                    className="py-2 px-2 rounded-full border border-[#18332f] text-[#18332f] hover:bg-[#18332f] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer text-center"
                  >
                    Available
                  </button>
                  <button
                    onClick={() => {
                      updateRoomStatus(selectedRoomDetail.id, 'Cleaning', 'VIP Rush');
                      setSelectedRoomDetail(null);
                    }}
                    className="py-2 px-2 rounded-full border border-[#b46a36] text-[#b46a36] hover:bg-[#b46a36] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer text-center"
                  >
                    VIP Clean
                  </button>
                  <button
                    onClick={() => {
                      updateRoomStatus(selectedRoomDetail.id, 'Maintenance');
                      setSelectedRoomDetail(null);
                    }}
                    className="py-2 px-2 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold transition-colors cursor-pointer text-center"
                  >
                    Maintenance
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#f0ece3]">
              <button
                onClick={() => setSelectedRoomDetail(null)}
                className="px-5 py-2 rounded-full bg-[#f8f6f1] hover:bg-[#f0ece3] text-[#18332f] text-xs font-semibold cursor-pointer border border-[#e5e0d6]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
