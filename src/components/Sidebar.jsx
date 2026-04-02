import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Users, FileEdit, Truck, HelpCircle, Plus } from 'lucide-react'
import useStore from '../store/useStore'
import './Sidebar.css'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/drafts', icon: FileEdit, label: 'Drafts', badgeKey: 'drafts' },
  { to: '/tracking', icon: Truck, label: 'Tracking' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
]

export default function Sidebar() {
  const drafts = useStore(s => s.drafts)

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon">D</div>
          <div>
            <div className="sidebar-logo-text">DAFONow</div>
            <div className="sidebar-logo-sub">Cascade Dafo</div>
          </div>
        </div>
      </div>

      {/* New Order */}
      <div className="sidebar-new-order">
        <NavLink to="/orders/new" className="sidebar-new-order-btn">
          <Plus size={15} strokeWidth={2.5} />
          New Order
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {nav.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => 'sidebar-nav-item' + (isActive ? ' active' : '')}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.badgeKey === 'drafts' && drafts.length > 0 && (
                  <span className="sidebar-draft-badge">{drafts.length}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="sidebar-user">
        <div className="sidebar-user-inner">
          <div className="sidebar-user-avatar">RL</div>
          <div style={{ minWidth: 0 }}>
            <div className="sidebar-user-name">Dr. Rebecca Lin</div>
            <div className="sidebar-user-clinic">Portland Pediatric</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
