import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'
import './PatientDetail.css'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { patients, orders } = useStore()
  const patient = patients.find(p => p.id === id)
  if (!patient) return <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-gray-400)' }}>Patient not found.</div>

  const patientOrders = orders.filter(o => o.patientId === id)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate('/patients')} className="patient-detail-back"><ArrowLeft size={14} /> Back to Patients</button>

      <div className="patient-detail-hero">
        <div className="avatar avatar-lg avatar-accent">
          {patient.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <h1>{patient.name}</h1>
          <p className="id-dob">{patient.id} — DOB: {patient.dob} (Age {patient.age})</p>
          <p className="diagnosis">{patient.diagnosis}</p>
          <div className="patient-detail-contacts">
            <span><Phone size={11} /> {patient.phone}</span>
            <span><MapPin size={11} /> {patient.clinic}</span>
          </div>
        </div>
        <Link to="/orders/new" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
          <Plus size={13} /> New Order
        </Link>
      </div>

      <h2 className="patient-detail-orders-title">Order History ({patientOrders.length})</h2>
      {patientOrders.length > 0 ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {patientOrders.map(o => (
                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
                  <td className="cell-primary">{o.id}</td>
                  <td>{o.product}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="cell-muted">{new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="cell-muted">{new Date(o.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="patient-detail-empty">No orders yet.</div>
      )}
    </motion.div>
  )
}
