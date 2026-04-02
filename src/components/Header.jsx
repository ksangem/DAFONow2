import { Search, Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import useStore from '../store/useStore'
import { notifications } from '../data/mockData'

export default function Header() {
  const setSearchOpen = useStore(s => s.setSearchOpen)
  const [notifOpen, setNotifOpen] = useState(false)
  const ref = useRef()
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-11 flex items-center justify-between px-5 bg-white border-b border-border sticky top-0 z-40">
      {/* Search */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 px-3 py-1 bg-background border border-border rounded text-text-secondary text-13 hover:border-border-strong transition-colors min-w-[320px]"
      >
        <Search size={14} />
        <span>Search patient, order, or job #</span>
        <kbd className="ml-auto text-11 px-1 py-0.5 bg-white border border-border rounded font-sans text-text-muted">Ctrl+K</kbd>
      </button>

      <div className="relative flex items-center gap-1" ref={ref}>
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-8 h-8 flex items-center justify-center rounded hover:bg-background text-grey transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute top-full right-0 mt-1 w-[340px] bg-white border border-border rounded-lg shadow-lg z-50">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="font-semibold text-13 text-text-dark">Notifications</span>
              <button className="text-12 text-dafo-blue font-medium">Mark all read</button>
            </div>
            <div className="max-h-[280px] overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`flex gap-2 px-3 py-2 border-b border-border/50 text-13 cursor-pointer hover:bg-background ${!n.read ? 'bg-dafo-blue-50' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-dafo-blue' : 'bg-transparent'}`} />
                  <div>
                    <p className="text-text-primary">{n.message}</p>
                    <span className="text-11 text-text-muted">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
