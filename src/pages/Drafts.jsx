import { useNavigate } from 'react-router-dom'
import { FileEdit, Clock, ArrowRight, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import useStore from '../store/useStore'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import './Drafts.css'

dayjs.extend(relativeTime)

export default function Drafts() {
  const navigate = useNavigate()
  const { drafts, removeDraft } = useStore()
  const [deleteId, setDeleteId] = useState(null)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="drafts-top">
        <h1>Drafts</h1>
        <p>{drafts.length} saved — resume where you left off</p>
      </div>

      {drafts.length === 0 ? (
        <div className="drafts-empty">
          <FileEdit size={36} className="icon" />
          <p className="title">No drafts</p>
          <p className="sub">Start a new order — drafts auto-save from Step 3.</p>
        </div>
      ) : (
        <div className="gap-stack-2">
          {drafts.map(d => (
            <div key={d.id} className="draft-card">
              <div className="draft-card-top">
                <div className="draft-card-icon"><FileEdit size={16} /></div>
                <div className="draft-card-info">
                  <div className="draft-card-name">{d.patient}</div>
                  <div className="draft-card-sub">{d.product || 'Product not selected'} — Step {d.step}/5</div>
                  <div className="draft-card-date"><Clock size={10} /> {dayjs(d.lastEdited).fromNow()}</div>
                </div>
                <div className="draft-card-progress">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#E0E4EA" strokeWidth="3" />
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#00338E" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${d.progress * 1.005} 100.5`} transform="rotate(-90 20 20)" />
                  </svg>
                  <span className="draft-card-progress-label">{d.progress}%</span>
                </div>
              </div>
              <div className="draft-card-actions">
                <button onClick={() => setDeleteId(d.id)} className="draft-card-discard"><Trash2 size={11} /> Discard</button>
                <button onClick={() => navigate('/orders/new')} className="btn btn-primary btn-sm">Resume <ArrowRight size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="draft-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="draft-delete-icon"><Trash2 size={18} /></div>
            <h2>Discard this draft?</h2>
            <p>All progress will be lost.</p>
            <div className="draft-delete-actions">
              <button onClick={() => setDeleteId(null)} className="btn btn-outline btn-block">Cancel</button>
              <button onClick={() => { removeDraft(deleteId); setDeleteId(null) }} className="btn btn-error btn-block">Discard Draft</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
