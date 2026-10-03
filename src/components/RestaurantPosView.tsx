import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  Sparkles, 
  Search, 
  Flame, 
  Send,
  Check,
  Heart
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { MenuItem, OrderItem, OrderStatus, InventoryItem } from '../types';

export const RestaurantPosView: React.FC = () => {
  const { 
    menuItems, 
    orders, 
    inventory, 
    reservations, 
    createOrder, 
    updateOrderStatus, 
    restockInventory,
    favorites,
    toggleFavorite,
    isFavorite
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'pos' | 'kot' | 'inventory' | 'ai-demand'>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchMenu, setSearchMenu] = useState<string>('');

  // Cart state
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isRoomService, setIsRoomService] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<string>('Table 7 (Veranda)');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('401');
  const [paymentMethod, setPaymentMethod] = useState<'Room Charge' | 'Chapa' | 'Credit Card' | 'Cash'>('Room Charge');
  const [orderPlacedFeedback, setOrderPlacedFeedback] = useState<string | null>(null);

  // Restock modal state
  const [restockTarget, setRestockTarget] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(5);

  const categories = ['All', 'Favorites', 'Steaks & Seafood', 'Fine Dining', 'Breakfast', 'Vintage Cellar', 'Desserts'];

  const filteredMenuItems = menuItems.filter(item => {
    if (selectedCategory === 'Favorites' && !isFavorite(item.id)) return false;
    if (selectedCategory !== 'All' && selectedCategory !== 'Favorites' && item.category !== selectedCategory) return false;
    if (searchMenu) {
      return item.name.toLowerCase().includes(searchMenu.toLowerCase()) || 
             item.description.toLowerCase().includes(searchMenu.toLowerCase());
    }
    return true;
  });

  const checkedInReservations = reservations.filter(r => r.status === 'Checked In');

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === menuItemId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map(i => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.menuItemId !== menuItemId);
    });
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15;
  const serviceCharge = subtotal * 0.10;
  const totalAmount = subtotal + tax + serviceCharge;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const guestInRoom = checkedInReservations.find(r => r.roomNumber === selectedRoomNumber);

    const newOrder = createOrder({
      tableNumber: isRoomService ? undefined : selectedTable,
      isRoomService,
      roomNumber: isRoomService ? selectedRoomNumber : undefined,
      guestName: isRoomService ? (guestInRoom?.guest.name || 'In-House Guest') : undefined,
      items: [...cart],
      subtotal,
      tax,
      serviceCharge,
      totalAmount,
      status: 'Pending',
      paymentMethod,
      billedToRoomId: isRoomService ? guestInRoom?.roomId : undefined
    });

    setOrderPlacedFeedback(`Fired ${newOrder.orderNumber}! Total: $${totalAmount.toFixed(2)}${isRoomService ? ` billed to Room ${selectedRoomNumber}` : ''}`);
    setTimeout(() => setOrderPlacedFeedback(null), 4000);
    clearCart();
  };

  const handleRestockSubmit = () => {
    if (!restockTarget) return;
    restockInventory(restockTarget.id, restockAmount);
    setRestockTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e5e0d6]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b46a36]">
            FINE DINING & BEVERAGE
          </span>
          <h1 className="text-3xl font-serif-luxury font-bold text-[#18332f] mt-0.5">
            Restaurant POS & Kitchen Operations
          </h1>
          <p className="text-xs text-[#5f6a65] mt-1">
            Gourmet Dining · Room Service Folio Posting · Live KOT Dispatch · Inventory Control
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e5e0d6] rounded-full shadow-xs">
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'pos' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            Digital POS
          </button>
          <button
            onClick={() => setActiveTab('kot')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kot' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            <span>Live KOT Board</span>
            {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Paid').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#b46a36] text-white font-bold text-[9px] flex items-center justify-center">
                {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Paid').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inventory' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            <span>Stock & Suppliers</span>
            {inventory.filter(i => i.status === 'Critical').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('ai-demand')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'ai-demand' 
                ? 'bg-[#18332f] text-white shadow-xs' 
                : 'text-[#5f6a65] hover:text-[#18332f]'
            }`}
          >
            AI Demand Forecast
          </button>
        </div>
      </div>

      {orderPlacedFeedback && (
        <div className="p-3.5 bg-[#f4efe6] border border-[#b46a36]/40 rounded-2xl text-xs text-[#18332f] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#18332f]" />
            <span className="font-medium">{orderPlacedFeedback}</span>
          </div>
          <button onClick={() => setOrderPlacedFeedback(null)} className="text-[#5f6a65] hover:text-[#18332f] text-xs font-medium cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW 1: DIGITAL POS TERMINAL */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Menu Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#88938c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gourmet menu items, wines, cocktails..."
                  value={searchMenu}
                  onChange={(e) => setSearchMenu(e.target.value)}
                  className="w-full bg-white border border-[#e5e0d6] rounded-full pl-10 pr-4 py-2 text-xs text-[#18332f] placeholder-[#88938c] focus:outline-none focus:border-[#18332f] shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-[#18332f] text-white shadow-xs'
                        : 'bg-white border border-[#e5e0d6] text-[#5f6a65] hover:text-[#18332f]'
                    }`}
                  >
                    {cat === 'Favorites' && (
                      <Heart className={`w-3.5 h-3.5 ${selectedCategory === 'Favorites' ? 'fill-rose-400 text-rose-400' : 'text-rose-500'}`} />
                    )}
                    <span>{cat}</span>
                    {cat === 'Favorites' && (
                      <span className="text-[10px] opacity-75 font-mono">({menuItems.filter(m => isFavorite(m.id)).length})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Cards matching Aurelia luxury style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[640px] overflow-y-auto pr-1">
              {filteredMenuItems.map((item) => {
                const inCart = cart.find(c => c.menuItemId === item.id);
                const isFav = isFavorite(item.id);

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white border border-[#e5e0d6] hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                  >
                    {/* Item Image with Category Badge */}
                    {item.imageUrl && (
                      <div className="relative h-44 w-full overflow-hidden bg-[#f0ece3]">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-semibold text-[#18332f] shadow-xs">
                          {item.category}
                        </span>
                        {/* Interactive Favorite Icon Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id, item.name);
                          }}
                          aria-label={isFav ? "Remove dish from favorites" : "Add dish to favorites"}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer z-10 ${
                            isFav
                              ? 'bg-rose-500 text-white scale-105 hover:bg-rose-600'
                              : 'bg-white/90 text-[#5f6a65] hover:text-rose-500 hover:bg-white hover:scale-105'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white stroke-white' : 'stroke-current'}`} />
                        </button>
                        <span className="absolute bottom-3 right-3 font-serif-luxury text-white font-bold text-base px-3 py-1 rounded-full bg-black/60 backdrop-blur-md">
                          ${item.price}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-serif-luxury font-bold text-base text-[#18332f] group-hover:text-[#b46a36] transition-colors">
                            {item.name}
                          </h3>
                          {!item.imageUrl && (
                            <span className="font-serif-luxury text-[#18332f] font-bold text-base shrink-0">
                              ${item.price}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5f6a65] leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#f0ece3] flex items-center justify-between">
                        <div className="text-[11px] text-[#88938c] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#b46a36]" />
                          <span>{item.prepTimeMinutes}m prep</span>
                        </div>

                        {inCart ? (
                          <div className="flex items-center gap-2 bg-[#f8f6f1] border border-[#e5e0d6] rounded-full p-1">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-6 h-6 rounded-full bg-white hover:bg-[#e5e0d6] flex items-center justify-center text-[#18332f] text-xs cursor-pointer shadow-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-bold text-xs text-[#18332f] w-4 text-center">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-6 h-6 rounded-full bg-[#18332f] hover:bg-[#112421] flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-1.5 rounded-full border border-[#18332f] text-[#18332f] hover:bg-[#18332f] hover:text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add to Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Active Order Cart & Folio Destination */}
          <div className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#b46a36]" />
                  <h2 className="text-base font-serif-luxury font-bold text-[#18332f]">
                    Active F&B Order
                  </h2>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Destination selector: Table vs Room Service */}
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRoomService(false)}
                    className={`py-2 px-3 rounded-full border text-xs font-semibold text-center transition-colors cursor-pointer ${
                      !isRoomService
                        ? 'bg-[#18332f] border-[#18332f] text-white shadow-xs'
                        : 'bg-[#f8f6f1] border-[#e5e0d6] text-[#5f6a65]'
                    }`}
                  >
                    Dine-In Table
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRoomService(true);
                      setPaymentMethod('Room Charge');
                    }}
                    className={`py-2 px-3 rounded-full border text-xs font-semibold text-center transition-colors cursor-pointer ${
                      isRoomService
                        ? 'bg-[#18332f] border-[#18332f] text-white shadow-xs'
                        : 'bg-[#f8f6f1] border-[#e5e0d6] text-[#5f6a65]'
                    }`}
                  >
                    Room Service Folio
                  </button>
                </div>

                {!isRoomService ? (
                  <div>
                    <label className="text-[#5f6a65] text-[11px] font-medium block mb-1">Select Table / Lounge</label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3 py-2 text-xs text-[#18332f] focus:outline-none"
                    >
                      <option value="Table 1 (Main Hall)">Table 1 (Main Hall)</option>
                      <option value="Table 3 (Main Hall)">Table 3 (Main Hall)</option>
                      <option value="Table 7 (Veranda)">Table 7 (Veranda - Sunset View)</option>
                      <option value="Table 12 (Private Salon)">Table 12 (Private Wine Salon)</option>
                      <option value="Poolside Cabana 4">Poolside Cabana 4</option>
                      <option value="Rooftop Cigar Lounge">Rooftop Cigar Lounge</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-[#5f6a65] text-[11px] font-medium block mb-1">Select In-House Suite</label>
                    <select
                      value={selectedRoomNumber}
                      onChange={(e) => setSelectedRoomNumber(e.target.value)}
                      className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3 py-2 text-xs text-[#18332f] focus:outline-none"
                    >
                      {checkedInReservations.map(r => (
                        <option key={r.id} value={r.roomNumber}>
                          Suite {r.roomNumber} - {r.guest.name} ({r.roomCategory})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-2 max-h-52 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#88938c]">
                    No items added yet. Click "+ Add to Order" from the menu.
                  </div>
                ) : (
                  cart.map((item) => {
                    const menuItem = menuItems.find(m => m.id === item.menuItemId);
                    return (
                      <div key={item.menuItemId} className="p-2.5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6] text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {menuItem?.imageUrl && (
                            <img
                              src={menuItem.imageUrl}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#e5e0d6]"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-[#18332f] truncate">{item.name}</div>
                            <div className="text-[10px] text-[#88938c]">${item.price} each</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[#18332f] font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-1 bg-white border border-[#e5e0d6] rounded-full p-0.5">
                            <button
                              onClick={() => removeFromCart(item.menuItemId)}
                              className="w-5 h-5 rounded-full hover:bg-[#f6f4ee] flex items-center justify-center text-[#18332f] text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs w-3 text-center text-[#18332f] font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(menuItems.find(m => m.id === item.menuItemId)!)}
                              className="w-5 h-5 rounded-full bg-[#18332f] hover:bg-[#112421] flex items-center justify-center text-white text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Calculations & Settlement */}
            <div className="space-y-3 pt-3 border-t border-[#f0ece3] text-xs">
              <div className="space-y-1 text-[#5f6a65]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-[#18332f] font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%):</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Luxury Hospitality Svc (10%):</span>
                  <span className="font-mono">${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#18332f] font-bold text-base pt-1 border-t border-[#f0ece3]">
                  <span>Total Due:</span>
                  <span className="font-mono text-[#18332f] font-serif-luxury text-lg">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment selector */}
              <div>
                <label className="text-[11px] text-[#5f6a65] font-medium block mb-1">Billing Destination</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Room Charge', 'Chapa', 'Credit Card', 'Cash'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-1.5 px-2 rounded-full border text-[11px] font-semibold transition-colors cursor-pointer ${
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

              <button
                disabled={cart.length === 0}
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-full bg-[#18332f] hover:bg-[#112421] disabled:bg-[#f0ece3] disabled:text-[#88938c] text-white font-semibold text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Fire KOT Ticket & Settle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: LIVE KOT KANBAN BOARD */}
      {activeTab === 'kot' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#e5e0d6] flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#b46a36]" />
              <span className="font-semibold text-[#18332f]">Kitchen Display System (KDS) Live Stream</span>
            </div>
            <span className="text-[#5f6a65]">
              Orders automatically sync with room folios and reduce restaurant inventory.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['Pending', 'Kitchen In Progress', 'Ready to Serve', 'Delivered'] as OrderStatus[]).map((statusCol) => {
              const colOrders = orders.filter(o => o.status === statusCol);

              return (
                <div key={statusCol} className="p-5 rounded-3xl bg-white border border-[#e5e0d6] shadow-xs flex flex-col justify-between min-h-[450px]">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#f0ece3]">
                      <span className={`text-xs font-bold tracking-wider uppercase ${
                        statusCol === 'Pending' ? 'text-[#b46a36]' :
                        statusCol === 'Kitchen In Progress' ? 'text-sky-700' :
                        statusCol === 'Ready to Serve' ? 'text-[#18332f]' : 'text-[#88938c]'
                      }`}>
                        {statusCol}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8f6f1] border border-[#e5e0d6] text-[#18332f] font-semibold">
                        {colOrders.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {colOrders.map((ord) => (
                        <div key={ord.id} className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6] text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[#b46a36]">{ord.orderNumber}</span>
                            <span className="text-[10px] text-[#88938c]">{ord.createdAt}</span>
                          </div>

                          <div className="text-[11px] font-bold text-[#18332f]">
                            {ord.isRoomService ? `Suite ${ord.roomNumber} (${ord.guestName})` : ord.tableNumber}
                          </div>

                          <div className="space-y-1 text-[#5f6a65] text-[11px] border-t border-[#e5e0d6] pt-1.5">
                            {ord.items.map((i, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{i.quantity}x {i.name}</span>
                                <span className="font-mono text-[#18332f]">${(i.price * i.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-[#e5e0d6] flex items-center justify-between">
                            <span className="font-mono font-bold text-[#18332f]">${ord.totalAmount.toFixed(2)}</span>

                            {statusCol === 'Pending' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Kitchen In Progress')}
                                className="px-3 py-1 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-[10px] font-semibold cursor-pointer shadow-xs"
                              >
                                Start Cooking
                              </button>
                            )}
                            {statusCol === 'Kitchen In Progress' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Ready to Serve')}
                                className="px-3 py-1 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-[10px] font-semibold cursor-pointer shadow-xs"
                              >
                                Mark Ready
                              </button>
                            )}
                            {statusCol === 'Ready to Serve' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                                className="px-3 py-1 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-semibold cursor-pointer shadow-xs"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: INVENTORY & STOCK MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ece3]">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-[#18332f]">
                Hospitality & Kitchen Stock Management
              </h2>
              <p className="text-xs text-[#5f6a65]">Real-time depletion tracking, supplier contacts and 1-click PO restock</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-rose-700 font-semibold">
                {inventory.filter(i => i.status === 'Critical').length} Critical Stockouts
              </span>
              <span className="text-[#c7bfb1]">·</span>
              <span className="text-[#b46a36] font-semibold">
                {inventory.filter(i => i.status === 'Low Stock').length} Low Stock Warnings
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f6f1] text-[#5f6a65] uppercase tracking-wider font-semibold border-b border-[#e5e0d6] text-[10px]">
                <tr>
                  <th className="py-3 px-4">Item & Category</th>
                  <th className="py-3 px-4">Current Stock / Min Buffer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4">Supplier Record</th>
                  <th className="py-3 px-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece3] text-[#18332f]">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbf9f5] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#18332f]">{item.name}</div>
                      <div className="text-[10px] text-[#88938c]">{item.category}</div>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span className={`font-bold ${item.status === 'Critical' ? 'text-rose-700' : item.status === 'Low Stock' ? 'text-[#b46a36]' : 'text-[#18332f]'}`}>
                        {item.currentStock} {item.unit}
                      </span>
                      <span className="text-[#88938c] text-[10px] block">Min: {item.minThreshold} {item.unit}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                        item.status === 'In Stock' ? 'text-[#18332f] border-[#18332f]/20 bg-[#18332f]/10' :
                        item.status === 'Low Stock' ? 'text-[#b46a36] border-[#b46a36]/30 bg-[#b46a36]/10' :
                        'text-rose-700 border-rose-300 bg-rose-50 animate-pulse'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium">${item.costPerUnit}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#18332f]">{item.supplier}</div>
                      <div className="text-[10px] text-[#88938c]">{item.supplierContact}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          setRestockTarget(item);
                          setRestockAmount(item.unit === 'kg' ? 5 : item.unit === 'bottles' ? 12 : 20);
                        }}
                        className="px-3.5 py-1.5 border border-[#18332f] text-[#18332f] hover:bg-[#18332f] hover:text-white rounded-full text-xs font-semibold cursor-pointer transition-colors"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: AI DEMAND & INVENTORY FORECAST */}
      {activeTab === 'ai-demand' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f0ece3]">
            <div className="p-2.5 rounded-full bg-[#b46a36]/10 text-[#b46a36]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-[#18332f]">
                AI Culinary Demand & Kitchen Waste Reduction Model
              </h2>
              <p className="text-xs text-[#5f6a65]">
                Predictive order volume based on upcoming guest reservations and room occupancy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6] space-y-2">
              <span className="text-xs text-[#88938c] block uppercase tracking-wider font-semibold">Weekend Covers Forecast</span>
              <span className="text-3xl font-bold font-serif-luxury text-[#18332f]">184 Covers</span>
              <p className="text-xs text-[#5f6a65]">
                Expected 38% increase over weekday dining velocity. Wagyu Ribeye & Brittany Turbot drive 62% of main course orders.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6] space-y-2">
              <span className="text-xs text-[#88938c] block uppercase tracking-wider font-semibold">Food Waste Reduction Yield</span>
              <span className="text-3xl font-bold font-serif-luxury text-[#18332f]">-22.4% Spoilage</span>
              <p className="text-xs text-[#5f6a65]">
                Automated par-level reordering prevented $3,450 in over-ordered dairy and seasonal produce this month.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbf9f5] border border-[#e5e0d6] space-y-2">
              <span className="text-xs text-[#88938c] block uppercase tracking-wider font-semibold">Vintage Cellar Allocation</span>
              <span className="text-3xl font-bold font-serif-luxury text-[#b46a36]">19 Dom Pérignon</span>
              <p className="text-xs text-[#5f6a65]">
                5 confirmed VIP suites have requested champagne on arrival. Recommend chilling 12 bottles prior to 14:00 Friday.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RESTOCK MODAL */}
      {restockTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e0d6] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece3]">
              <h3 className="text-xl font-serif-luxury font-bold text-[#18332f]">
                Restock Inventory Item
              </h3>
              <button onClick={() => setRestockTarget(null)} className="text-[#88938c] hover:text-[#18332f] cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#f8f6f1] rounded-2xl border border-[#e5e0d6] text-xs space-y-1.5">
              <div className="font-bold text-[#18332f] text-sm">{restockTarget.name}</div>
              <div className="text-[#5f6a65]">Supplier: {restockTarget.supplier} ({restockTarget.supplierContact})</div>
              <div className="text-[#5f6a65]">Current Stock: <span className="text-[#b46a36] font-mono font-bold">{restockTarget.currentStock} {restockTarget.unit}</span></div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-[#5f6a65] font-medium block">Quantity to Add ({restockTarget.unit}):</label>
              <input
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(Number(e.target.value))}
                className="w-full bg-[#f8f6f1] border border-[#e5e0d6] rounded-xl px-3.5 py-2.5 text-[#18332f] font-mono"
              />
              <span className="text-[11px] text-[#88938c] block mt-1">
                Estimated PO Total: ${(restockAmount * restockTarget.costPerUnit).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0ece3]">
              <button
                onClick={() => setRestockTarget(null)}
                className="px-5 py-2 rounded-full border border-[#e5e0d6] text-[#5f6a65] hover:bg-[#f6f4ee] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRestockSubmit}
                className="px-6 py-2 rounded-full bg-[#18332f] hover:bg-[#112421] text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                Authorize PO & Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
