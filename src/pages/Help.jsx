import { Phone, Mail, MessageSquare, HelpCircle, BookOpen, Video, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

const faqs = [
  { q: 'How do I track my order?', a: 'Navigate to the Tracking tab or click any order to view real-time status.' },
  { q: 'Can I modify an order after submission?', a: 'Orders cannot be modified after submission. Contact Cascade support for changes.' },
  { q: 'How do I save a draft?', a: 'Drafts auto-save from Step 3. You can also click "Save Draft" during Steps 3-5.' },
  { q: 'What is the typical turnaround time?', a: 'Standard: 10-14 business days. Rush orders are prioritized.' },
  { q: 'How do I reorder for an existing patient?', a: 'Go to Patients, find the patient, and click "New Order" from their profile.' },
]

export default function Help() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-800">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-text-dark">Help & Support</h1>
        <p className="text-12 text-text-secondary">Get help with DAFONow or contact Cascade Dafo</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: Phone, title: 'Phone', sub: 'Mon-Fri, 8am-5pm PST', link: '(800) 547-2024' },
          { icon: Mail, title: 'Email', sub: 'Response within 24h', link: 'support@cascadedafo.com' },
          { icon: MessageSquare, title: 'Live Chat', sub: 'During business hours', link: 'Start Chat' },
        ].map((c, i) => (
          <div key={i} className="bg-white border border-border rounded p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-dafo-blue-50 text-dafo-blue flex items-center justify-center mx-auto mb-2"><c.icon size={18} /></div>
            <h3 className="text-13 font-bold text-text-dark">{c.title}</h3>
            <p className="text-11 text-text-muted mb-2">{c.sub}</p>
            <span className="text-13 font-semibold text-dafo-blue">{c.link}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded p-4 mb-4">
        <h2 className="text-13 font-bold text-text-dark flex items-center gap-1.5 mb-3"><HelpCircle size={14} /> Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="border-b border-border/50 last:border-0">
            <summary className="py-2.5 text-13 font-semibold text-text-dark cursor-pointer hover:text-dafo-blue">{faq.q}</summary>
            <p className="pb-2.5 text-12 text-text-muted leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: BookOpen, title: 'Product Catalog', desc: 'Browse full DAFO product line with specs.' },
          { icon: Video, title: 'Video Tutorials', desc: 'Step-by-step DAFONow guides.' },
        ].map((r, i) => (
          <div key={i} className="bg-white border border-border rounded p-3">
            <r.icon size={16} className="text-dafo-blue mb-1.5" />
            <h3 className="text-13 font-bold text-text-dark mb-0.5">{r.title}</h3>
            <p className="text-12 text-text-muted mb-2">{r.desc}</p>
            <button className="text-12 text-dafo-blue font-medium flex items-center gap-1">View <ExternalLink size={11} /></button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
