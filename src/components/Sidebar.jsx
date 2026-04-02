import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Users, FileEdit, Truck, HelpCircle, Plus } from 'lucide-react'
import useStore from '../store/useStore'

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
    <aside className="fixed top-0 left-0 sidebar-w h-screen flex flex-col z-50 overflow-y-auto" style={{ backgroundColor: '#00338E' }}>
      {/* Logo */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <span className="text-white font-bold text-12">D</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">DAFONow</div>
            <div className="text-11 leading-tight" style={{ color: 'rgba(255,255,255,0.4)' }}>Cascade Dafo</div>
          </div>
        </div>
      </div>

      {/* New Order */}
      <div className="px-3 pt-3 pb-1">
        <NavLink
          to="/orders/new"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded bg-accent text-white font-semibold text-13 transition-colors"
          style={{ backgroundColor: '#F7943E' }}
        >
          <Plus size={15} strokeWidth={2.5} />
          New Order
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        <ul className="flex flex-col gap-0.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {nav.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => 'sidebar-nav-link' + (isActive ? ' sidebar-nav-active' : '')}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.badgeKey === 'drafts' && drafts.length > 0 && (
                  <span className="sidebar-draft-badge">
                    {drafts.length}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full text-white text-11 font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            RL
          </div>
          <div className="min-w-0">
            <div className="text-white text-12 font-semibold truncate">Dr. Rebecca Lin</div>
            <div className="text-11 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>Portland Pediatric</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
