export const formatVND = (amount) => `${new Intl.NumberFormat('vi-VN').format(amount ?? 0)}đ`

export const formatClock = (iso) => {
  const date = iso ? new Date(iso) : new Date()
  return Number.isNaN(date.getTime()) ? '--:--:--' : date.toLocaleTimeString('vi-VN', { hour12: false })
}

export const minutesSince = (iso) => {
  const diff = Date.now() - new Date(iso).getTime()
  return Number.isFinite(diff) ? Math.max(0, Math.floor(diff / 60000)) : 0
}
