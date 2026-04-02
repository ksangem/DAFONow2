import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'

export default function Patients() {
  const { patients } = useStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = search
    ? patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase()))
    : patients

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Patients</h1>
          <p className="text-12 text-text-secondary">{patients.length} patients on file</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-dafo-blue text-white rounded font-semibold text-13 hover:bg-dafo-blue-light transition-colors">
          <Plus size={14} /> Add Patient
        </button>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-border rounded text-13 w-260 mb-3">
        <Search size={13} className="text-text-muted" />
        <input className="flex-1 outline-none bg-transparent text-text-primary" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-white border border-border rounded overflow-hidden">
        <table className="w-full text-13">
          <thead>
            <tr className="bg-background text-11 uppercase tracking-wide text-text-muted font-semibold border-b border-border">
              <th className="text-left px-3 py-1.5">Patient</th>
              <th className="text-left px-3 py-1.5">ID</th>
              <th className="text-left px-3 py-1.5">DOB / Age</th>
              <th className="text-left px-3 py-1.5">Diagnosis</th>
              <th className="text-left px-3 py-1.5">Orders</th>
              <th className="text-left px-3 py-1.5">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map(p => (
              <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)} className="hover:bg-dafo-blue-50 cursor-pointer transition-colors">
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent-light text-amber-700 flex items-center justify-center text-11 font-bold shrink-0">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-text-dark">{p.name}</span>
                  </div>
                </td>
                <td className="px-3 py-1.5 text-text-muted">{p.id}</td>
                <td className="px-3 py-1.5"><span>{p.dob}</span><span className="text-11 text-text-muted ml-1">(Age {p.age})</span></td>
                <td className="px-3 py-1.5 text-12 max-w-180 truncate">{p.diagnosis}</td>
                <td className="px-3 py-1.5 font-semibold">{p.orders}</td>
                <td className="px-3 py-1.5 text-text-muted text-12">{new Date(p.lastOrder).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
