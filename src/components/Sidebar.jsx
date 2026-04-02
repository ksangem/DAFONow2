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
    <aside className="fixed top-0 left-0 sidebar-w h-screen bg-dafo-blue flex flex-col z-50">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-12">D</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">DAFONow</div>
            <div className="text-white/40 text-11 leading-tight">Cascade Dafo</div>
          </div>
        </div>
      </div>

      {/* New Order */}
      <div className="px-3 pt-3 pb-1">
        <NavLink
          to="/orders/new"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded bg-accent text-white font-semibold text-13 hover:bg-amber-500 transition-colors"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Order
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2">
        <ul className="flex flex-col gap-0.5">
          {nav.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-1.5 rounded text-13 font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                  }`
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.badgeKey === 'drafts' && drafts.length > 0 && (
                  <span className="ml-auto bg-accent text-white text-11 font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {drafts.length}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/15 text-white text-11 font-bold flex items-center justify-center shrink-0">
            RL
          </div>
          <div className="min-w-0">
            <div className="text-white text-12 font-semibold truncate">Dr. Rebecca Lin</div>
            <div className="text-white/40 text-11 truncate">Portland Pediatric</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
