import { Check, Minus, Plus, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatVnd } from '../mockData';

export default function DishCard({ dish, quantity, onAdd, onDecrease }) {
  const unavailable = !dish.is_available;
  return (
    <motion.article layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: unavailable ? 0.58 : 1, y: 0 }} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-float">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={dish.image_url} alt={dish.dish_name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-red-600 shadow-sm">{dish.category}</span>
        {unavailable && <span className="absolute inset-0 grid place-items-center bg-slate-900/70 text-sm font-bold text-white">Tạm hết</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold leading-snug text-slate-900 sm:text-base">{dish.dish_name}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4"><strong className="text-sm font-bold text-red-600 sm:text-base">{formatVnd(dish.price)}</strong>
          {unavailable ? <span className="flex items-center gap-1 text-xs font-semibold text-slate-800"><Utensils size={14} aria-hidden="true" /> Hết món</span> : quantity > 0 ? <div className="flex items-center gap-1 rounded-full bg-red-50 p-1"><button type="button" onClick={() => onDecrease(dish.dish_id)} aria-label={`Giảm ${dish.dish_name}`} className="grid h-11 min-h-[44px] w-11 min-w-[44px] cursor-pointer place-items-center rounded-full bg-white text-red-600 transition-transform duration-150 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600 active:scale-95"><Minus size={16} /></button><span className="min-w-6 text-center text-sm font-bold text-slate-900">{quantity}</span><button type="button" onClick={() => onAdd(dish)} aria-label={`Thêm ${dish.dish_name}`} className="grid h-11 min-h-[44px] w-11 min-w-[44px] cursor-pointer place-items-center rounded-full bg-red-600 text-white transition-transform duration-150 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 active:scale-95"><Plus size={16} /></button></div> : <button type="button" onClick={() => onAdd(dish)} aria-label={`Thêm ${dish.dish_name} vào giỏ`} className="grid h-11 min-h-[44px] w-11 min-w-[44px] cursor-pointer place-items-center rounded-xl bg-red-50 text-red-600 transition-transform duration-150 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-100 active:scale-95"><Plus size={19} /></button>}
        </div>
        {quantity > 0 && !unavailable && <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-800"><Check size={13} aria-hidden="true" /> Đã chọn</p>}
      </div>
    </motion.article>
  );
}