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
  OperationalInsight 
} from './types';

const ROOM_IMAGES_BY_CATEGORY: Record<string, string> = {
  'Presidential Suite': '/src/assets/images/luxury_hotel_suite_1791012847273.jpg',
  'Royal Penthouse': '/src/assets/images/royal_penthouse_suite_1791013564145.jpg',
  'Executive Suite': '/src/assets/images/executive_king_room_1791013575430.jpg',
  'Deluxe Ocean King': '/src/assets/images/ocean_garden_villa_1791013552288.jpg',
  'Premier Garden Villa': '/src/assets/images/ocean_garden_villa_1791013552288.jpg',
  'Classic Deluxe': '/src/assets/images/executive_king_room_1791013575430.jpg'
};

const RAW_ROOMS: Room[] = [
  // Floor 4 - Ultra Luxury & Penthouses
  {
    id: 'room-401',
    roomNumber: '401',
    floor: 4,
    category: 'Presidential Suite',
    pricePerNight: 1250,
    baseRate: 1100,
    status: 'Occupied',
    maxGuests: 4,
    amenities: ['Private Butler', 'Panoramic Ocean Terrace', 'Jacuzzi Spa', 'Grand Piano', 'Helipad Access'],
    currentGuestId: 'guest-101',
    cleaningPriority: 'VIP Rush',
    lastCleaned: '2026-10-02 09:30',
    imageUrl: '/src/assets/images/luxury_hotel_suite_1791012847273.jpg'
  },
  {
    id: 'room-402',
    roomNumber: '402',
    floor: 4,
    category: 'Royal Penthouse',
    pricePerNight: 950,
    baseRate: 850,
    status: 'Reserved',
    maxGuests: 3,
    amenities: ['Private Balcony', 'Wine Cellar', 'Marble Bath', 'Personalized Fragrance Bar'],
    cleaningPriority: 'High',
    lastCleaned: '2026-10-02 11:00',
    imageUrl: '/src/assets/images/luxury_hotel_suite_1791012847273.jpg'
  },
  {
    id: 'room-403',
    roomNumber: '403',
    floor: 4,
    category: 'Royal Penthouse',
    pricePerNight: 950,
    baseRate: 850,
    status: 'Available',
    maxGuests: 3,
    amenities: ['Private Balcony', 'Wine Cellar', 'Marble Bath', 'Personalized Fragrance Bar'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 14:15',
    imageUrl: '/src/assets/images/luxury_hotel_suite_1791012847273.jpg'
  },
  {
    id: 'room-404',
    roomNumber: '404',
    floor: 4,
    category: 'Presidential Suite',
    pricePerNight: 1250,
    baseRate: 1100,
    status: 'Cleaning',
    maxGuests: 4,
    amenities: ['Private Butler', 'Panoramic Ocean Terrace', 'Jacuzzi Spa', 'Fireplace'],
    cleaningPriority: 'VIP Rush',
    lastCleaned: '2026-10-01 16:00',
    imageUrl: '/src/assets/images/luxury_hotel_suite_1791012847273.jpg'
  },

  // Floor 3 - Executive Suites
  {
    id: 'room-301',
    roomNumber: '301',
    floor: 3,
    category: 'Executive Suite',
    pricePerNight: 580,
    baseRate: 520,
    status: 'Occupied',
    maxGuests: 2,
    amenities: ['Executive Lounge Key', 'Ergonomic Workstation', 'High-Speed Starlink', 'Espresso Bar'],
    currentGuestId: 'guest-102',
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 10:15'
  },
  {
    id: 'room-302',
    roomNumber: '302',
    floor: 3,
    category: 'Executive Suite',
    pricePerNight: 580,
    baseRate: 520,
    status: 'Occupied',
    maxGuests: 2,
    amenities: ['Executive Lounge Key', 'Ergonomic Workstation', 'Balcony', 'Espresso Bar'],
    currentGuestId: 'guest-103',
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 10:45'
  },
  {
    id: 'room-303',
    roomNumber: '303',
    floor: 3,
    category: 'Executive Suite',
    pricePerNight: 580,
    baseRate: 520,
    status: 'Available',
    maxGuests: 2,
    amenities: ['Executive Lounge Key', 'Ergonomic Workstation', 'Espresso Bar'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 13:00'
  },
  {
    id: 'room-304',
    roomNumber: '304',
    floor: 3,
    category: 'Executive Suite',
    pricePerNight: 580,
    baseRate: 520,
    status: 'Reserved',
    maxGuests: 2,
    amenities: ['Executive Lounge Key', 'City Skyline View', 'Rain Shower'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 12:20'
  },
  {
    id: 'room-305',
    roomNumber: '305',
    floor: 3,
    category: 'Executive Suite',
    pricePerNight: 580,
    baseRate: 520,
    status: 'Occupied',
    maxGuests: 2,
    amenities: ['Executive Lounge Key', 'Ergonomic Workstation', 'Espresso Bar'],
    currentGuestId: 'guest-104',
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 09:50'
  },
  {
    id: 'room-306',
    roomNumber: '306',
    floor: 3,
    category: 'Executive Suite',
    pricePerNight: 580,
    baseRate: 520,
    status: 'Maintenance',
    maxGuests: 2,
    amenities: ['Executive Lounge Key', 'Smart Lighting', 'Jacuzzi'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-09-30 18:00'
  },

  // Floor 2 - Deluxe Ocean King
  {
    id: 'room-201',
    roomNumber: '201',
    floor: 2,
    category: 'Deluxe Ocean King',
    pricePerNight: 420,
    baseRate: 380,
    status: 'Occupied',
    maxGuests: 2,
    amenities: ['Direct Ocean Front', 'King Featherbed', 'Nespresso', 'Bose Sound System'],
    currentGuestId: 'guest-105',
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 11:30'
  },
  {
    id: 'room-202',
    roomNumber: '202',
    floor: 2,
    category: 'Deluxe Ocean King',
    pricePerNight: 420,
    baseRate: 380,
    status: 'Occupied',
    maxGuests: 2,
    amenities: ['Direct Ocean Front', 'King Featherbed', 'Nespresso'],
    currentGuestId: 'guest-106',
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 11:45'
  },
  {
    id: 'room-203',
    roomNumber: '203',
    floor: 2,
    category: 'Deluxe Ocean King',
    pricePerNight: 420,
    baseRate: 380,
    status: 'Available',
    maxGuests: 2,
    amenities: ['Direct Ocean Front', 'King Featherbed', 'Balcony'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 14:00'
  },
  {
    id: 'room-204',
    roomNumber: '204',
    floor: 2,
    category: 'Deluxe Ocean King',
    pricePerNight: 420,
    baseRate: 380,
    status: 'Cleaning',
    maxGuests: 2,
    amenities: ['Direct Ocean Front', 'King Featherbed'],
    cleaningPriority: 'High',
    lastCleaned: '2026-10-01 17:00'
  },
  {
    id: 'room-205',
    roomNumber: '205',
    floor: 2,
    category: 'Deluxe Ocean King',
    pricePerNight: 420,
    baseRate: 380,
    status: 'Available',
    maxGuests: 2,
    amenities: ['Direct Ocean Front', 'King Featherbed', 'Minibar Deluxe'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 13:30'
  },

  // Floor 1 - Premier Garden Villa & Classic Deluxe
  {
    id: 'room-101',
    roomNumber: '101',
    floor: 1,
    category: 'Premier Garden Villa',
    pricePerNight: 720,
    baseRate: 650,
    status: 'Occupied',
    maxGuests: 4,
    amenities: ['Private Garden Path', 'Plunge Pool', 'Outdoor Rain Shower', 'Fire Pit'],
    currentGuestId: 'guest-107',
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 10:00'
  },
  {
    id: 'room-102',
    roomNumber: '102',
    floor: 1,
    category: 'Premier Garden Villa',
    pricePerNight: 720,
    baseRate: 650,
    status: 'Available',
    maxGuests: 4,
    amenities: ['Private Garden Path', 'Plunge Pool', 'Outdoor Rain Shower'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 12:45'
  },
  {
    id: 'room-103',
    roomNumber: '103',
    floor: 1,
    category: 'Classic Deluxe',
    pricePerNight: 320,
    baseRate: 290,
    status: 'Occupied',
    maxGuests: 2,
    amenities: ['Garden View', 'Queen Pillowtop', 'Smart TV', 'Organic Toiletries'],
    currentGuestId: 'guest-108',
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 11:15'
  },
  {
    id: 'room-104',
    roomNumber: '104',
    floor: 1,
    category: 'Classic Deluxe',
    pricePerNight: 320,
    baseRate: 290,
    status: 'Reserved',
    maxGuests: 2,
    amenities: ['Garden View', 'Queen Pillowtop', 'Smart TV'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 12:00'
  },
  {
    id: 'room-105',
    roomNumber: '105',
    floor: 1,
    category: 'Classic Deluxe',
    pricePerNight: 320,
    baseRate: 290,
    status: 'Available',
    maxGuests: 2,
    amenities: ['Garden View', 'Queen Pillowtop', 'Mini Bar'],
    cleaningPriority: 'Normal',
    lastCleaned: '2026-10-02 13:40'
  }
];

export const INITIAL_ROOMS: Room[] = RAW_ROOMS.map(rm => ({
  ...rm,
  imageUrl: rm.imageUrl || ROOM_IMAGES_BY_CATEGORY[rm.category] || '/src/assets/images/luxury_hotel_suite_1791012847273.jpg'
}));

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-001',
    confirmationCode: 'GLD-7821',
    guest: {
      id: 'guest-101',
      name: 'Lord Alistair Sterling',
      email: 'a.sterling@sovereign-holdings.co.uk',
      phone: '+44 20 7946 0912',
      vipStatus: true,
      vipTier: 'Black Diamond',
      nationality: 'United Kingdom',
      idNumber: 'GBR-8921740',
      specialRequests: 'Dom Pérignon 2012 on ice upon arrival. Hypoallergenic goose down pillows only.',
      totalStays: 14
    },
    roomId: 'room-401',
    roomNumber: '401',
    roomCategory: 'Presidential Suite',
    checkInDate: '2026-10-01',
    checkOutDate: '2026-10-06',
    nights: 5,
    adults: 2,
    children: 0,
    ratePerNight: 1250,
    totalRoomCost: 6250,
    incidentalsDeposit: 2000,
    status: 'Checked In',
    bookingChannel: 'Concierge',
    paymentStatus: 'Deposit Paid',
    keycardIssued: true,
    notes: 'VIP Ambassador. Arrange private chauffeured Maybach for departures.',
    roomCharges: [
      { id: 'f-1', date: '2026-10-01', description: 'Room Charge - Night 1', category: 'Room', amount: 1250, paid: true },
      { id: 'f-2', date: '2026-10-01', description: 'Vintage Champagne & Beluga Welcome', category: 'Restaurant', amount: 480, paid: false },
      { id: 'f-3', date: '2026-10-02', description: 'Imperial Spa - 90min Couple Massage', category: 'Spa', amount: 420, paid: false }
    ]
  },
  {
    id: 'res-002',
    confirmationCode: 'GLD-8910',
    guest: {
      id: 'guest-102',
      name: 'Dr. Elena Rostova',
      email: 'elena.rostova@geneva-biotech.org',
      phone: '+41 22 555 0199',
      vipStatus: true,
      vipTier: 'Gold',
      nationality: 'Switzerland',
      idNumber: 'CHE-9921004',
      specialRequests: 'Quiet room away from elevators. Extra HDMI monitor for video calls.',
      totalStays: 6
    },
    roomId: 'room-301',
    roomNumber: '301',
    roomCategory: 'Executive Suite',
    checkInDate: '2026-10-01',
    checkOutDate: '2026-10-04',
    nights: 3,
    adults: 1,
    children: 0,
    ratePerNight: 580,
    totalRoomCost: 1740,
    incidentalsDeposit: 600,
    status: 'Checked In',
    bookingChannel: 'Corporate',
    paymentStatus: 'Paid',
    keycardIssued: true,
    roomCharges: [
      { id: 'f-4', date: '2026-10-01', description: 'Room Charge - Night 1', category: 'Room', amount: 580, paid: true },
      { id: 'f-5', date: '2026-10-02', description: 'In-Room Dining: Prime Wagyu & Merlot', category: 'Restaurant', amount: 145, paid: false }
    ]
  },
  {
    id: 'res-003',
    confirmationCode: 'GLD-9034',
    guest: {
      id: 'guest-103',
      name: 'Marcus Vance',
      email: 'marcus.v@apexventures.com',
      phone: '+1 415 800 2311',
      vipStatus: false,
      nationality: 'United States',
      idNumber: 'USA-481920311',
      specialRequests: 'Early check-in requested at 11:30 AM.',
      totalStays: 3
    },
    roomId: 'room-302',
    roomNumber: '302',
    roomCategory: 'Executive Suite',
    checkInDate: '2026-10-02',
    checkOutDate: '2026-10-05',
    nights: 3,
    adults: 2,
    children: 0,
    ratePerNight: 580,
    totalRoomCost: 1740,
    incidentalsDeposit: 500,
    status: 'Checked In',
    bookingChannel: 'Direct Website',
    paymentStatus: 'Deposit Paid',
    keycardIssued: true,
    roomCharges: [
      { id: 'f-6', date: '2026-10-02', description: 'Room Charge - Night 1', category: 'Room', amount: 580, paid: true }
    ]
  },
  {
    id: 'res-004',
    confirmationCode: 'GLD-9214',
    guest: {
      id: 'guest-109',
      name: 'Sophia Chen-Lin',
      email: 'schen@pacificpartners.sg',
      phone: '+65 6712 9001',
      vipStatus: true,
      vipTier: 'Gold',
      nationality: 'Singapore',
      idNumber: 'SGP-S8912349B',
      specialRequests: 'Late check-in expected at 8:00 PM. Almond milk in minibar.',
      totalStays: 8
    },
    roomId: 'room-402',
    roomNumber: '402',
    roomCategory: 'Royal Penthouse',
    checkInDate: '2026-10-02',
    checkOutDate: '2026-10-07',
    nights: 5,
    adults: 2,
    children: 1,
    ratePerNight: 950,
    totalRoomCost: 4750,
    incidentalsDeposit: 1500,
    status: 'Confirmed',
    bookingChannel: 'Direct Website',
    paymentStatus: 'Deposit Paid',
    keycardIssued: false,
    roomCharges: []
  },
  {
    id: 'res-005',
    confirmationCode: 'GLD-9330',
    guest: {
      id: 'guest-107',
      name: 'Princess Amara Al-Mansoor',
      email: 'a.almansoor@royaloffice.ae',
      phone: '+971 4 332 9901',
      vipStatus: true,
      vipTier: 'Black Diamond',
      nationality: 'United Arab Emirates',
      idNumber: 'ARE-784-1988-29182',
      specialRequests: 'Private security team access pass. Fresh white orchids daily.',
      totalStays: 19
    },
    roomId: 'room-101',
    roomNumber: '101',
    roomCategory: 'Premier Garden Villa',
    checkInDate: '2026-09-29',
    checkOutDate: '2026-10-03',
    nights: 4,
    adults: 3,
    children: 2,
    ratePerNight: 720,
    totalRoomCost: 2880,
    incidentalsDeposit: 2500,
    status: 'Checked In',
    bookingChannel: 'Concierge',
    paymentStatus: 'Paid',
    keycardIssued: true,
    roomCharges: [
      { id: 'f-7', date: '2026-09-29', description: 'Room Charge (4 nights)', category: 'Room', amount: 2880, paid: true },
      { id: 'f-8', date: '2026-10-01', description: 'Private Villa Banquet & BBQ Catering', category: 'Restaurant', amount: 890, paid: false },
      { id: 'f-9', date: '2026-10-02', description: 'Luxury Laundry & Dry Cleaning Express', category: 'Laundry', amount: 160, paid: false }
    ]
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Fine Dining & Steaks
  {
    id: 'menu-1',
    name: 'A5 Miyazaki Wagyu Ribeye (250g)',
    category: 'Steaks & Seafood',
    price: 185,
    description: 'Black garlic truffle glaze, roasted marrow butter, charred maitake mushroom, smoked Himalayan salt.',
    available: true,
    prepTimeMinutes: 25,
    allergens: ['Dairy'],
    imageUrl: '/src/assets/images/wagyu_steak_dish_1791012861226.jpg'
  },
  {
    id: 'menu-2',
    name: 'Pan-Seared Brittany Turbot',
    category: 'Steaks & Seafood',
    price: 110,
    description: 'Champagne velouté, imperial oscietra caviar, braised baby leeks, sea fennel.',
    available: true,
    prepTimeMinutes: 20,
    allergens: ['Fish', 'Dairy'],
    imageUrl: '/src/assets/images/pan_seared_turbot_1791012873342.jpg'
  },
  {
    id: 'menu-3',
    name: 'Handcrafted Truffle Tagliolini',
    category: 'Fine Dining',
    price: 68,
    description: '36-month aged Parmigiano Reggiano emulsified in cultured butter, shaved fresh black Norcia truffle.',
    available: true,
    prepTimeMinutes: 15,
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    imageUrl: '/src/assets/images/wagyu_steak_dish_1791012861226.jpg'
  },
  {
    id: 'menu-4',
    name: 'Roasted Pyrenean Milk-Fed Lamb',
    category: 'Fine Dining',
    price: 92,
    description: 'Pistachio herb crust, pomme purée, glazed heritage carrots, rosemary jus.',
    available: true,
    prepTimeMinutes: 25,
    allergens: ['Nuts', 'Dairy'],
    imageUrl: '/src/assets/images/wagyu_steak_dish_1791012861226.jpg'
  },

  // Breakfast
  {
    id: 'menu-5',
    name: 'Royal Sovereign Caviar Benedict',
    category: 'Breakfast',
    price: 52,
    description: 'Poached organic eggs, house-cured King salmon, saffron hollandaise, golden Ossetra caviar, brioche.',
    available: true,
    prepTimeMinutes: 15,
    allergens: ['Gluten', 'Eggs', 'Fish', 'Dairy'],
    imageUrl: '/src/assets/images/royal_caviar_benedict_1791013617241.jpg'
  },
  {
    id: 'menu-6',
    name: 'French Brioche Pain Perdu',
    category: 'Breakfast',
    price: 34,
    description: 'Bourbon barrel vanilla bean cream, caramelized Quebec maple glaze, fresh wild berries.',
    available: true,
    prepTimeMinutes: 12,
    allergens: ['Gluten', 'Eggs', 'Dairy'],
    imageUrl: '/src/assets/images/luxury_chocolate_dessert_1791012893463.jpg'
  },

  // Vintage Cellar & Cocktails
  {
    id: 'menu-7',
    name: 'Dom Pérignon Vintage 2013 Brut',
    category: 'Vintage Cellar',
    price: 360,
    description: 'Épernay, Champagne, France. Crisp minerality, brioche nuances, exquisite effervescence.',
    available: true,
    prepTimeMinutes: 5,
    imageUrl: '/src/assets/images/vintage_champagne_bucket_1791013587416.jpg'
  },
  {
    id: 'menu-8',
    name: 'Château Margaux Premier Grand Cru 2015',
    category: 'Vintage Cellar',
    price: 890,
    description: 'Bordeaux, France. Intense blackberry, violet, tobacco leaf, velvety silky tannins.',
    available: true,
    prepTimeMinutes: 10,
    imageUrl: '/src/assets/images/vintage_champagne_bucket_1791013587416.jpg'
  },
  {
    id: 'menu-9',
    name: 'Golden Smoked Old Fashioned',
    category: 'Vintage Cellar',
    price: 32,
    description: 'Yamazaki 12yr Japanese whisky, artisan bitters, smoked oakwood cloche, 24k edible gold leaf.',
    available: true,
    prepTimeMinutes: 8,
    imageUrl: '/src/assets/images/vintage_smoked_cocktail_1791012884144.jpg'
  },
  {
    id: 'menu-11',
    name: 'Golden Sovereign Orchid Elixir',
    category: 'Vintage Cellar',
    price: 28,
    description: 'Clarified passionfruit puree, botanical gin, champagne float, edible orchid flower & gold dust.',
    available: true,
    prepTimeMinutes: 6,
    imageUrl: '/src/assets/images/tropical_signature_cocktail_1791013599000.jpg'
  },

  // Desserts
  {
    id: 'menu-10',
    name: 'Valrhona Grand Cru Dark Chocolate Sphere',
    category: 'Desserts',
    price: 36,
    description: 'Molten salted caramel poured table-side, Madagascar vanilla bean gelato, hazelnut crumble.',
    available: true,
    prepTimeMinutes: 10,
    allergens: ['Dairy', 'Nuts', 'Gluten'],
    imageUrl: '/src/assets/images/luxury_chocolate_dessert_1791012893463.jpg'
  }
];

export const INITIAL_ORDERS: RestaurantOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'KOT-2041',
    tableNumber: 'Table 7 (Veranda)',
    isRoomService: false,
    items: [
      { menuItemId: 'menu-1', name: 'A5 Miyazaki Wagyu Ribeye', price: 185, quantity: 2, notes: 'Medium rare, extra truffle butter' },
      { menuItemId: 'menu-7', name: 'Dom Pérignon Vintage 2013 Brut', price: 360, quantity: 1 }
    ],
    subtotal: 730,
    tax: 109.50,
    serviceCharge: 73.00,
    totalAmount: 912.50,
    status: 'Kitchen In Progress',
    createdAt: '18:42',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ord-102',
    orderNumber: 'KOT-2042',
    isRoomService: true,
    roomNumber: '401',
    guestName: 'Lord Alistair Sterling',
    items: [
      { menuItemId: 'menu-3', name: 'Handcrafted Truffle Tagliolini', price: 68, quantity: 2 },
      { menuItemId: 'menu-10', name: 'Valrhona Grand Cru Dark Chocolate Sphere', price: 36, quantity: 2 }
    ],
    subtotal: 208,
    tax: 31.20,
    serviceCharge: 20.80,
    totalAmount: 260.00,
    status: 'Ready to Serve',
    createdAt: '19:10',
    paymentMethod: 'Room Charge',
    billedToRoomId: 'room-401'
  },
  {
    id: 'ord-103',
    orderNumber: 'KOT-2043',
    tableNumber: 'Table 3 (Main Hall)',
    isRoomService: false,
    items: [
      { menuItemId: 'menu-2', name: 'Pan-Seared Brittany Turbot', price: 110, quantity: 1 },
      { menuItemId: 'menu-9', name: 'Golden Smoked Old Fashioned', price: 32, quantity: 2 }
    ],
    subtotal: 174,
    tax: 26.10,
    serviceCharge: 17.40,
    totalAmount: 217.50,
    status: 'Pending',
    createdAt: '19:25'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'A5 Miyazaki Wagyu Ribeye Loin',
    category: 'Meat & Seafood',
    currentStock: 4.8,
    unit: 'kg',
    minThreshold: 8.0,
    costPerUnit: 140,
    supplier: 'Kobe Gourmet Imports',
    supplierContact: 'orders@kobegourmet.jp',
    lastRestocked: '2026-09-28',
    status: 'Critical'
  },
  {
    id: 'inv-2',
    name: 'Fresh Black Norcia Truffles',
    category: 'Dairy & Produce',
    currentStock: 350,
    unit: 'grams',
    minThreshold: 500,
    costPerUnit: 1.8,
    supplier: 'Umbria Tartufi SpA',
    supplierContact: '+39 075 923 100',
    lastRestocked: '2026-09-29',
    status: 'Low Stock'
  },
  {
    id: 'inv-3',
    name: 'Dom Pérignon Champagne 2013',
    category: 'Beverages & Wine',
    currentStock: 14,
    unit: 'bottles',
    minThreshold: 20,
    costPerUnit: 210,
    supplier: 'Moët Hennessy Grand Cru Dist.',
    supplierContact: 'orders-vip@mhd.com',
    lastRestocked: '2026-09-25',
    status: 'Low Stock'
  },
  {
    id: 'inv-4',
    name: 'Royal Ossetra Caviar (50g tins)',
    category: 'Meat & Seafood',
    currentStock: 18,
    unit: 'tins',
    minThreshold: 10,
    costPerUnit: 95,
    supplier: 'Petrossian Paris',
    supplierContact: 'concierge-sales@petrossian.fr',
    lastRestocked: '2026-09-30',
    status: 'In Stock'
  },
  {
    id: 'inv-5',
    name: 'Egyptian Cotton Bed Linen Sets (1000 TC)',
    category: 'Linens',
    currentStock: 85,
    unit: 'sets',
    minThreshold: 40,
    costPerUnit: 120,
    supplier: 'Frette Luxury Hospitality',
    supplierContact: 'hospitality@frette.it',
    lastRestocked: '2026-09-15',
    status: 'In Stock'
  },
  {
    id: 'inv-6',
    name: 'Acqua di Parma Room Amenities Sets',
    category: 'Hotel Amenities',
    currentStock: 110,
    unit: 'kits',
    minThreshold: 60,
    costPerUnit: 18,
    supplier: 'Acqua di Parma Corporate',
    supplierContact: 'b2b@acquadiparma.it',
    lastRestocked: '2026-09-20',
    status: 'In Stock'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Julian Montgomery',
    role: 'General Manager',
    department: 'Executive Management',
    email: 'j.montgomery@goldenhotel.com',
    phone: '+1 555 401 2290',
    avatarColor: 'bg-amber-600',
    shift: 'Morning (07:00-15:30)',
    clockedIn: true,
    monthlySalary: 12500,
    performanceScore: 98,
    activeTasks: 4
  },
  {
    id: 'staff-2',
    name: 'Seraphina Dupont',
    role: 'Front Office Lead',
    department: 'Front Office',
    email: 's.dupont@goldenhotel.com',
    phone: '+1 555 401 2291',
    avatarColor: 'bg-indigo-600',
    shift: 'Morning (07:00-15:30)',
    clockedIn: true,
    monthlySalary: 5400,
    performanceScore: 96,
    activeTasks: 6
  },
  {
    id: 'staff-3',
    name: 'Chef Antoine Laurent',
    role: 'Executive Chef',
    department: 'Food & Beverage',
    email: 'chef.antoine@goldenhotel.com',
    phone: '+1 555 401 2294',
    avatarColor: 'bg-emerald-600',
    shift: 'Evening (15:00-23:30)',
    clockedIn: true,
    monthlySalary: 8200,
    performanceScore: 94,
    activeTasks: 8
  },
  {
    id: 'staff-4',
    name: 'Beatriz Morales',
    role: 'Housekeeping Director',
    department: 'Housekeeping',
    email: 'b.morales@goldenhotel.com',
    phone: '+1 555 401 2297',
    avatarColor: 'bg-purple-600',
    shift: 'Morning (07:00-15:30)',
    clockedIn: true,
    monthlySalary: 4800,
    performanceScore: 92,
    activeTasks: 5
  },
  {
    id: 'staff-5',
    name: 'Harrison Sterling-Cole',
    role: 'Chief Financial Controller',
    department: 'Finance',
    email: 'h.sterling@goldenhotel.com',
    phone: '+1 555 401 2299',
    avatarColor: 'bg-cyan-600',
    shift: 'Morning (07:00-15:30)',
    clockedIn: true,
    monthlySalary: 9100,
    performanceScore: 97,
    activeTasks: 3
  }
];

export const INITIAL_SHIFTS: ShiftSchedule[] = [
  { id: 'sh-1', staffId: 'staff-1', staffName: 'Julian Montgomery', department: 'Executive Management', dayOfWeek: 'Monday', shift: 'Morning' },
  { id: 'sh-2', staffId: 'staff-1', staffName: 'Julian Montgomery', department: 'Executive Management', dayOfWeek: 'Tuesday', shift: 'Morning' },
  { id: 'sh-3', staffId: 'staff-1', staffName: 'Julian Montgomery', department: 'Executive Management', dayOfWeek: 'Wednesday', shift: 'Morning' },
  { id: 'sh-4', staffId: 'staff-2', staffName: 'Seraphina Dupont', department: 'Front Office', dayOfWeek: 'Monday', shift: 'Morning' },
  { id: 'sh-5', staffId: 'staff-2', staffName: 'Seraphina Dupont', department: 'Front Office', dayOfWeek: 'Tuesday', shift: 'Morning' },
  { id: 'sh-6', staffId: 'staff-3', staffName: 'Chef Antoine Laurent', department: 'Food & Beverage', dayOfWeek: 'Monday', shift: 'Evening' },
  { id: 'sh-7', staffId: 'staff-3', staffName: 'Chef Antoine Laurent', department: 'Food & Beverage', dayOfWeek: 'Tuesday', shift: 'Evening' },
  { id: 'sh-8', staffId: 'staff-4', staffName: 'Beatriz Morales', department: 'Housekeeping', dayOfWeek: 'Monday', shift: 'Morning' },
  { id: 'sh-9', staffId: 'staff-5', staffName: 'Harrison Sterling-Cole', department: 'Finance', dayOfWeek: 'Monday', shift: 'Morning' }
];

export const INITIAL_DYNAMIC_PRICING: DynamicPricingSuggestion[] = [
  {
    id: 'pr-1',
    roomCategory: 'Presidential Suite',
    currentRate: 1250,
    suggestedRate: 1480,
    adjustmentPercent: 18.4,
    reason: 'High demand for upcoming International Diplomatic Summit. 88% market occupancy within a 5-mile luxury comp set.',
    confidence: 94,
    projectedRevenueIncrease: 4600,
    status: 'Pending Approval'
  },
  {
    id: 'pr-2',
    roomCategory: 'Deluxe Ocean King',
    currentRate: 420,
    suggestedRate: 475,
    adjustmentPercent: 13.1,
    reason: 'Weekend coastal tourism surge. Only 3 ocean units remaining unallocated.',
    confidence: 91,
    projectedRevenueIncrease: 2200,
    status: 'Pending Approval'
  },
  {
    id: 'pr-3',
    roomCategory: 'Classic Deluxe',
    currentRate: 320,
    suggestedRate: 345,
    adjustmentPercent: 7.8,
    reason: 'Optimizing weekday corporate pace. Competitors increased base rate by 10%.',
    confidence: 88,
    projectedRevenueIncrease: 1250,
    status: 'Pending Approval'
  }
];

export const INITIAL_INSIGHTS: OperationalInsight[] = [
  {
    id: 'ins-1',
    type: 'Occupancy',
    title: 'Surge Occupancy Weekend Approaching (96% Projected)',
    description: '19 room arrivals scheduled for Friday afternoon. Recommend pre-authorizing keys and staggering check-in welcoming flutes in the lounge.',
    severity: 'Warning',
    suggestedAction: 'Deploy 2 extra Front Desk ambassadors between 14:00 - 18:00',
    impactMetric: '+14% faster check-in velocity',
    timestamp: '10 mins ago'
  },
  {
    id: 'ins-2',
    type: 'Revenue',
    title: 'RevPAR Outperforming Luxury Benchmark by $42',
    description: 'Current RevPAR of $318.50 is 15.2% higher than quarterly comp set. Driven by premium Penthouse upsells.',
    severity: 'Success',
    suggestedAction: 'Apply recommended dynamic pricing surge to capture an extra $8,050',
    impactMetric: '+$8,050 net yield',
    timestamp: '25 mins ago'
  },
  {
    id: 'ins-3',
    type: 'Kitchen',
    title: 'Wagyu Ribeye Loin Below Safety Buffer',
    description: 'Current inventory is 4.8 kg against weekend banquet forecast of 14 kg. Expedited replenishment PO draft prepared.',
    severity: 'Urgent',
    suggestedAction: 'Approve Kobe Gourmet express delivery PO #8892',
    impactMetric: 'Zero menu stockouts',
    timestamp: '42 mins ago'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-8801',
    invoiceNumber: 'INV-2026-8801',
    reservationId: 'res-001',
    guestName: 'Lord Alistair Sterling',
    roomNumber: '401',
    issueDate: '2026-10-02',
    dueDate: '2026-10-06',
    items: [
      { id: 'i-1', date: '2026-10-01', description: 'Presidential Suite (5 Nights)', category: 'Room', amount: 6250, paid: false },
      { id: 'i-2', date: '2026-10-01', description: 'Champagne & Caviar Welcome', category: 'Restaurant', amount: 480, paid: false },
      { id: 'i-3', date: '2026-10-02', description: 'Imperial Spa Treatment', category: 'Spa', amount: 420, paid: false }
    ],
    subtotal: 7150,
    taxAmount: 1072.50, // 15% VAT
    serviceCharge: 715.00, // 10%
    totalAmount: 8937.50,
    paymentMethod: 'Chapa',
    paymentReference: 'CHP-TX-9901429402',
    status: 'Outstanding'
  },
  {
    id: 'inv-8802',
    invoiceNumber: 'INV-2026-8802',
    reservationId: 'res-002',
    guestName: 'Dr. Elena Rostova',
    roomNumber: '301',
    issueDate: '2026-10-01',
    dueDate: '2026-10-04',
    items: [
      { id: 'i-4', date: '2026-10-01', description: 'Executive Suite (3 Nights)', category: 'Room', amount: 1740, paid: true },
      { id: 'i-5', date: '2026-10-02', description: 'In-Room Dining: Prime Wagyu', category: 'Restaurant', amount: 145, paid: true }
    ],
    subtotal: 1885,
    taxAmount: 282.75,
    serviceCharge: 188.50,
    totalAmount: 2356.25,
    paymentMethod: 'Visa/Mastercard',
    paymentReference: 'VSA-AUTH-44129',
    status: 'Paid'
  }
];
