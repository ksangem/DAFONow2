import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import TrackingTimeline from '../components/TrackingTimeline'
import './Tracking.css'

export default function Tracking() {
  const { orders } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('active')

  const active = orders.filter(o => o.status !== 'delivered')
  const delivered = orders.filter(o => o.status === 'delivered')
  const displayed = tab === 'active' ? active : delivered

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="tracking-top">
        <h1>Order Tracking</h1>
        <p>Real-time status for all orders</p>
      </div>

      <div className="tabs">
        {[
          { key: 'active', label: `Active (${active.length})` },
          { key: 'delivered', label: `Delivered (${delivered.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={'tab-btn' + (tab === t.key ? ' active' : '')}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="gap-stack-3">
        {displayed.map(o => (
          <div key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="tracking-card">
            <div className="tracking-card-top">
              <div className="tracking-card-icon"><Package size={16} /></div>
              <div style={{ flex: 1 }}>
                <div className="tracking-card-header">
                  <span className="tracking-card-id">{o.id}</span>
                  <StatusBadge status={o.status} />
                  {o.priority === 'rush' && <span className="priority-rush">Rush</span>}
                </div>
                <div className="tracking-card-sub">{o.patient} — {o.product} — {o.jobNumber}</div>
                <div className="tracking-card-eta">ETA: {new Date(o.eta).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
            <div className="tracking-card-timeline">
              <TrackingTimeline currentStatus={o.status} compact />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
