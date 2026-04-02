import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import './Orders.css'

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
      <div className="orders-top">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} total — {orders.filter(o => o.status !== 'delivered').length} active</p>
        </div>
        <Link to="/orders/new" className="btn btn-primary">
          <Plus size={14} /> New Order
        </Link>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-input" style={{ width: 240 }}>
          <Search size={13} />
          <input placeholder="Filter orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-pills">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={'filter-pill' + (filter === f ? ' active' : '')}
            >
              {filterLabels[f]}
              {f !== 'all' && <span className="count">{orders.filter(o => o.status === f).length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Dense table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order / Job</th>
              <th>Patient</th>
              <th>Product</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Ordered</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
                <td>
                  <div className="cell-primary">{o.id}</div>
                  <div className="cell-secondary">{o.jobNumber}</div>
                </td>
                <td>{o.patient}</td>
                <td className="cell-primary">{o.product}</td>
                <td><StatusBadge status={o.status} /></td>
                <td>
                  {o.priority === 'rush'
                    ? <span className="priority-rush">Rush</span>
                    : <span className="cell-muted">Standard</span>
                  }
                </td>
                <td className="cell-muted">{new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td className="cell-muted">{new Date(o.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
