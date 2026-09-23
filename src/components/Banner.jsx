import { ArrowDown, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Banner() {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative isolate overflow-hidden rounded-[2rem] bg-red-700 px-6 py-8 text-white shadow-float sm:px-10 sm:py-10">
      <div className="relative z-10 max-w-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-100">Phục vụ bằng cả sự tận tâm</p>
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">Bữa ngon đến bàn,<br /><span className="text-amber-200">robot lo ngay.</span></h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-red-50 sm:text-base">Chọn món yêu thích, bếp bắt tay chuẩn bị. Robot sẽ mang món nóng hổi đến tận bàn của bạn.</p>
        <a href="#menu" className="mt-6 inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-red-600 transition-transform duration-150 hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-white/50 active:scale-95">Xem thực đơn <ArrowDown aria-hidden="true" size={16} className="text-red-600" /></a>
      </div>
      <Bot aria-hidden="true" size={180} strokeWidth={1} className="absolute -bottom-8 -right-4 hidden text-red-300/40 sm:block" />
      <div aria-hidden="true" className="absolute -right-28 -top-28 -z-10 h-72 w-72 rounded-full bg-red-500/45" />
    </motion.section>
  );
}