import { Search, Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import useStore from '../store/useStore'
import { notifications } from '../data/mockData'
import './Header.css'

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
    <header className="header">
      <button onClick={() => setSearchOpen(true)} className="header-search-trigger">
        <Search size={14} />
        <span>Search patient, order, or job #</span>
        <kbd>Ctrl+K</kbd>
      </button>

      <div className="header-actions" ref={ref}>
        <button onClick={() => setNotifOpen(!notifOpen)} className="header-notif-btn" aria-label="Notifications">
          <Bell size={16} />
          {unread > 0 && <span className="header-notif-badge">{unread}</span>}
        </button>

        {notifOpen && (
          <div className="header-notif-dropdown">
            <div className="header-notif-header">
              <span>Notifications</span>
              <button>Mark all read</button>
            </div>
            <div className="header-notif-list">
              {notifications.map(n => (
                <div key={n.id} className={'header-notif-item' + (!n.read ? ' unread' : '')}>
                  <div className={'header-notif-dot' + (!n.read ? ' unread' : '')} />
                  <div>
                    <p>{n.message}</p>
                    <span className="header-notif-time">{n.time}</span>
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
