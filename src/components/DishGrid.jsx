import DishCard from './DishCard';

export default function DishGrid({ dishes, cart, onAdd, onDecrease }) {
  if (!dishes.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-800">Không tìm thấy món phù hợp. Hãy thử từ khóa khác.</div>;
  return <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{dishes.map((dish) => <DishCard key={dish.dish_id} dish={dish} quantity={cart[dish.dish_id]?.quantity || 0} onAdd={onAdd} onDecrease={onDecrease} />)}</div>;
}