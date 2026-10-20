import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { Pulse as Activity, CaretRight, ChefHat, ShieldCheck, SquaresFour, X } from '@phosphor-icons/react'
import { Button } from 'antd'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Tổng quan', icon: SquaresFour, roles: ['ADMIN', 'STAFF'] },
  { to: '/staff', label: 'Không gian phục vụ', icon: ChefHat, roles: ['ADMIN', 'STAFF'] },
  { to: '/admin', label: 'Quản trị hệ thống', icon: ShieldCheck, roles: ['ADMIN'] },
]

export default function Sidebar({ mobileNav, onClose }) {
  const { currentUser, role, logout } = useAuth()
  const navRef = useRef(null)
  const roleLabel = role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'
  const displayName = currentUser.full_name || currentUser.username

  useEffect(() => {
    if (!mobileNav) return undefined
    const timeout = window.setTimeout(() => navRef.current?.querySelector('a')?.focus(), 0)
    return () => window.clearTimeout(timeout)
  }, [mobileNav])

  return (
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`} aria-label="Điều hướng ứng dụng">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true"><Activity size={21} weight="bold" /></div>
        <div>
          <strong>ROBO/OPS</strong>
          <small>Vận hành nhà hàng</small>
        </div>
        <Button
          className="icon-button mobile-close"
          type="text"
          icon={<X size={18} />}
          onClick={onClose}
          aria-label="Đóng menu"
        />
      </div>
      <div className="workspace-label">Khu vực · {roleLabel}</div>
      <nav id="primary-navigation" ref={navRef} className="sidebar-nav" aria-label="Điều hướng chính">
        {links.filter((link) => link.roles.includes(role)).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
            <CaretRight className="nav-arrow" size={15} aria-hidden="true" />
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="user-avatar" aria-hidden="true">{displayName?.charAt(0) || '?'}</div>
        <div className="sidebar-user-copy">
          <strong>{displayName}</strong>
          <small>@{currentUser.username} · {roleLabel}</small>
        </div>
        <Button className="logout-button" type="text" size="small" onClick={logout}>
          Đăng xuất
        </Button>
      </div>
    </aside>
  )
}
