import { FileEdit, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useStore from '../store/useStore'
import './AwarenessStrip.css'

export default function AwarenessStrip() {
  const [visible, setVisible] = useState(true)
  const drafts = useStore(s => s.drafts)

  if (!visible || drafts.length === 0) return null

  return (
    <div className="awareness-strip">
      <div className="awareness-strip-content">
        <FileEdit size={13} />
        <span>You have {drafts.length} unsaved drafts</span>
        <Link to="/drafts">View Drafts</Link>
      </div>
      <button onClick={() => setVisible(false)} className="awareness-strip-close"><X size={12} /></button>
    </div>
  )
}
