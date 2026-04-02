import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, User, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import TrackingTimeline from '../components/TrackingTimeline'
import './OrderDetail.css'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, patients } = useStore()
  const order = orders.find(o => o.id === id)
  if (!order) return <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-gray-400)' }}>Order {id} not found.</div>

  const patient = patients.find(p => p.id === order.patientId)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate('/orders')} className="order-detail-back">
        <ArrowLeft size={14} /> Back to Orders
      </button>

      <div className="order-detail-header">
        <h1>{order.id}</h1>
        <StatusBadge status={order.status} />
        {order.priority === 'rush' && <span className="priority-rush">Rush</span>}
        <span className="order-detail-meta">Job #{order.jobNumber} — {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <div className="grid detail-grid gap-4">
        <div className="gap-stack-4">
          {/* Tracking */}
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ fontSize: 'var(--font-size-13)', fontWeight: 700, color: 'var(--color-gray-800)', marginBottom: 16 }}>Order Tracking</h2>
            <TrackingTimeline currentStatus={order.status} />
            {order.tracking && (
              <div className="order-tracking-info">
                <span className="label">Tracking:</span>
                <span className="value">{order.tracking}</span>
                <button className="copy-btn"><Copy size={12} /></button>
              </div>
            )}
          </div>
          {/* Specs */}
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ fontSize: 'var(--font-size-13)', fontWeight: 700, color: 'var(--color-gray-800)', marginBottom: 12 }}>Specifications</h2>
            <div className="order-spec-tags">
              {order.customizations.map((c, i) => (
                <span key={i} className="order-spec-tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="gap-stack-3">
          {/* Patient */}
          <div className="card" style={{ padding: 12 }}>
            <h3 style={{ fontSize: 'var(--font-size-12)', fontWeight: 600, color: 'var(--color-gray-800)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><User size={13} /> Patient</h3>
            {patient && (
              <div className="order-patient-row">
                <div className="avatar avatar-md avatar-accent">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="order-patient-info">
                  <div className="name">{patient.name}</div>
                  <div className="sub">{patient.id} — DOB: {patient.dob}</div>
                  <div className="sub">{patient.diagnosis}</div>
                </div>
              </div>
            )}
          </div>
          {/* Product */}
          <div className="card" style={{ padding: 12 }}>
            <h3 style={{ fontSize: 'var(--font-size-12)', fontWeight: 600, color: 'var(--color-gray-800)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}><Package size={13} /> Product</h3>
            <div className="order-product-row">
              <div className="order-product-icon"><Package size={18} /></div>
              <div>
                <div className="order-product-name">{order.product}</div>
                <div className="order-product-eta">ETA: {new Date(order.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          </div>
          <div className="order-help-card">
            <h3>Need help?</h3>
            <p>Contact Cascade Dafo support.</p>
            <button>Contact Support</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
