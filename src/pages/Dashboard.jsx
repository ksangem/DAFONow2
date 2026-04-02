import { Link, useNavigate } from 'react-router-dom'
import { Plus, ArrowRight, Clock, ShoppingCart, FileEdit, Truck, Users, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import TrackingTimeline from '../components/TrackingTimeline'

export default function Dashboard() {
  const { orders, drafts, patients, setSearchOpen } = useStore()
  const navigate = useNavigate()
  const active = orders.filter(o => o.status !== 'delivered')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Dashboard</h1>
          <p className="text-13 text-text-secondary">Good morning, Dr. Lin — here's your overview.</p>
        </div>
        <Link to="/orders/new" className="flex items-center gap-1.5 px-4 py-2 bg-dafo-blue text-white rounded font-semibold text-13 hover:bg-dafo-blue-light transition-colors">
          <Plus size={15} /> New Order
        </Link>
      </div>

      {/* Stats — McMaster dense row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: ShoppingCart, label: 'Active Orders', value: active.length, sub: '2 this week', color: 'text-dafo-blue', bg: 'bg-dafo-blue-50' },
          { icon: FileEdit, label: 'Drafts', value: drafts.length, sub: '1 ready to submit', color: 'text-amber-600', bg: 'bg-accent-light' },
          { icon: Truck, label: 'In Transit', value: orders.filter(o => o.status === 'shipped').length, sub: 'ETA: Mar 28', color: 'text-info', bg: 'bg-info/10' },
          { icon: Users, label: 'Patients', value: patients.length, sub: `${patients.filter(p => p.orders > 3).length} repeat`, color: 'text-purple', bg: 'bg-purple/10' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-border rounded p-3 flex gap-3 items-start">
            <div className={`w-8 h-8 rounded flex items-center justify-center ${s.bg} ${s.color} shrink-0`}>
              <s.icon size={16} />
            </div>
            <div>
              <div className="text-11 font-medium uppercase tracking-wide text-text-muted">{s.label}</div>
              <div className="text-xl font-bold text-text-dark leading-tight">{s.value}</div>
              <div className="text-11 text-text-muted">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid dash-grid gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Resume drafts */}
          {drafts.length > 0 && (
            <div className="bg-white border border-border rounded">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <h2 className="text-13 font-bold text-text-dark flex items-center gap-1.5"><FileEdit size={14} /> Resume Drafts</h2>
                <Link to="/drafts" className="text-12 text-dafo-blue font-medium flex items-center gap-0.5">All <ArrowRight size={12} /></Link>
              </div>
              <div className="divide-y divide-border/50">
                {drafts.map(d => (
                  <button
                    key={d.id}
                    onClick={() => navigate('/orders/new')}
                    className="flex items-center gap-3 px-3 py-2 w-full text-left hover:bg-dafo-blue-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-13 font-medium text-text-dark">{d.patient}</div>
                      <div className="text-12 text-text-muted">{d.product || 'Product not selected'} — Step {d.step}/5</div>
                    </div>
                    <div className="w-100 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-success-light rounded-full" style={{ width: `${d.progress}%` }} />
                      </div>
                      <span className="text-11 text-text-muted w-7 text-right">{d.progress}%</span>
                    </div>
                    <div className="text-11 text-text-muted flex items-center gap-1 whitespace-nowrap">
                      <Clock size={10} />
                      {new Date(d.lastEdited).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <ArrowRight size={14} className="text-border" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders table — McMaster-dense */}
          <div className="bg-white border border-border rounded">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <h2 className="text-13 font-bold text-text-dark flex items-center gap-1.5"><ShoppingCart size={14} /> Recent Orders</h2>
              <Link to="/orders" className="text-12 text-dafo-blue font-medium flex items-center gap-0.5">All Orders <ArrowRight size={12} /></Link>
            </div>
            <table className="w-full text-13">
              <thead>
                <tr className="bg-background text-11 uppercase tracking-wide text-text-muted font-semibold">
                  <th className="text-left px-3 py-1.5">Order / Job</th>
                  <th className="text-left px-3 py-1.5">Patient</th>
                  <th className="text-left px-3 py-1.5">Product</th>
                  <th className="text-left px-3 py-1.5">Status</th>
                  <th className="text-left px-3 py-1.5">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="hover:bg-dafo-blue-50 cursor-pointer transition-colors">
                    <td className="px-3 py-1.5">
                      <div className="font-medium text-text-dark">{o.id}</div>
                      <div className="text-11 text-text-muted">{o.jobNumber}</div>
                    </td>
                    <td className="px-3 py-1.5 text-text-primary">{o.patient}</td>
                    <td className="px-3 py-1.5 font-medium text-text-dark">{o.product}</td>
                    <td className="px-3 py-1.5"><StatusBadge status={o.status} /></td>
                    <td className="px-3 py-1.5 text-text-muted text-12">{new Date(o.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Tracking */}
          <div className="bg-white border border-border rounded">
            <div className="px-3 py-2 border-b border-border">
              <h2 className="text-13 font-bold text-text-dark flex items-center gap-1.5"><Truck size={14} /> Active Tracking</h2>
            </div>
            <div className="divide-y divide-border/50">
              {active.slice(0, 2).map(o => (
                <div key={o.id} className="px-3 py-2.5 cursor-pointer hover:bg-dafo-blue-50 transition-colors" onClick={() => navigate(`/orders/${o.id}`)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-13 font-medium text-text-dark">{o.id}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="text-12 text-text-muted mb-2">{o.patient} — {o.product}</div>
                  <TrackingTimeline currentStatus={o.status} compact />
                </div>
              ))}
            </div>
            <Link to="/tracking" className="block text-center py-2 text-12 text-dafo-blue font-medium border-t border-border hover:bg-dafo-blue-50 transition-colors">
              View All Tracking
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-border rounded p-3">
            <h2 className="text-13 font-bold text-text-dark mb-2">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Plus, label: 'New Order', to: '/orders/new' },
                { icon: Package, label: 'Find Order', action: () => setSearchOpen(true) },
                { icon: Users, label: 'Patients', to: '/patients' },
                { icon: FileEdit, label: 'Drafts', to: '/drafts' },
              ].map((a, i) => (
                a.to ? (
                  <Link key={i} to={a.to} className="flex flex-col items-center gap-1 py-2.5 rounded bg-background hover:bg-dafo-blue-50 text-text-primary hover:text-dafo-blue transition-colors">
                    <a.icon size={16} />
                    <span className="text-12 font-medium">{a.label}</span>
                  </Link>
                ) : (
                  <button key={i} onClick={a.action} className="flex flex-col items-center gap-1 py-2.5 rounded bg-background hover:bg-dafo-blue-50 text-text-primary hover:text-dafo-blue transition-colors">
                    <a.icon size={16} />
                    <span className="text-12 font-medium">{a.label}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
