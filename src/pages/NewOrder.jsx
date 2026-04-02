import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Save, Trash2, User, Package, Settings, ClipboardCheck, Send, Search, Plus, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'
import './NewOrder.css'

const steps = [
  { n: 1, icon: User, label: 'Patient', desc: 'Start patient order' },
  { n: 2, icon: Package, label: 'Product', desc: 'Select DAFO type' },
  { n: 3, icon: Settings, label: 'Customize', desc: 'Customize specifications' },
  { n: 4, icon: ClipboardCheck, label: 'Review', desc: 'Review your order' },
  { n: 5, icon: Send, label: 'Submit', desc: 'Submit to Cascade' },
]

export default function NewOrder() {
  const navigate = useNavigate()
  const { patients, products } = useStore()
  const [step, setStep] = useState(1)
  const [showDiscard, setShowDiscard] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [patient, setPatient] = useState(null)
  const [patSearch, setPatSearch] = useState('')
  const [product, setProduct] = useState(null)
  const [prodFilter, setProdFilter] = useState('all')
  const [custom, setCustom] = useState({ trimStyle: 'standard', pattern: '', closure: 'velcro', padding: 'standard', laterality: 'bilateral', notes: '' })

  const filteredP = patSearch ? patients.filter(p => p.name.toLowerCase().includes(patSearch.toLowerCase()) || p.id.toLowerCase().includes(patSearch.toLowerCase())) : patients
  const categories = ['all', 'popular', ...new Set(products.map(p => p.category))]
  const filteredProd = prodFilter === 'all' ? products : prodFilter === 'popular' ? products.filter(p => p.popular) : products.filter(p => p.category === prodFilter)

  const canNext = () => { if (step === 1) return !!patient; if (step === 2) return !!product; return true }

  const handleSave = () => toast.success('Draft saved', { duration: 2000, style: { fontSize: '13px' } })

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="order-success">
        <div className="order-success-icon"><Check size={32} /></div>
        <h1>Order Submitted</h1>
        <p className="sub">Your order has been submitted to Cascade Dafo.</p>
        <div className="order-success-details">
          {[['Order ID', 'ORD-4522'], ['Job #', 'J-78902'], ['Patient', patient?.name], ['Product', product?.name], ['ETA', 'Apr 22, 2026']].map(([k, v]) => (
            <div key={k} className="row"><span className="label">{k}</span><strong className="value">{v}</strong></div>
          ))}
        </div>
        <div className="order-success-actions">
          <button onClick={() => navigate('/orders/ORD-4521')} className="btn btn-primary btn-block">View Order</button>
          <button onClick={() => navigate('/')} className="btn btn-outline btn-block">Dashboard</button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Top */}
      <div className="new-order-top">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm"><ArrowLeft size={14} /> Back</button>
        <h1>New Order</h1>
        <div className="actions">
          {step >= 3 && <button onClick={handleSave} className="btn btn-outline btn-sm"><Save size={12} /> Save Draft</button>}
        </div>
      </div>

      {/* Progress stepper */}
      <div className="new-order-stepper">
        {steps.map((s, i) => {
          const done = s.n < step, active = s.n === step, Icon = s.icon
          const dotClass = done ? 'done' : active ? 'active' : 'pending'
          const labelClass = done ? 'done' : active ? 'active' : 'pending'
          return (
            <div key={s.n} className="new-order-step">
              <div className="new-order-step-inner">
                <div className={`new-order-step-dot ${dotClass}`}>
                  {done ? <Check size={12} strokeWidth={3} /> : <Icon size={12} />}
                </div>
                <div>
                  <div className={`new-order-step-label ${labelClass}`}>{s.label}</div>
                  {active && <div className="new-order-step-desc">{s.desc}</div>}
                </div>
              </div>
              {i < steps.length - 1 && <div className={`new-order-step-connector ${done ? 'done' : 'pending'}`} />}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="new-order-content">
        {/* Step 1: Patient */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="new-order-section-title">Select Patient</h2>
            <p className="new-order-section-sub">Choose existing or create new.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="search-input" style={{ flex: 1 }}>
                <Search size={13} />
                <input placeholder="Search by name or ID..." value={patSearch} onChange={e => setPatSearch(e.target.value)} />
              </div>
              <button className="btn btn-outline btn-sm"><Plus size={12} /> New Patient</button>
            </div>
            <div className="gap-stack-2">
              {filteredP.map(p => (
                <button key={p.id} onClick={() => setPatient(p)}
                  className={'patient-select-card' + (patient?.id === p.id ? ' selected' : '')}>
                  <div className="avatar avatar-md avatar-accent">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="info">
                    <div className="name">{p.name}</div>
                    <div className="sub">{p.id} — DOB: {p.dob} — {p.diagnosis}</div>
                  </div>
                  <div className="orders-count">{p.orders} orders</div>
                  {patient?.id === p.id && <div className="check"><Check size={11} /></div>}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Product */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="new-order-section-title">Select DAFO Type</h2>
            <p className="new-order-section-sub">Choose product for {patient?.name}.</p>
            <div className="filter-pills" style={{ marginBottom: 12 }}>
              {categories.map(c => (
                <button key={c} onClick={() => setProdFilter(c)} className={'filter-pill' + (prodFilter === c ? ' active' : '')}>
                  {c === 'all' ? 'All' : c === 'popular' ? 'Popular' : c}
                </button>
              ))}
            </div>
            <div className="grid grid-2 gap-2">
              {filteredProd.map(p => (
                <button key={p.id} onClick={() => setProduct(p)}
                  className={'product-select-card' + (product?.id === p.id ? ' selected' : '')}>
                  <div className={'product-select-icon' + (product?.id === p.id ? ' selected' : '')}>
                    <Package size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="product-select-name">{p.name}</div>
                    <div className="product-select-desc">{p.desc}</div>
                    <div className="product-select-meta">{p.category} — {p.sku}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Customize */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="new-order-section-title">Customize Specifications</h2>
            <p className="new-order-section-sub">Configure {product?.name} for {patient?.name}.</p>
            <div className="grid customize-grid gap-4">
              <div className="customize-form">
                <div className="field">
                  <label className="form-label">Trim Style</label>
                  <select className="form-select" value={custom.trimStyle} onChange={e => setCustom({...custom, trimStyle: e.target.value})}>
                    <option value="standard">Standard</option><option value="turbo">Turbo</option><option value="extended">Extended</option><option value="sport">Sport</option>
                  </select>
                </div>
                <div className="field">
                  <label className="form-label">Pattern / Color</label>
                  <div className="pattern-chips">
                    {['Blue', 'Pink', 'Green', 'Purple', 'Dinosaur', 'Floral', 'Sports', 'Custom'].map(c => (
                      <button key={c} onClick={() => setCustom({...custom, pattern: c})} className={'pattern-chip' + (custom.pattern === c ? ' selected' : '')}>{c}</button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label className="form-label">Closure</label>
                  <select className="form-select" value={custom.closure} onChange={e => setCustom({...custom, closure: e.target.value})}>
                    <option value="velcro">Velcro</option><option value="lace">Lace</option><option value="boa">BOA</option>
                  </select>
                </div>
                <div className="field">
                  <label className="form-label">Padding</label>
                  <select className="form-select" value={custom.padding} onChange={e => setCustom({...custom, padding: e.target.value})}>
                    <option value="standard">Standard</option><option value="extra">Extra</option><option value="minimal">Minimal</option>
                  </select>
                </div>
                <div className="field">
                  <label className="form-label">Laterality</label>
                  <div className="laterality-group">
                    {['Left', 'Right', 'Bilateral'].map(l => (
                      <button key={l} onClick={() => setCustom({...custom, laterality: l.toLowerCase()})} className={'laterality-btn' + (custom.laterality === l.toLowerCase() ? ' selected' : '')}>{l}</button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label className="form-label">Clinical Notes</label>
                  <textarea className="form-textarea" placeholder="Special instructions..." value={custom.notes} onChange={e => setCustom({...custom, notes: e.target.value})} />
                </div>
              </div>
              {/* Summary panel */}
              <div className="order-summary-panel">
                <h3>Order Summary</h3>
                <div className="summary-section"><span className="summary-label">Patient</span><span className="summary-value">{patient?.name}</span></div>
                <div className="summary-section"><span className="summary-label">Product</span><span className="summary-value">{product?.name}</span></div>
                <hr />
                <div className="summary-section"><span className="summary-label">Specs</span>
                  <div className="summary-specs">
                    <div>Trim: {custom.trimStyle}</div>
                    <div>Pattern: {custom.pattern || '—'}</div>
                    <div>Closure: {custom.closure}</div>
                    <div>Padding: {custom.padding}</div>
                    <div>Laterality: {custom.laterality}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 640 }}>
            <h2 className="new-order-section-title">Review Your Order</h2>
            <p className="new-order-section-sub">Verify all details before submitting.</p>
            <div className="card" style={{ padding: 16, marginBottom: 12 }}>
              {[
                { icon: User, title: 'Patient', editStep: 1, rows: [['Name', patient?.name], ['ID', patient?.id], ['DOB', patient?.dob], ['Diagnosis', patient?.diagnosis]] },
                { icon: Package, title: 'Product', editStep: 2, rows: [['DAFO Type', product?.name], ['Category', product?.category], ['SKU', product?.sku]] },
                { icon: Settings, title: 'Specifications', editStep: 3, rows: [['Trim', custom.trimStyle], ['Pattern', custom.pattern || '—'], ['Closure', custom.closure], ['Padding', custom.padding], ['Laterality', custom.laterality]] },
              ].map((section) => (
                <div key={section.title} className="review-section">
                  <div className="review-section-header">
                    <section.icon size={14} style={{ color: 'var(--color-primary)' }} />
                    <h3>{section.title}</h3>
                    <button onClick={() => setStep(section.editStep)} className="edit-btn">Edit</button>
                  </div>
                  <div className="review-grid">
                    {section.rows.map(([k, v]) => (
                      <div key={k}><span className="label">{k}: </span><span className="value">{v}</span></div>
                    ))}
                  </div>
                  {section.title !== 'Specifications' && <hr className="review-divider" />}
                </div>
              ))}
              {custom.notes && <div className="review-notes"><span className="label">Notes: </span>{custom.notes}</div>}
            </div>
            <div className="review-warning">
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <div><strong>Verify all details.</strong> Orders cannot be modified after submission.</div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Submit */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="submit-center">
            <div className="submit-icon"><Send size={24} /></div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-gray-800)', marginBottom: 4 }}>Ready to Submit</h2>
            <p style={{ fontSize: 'var(--font-size-13)', color: 'var(--color-gray-400)', marginBottom: 20 }}>Order for <strong>{patient?.name}</strong> — <strong>{product?.name}</strong></p>
            <div className="submit-summary">
              <div>Patient: {patient?.name}</div>
              <div>Product: {product?.name}</div>
              <div>Trim: {custom.trimStyle} — {custom.laterality}</div>
              <div>Est. Processing: 10–14 business days</div>
            </div>
            <button onClick={() => setSubmitted(true)} className="btn btn-primary btn-block btn-lg">
              <Send size={16} /> Submit Order to Cascade
            </button>
            <p className="submit-note">You'll receive confirmation and can track in real time.</p>
          </motion.div>
        )}
      </div>

      {/* Footer nav */}
      {step < 5 && (
        <div className="new-order-footer">
          <div>{step > 1 && <button onClick={() => setStep(step - 1)} className="btn btn-outline btn-sm"><ArrowLeft size={14} /> Back</button>}</div>
          <div className="right">
            {step >= 3 && <button onClick={() => setShowDiscard(true)} className="discard-link"><Trash2 size={12} /> Discard Draft</button>}
            <button onClick={() => setStep(step + 1)} disabled={!canNext()} className="btn btn-primary">
              {step === 4 ? 'Proceed to Submit' : 'Continue'} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Discard modal */}
      {showDiscard && (
        <div className="modal-overlay" onClick={() => setShowDiscard(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="discard-modal" onClick={e => e.stopPropagation()}>
            <div className="discard-modal-icon"><Trash2 size={20} /></div>
            <h2>Discard this draft?</h2>
            <p>All progress will be lost.</p>
            <div className="discard-modal-actions">
              <button onClick={() => setShowDiscard(false)} className="btn btn-outline btn-block">Cancel</button>
              <button onClick={() => navigate('/')} className="btn btn-error btn-block">Discard Draft</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
