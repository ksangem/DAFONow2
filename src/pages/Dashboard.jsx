import { Link, useNavigate } from 'react-router-dom'
import { Plus, ArrowRight, Clock, ShoppingCart, FileEdit, Truck, Users, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import TrackingTimeline from '../components/TrackingTimeline'
import './Dashboard.css'

export default function Dashboard() {
  const { orders, drafts, patients, setSearchOpen } = useStore()
  const navigate = useNavigate()
  const active = orders.filter(o => o.status !== 'delivered')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Top bar */}
      <div className="dash-top-bar">
        <div>
          <h1>Dashboard</h1>
          <p>Good morning, Dr. Lin — here's your overview.</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary">
          <Plus size={15} /> New Order
        </Link>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {[
          { icon: ShoppingCart, label: 'Active Orders', value: active.length, sub: '2 this week', variant: 'blue' },
          { icon: FileEdit, label: 'Drafts', value: drafts.length, sub: '1 ready to submit', variant: 'amber' },
          { icon: Truck, label: 'In Transit', value: orders.filter(o => o.status === 'shipped').length, sub: 'ETA: Mar 28', variant: 'info' },
          { icon: Users, label: 'Patients', value: patients.length, sub: `${patients.filter(p => p.orders > 3).length} repeat`, variant: 'purple' },
        ].map((s, i) => (
          <div key={i} className="dash-stat-card">
            <div className={`dash-stat-icon ${s.variant}`}><s.icon size={16} /></div>
            <div>
              <div className="dash-stat-label">{s.label}</div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid dash-grid gap-4">
        {/* Left column */}
        <div className="gap-stack-4">
          {/* Resume drafts */}
          {drafts.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-header-title"><FileEdit size={14} /> Resume Drafts</h2>
                <Link to="/drafts" className="card-link">All <ArrowRight size={12} /></Link>
              </div>
              <div className="divide-list">
                {drafts.map(d => (
                  <button key={d.id} onClick={() => navigate('/orders/new')} className="dash-draft-row">
                    <div className="dash-draft-info">
                      <div className="dash-draft-name">{d.patient}</div>
                      <div className="dash-draft-sub">{d.product || 'Product not selected'} — Step {d.step}/5</div>
                    </div>
                    <div className="dash-draft-progress">
                      <div className="dash-draft-bar">
                        <div className="dash-draft-bar-fill" style={{ width: `${d.progress}%` }} />
                      </div>
                      <span className="dash-draft-pct">{d.progress}%</span>
                    </div>
                    <div className="dash-draft-date">
                      <Clock size={10} />
                      {new Date(d.lastEdited).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <ArrowRight size={14} className="dash-draft-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders table */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-header-title"><ShoppingCart size={14} /> Recent Orders</h2>
              <Link to="/orders" className="card-link">All Orders <ArrowRight size={12} /></Link>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order / Job</th>
                  <th>Patient</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
                    <td>
                      <div className="cell-primary">{o.id}</div>
                      <div className="cell-secondary">{o.jobNumber}</div>
                    </td>
                    <td>{o.patient}</td>
                    <td className="cell-primary">{o.product}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="cell-muted">{new Date(o.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="gap-stack-4">
          {/* Tracking */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-header-title"><Truck size={14} /> Active Tracking</h2>
            </div>
            <div className="divide-list">
              {active.slice(0, 2).map(o => (
                <div key={o.id} className="dash-tracking-card" onClick={() => navigate(`/orders/${o.id}`)}>
                  <div className="dash-tracking-header">
                    <span>{o.id}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="dash-tracking-sub">{o.patient} — {o.product}</div>
                  <TrackingTimeline currentStatus={o.status} compact />
                </div>
              ))}
            </div>
            <Link to="/tracking" className="dash-view-all">View All Tracking</Link>
          </div>

          {/* Quick actions */}
          <div className="card" style={{ padding: 12 }}>
            <h2 style={{ fontSize: 'var(--font-size-13)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-gray-800)', marginBottom: 8 }}>Quick Actions</h2>
            <div className="dash-quick-actions">
              {[
                { icon: Plus, label: 'New Order', to: '/orders/new' },
                { icon: Package, label: 'Find Order', action: () => setSearchOpen(true) },
                { icon: Users, label: 'Patients', to: '/patients' },
                { icon: FileEdit, label: 'Drafts', to: '/drafts' },
              ].map((a, i) => (
                a.to ? (
                  <Link key={i} to={a.to} className="dash-quick-action">
                    <a.icon size={16} />
                    <span>{a.label}</span>
                  </Link>
                ) : (
                  <button key={i} onClick={a.action} className="dash-quick-action">
                    <a.icon size={16} />
                    <span>{a.label}</span>
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
