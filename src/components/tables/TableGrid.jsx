import { Armchair, Broom as Brush, CheckCircle as CheckCircle2, Clock, UsersThree as UsersRound } from '@phosphor-icons/react'
import { tables } from '../../mock/mockData'

const states = { EMPTY: { label: 'Trống', icon: CheckCircle2, tone: 'empty' }, OCCUPIED: { label: 'Đang dùng', icon: UsersRound, tone: 'occupied' }, RESERVED: { label: 'Đã đặt', icon: Clock, tone: 'reserved' }, CLEANING: { label: 'Đang dọn', icon: Brush, tone: 'cleaning' } }
export default function TableGrid({ onSelect }) {
  return <div className="table-grid">{tables.map((table) => { const state = states[table.status]; const Icon = state.icon; return <button className={`table-tile ${state.tone}`} onClick={() => onSelect(table)} key={table.table_id}><div className="table-tile-top"><span className="table-number">{table.table_number}</span><Icon size={17} /></div><Armchair className="table-chair" size={34} /><strong>{state.label}</strong><span className="mono">{table.qr_id}</span></button> })}</div>
}
