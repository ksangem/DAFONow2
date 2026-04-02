import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import './Patients.css'

export default function Patients() {
  const { patients } = useStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = search
    ? patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.diagnosis.toLowerCase().includes(search.toLowerCase()))
    : patients

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="patients-top">
        <div>
          <h1>Patients</h1>
          <p>{patients.length} patients on file</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={14} /> Add Patient
        </button>
      </div>

      <div className="search-input" style={{ width: 260, marginBottom: 12 }}>
        <Search size={13} />
        <input placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>ID</th>
              <th>DOB / Age</th>
              <th>Diagnosis</th>
              <th>Orders</th>
              <th>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)}>
                <td>
                  <div className="patients-avatar-cell">
                    <div className="avatar avatar-sm avatar-accent">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="name">{p.name}</span>
                  </div>
                </td>
                <td className="cell-muted">{p.id}</td>
                <td><span>{p.dob}</span><span className="patients-dob-age">(Age {p.age})</span></td>
                <td className="patients-diagnosis">{p.diagnosis}</td>
                <td className="cell-primary">{p.orders}</td>
                <td className="cell-muted">{new Date(p.lastOrder).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
