import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Room, 
  Reservation, 
  MenuItem, 
  RestaurantOrder, 
  InventoryItem, 
  StaffMember, 
  ShiftSchedule, 
  Invoice, 
  DynamicPricingSuggestion, 
  OperationalInsight, 
  UserRole, 
  RoomStatus, 
  OrderStatus,
  FolioItem,
  RoomCategory
} from '../types';
import { 
  INITIAL_ROOMS, 
  INITIAL_RESERVATIONS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_INVENTORY, 
  INITIAL_STAFF, 
  INITIAL_SHIFTS, 
  INITIAL_INVOICES, 
  INITIAL_DYNAMIC_PRICING, 
  INITIAL_INSIGHTS 
} from '../mockData';

export interface ActivityLog {
  id: string;
  time: string;
  user: string;
  role: string;
  action: string;
  badge: 'green' | 'amber' | 'blue' | 'purple' | 'red';
}

interface HotelContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  rooms: Room[];
  reservations: Reservation[];
  menuItems: MenuItem[];
  orders: RestaurantOrder[];
  inventory: InventoryItem[];
  staff: StaffMember[];
  shifts: ShiftSchedule[];
  invoices: Invoice[];
  pricingSuggestions: DynamicPricingSuggestion[];
  insights: OperationalInsight[];
  activityLogs: ActivityLog[];
  
  // Actions
  checkInGuest: (reservationId: string, deposit?: number) => void;
  checkOutGuest: (reservationId: string, paymentMethod: 'Chapa' | 'Credit Card' | 'Cash') => Invoice | null;
  updateRoomStatus: (roomId: string, status: RoomStatus, cleaningPriority?: 'Normal' | 'High' | 'VIP Rush') => void;
  createReservation: (data: Partial<Omit<Reservation, 'guest'>> & { guest: { name: string; email?: string; phone?: string; vipStatus?: boolean; vipTier?: 'Silver' | 'Gold' | 'Black Diamond'; specialRequests?: string; nationality?: string; idNumber?: string } }) => Reservation;
  cancelReservation: (reservationId: string) => void;
  createOrder: (order: Omit<RestaurantOrder, 'id' | 'orderNumber' | 'createdAt'>) => RestaurantOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  restockInventory: (itemId: string, addQty: number) => void;
  approvePricingSuggestion: (suggestionId: string) => void;
  rejectPricingSuggestion: (suggestionId: string) => void;
  toggleStaffClock: (staffId: string) => void;
  updateShift: (shiftId: string, newShift: 'Morning' | 'Evening' | 'Night' | 'Off') => void;
  markInvoicePaid: (invoiceId: string, paymentMethod?: string) => void;
  addFolioCharge: (reservationId: string, charge: Omit<FolioItem, 'id' | 'date'>) => void;
  resetToDemo: () => void;
  favorites: string[];
  toggleFavorite: (id: string, label?: string) => void;
  isFavorite: (id: string) => boolean;

  // Computed metrics
  stats: {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    cleaningRooms: number;
    occupancyRate: number;
    todayRevenue: number;
    revPar: number;
    adr: number;
    pendingCheckIns: number;
    pendingCheckOuts: number;
    activeKOTs: number;
    criticalInventoryCount: number;
  };
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('golden_active_role') as UserRole) || 'General Manager';
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('golden_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('golden_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('golden_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState<RestaurantOrder[]>(() => {
    const saved = localStorage.getItem('golden_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('golden_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('golden_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [shifts, setShifts] = useState<ShiftSchedule[]>(() => {
    const saved = localStorage.getItem('golden_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('golden_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [pricingSuggestions, setPricingSuggestions] = useState<DynamicPricingSuggestion[]>(() => {
    const saved = localStorage.getItem('golden_pricing_suggestions');
    return saved ? JSON.parse(saved) : INITIAL_DYNAMIC_PRICING;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('golden_favorites');
    return saved ? JSON.parse(saved) : ['room-401', 'menu-1', 'menu-6', 'showcase-1'];
  });

  const [insights, setInsights] = useState<OperationalInsight[]>(() => {
    const saved = localStorage.getItem('golden_insights');
    return saved ? JSON.parse(saved) : INITIAL_INSIGHTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => [
    { id: 'log-1', time: '18:45', user: 'Seraphina Dupont', role: 'Front Desk', action: 'Issued digital keycard for Suite 302 (Marcus Vance)', badge: 'blue' },
    { id: 'log-2', time: '18:42', user: 'Chef Antoine Laurent', role: 'F&B Manager', action: 'Fired KOT-2041: 2x A5 Wagyu Ribeye & Dom Pérignon', badge: 'amber' },
    { id: 'log-3', time: '17:30', user: 'Julian Montgomery', role: 'General Manager', action: 'Approved dynamic pricing surge (+18.4%) on Presidential Suites', badge: 'green' },
    { id: 'log-4', time: '16:15', user: 'Beatriz Morales', role: 'Housekeeping Lead', action: 'Flagged Room 404 for VIP Rush sanitization', badge: 'purple' },
    { id: 'log-5', time: '15:20', user: 'Harrison Sterling', role: 'Finance', action: 'Settled Chapa Folio #INV-8802 ($2,356.25)', badge: 'green' }
  ]);

  // Sync to local storage
  useEffect(() => { localStorage.setItem('golden_active_role', activeRole); }, [activeRole]);
  useEffect(() => { localStorage.setItem('golden_rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('golden_reservations', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('golden_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('golden_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('golden_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('golden_shifts', JSON.stringify(shifts)); }, [shifts]);
  useEffect(() => { localStorage.setItem('golden_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('golden_pricing_suggestions', JSON.stringify(pricingSuggestions)); }, [pricingSuggestions]);
  useEffect(() => { localStorage.setItem('golden_favorites', JSON.stringify(favorites)); }, [favorites]);

  const toggleFavorite = (id: string, label?: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(fId => fId !== id) : [...prev, id];
      if (label) {
        addLog(exists ? `Removed "${label}" from Favorites` : `Added "${label}" to Favorites`, exists ? 'amber' : 'green');
      }
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addLog = (action: string, badge: ActivityLog['badge'] = 'blue') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      user: activeRole === 'General Manager' ? 'Julian Montgomery' : 
            activeRole === 'Front Desk Receptionist' ? 'Seraphina Dupont' :
            activeRole === 'F&B & POS Manager' ? 'Chef Antoine Laurent' :
            activeRole === 'Housekeeping Lead' ? 'Beatriz Morales' : 'Harrison Sterling',
      role: activeRole,
      action,
      badge
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 24)]);
  };

  // Check In Guest
  const checkInGuest = (reservationId: string, deposit: number = 500) => {
    setReservations(prev => prev.map(res => {
      if (res.id === reservationId) {
        return {
          ...res,
          status: 'Checked In',
          keycardIssued: true,
          incidentalsDeposit: deposit,
        };
      }
      return res;
    }));

    const res = reservations.find(r => r.id === reservationId);
    if (res) {
      setRooms(prev => prev.map(rm => {
        if (rm.id === res.roomId || rm.roomNumber === res.roomNumber) {
          return {
            ...rm,
            status: 'Occupied',
            currentGuestId: res.guest.id
          };
        }
        return rm;
      }));
      addLog(`Checked in ${res.guest.name} into Suite ${res.roomNumber}. Keycard issued & $${deposit} deposit authorized.`, 'green');
    }
  };

  // Check Out Guest
  const checkOutGuest = (reservationId: string, paymentMethod: 'Chapa' | 'Credit Card' | 'Cash'): Invoice | null => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return null;

    // Calculate total folio
    const subtotal = res.roomCharges.reduce((acc, c) => acc + c.amount, 0) || res.totalRoomCost;
    const tax = subtotal * 0.15;
    const service = subtotal * 0.10;
    const grandTotal = subtotal + tax + service;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      reservationId: res.id,
      guestName: res.guest.name,
      roomNumber: res.roomNumber,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: res.roomCharges.length > 0 ? res.roomCharges : [
        {
          id: `f-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: `${res.roomCategory} (${res.nights} Nights)`,
          category: 'Room',
          amount: res.totalRoomCost,
          paid: true
        }
      ],
      subtotal,
      taxAmount: tax,
      serviceCharge: service,
      totalAmount: grandTotal,
      paymentMethod,
      paymentReference: `${paymentMethod === 'Chapa' ? 'CHP-TX-' : 'CARD-TX-'}${Math.floor(100000000 + Math.random() * 900000000)}`,
      status: 'Paid'
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Update reservation
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'Checked Out', paymentStatus: 'Paid' } : r));

    // Mark room dirty for housekeeping
    setRooms(prev => prev.map(rm => {
      if (rm.id === res.roomId || rm.roomNumber === res.roomNumber) {
        return {
          ...rm,
          status: 'Cleaning',
          currentGuestId: undefined,
          cleaningPriority: res.guest.vipStatus ? 'VIP Rush' : 'High'
        };
      }
      return rm;
    }));

    addLog(`Checked out ${res.guest.name} from Suite ${res.roomNumber}. Folio settled via ${paymentMethod} ($${grandTotal.toFixed(2)}). Room flagged for Housekeeping.`, 'blue');
    return newInvoice;
  };

  // Update room status
  const updateRoomStatus = (roomId: string, status: RoomStatus, cleaningPriority: 'Normal' | 'High' | 'VIP Rush' = 'Normal') => {
    setRooms(prev => prev.map(rm => {
      if (rm.id === roomId) {
        return {
          ...rm,
          status,
          cleaningPriority,
          lastCleaned: status === 'Available' || status === 'Inspected' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : rm.lastCleaned
        };
      }
      return rm;
    }));

    const target = rooms.find(r => r.id === roomId);
    addLog(`Room ${target?.roomNumber || roomId} status changed to ${status}${cleaningPriority !== 'Normal' ? ` (${cleaningPriority})` : ''}`, 'purple');
  };

  // Create new reservation
  const createReservation = (data: Partial<Omit<Reservation, 'guest'>> & { guest: { name: string; email?: string; phone?: string; vipStatus?: boolean; vipTier?: 'Silver' | 'Gold' | 'Black Diamond'; specialRequests?: string; nationality?: string; idNumber?: string } }): Reservation => {
    const targetRoom = rooms.find(r => r.id === data.roomId || r.roomNumber === data.roomNumber) || rooms[0];
    const nights = data.nights || 3;
    const rate = targetRoom.pricePerNight;
    const totalRoomCost = rate * nights;

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      confirmationCode: `GLD-${Math.floor(1000 + Math.random() * 9000)}`,
      guest: {
        id: `guest-${Date.now()}`,
        name: data.guest.name,
        email: data.guest.email || 'guest@luxury.com',
        phone: data.guest.phone || '+1 555 0192',
        vipStatus: data.guest.vipStatus || false,
        vipTier: data.guest.vipTier,
        nationality: data.guest.nationality || 'International',
        idNumber: data.guest.idNumber || `PASSPORT-${Math.floor(100000 + Math.random() * 900000)}`,
        specialRequests: data.guest.specialRequests || '',
        totalStays: 1
      },
      roomId: targetRoom.id,
      roomNumber: targetRoom.roomNumber,
      roomCategory: targetRoom.category,
      checkInDate: data.checkInDate || new Date().toISOString().split('T')[0],
      checkOutDate: data.checkOutDate || new Date(Date.now() + 86400000 * nights).toISOString().split('T')[0],
      nights,
      adults: data.adults || 2,
      children: data.children || 0,
      ratePerNight: rate,
      totalRoomCost,
      incidentalsDeposit: 500,
      status: 'Confirmed',
      bookingChannel: data.bookingChannel || 'Direct Website',
      paymentStatus: 'Deposit Paid',
      keycardIssued: false,
      notes: data.notes || '',
      roomCharges: [
        {
          id: `chg-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: `${targetRoom.category} (${nights} nights)`,
          category: 'Room',
          amount: totalRoomCost,
          paid: false
        }
      ]
    };

    setReservations(prev => [newRes, ...prev]);
    // update room status to reserved
    setRooms(prev => prev.map(rm => rm.id === targetRoom.id ? { ...rm, status: 'Reserved' } : rm));

    addLog(`Created reservation ${newRes.confirmationCode} for ${newRes.guest.name} in Room ${targetRoom.roomNumber}`, 'amber');
    return newRes;
  };

  const cancelReservation = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'Cancelled' } : r));
    setRooms(prev => prev.map(rm => rm.id === res.roomId ? { ...rm, status: 'Available' } : rm));
    addLog(`Cancelled reservation ${res.confirmationCode} for ${res.guest.name}`, 'red');
  };

  // Create Restaurant Order & support Room Service Charge
  const createOrder = (orderData: Omit<RestaurantOrder, 'id' | 'orderNumber' | 'createdAt'>): RestaurantOrder => {
    const orderNumber = `KOT-${Math.floor(2000 + Math.random() * 8000)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: RestaurantOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: timeStr
    };

    setOrders(prev => [newOrder, ...prev]);

    // If billed to room, post charge to guest folio!
    if (orderData.paymentMethod === 'Room Charge' && orderData.roomNumber) {
      const activeRes = reservations.find(r => r.roomNumber === orderData.roomNumber && r.status === 'Checked In');
      if (activeRes) {
        const folioItem: FolioItem = {
          id: `fol-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: `F&B Dining Ticket #${orderNumber} (${orderData.items.map(i => `${i.quantity}x ${i.name}`).join(', ')})`,
          category: 'Restaurant',
          amount: orderData.totalAmount,
          paid: false
        };

        setReservations(prev => prev.map(r => {
          if (r.id === activeRes.id) {
            return {
              ...r,
              roomCharges: [...r.roomCharges, folioItem]
            };
          }
          return r;
        }));
      }
    }

    // Deduct stock for relevant items automatically
    setInventory(prev => prev.map(item => {
      if (item.name.includes('Wagyu') && orderData.items.some(i => i.name.includes('Wagyu'))) {
        const newStock = Math.max(0, +(item.currentStock - 0.5).toFixed(1));
        return { ...item, currentStock: newStock, status: newStock < item.minThreshold ? 'Critical' : 'In Stock' };
      }
      if (item.name.includes('Champagne') && orderData.items.some(i => i.name.includes('Pérignon'))) {
        const newStock = Math.max(0, item.currentStock - 1);
        return { ...item, currentStock: newStock, status: newStock < item.minThreshold ? 'Low Stock' : 'In Stock' };
      }
      return item;
    }));

    addLog(`Fired ${newOrder.orderNumber}: ${newOrder.isRoomService ? `Room ${newOrder.roomNumber}` : newOrder.tableNumber} ($${newOrder.totalAmount.toFixed(2)})`, 'amber');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
    addLog(`Order ${orderId} updated to ${status}`, 'blue');
  };

  const restockInventory = (itemId: string, addQty: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = +(item.currentStock + addQty).toFixed(1);
        return {
          ...item,
          currentStock: newStock,
          status: newStock >= item.minThreshold ? 'In Stock' : 'Low Stock',
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    const target = inventory.find(i => i.id === itemId);
    addLog(`Restocked ${target?.name} (+${addQty} ${target?.unit})`, 'green');
  };

  const approvePricingSuggestion = (suggestionId: string) => {
    const suggestion = pricingSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    // Apply new rate to all rooms of that category
    setRooms(prev => prev.map(rm => {
      if (rm.category === suggestion.roomCategory) {
        return {
          ...rm,
          pricePerNight: suggestion.suggestedRate
        };
      }
      return rm;
    }));

    setPricingSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, status: 'Approved' } : s));
    addLog(`Approved AI dynamic pricing for ${suggestion.roomCategory}: $${suggestion.currentRate} → $${suggestion.suggestedRate}/night`, 'green');
  };

  const rejectPricingSuggestion = (suggestionId: string) => {
    setPricingSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, status: 'Declined' } : s));
    addLog(`Declined dynamic pricing recommendation for ${suggestionId}`, 'red');
  };

  const toggleStaffClock = (staffId: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        const willClockIn = !s.clockedIn;
        addLog(`${s.name} (${s.role}) clocked ${willClockIn ? 'IN' : 'OUT'}`, willClockIn ? 'green' : 'amber');
        return { ...s, clockedIn: willClockIn };
      }
      return s;
    }));
  };

  const updateShift = (shiftId: string, newShift: 'Morning' | 'Evening' | 'Night' | 'Off') => {
    setShifts(prev => prev.map(s => s.id === shiftId ? { ...s, shift: newShift } : s));
    addLog(`Roster shift updated for entry ${shiftId} to ${newShift}`, 'blue');
  };

  const markInvoicePaid = (invoiceId: string, paymentMethod: string = 'Chapa') => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: 'Paid', paymentMethod: paymentMethod as any };
      }
      return inv;
    }));
    addLog(`Invoice ${invoiceId} marked as Paid via ${paymentMethod}`, 'green');
  };

  const addFolioCharge = (reservationId: string, charge: Omit<FolioItem, 'id' | 'date'>) => {
    const newItem: FolioItem = {
      ...charge,
      id: `fol-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setReservations(prev => prev.map(res => {
      if (res.id === reservationId) {
        return {
          ...res,
          roomCharges: [...res.roomCharges, newItem]
        };
      }
      return res;
    }));
    addLog(`Added charge "${charge.description}" ($${charge.amount}) to reservation ${reservationId}`, 'blue');
  };

  const resetToDemo = () => {
    localStorage.clear();
    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setStaff(INITIAL_STAFF);
    setShifts(INITIAL_SHIFTS);
    setInvoices(INITIAL_INVOICES);
    setPricingSuggestions(INITIAL_DYNAMIC_PRICING);
    setInsights(INITIAL_INSIGHTS);
    addLog('Reset Golden Hotel ERP state to pristine luxury demo benchmark', 'purple');
  };

  // Computed statistics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const cleaningRooms = rooms.filter(r => r.status === 'Cleaning').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  const todayRevenue = reservations
    .filter(r => r.status === 'Checked In')
    .reduce((sum, r) => sum + r.ratePerNight, 0) + 
    orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const adr = occupiedRooms > 0 ? Math.round(
    reservations.filter(r => r.status === 'Checked In').reduce((sum, r) => sum + r.ratePerNight, 0) / occupiedRooms
  ) : 480;

  const revPar = Math.round((adr * occupancyRate) / 100);

  const pendingCheckIns = reservations.filter(r => r.status === 'Confirmed').length;
  const pendingCheckOuts = reservations.filter(r => r.status === 'Checked In' && r.checkOutDate === '2026-10-02').length;
  const activeKOTs = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Paid').length;
  const criticalInventoryCount = inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock').length;

  return (
    <HotelContext.Provider value={{
      activeRole,
      setActiveRole,
      rooms,
      reservations,
      menuItems,
      orders,
      inventory,
      staff,
      shifts,
      invoices,
      pricingSuggestions,
      insights,
      activityLogs,
      checkInGuest,
      checkOutGuest,
      updateRoomStatus,
      createReservation,
      cancelReservation,
      createOrder,
      updateOrderStatus,
      restockInventory,
      approvePricingSuggestion,
      rejectPricingSuggestion,
      toggleStaffClock,
      updateShift,
      markInvoicePaid,
      addFolioCharge,
      resetToDemo,
      favorites,
      toggleFavorite,
      isFavorite,
      stats: {
        totalRooms,
        occupiedRooms,
        availableRooms,
        cleaningRooms,
        occupancyRate,
        todayRevenue,
        revPar,
        adr,
        pendingCheckIns,
        pendingCheckOuts,
        activeKOTs,
        criticalInventoryCount
      }
    }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
