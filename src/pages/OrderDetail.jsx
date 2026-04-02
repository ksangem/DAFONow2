import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, User, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import TrackingTimeline from '../components/TrackingTimeline'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, patients } = useStore()
  const order = orders.find(o => o.id === id)
  if (!order) return <div className="p-8 text-center text-text-muted">Order {id} not found.</div>

  const patient = patients.find(p => p.id === order.patientId)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate('/orders')} className="flex items-center gap-1 text-13 text-dafo-blue font-medium mb-3 hover:underline">
        <ArrowLeft size={14} /> Back to Orders
      </button>

      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-bold text-text-dark">{order.id}</h1>
        <StatusBadge status={order.status} />
        {order.priority === 'rush' && <span className="text-11 font-semibold px-1.5 py-0.5 rounded bg-error-light text-error">Rush</span>}
        <span className="text-12 text-text-muted">Job #{order.jobNumber} — {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <div className="grid detail-grid gap-4">
        <div className="space-y-4">
          {/* Tracking */}
          <div className="bg-white border border-border rounded p-4">
            <h2 className="text-13 font-bold text-text-dark mb-4">Order Tracking</h2>
            <TrackingTimeline currentStatus={order.status} />
            {order.tracking && (
              <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-background rounded text-12">
                <span className="text-text-muted">Tracking:</span>
                <span className="font-semibold text-text-dark">{order.tracking}</span>
                <button className="text-dafo-blue hover:underline ml-1"><Copy size={12} /></button>
              </div>
            )}
          </div>
          {/* Specs */}
          <div className="bg-white border border-border rounded p-4">
            <h2 className="text-13 font-bold text-text-dark mb-3">Specifications</h2>
            <div className="flex flex-wrap gap-1.5">
              {order.customizations.map((c, i) => (
                <span key={i} className="px-2 py-0.5 bg-background border border-border rounded text-12 text-text-primary">{c}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {/* Patient */}
          <div className="bg-white border border-border rounded p-3">
            <h3 className="text-12 font-bold text-text-dark flex items-center gap-1.5 mb-2"><User size={13} /> Patient</h3>
            {patient && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-light text-amber-700 flex items-center justify-center text-11 font-bold shrink-0">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-13 font-semibold text-text-dark">{patient.name}</div>
                  <div className="text-11 text-text-muted">{patient.id} — DOB: {patient.dob}</div>
                  <div className="text-11 text-text-muted">{patient.diagnosis}</div>
                </div>
              </div>
            )}
          </div>
          {/* Product */}
          <div className="bg-white border border-border rounded p-3">
            <h3 className="text-12 font-bold text-text-dark flex items-center gap-1.5 mb-2"><Package size={13} /> Product</h3>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded bg-dafo-blue-50 text-dafo-blue flex items-center justify-center"><Package size={18} /></div>
              <div>
                <div className="text-13 font-semibold text-text-dark">{order.product}</div>
                <div className="text-11 text-text-muted">ETA: {new Date(order.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          </div>
          <div className="bg-dafo-blue-50 border border-dafo-blue-100 rounded p-3">
            <h3 className="text-12 font-semibold text-text-dark mb-1">Need help?</h3>
            <p className="text-11 text-text-muted mb-2">Contact Cascade Dafo support.</p>
            <button className="w-full py-1.5 text-12 font-semibold border border-border rounded bg-white hover:bg-background transition-colors">Contact Support</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
