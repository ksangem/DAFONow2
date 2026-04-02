import { Phone, Mail, MessageSquare, HelpCircle, BookOpen, Video, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import './Help.css'

const faqs = [
  { q: 'How do I track my order?', a: 'Navigate to the Tracking tab or click any order to view real-time status.' },
  { q: 'Can I modify an order after submission?', a: 'Orders cannot be modified after submission. Contact Cascade support for changes.' },
  { q: 'How do I save a draft?', a: 'Drafts auto-save from Step 3. You can also click "Save Draft" during Steps 3-5.' },
  { q: 'What is the typical turnaround time?', a: 'Standard: 10-14 business days. Rush orders are prioritized.' },
  { q: 'How do I reorder for an existing patient?', a: 'Go to Patients, find the patient, and click "New Order" from their profile.' },
]

export default function Help() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 800 }}>
      <div className="help-top">
        <h1>Help & Support</h1>
        <p>Get help with DAFONow or contact Cascade Dafo</p>
      </div>

      <div className="help-contacts">
        {[
          { icon: Phone, title: 'Phone', sub: 'Mon-Fri, 8am-5pm PST', link: '(800) 547-2024' },
          { icon: Mail, title: 'Email', sub: 'Response within 24h', link: 'support@cascadedafo.com' },
          { icon: MessageSquare, title: 'Live Chat', sub: 'During business hours', link: 'Start Chat' },
        ].map((c, i) => (
          <div key={i} className="help-contact-card">
            <div className="help-contact-icon"><c.icon size={18} /></div>
            <h3>{c.title}</h3>
            <p className="sub">{c.sub}</p>
            <span className="link">{c.link}</span>
          </div>
        ))}
      </div>

      <div className="help-faq">
        <h2><HelpCircle size={14} /> Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i}>
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </div>

      <div className="help-resources">
        {[
          { icon: BookOpen, title: 'Product Catalog', desc: 'Browse full DAFO product line with specs.' },
          { icon: Video, title: 'Video Tutorials', desc: 'Step-by-step DAFONow guides.' },
        ].map((r, i) => (
          <div key={i} className="help-resource-card">
            <r.icon size={16} style={{ color: 'var(--color-primary)' }} />
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
            <button className="help-resource-link">View <ExternalLink size={11} /></button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
