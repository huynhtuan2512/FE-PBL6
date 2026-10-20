import { List } from '@phosphor-icons/react'
import { Button } from 'antd'
import { useLocation } from 'react-router-dom'

const pageLabels = {
  '/dashboard': 'Tổng quan',
  '/staff': 'Không gian phục vụ',
  '/admin': 'Quản trị hệ thống',
}

export default function Topbar({ onMenu, mobileNav, menuButtonRef }) {
  const { pathname } = useLocation()

  return (
    <header className="topbar">
      <Button
        ref={menuButtonRef}
        className="icon-button menu-button"
        type="text"
        icon={<List size={20} />}
        onClick={onMenu}
        aria-label="Mở menu"
        aria-controls="primary-navigation"
        aria-expanded={mobileNav}
      />
      <div className="topbar-context" aria-label="Vị trí hiện tại">
        <span>ROBO/OPS</span>
        <span aria-hidden="true">/</span>
        <strong>{pageLabels[pathname] ?? 'Không gian vận hành'}</strong>
      </div>
    </header>
  )
}
