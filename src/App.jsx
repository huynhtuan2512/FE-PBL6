import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { categories, dishes, getTableFromUrl } from './mockData';
import Header from './components/Header';
import Banner from './components/Banner';
import CategoryScroll from './components/CategoryScroll';
import DishGrid from './components/DishGrid';
import FloatingCart from './components/FloatingCart';
import CartModal from './components/CartModal';

export default function App() {
  const [table] = useState(getTableFromUrl);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [note, setNote] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const filteredDishes = useMemo(() => dishes.filter((dish) => {
    const matchesCategory = activeCategory === 'Tất cả' || dish.category === activeCategory;
    const matchesQuery = dish.dish_name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  }), [activeCategory, query]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

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

  const confirmOrder = () => {
    const order = {
      order_id: 101,
      table_id: table.table_id,
      total_amount: cartTotal,
      order_status: 'PENDING',
      created_at: '2026-09-23T10:00:00Z',
      order_details: cartItems.map((item, index) => ({
        detail_id: index + 1,
        dish_id: item.dish_id,
        quantity: item.quantity,
        served_status: false,
      })),
    };
    console.log('Robot Restaurant order created:', order, note ? { kitchen_note: note } : '');
    setConfirmedOrder(order);
    setCart({});
    setNote('');
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
      <Header table={table} query={query} onQueryChange={setQuery} cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 pb-32 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <Banner />
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
      <CartModal open={isCartOpen} cartItems={cartItems} total={cartTotal} note={note} table={table} confirmedOrder={confirmedOrder} onClose={closeModal} onAdd={addToCart} onDecrease={decreaseFromCart} onRemove={removeFromCart} onNoteChange={setNote} onConfirm={confirmOrder} />
      <footer className="pb-8 text-center text-xs font-semibold text-slate-800">Robot Restaurant · {table.table_id} · Sẵn sàng phục vụ</footer>
    </div>
  );
}
