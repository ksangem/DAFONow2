import { Check } from 'lucide-react'
import { trackingSteps } from '../data/mockData'
import './TrackingTimeline.css'

const order = ['submitted', 'review', 'manufacturing', 'shipped', 'delivered']

export default function TrackingTimeline({ currentStatus, compact = false }) {
  const idx = order.indexOf(currentStatus)

  if (compact) {
    return (
      <div className="timeline-compact">
        {trackingSteps.map((step, i) => {
          const done = i < idx
          const active = i === idx
          const dotClass = done ? 'done' : active ? 'active' : 'pending'
          return (
            <div key={step.key} className="timeline-compact-step">
              <div className={`timeline-dot ${dotClass}`}>
                {done ? <Check size={10} strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              {i < trackingSteps.length - 1 && (
                <div className={`timeline-connector ${done ? 'done' : 'pending'}`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="timeline-full">
      {trackingSteps.map((step, i) => {
        const done = i < idx
        const active = i === idx
        const dotClass = done ? 'done' : active ? 'active' : 'pending'
        const labelClass = done || active ? (done ? 'completed' : 'current') : 'future'
        return (
          <div key={step.key} className="timeline-full-step">
            <div className="timeline-full-rail">
              <div className={`timeline-full-dot ${dotClass}`}>
                {done ? <Check size={12} strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              {i < trackingSteps.length - 1 && (
                <div className={`timeline-full-line ${done ? 'done' : 'pending'}`} />
              )}
            </div>
            <div className="timeline-full-content">
              <div className={`timeline-step-label ${labelClass}`}>{step.label}</div>
              <div className={`timeline-step-desc ${active ? 'current' : 'other'}`}>{step.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
