import { statusMap } from '../data/mockData'

export default function StatusBadge({ status }) {
  const s = statusMap[status]
  if (!s) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-11 font-semibold ${s.color}`}>
      {s.label}
    </span>
  )
}
