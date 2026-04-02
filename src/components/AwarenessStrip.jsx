import { FileEdit, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useStore from '../store/useStore'

export default function AwarenessStrip() {
  const [visible, setVisible] = useState(true)
  const drafts = useStore(s => s.drafts)

  if (!visible || drafts.length === 0) return null

  return (
    <div className="flex items-center justify-between px-5 py-1.5 bg-accent-light text-amber-800 text-12 font-medium">
      <div className="flex items-center gap-1.5">
        <FileEdit size={13} />
        <span>You have {drafts.length} unsaved drafts</span>
        <Link to="/drafts" className="underline font-semibold ml-1">View Drafts</Link>
      </div>
      <button onClick={() => setVisible(false)} className="p-0.5 rounded hover:bg-black/5"><X size={12} /></button>
    </div>
  )
}
