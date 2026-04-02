import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import StatusBadge from '../components/StatusBadge'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { patients, orders } = useStore()
  const patient = patients.find(p => p.id === id)
  if (!patient) return <div className="p-8 text-center text-text-muted">Patient not found.</div>

  const patientOrders = orders.filter(o => o.patientId === id)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate('/patients')} className="flex items-center gap-1 text-13 text-dafo-blue font-medium mb-3 hover:underline"><ArrowLeft size={14} /> Back to Patients</button>

      <div className="flex items-start gap-4 bg-white border border-border rounded p-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-accent-light text-amber-700 flex items-center justify-center text-lg font-bold shrink-0">
          {patient.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-text-dark">{patient.name}</h1>
          <p className="text-12 text-text-muted">{patient.id} — DOB: {patient.dob} (Age {patient.age})</p>
          <p className="text-13 font-medium text-text-primary mt-0.5">{patient.diagnosis}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-12 text-text-muted flex items-center gap-1"><Phone size={11} /> {patient.phone}</span>
            <span className="text-12 text-text-muted flex items-center gap-1"><MapPin size={11} /> {patient.clinic}</span>
          </div>
        </div>
        <Link to="/orders/new" className="flex items-center gap-1 px-3 py-1.5 bg-dafo-blue text-white rounded font-semibold text-12 hover:bg-dafo-blue-light shrink-0">
          <Plus size={13} /> New Order
        </Link>
      </div>

      <h2 className="text-13 font-bold text-text-dark mb-2">Order History ({patientOrders.length})</h2>
      {patientOrders.length > 0 ? (
        <div className="bg-white border border-border rounded overflow-hidden">
          <table className="w-full text-13">
            <thead><tr className="bg-background text-11 uppercase tracking-wide text-text-muted font-semibold border-b border-border">
              <th className="text-left px-3 py-1.5">Order</th><th className="text-left px-3 py-1.5">Product</th><th className="text-left px-3 py-1.5">Status</th><th className="text-left px-3 py-1.5">Date</th><th className="text-left px-3 py-1.5">ETA</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {patientOrders.map(o => (
                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="hover:bg-dafo-blue-50 cursor-pointer transition-colors">
                  <td className="px-3 py-1.5 font-semibold text-text-dark">{o.id}</td>
                  <td className="px-3 py-1.5">{o.product}</td>
                  <td className="px-3 py-1.5"><StatusBadge status={o.status} /></td>
                  <td className="px-3 py-1.5 text-text-muted text-12">{new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="px-3 py-1.5 text-text-muted text-12">{new Date(o.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-border rounded p-8 text-center text-text-muted text-13">No orders yet.</div>
      )}
    </motion.div>
  )
}
