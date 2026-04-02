import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import TrackingTimeline from '../components/TrackingTimeline'

export default function Tracking() {
  const { orders } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('active')

  const active = orders.filter(o => o.status !== 'delivered')
  const delivered = orders.filter(o => o.status === 'delivered')
  const displayed = tab === 'active' ? active : delivered

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-3">
        <h1 className="text-xl font-bold text-text-dark">Order Tracking</h1>
        <p className="text-12 text-text-secondary">Real-time status for all orders</p>
      </div>

      <div className="flex gap-0 border-b border-border mb-4">
        {[
          { key: 'active', label: `Active (${active.length})` },
          { key: 'delivered', label: `Delivered (${delivered.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-13 font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? 'border-dafo-blue text-dafo-blue' : 'border-transparent text-text-muted hover:text-text-primary'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayed.map(o => (
          <div key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="bg-white border border-border rounded p-3 cursor-pointer hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded bg-dafo-blue-50 text-dafo-blue flex items-center justify-center shrink-0"><Package size={16} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-13 font-bold text-text-dark">{o.id}</span>
                  <StatusBadge status={o.status} />
                  {o.priority === 'rush' && <span className="text-11 font-semibold px-1.5 py-0.5 rounded bg-error-light text-error">Rush</span>}
                </div>
                <div className="text-12 text-text-muted">{o.patient} — {o.product} — {o.jobNumber}</div>
                <div className="text-11 text-text-muted">ETA: {new Date(o.eta).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <TrackingTimeline currentStatus={o.status} compact />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
