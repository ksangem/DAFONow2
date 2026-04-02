import { statusMap } from '../data/mockData'

export default function StatusBadge({ status }) {
  const s = statusMap[status]
  if (!s) return null
  return (
    <span className={`status-badge ${s.className}`}>
      {s.label}
    </span>
  )
}
