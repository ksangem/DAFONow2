import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, User, ShoppingCart, FileEdit, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import './GlobalSearch.css'

export default function GlobalSearch() {
  const { searchOpen, setSearchOpen, patients, orders, drafts } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchOpen) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 80) }
  }, [searchOpen])

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(!searchOpen) }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [searchOpen, setSearchOpen])

  if (!searchOpen) return null

  const q = query.toLowerCase()
  const mp = q ? patients.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) : []
  const mo = q ? orders.filter(o => o.id.toLowerCase().includes(q) || o.jobNumber.toLowerCase().includes(q) || o.patient.toLowerCase().includes(q)) : []
  const md = q ? drafts.filter(d => d.patient.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)) : []
  const hasResults = mp.length || mo.length || md.length

  const recents = !q ? [
    { icon: User, label: 'Emma Thompson', sub: 'P-1001', to: '/patients/P-1001' },
    { icon: ShoppingCart, label: 'ORD-4521', sub: 'DAFO 3.5 — Manufacturing', to: '/orders/ORD-4521' },
    { icon: FileEdit, label: 'DRF-301', sub: 'Step 3 — DAFO 3.5', to: '/drafts' },
  ] : []

  const go = (to) => { navigate(to); setSearchOpen(false) }

  const ResultItem = ({ icon: Icon, label, sub, onClick }) => (
    <button onClick={onClick} className="search-result-item">
      <div className="search-result-icon"><Icon size={14} /></div>
      <span className="search-result-label">{label}</span>
      <span className="search-result-sub">{sub}</span>
    </button>
  )

  return (
    <div className="search-overlay" onClick={() => setSearchOpen(false)}>
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="search-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="search-modal-input-row">
          <Search size={16} className="search-icon" />
          <input ref={inputRef} placeholder="Search patient, order, or job #" value={query} onChange={e => setQuery(e.target.value)} />
          <button onClick={() => setSearchOpen(false)} className="search-modal-close"><X size={16} /></button>
        </div>
        <div className="search-results">
          {recents.length > 0 && (
            <div>
              <div className="search-section-label"><Clock size={11} />Recent</div>
              {recents.map((r, i) => <ResultItem key={i} icon={r.icon} label={r.label} sub={r.sub} onClick={() => go(r.to)} />)}
            </div>
          )}
          {q && mp.length > 0 && (
            <div>
              <div className="search-section-label spaced"><User size={11} />Patients</div>
              {mp.map(p => <ResultItem key={p.id} icon={User} label={p.name} sub={`${p.id} — ${p.diagnosis}`} onClick={() => go(`/patients/${p.id}`)} />)}
            </div>
          )}
          {q && mo.length > 0 && (
            <div>
              <div className="search-section-label spaced"><ShoppingCart size={11} />Orders</div>
              {mo.map(o => <ResultItem key={o.id} icon={ShoppingCart} label={o.id} sub={`${o.patient} — ${o.product}`} onClick={() => go(`/orders/${o.id}`)} />)}
            </div>
          )}
          {q && md.length > 0 && (
            <div>
              <div className="search-section-label spaced"><FileEdit size={11} />Drafts</div>
              {md.map(d => <ResultItem key={d.id} icon={FileEdit} label={d.id} sub={`${d.patient} — Step ${d.step}`} onClick={() => go('/drafts')} />)}
            </div>
          )}
          {q && !hasResults && (
            <div className="search-no-results">
              <p>No results for "{query}"</p>
              <p>Try patient name, order ID, or job number</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
