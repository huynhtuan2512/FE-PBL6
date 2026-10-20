import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getTableFromUrl } from './mockData';
import { createOrder, getCategories, getMenu, getTableStatus } from './services/restaurantApi';
import Header from './components/Header';
import Banner from './components/Banner';
import CategoryScroll from './components/CategoryScroll';
import DishGrid from './components/DishGrid';
import FloatingCart from './components/FloatingCart';
import CartModal from './components/CartModal';
import CustomerOrderTracking from './components/CustomerOrderTracking';

export default function App() {
  const [tableId] = useState(() => getTableFromUrl().table_id);
  const [table, setTable] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState('');
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState(['Tất cả']);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [note, setNote] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const trackingStorageKey = `restaurant:last-order:${tableId}`;
  const [trackedOrderId, setTrackedOrderId] = useState(
    () => window.localStorage.getItem(trackingStorageKey) || '',
  );

  useEffect(() => {
    const controller = new AbortController();
    getTableStatus(tableId, controller.signal)
      .then((value) => {
        setTable(value);
        setTableError('');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setTable(null);
          setTableError(error.message || 'Không tìm thấy bàn.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setTableLoading(false)
      });

    return () => controller.abort();
  }, [tableId]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getMenu(controller.signal), getCategories(controller.signal)])
      .then(([menu, categoryList]) => {
        const categoryNames = new Map(categoryList.map((category) => [category.category_id, category.category_name]));
        setDishes(menu.map((dish) => ({
          ...dish,
          category: categoryNames.get(dish.category_id) || 'Khác',
        })));
        setCategories(['Tất cả', ...categoryList.map((category) => category.category_name)]);
        setMenuError('');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setMenuError(error.message || 'Không thể tải thực đơn.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setMenuLoading(false)
      });

    return () => controller.abort();
  }, []);

  const filteredDishes = useMemo(() => dishes.filter((dish) => {
    const matchesCategory = activeCategory === 'Tất cả' || dish.category === activeCategory;
    const matchesQuery = dish.dish_name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  }), [activeCategory, query]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tableCanOrder = table && ['EMPTY', 'OCCUPIED'].includes(table.status);
  const tableStatusText = {
    EMPTY: 'Bàn trống · sẵn sàng nhận món',
    OCCUPIED: 'Bàn đang sử dụng · có thể gọi thêm món',
    RESERVED: 'Bàn đã được đặt · hiện chưa thể gọi món',
    CLEANING: 'Bàn đang được dọn · hiện chưa thể gọi món',
  }[table?.status] ?? table?.status;

  const rememberTrackedOrder = useCallback((orderId) => {
    setTrackedOrderId(orderId);
    window.localStorage.setItem(trackingStorageKey, orderId);
  }, [trackingStorageKey]);

  const addToCart = (dish) => setCart((current) => ({
    ...current,
    [dish.dish_id]: { ...dish, quantity: (current[dish.dish_id]?.quantity || 0) + 1 },
  }));

  const decreaseFromCart = (dishId) => setCart((current) => {
    const item = current[dishId];
    if (!item || item.quantity <= 1) {
      const next = { ...current };
      delete next[dishId];
      return next;
    }
    return { ...current, [dishId]: { ...item, quantity: item.quantity - 1 } };
  });

  const removeFromCart = (dishId) => setCart((current) => {
    const next = { ...current };
    delete next[dishId];
    return next;
  });

  const confirmOrder = async () => {
    if (!tableCanOrder) {
      setOrderError('Bàn này hiện không thể nhận đơn mới.')
      return
    }
    setSubmitting(true);
    setOrderError('');
    try {
      const order = await createOrder({
        table_id: table.table_id,
        items: cartItems.map((item) => ({
          dish_id: item.dish_id,
          quantity: item.quantity,
          notes: note.trim() || null,
        })),
      });
      setConfirmedOrder(order);
      rememberTrackedOrder(order.order_id);
      setCart({});
      setNote('');
    } catch (error) {
      setOrderError(error.message || 'Không thể gửi đơn hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const closeModal = () => {
    setIsCartOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] text-slate-900">
      <Header table={table ?? { table_id: tableId, table_number: null }} query={query} onQueryChange={setQuery} cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 pb-32 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <Banner />
        {tableLoading && <p role="status" className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">Đang xác minh bàn {tableId}...</p>}
        {!tableLoading && tableError && (
          <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-bold">Không thể đặt món vì mã bàn không hợp lệ.</p>
            <p className="mt-1">{tableError}</p>
            <p className="mt-1">Hãy quét lại mã QR tại bàn hoặc liên hệ nhân viên.</p>
          </div>
        )}
        {table && (
          <div className={`mt-5 rounded-2xl border p-4 text-sm font-semibold ${
            tableCanOrder ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}>
            Bàn {String(table.table_number).padStart(2, '0')} · {tableStatusText}
          </div>
        )}
        {menuLoading && <p role="status" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">Đang tải thực đơn...</p>}
        {menuError && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p className="font-bold">Không thể tải thực đơn từ máy chủ.</p><p className="mt-1">{menuError}</p><button type="button" onClick={() => window.location.reload()} className="mt-3 min-h-[44px] rounded-full bg-red-600 px-4 py-2 font-bold text-white">Thử lại</button></div>}
        <CustomerOrderTracking
          tableId={tableId}
          initialOrderId={trackedOrderId}
          dishes={dishes}
          onOrderFound={rememberTrackedOrder}
        />
        <section className="mt-8" aria-labelledby="category-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-red-600">Khám phá vị ngon</p>
              <h2 id="category-title" className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">Danh mục món ăn</h2>
            </div>
            <span className="text-sm font-semibold text-slate-800">{filteredDishes.length} món</span>
          </div>
          <CategoryScroll categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </section>
        <section id="menu" className="mt-7" aria-labelledby="menu-title">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="menu-title" className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Món được yêu thích</h2>
            {(query || activeCategory !== 'Tất cả') && (
              <button type="button" onClick={() => { setQuery(''); setActiveCategory('Tất cả'); }} className="min-h-[44px] min-w-[44px] cursor-pointer px-2 text-sm font-bold text-red-600 transition-transform duration-150 hover:underline focus:outline-none focus:ring-4 focus:ring-red-100 active:scale-95">
                Xóa bộ lọc
              </button>
            )}
          </div>
          <DishGrid dishes={filteredDishes} cart={cart} onAdd={addToCart} onDecrease={decreaseFromCart} />
        </section>
      </main>
      <AnimatePresence>{cartCount > 0 && <FloatingCart count={cartCount} total={cartTotal} onOpen={() => setIsCartOpen(true)} />}</AnimatePresence>
      <CartModal open={isCartOpen} cartItems={cartItems} total={cartTotal} note={note} table={table ?? { table_id: tableId, table_number: null }} confirmedOrder={confirmedOrder} submitting={submitting} orderError={orderError} orderDisabled={!tableCanOrder || tableLoading} onClose={closeModal} onViewOrder={() => { closeModal(); document.getElementById('order-tracking')?.scrollIntoView({ behavior: 'smooth' }) }} onAdd={addToCart} onDecrease={decreaseFromCart} onRemove={removeFromCart} onNoteChange={setNote} onConfirm={confirmOrder} />
      <footer className="pb-8 text-center text-xs font-semibold text-slate-800">Restaurant · {tableId} · Sẵn sàng phục vụ</footer>
    </div>
  );
}
