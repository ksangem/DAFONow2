import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'

const filters = ['all', 'submitted', 'review', 'manufacturing', 'shipped', 'delivered']
const filterLabels = { all: 'All', submitted: 'Submitted', review: 'In Review', manufacturing: 'Mfg', shipped: 'Shipped', delivered: 'Delivered' }

export default function Orders() {
  const { orders } = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return o.id.toLowerCase().includes(q) || o.jobNumber.toLowerCase().includes(q) || o.patient.toLowerCase().includes(q) || o.product.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Orders</h1>
          <p className="text-12 text-text-secondary">{orders.length} total — {orders.filter(o => o.status !== 'delivered').length} active</p>
        </div>
        <Link to="/orders/new" className="flex items-center gap-1.5 px-3 py-1.5 bg-dafo-blue text-white rounded font-semibold text-13 hover:bg-dafo-blue-light transition-colors">
          <Plus size={14} /> New Order
        </Link>
      </div>

      {/* McMaster-style filter bar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-border rounded text-text-muted text-13 w-[240px]">
          <Search size={13} />
          <input className="flex-1 outline-none bg-transparent text-text-primary" placeholder="Filter orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded text-12 font-medium transition-colors ${
                filter === f ? 'bg-dafo-blue text-white' : 'bg-white border border-border text-text-primary hover:bg-background'
              }`}
            >
              {filterLabels[f]}
              {f !== 'all' && <span className="ml-1 opacity-60">{orders.filter(o => o.status === f).length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Dense table */}
      <div className="bg-white border border-border rounded overflow-hidden">
        <table className="w-full text-13">
          <thead>
            <tr className="bg-background text-11 uppercase tracking-wide text-text-muted font-semibold border-b border-border">
              <th className="text-left px-3 py-1.5">Order / Job</th>
              <th className="text-left px-3 py-1.5">Patient</th>
              <th className="text-left px-3 py-1.5">Product</th>
              <th className="text-left px-3 py-1.5">Status</th>
              <th className="text-left px-3 py-1.5">Priority</th>
              <th className="text-left px-3 py-1.5">Ordered</th>
              <th className="text-left px-3 py-1.5">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map(o => (
              <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="hover:bg-dafo-blue-50 cursor-pointer transition-colors">
                <td className="px-3 py-1.5">
                  <div className="font-semibold text-text-dark">{o.id}</div>
                  <div className="text-11 text-text-muted">{o.jobNumber}</div>
                </td>
                <td className="px-3 py-1.5">{o.patient}</td>
                <td className="px-3 py-1.5 font-medium">{o.product}</td>
                <td className="px-3 py-1.5"><StatusBadge status={o.status} /></td>
                <td className="px-3 py-1.5">
                  {o.priority === 'rush'
                    ? <span className="text-11 font-semibold px-1.5 py-0.5 rounded bg-error-light text-error">Rush</span>
                    : <span className="text-text-muted text-12">Standard</span>
                  }
                </td>
                <td className="px-3 py-1.5 text-text-muted text-12">{new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td className="px-3 py-1.5 text-text-muted text-12">{new Date(o.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
