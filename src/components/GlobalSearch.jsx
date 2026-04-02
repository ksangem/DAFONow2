import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, User, ShoppingCart, FileEdit, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'

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
    <button onClick={onClick} className="flex items-center gap-2.5 w-full px-4 py-1.5 text-left hover:bg-dafo-blue-50 transition-colors">
      <div className="w-7 h-7 rounded bg-background flex items-center justify-center text-grey shrink-0"><Icon size={14} /></div>
      <span className="text-13 font-medium text-text-dark">{label}</span>
      <span className="text-12 text-text-muted ml-auto truncate max-w-[200px]">{sub}</span>
    </button>
  )

  return (
    <div className="fixed inset-0 z-[1000] bg-black/30 flex items-start justify-center pt-[10vh]" onClick={() => setSearchOpen(false)}>
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="w-[500px] bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
          <Search size={16} className="text-text-muted shrink-0" />
          <input ref={inputRef} className="flex-1 outline-none text-sm text-text-dark bg-transparent" placeholder="Search patient, order, or job #" value={query} onChange={e => setQuery(e.target.value)} />
          <button onClick={() => setSearchOpen(false)} className="text-text-muted hover:text-grey"><X size={16} /></button>
        </div>
        <div className="max-h-[350px] overflow-y-auto py-1">
          {recents.length > 0 && (
            <div>
              <div className="px-4 py-1 text-11 font-semibold uppercase tracking-wide text-text-muted flex items-center gap-1.5"><Clock size={11} />Recent</div>
              {recents.map((r, i) => <ResultItem key={i} icon={r.icon} label={r.label} sub={r.sub} onClick={() => go(r.to)} />)}
            </div>
          )}
          {q && mp.length > 0 && (
            <div>
              <div className="px-4 py-1 text-11 font-semibold uppercase tracking-wide text-text-muted flex items-center gap-1.5 mt-1"><User size={11} />Patients</div>
              {mp.map(p => <ResultItem key={p.id} icon={User} label={p.name} sub={`${p.id} — ${p.diagnosis}`} onClick={() => go(`/patients/${p.id}`)} />)}
            </div>
          )}
          {q && mo.length > 0 && (
            <div>
              <div className="px-4 py-1 text-11 font-semibold uppercase tracking-wide text-text-muted flex items-center gap-1.5 mt-1"><ShoppingCart size={11} />Orders</div>
              {mo.map(o => <ResultItem key={o.id} icon={ShoppingCart} label={o.id} sub={`${o.patient} — ${o.product}`} onClick={() => go(`/orders/${o.id}`)} />)}
            </div>
          )}
          {q && md.length > 0 && (
            <div>
              <div className="px-4 py-1 text-11 font-semibold uppercase tracking-wide text-text-muted flex items-center gap-1.5 mt-1"><FileEdit size={11} />Drafts</div>
              {md.map(d => <ResultItem key={d.id} icon={FileEdit} label={d.id} sub={`${d.patient} — Step ${d.step}`} onClick={() => go('/drafts')} />)}
            </div>
          )}
          {q && !hasResults && (
            <div className="text-center py-8 text-text-muted">
              <p className="text-sm text-text-primary">No results for "{query}"</p>
              <p className="text-12 mt-0.5">Try patient name, order ID, or job number</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
