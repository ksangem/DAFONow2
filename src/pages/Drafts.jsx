import { useNavigate } from 'react-router-dom'
import { FileEdit, Clock, ArrowRight, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import useStore from '../store/useStore'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function Drafts() {
  const navigate = useNavigate()
  const { drafts, removeDraft } = useStore()
  const [deleteId, setDeleteId] = useState(null)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-3">
        <h1 className="text-xl font-bold text-text-dark">Drafts</h1>
        <p className="text-12 text-text-secondary">{drafts.length} saved — resume where you left off</p>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-white border border-border rounded p-12 text-center text-text-muted">
          <FileEdit size={36} className="mx-auto mb-2 text-border" />
          <p className="font-medium text-text-primary">No drafts</p>
          <p className="text-12">Start a new order — drafts auto-save from Step 3.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {drafts.map(d => (
            <div key={d.id} className="bg-white border border-border rounded p-3">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-9 h-9 rounded bg-accent-light text-amber-700 flex items-center justify-center shrink-0"><FileEdit size={16} /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-13 font-medium text-text-dark">{d.patient}</div>
                  <div className="text-12 text-text-muted">{d.product || 'Product not selected'} — Step {d.step}/5</div>
                  <div className="text-11 text-text-muted flex items-center gap-1 mt-1"><Clock size={10} /> {dayjs(d.lastEdited).fromNow()}</div>
                </div>
                <div className="flex flex-col items-center">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#E0E4EA" strokeWidth="3" />
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#00338E" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${d.progress * 1.005} 100.5`} transform="rotate(-90 20 20)" />
                  </svg>
                  <span className="text-11 font-bold text-text-primary -mt-7">{d.progress}%</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                <button onClick={() => setDeleteId(d.id)} className="text-12 text-text-muted hover:text-error flex items-center gap-1"><Trash2 size={11} /> Discard</button>
                <button onClick={() => navigate('/orders/new')} className="flex items-center gap-1 px-3 py-1 bg-dafo-blue text-white rounded text-12 font-semibold hover:bg-dafo-blue-light">Resume <ArrowRight size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-modal bg-black/40 flex items-center justify-center" onClick={() => setDeleteId(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg p-6 w-340 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-full bg-error-light text-error flex items-center justify-center mx-auto mb-2"><Trash2 size={18} /></div>
            <h2 className="text-sm font-bold text-text-dark mb-1">Discard this draft?</h2>
            <p className="text-12 text-text-muted mb-4">All progress will be lost.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-1.5 border border-border rounded text-12 font-medium">Cancel</button>
              <button onClick={() => { removeDraft(deleteId); setDeleteId(null) }} className="flex-1 py-1.5 bg-error text-white rounded text-12 font-semibold">Discard Draft</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
