import { MapPin, Search, ShoppingBasket, Sparkles } from 'lucide-react';

export default function Header({ table, query, onQueryChange, cartCount, onOpenCart }) {
  const tableNumber = Number.isInteger(table.table_number)
    ? `Bàn ${String(table.table_number).padStart(2, '0')}`
    : `Mã bàn ${table.table_id}`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-300 bg-[#FFFAF5]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="grid h-11 w-11 min-w-[44px] shrink-0 place-items-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200">
            <ShoppingBasket aria-hidden="true" size={21} />
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate font-bold leading-tight text-slate-900">Robot Restaurant</p>
            <span className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-800">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
              Đặt món trực tuyến
            </span>
          </div>
        </div>

        <label className="relative flex min-w-0 flex-[2]">
          <span className="sr-only">Tìm kiếm món ăn</span>
          <Search aria-hidden="true" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700" />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} type="search" placeholder="Tìm món ăn..." className="h-11 min-h-[44px] w-full rounded-full border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition-transform duration-150 placeholder:text-slate-600 focus:border-red-600 focus:ring-4 focus:ring-red-100" />
        </label>

        <div className="hidden min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 sm:flex" title={table.table_id}>
          <MapPin aria-hidden="true" size={15} className="text-red-600" />
          {tableNumber}
        </div>
        <button type="button" onClick={onOpenCart} aria-label={`Mở giỏ hàng, ${cartCount} món`} className="relative grid h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 cursor-pointer place-items-center rounded-full bg-slate-900 text-white transition-transform duration-150 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 active:scale-95">
          <ShoppingBasket aria-hidden="true" size={19} />
          {cartCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-amber-600 px-1.5 py-0.5 text-center text-[11px] font-bold text-white">{cartCount}</span>}
        </button>
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 pb-2 text-xs font-semibold text-slate-700 sm:hidden">
        <Sparkles aria-hidden="true" size={13} className="text-amber-600" />
        <span>Đặt món trực tuyến</span><span className="text-slate-700">·</span><span>{tableNumber}</span>
      </div>
    </header>
  );
}