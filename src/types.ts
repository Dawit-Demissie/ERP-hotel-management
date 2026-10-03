export type UserRole = 
  | 'General Manager' 
  | 'Front Desk Receptionist' 
  | 'F&B & POS Manager' 
  | 'Housekeeping Lead' 
  | 'Financial Controller';

export type RoomCategory = 
  | 'Presidential Suite' 
  | 'Royal Penthouse' 
  | 'Executive Suite' 
  | 'Deluxe Ocean King' 
  | 'Premier Garden Villa' 
  | 'Classic Deluxe';

export type RoomStatus = 
  | 'Available' 
  | 'Occupied' 
  | 'Reserved' 
  | 'Cleaning' 
  | 'Inspected' 
  | 'Maintenance';

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  category: RoomCategory;
  pricePerNight: number;
  baseRate: number;
  status: RoomStatus;
  maxGuests: number;
  amenities: string[];
  currentGuestId?: string;
  cleaningPriority?: 'Normal' | 'High' | 'VIP Rush';
  lastCleaned?: string;
  imageUrl?: string;
}

export type ReservationStatus = 
  | 'Confirmed' 
  | 'Checked In' 
  | 'Checked Out' 
  | 'Cancelled' 
  | 'Pending';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  vipStatus: boolean;
  vipTier?: 'Silver' | 'Gold' | 'Black Diamond';
  nationality: string;
  idNumber: string;
  specialRequests?: string;
  totalStays: number;
}

export interface Reservation {
  id: string;
  confirmationCode: string;
  guest: Guest;
  roomId: string;
  roomNumber: string;
  roomCategory: RoomCategory;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  ratePerNight: number;
  totalRoomCost: number;
  incidentalsDeposit: number;
  status: ReservationStatus;
  bookingChannel: 'Direct Website' | 'Booking.com' | 'Expedia' | 'Corporate' | 'Concierge';
  paymentStatus: 'Paid' | 'Deposit Paid' | 'Pending Settlement' | 'Refunded';
  keycardIssued?: boolean;
  notes?: string;
  roomCharges: FolioItem[];
}

export interface FolioItem {
  id: string;
  date: string;
  description: string;
  category: 'Room' | 'Restaurant' | 'Mini Bar' | 'Spa' | 'Laundry' | 'Tax' | 'Service Fee';
  amount: number;
  paid: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Fine Dining' | 'Steaks & Seafood' | 'Desserts' | 'Vintage Cellar' | 'Beverages';
  price: number;
  description: string;
  available: boolean;
  prepTimeMinutes: number;
  calories?: number;
  allergens?: string[];
  imageUrl?: string;
}

export type OrderStatus = 'Pending' | 'Kitchen In Progress' | 'Ready to Serve' | 'Delivered' | 'Paid';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface RestaurantOrder {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  isRoomService: boolean;
  roomNumber?: string;
  guestName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  billedToRoomId?: string;
  paymentMethod?: 'Room Charge' | 'Chapa' | 'Credit Card' | 'Cash';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Meat & Seafood' | 'Dairy & Produce' | 'Dry Goods & Spices' | 'Beverages & Wine' | 'Hotel Amenities' | 'Linens';
  currentStock: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  supplier: string;
  supplierContact: string;
  lastRestocked: string;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: 'Front Office' | 'Housekeeping' | 'Food & Beverage' | 'Finance' | 'Executive Management';
  email: string;
  phone: string;
  avatarColor: string;
  shift: 'Morning (07:00-15:30)' | 'Evening (15:00-23:30)' | 'Night (23:00-07:30)' | 'Off';
  clockedIn: boolean;
  monthlySalary: number;
  performanceScore: number; // 0 - 100
  activeTasks: number;
}

export interface ShiftSchedule {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  shift: 'Morning' | 'Evening' | 'Night' | 'Off';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  issueDate: string;
  dueDate: string;
  items: FolioItem[];
  subtotal: number;
  taxAmount: number; // 15% VAT
  serviceCharge: number; // 10% Luxury Service
  totalAmount: number;
  paymentMethod: 'Chapa' | 'Credit Card' | 'Visa/Mastercard' | 'Wire Transfer' | 'Cash';
  paymentReference: string;
  status: 'Paid' | 'Outstanding' | 'Draft';
}

export interface DynamicPricingSuggestion {
  id: string;
  roomCategory: RoomCategory;
  currentRate: number;
  suggestedRate: number;
  adjustmentPercent: number;
  reason: string;
  confidence: number;
  projectedRevenueIncrease: number;
  status: 'Pending Approval' | 'Approved' | 'Declined';
}

export interface OperationalInsight {
  id: string;
  type: 'Occupancy' | 'Revenue' | 'VIP' | 'Kitchen' | 'Staffing';
  title: string;
  description: string;
  severity: 'Info' | 'Warning' | 'Urgent' | 'Success';
  suggestedAction?: string;
  impactMetric?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
}
