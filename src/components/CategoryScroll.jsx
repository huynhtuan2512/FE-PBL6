export default function CategoryScroll({ categories, activeCategory, onSelect }) {
  return (
    <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Danh mục món ăn">
      {categories.map((category) => {
        const selected = category === activeCategory;
        return <button key={category} type="button" role="tab" aria-selected={selected} onClick={() => onSelect(category)} className={`min-h-[44px] min-w-[44px] shrink-0 cursor-pointer rounded-full px-5 text-sm font-bold transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-red-100 active:scale-95 ${selected ? 'bg-slate-900 text-white hover:bg-slate-800' : 'border border-slate-300 bg-white text-slate-800 hover:border-red-600 hover:text-red-600'}`}>{category}</button>;
      })}
    </div>
  );
}