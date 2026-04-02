import { Check } from 'lucide-react'
import { trackingSteps } from '../data/mockData'

const order = ['submitted', 'review', 'manufacturing', 'shipped', 'delivered']

export default function TrackingTimeline({ currentStatus, compact = false }) {
  const idx = order.indexOf(currentStatus)

  if (compact) {
    return (
      <div className="flex items-center gap-0">
        {trackingSteps.map((step, i) => {
          const done = i < idx
          const active = i === idx
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                done ? 'bg-success-light text-white' : active ? 'bg-dafo-blue text-white' : 'bg-border text-text-muted'
              }`}>
                {done ? <Check size={10} strokeWidth={3} /> : <span>{i + 1}</span>}
              </div>
              {i < trackingSteps.length - 1 && (
                <div className={`flex-1 h-0.5 ${done ? 'bg-success-light' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {trackingSteps.map((step, i) => {
        const done = i < idx
        const active = i === idx
        return (
          <div key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                done ? 'bg-success-light text-white' : active ? 'bg-dafo-blue text-white ring-4 ring-dafo-blue-50' : 'bg-border text-text-muted'
              }`}>
                {done ? <Check size={12} strokeWidth={3} /> : <span className="text-11 font-semibold">{i + 1}</span>}
              </div>
              {i < trackingSteps.length - 1 && <div className={`w-0.5 flex-1 min-h-[28px] ${done ? 'bg-success-light' : 'bg-border'}`} />}
            </div>
            <div className="pb-5">
              <div className={`text-13 font-semibold ${done || active ? 'text-text-dark' : 'text-text-muted'}`}>{step.label}</div>
              <div className={`text-12 ${active ? 'text-dafo-blue font-medium' : 'text-text-muted'}`}>{step.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
