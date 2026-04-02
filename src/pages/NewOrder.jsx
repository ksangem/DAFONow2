import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Save, Trash2, User, Package, Settings, ClipboardCheck, Send, Search, Plus, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-4"><Check size={32} /></div>
        <h1 className="text-xl font-bold text-text-dark mb-1">Order Submitted</h1>
        <p className="text-13 text-text-muted mb-6">Your order has been submitted to Cascade Dafo.</p>
        <div className="text-left bg-background rounded p-4 mb-6 space-y-2 text-13">
          {[['Order ID', 'ORD-4522'], ['Job #', 'J-78902'], ['Patient', patient?.name], ['Product', product?.name], ['ETA', 'Apr 22, 2026']].map(([k, v]) => (
            <div key={k} className="flex justify-between"><span className="text-text-muted">{k}</span><strong className="text-text-dark">{v}</strong></div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/orders/ORD-4521')} className="flex-1 py-2 bg-dafo-blue text-white rounded font-semibold text-13">View Order</button>
          <button onClick={() => navigate('/')} className="flex-1 py-2 bg-white border border-border rounded font-semibold text-13 text-text-primary">Dashboard</button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-900 mx-auto">
      {/* Top */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-13 text-dafo-blue font-medium flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
        <h1 className="text-lg font-bold text-text-dark">New Order</h1>
        <div className="ml-auto flex items-center gap-2">
          {step >= 3 && <button onClick={handleSave} className="flex items-center gap-1 px-2.5 py-1 text-12 border border-border rounded text-text-primary hover:bg-background"><Save size={12} /> Save Draft</button>}
        </div>
      </div>

      {/* Progress — compact McMaster style */}
      <div className="flex items-center bg-white border border-border rounded px-4 py-2.5 mb-5 gap-0">
        {steps.map((s, i) => {
          const done = s.n < step, active = s.n === step, Icon = s.icon
          return (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-12 font-bold shrink-0 ${
                  done ? 'bg-success-light text-white' : active ? 'bg-dafo-blue text-white' : 'bg-background border border-border text-text-muted'
                }`}>
                  {done ? <Check size={12} strokeWidth={3} /> : <Icon size={12} />}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-12 font-semibold leading-tight ${active ? 'text-text-dark' : done ? 'text-success' : 'text-text-muted'}`}>{s.label}</div>
                  {active && <div className="text-11 text-dafo-blue">{s.desc}</div>}
                </div>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${done ? 'bg-success-light' : 'bg-border'}`} />}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="min-h-380">
        {/* Step 1: Patient */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-base font-bold text-text-dark mb-1">Select Patient</h2>
            <p className="text-12 text-text-muted mb-3">Choose existing or create new.</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-border rounded text-13 flex-1">
                <Search size={13} className="text-text-muted" />
                <input className="flex-1 outline-none bg-transparent" placeholder="Search by name or ID..." value={patSearch} onChange={e => setPatSearch(e.target.value)} />
              </div>
              <button className="flex items-center gap-1 px-2.5 py-1 border border-border rounded text-12 font-medium text-text-primary hover:bg-background"><Plus size={12} /> New Patient</button>
            </div>
            <div className="space-y-1.5">
              {filteredP.map(p => (
                <button key={p.id} onClick={() => setPatient(p)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded border transition-colors text-left ${
                    patient?.id === p.id ? 'border-dafo-blue bg-dafo-blue-50' : 'border-border bg-white hover:bg-background'
                  }`}>
                  <div className="w-8 h-8 rounded-full bg-accent-light text-amber-700 flex items-center justify-center text-11 font-bold shrink-0">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-13 font-semibold text-text-dark">{p.name}</div>
                    <div className="text-11 text-text-muted">{p.id} — DOB: {p.dob} — {p.diagnosis}</div>
                  </div>
                  <div className="text-11 text-text-muted whitespace-nowrap">{p.orders} orders</div>
                  {patient?.id === p.id && <div className="w-5 h-5 rounded-full bg-dafo-blue text-white flex items-center justify-center"><Check size={11} /></div>}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Product */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-base font-bold text-text-dark mb-1">Select DAFO Type</h2>
            <p className="text-12 text-text-muted mb-3">Choose product for {patient?.name}.</p>
            <div className="flex gap-1 mb-3 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setProdFilter(c)} className={`px-2 py-0.5 rounded text-12 font-medium ${prodFilter === c ? 'bg-dafo-blue text-white' : 'bg-white border border-border text-text-primary hover:bg-background'}`}>
                  {c === 'all' ? 'All' : c === 'popular' ? 'Popular' : c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredProd.map(p => (
                <button key={p.id} onClick={() => setProduct(p)}
                  className={`flex gap-3 p-3 rounded border text-left transition-colors ${
                    product?.id === p.id ? 'border-dafo-blue bg-dafo-blue-50' : 'border-border bg-white hover:bg-background'
                  }`}>
                  <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${product?.id === p.id ? 'bg-dafo-blue text-white' : 'bg-background text-text-muted'}`}>
                    <Package size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-13 font-semibold text-text-dark">{p.name}</div>
                    <div className="text-11 text-text-muted line-clamp-2">{p.desc}</div>
                    <div className="text-11 text-dafo-blue font-medium mt-0.5">{p.category} — {p.sku}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Customize */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-base font-bold text-text-dark mb-1">Customize Specifications</h2>
            <p className="text-12 text-text-muted mb-4">Configure {product?.name} for {patient?.name}.</p>
            <div className="grid customize-grid gap-4">
              <div className="bg-white border border-border rounded p-4 space-y-3">
                <div><label className="text-12 font-semibold text-text-dark block mb-1">Trim Style</label>
                  <select className="w-full px-2.5 py-1.5 border border-border rounded text-13 bg-white" value={custom.trimStyle} onChange={e => setCustom({...custom, trimStyle: e.target.value})}>
                    <option value="standard">Standard</option><option value="turbo">Turbo</option><option value="extended">Extended</option><option value="sport">Sport</option>
                  </select>
                </div>
                <div><label className="text-12 font-semibold text-text-dark block mb-1">Pattern / Color</label>
                  <div className="flex flex-wrap gap-1">
                    {['Blue', 'Pink', 'Green', 'Purple', 'Dinosaur', 'Floral', 'Sports', 'Custom'].map(c => (
                      <button key={c} onClick={() => setCustom({...custom, pattern: c})} className={`px-2 py-0.5 rounded text-12 ${custom.pattern === c ? 'bg-dafo-blue text-white' : 'bg-background border border-border text-text-primary'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div><label className="text-12 font-semibold text-text-dark block mb-1">Closure</label>
                  <select className="w-full px-2.5 py-1.5 border border-border rounded text-13 bg-white" value={custom.closure} onChange={e => setCustom({...custom, closure: e.target.value})}>
                    <option value="velcro">Velcro</option><option value="lace">Lace</option><option value="boa">BOA</option>
                  </select>
                </div>
                <div><label className="text-12 font-semibold text-text-dark block mb-1">Padding</label>
                  <select className="w-full px-2.5 py-1.5 border border-border rounded text-13 bg-white" value={custom.padding} onChange={e => setCustom({...custom, padding: e.target.value})}>
                    <option value="standard">Standard</option><option value="extra">Extra</option><option value="minimal">Minimal</option>
                  </select>
                </div>
                <div><label className="text-12 font-semibold text-text-dark block mb-1">Laterality</label>
                  <div className="flex gap-1">
                    {['Left', 'Right', 'Bilateral'].map(l => (
                      <button key={l} onClick={() => setCustom({...custom, laterality: l.toLowerCase()})} className={`flex-1 py-1.5 rounded text-12 font-medium border ${custom.laterality === l.toLowerCase() ? 'border-dafo-blue bg-dafo-blue-50 text-dafo-blue' : 'border-border bg-white text-text-primary'}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div><label className="text-12 font-semibold text-text-dark block mb-1">Clinical Notes</label>
                  <textarea className="w-full px-2.5 py-1.5 border border-border rounded text-13 bg-white min-h-60" placeholder="Special instructions..." value={custom.notes} onChange={e => setCustom({...custom, notes: e.target.value})} />
                </div>
              </div>
              {/* Summary panel */}
              <div className="bg-white border border-border rounded p-3 sticky top-20 self-start">
                <h3 className="text-12 font-bold text-text-dark mb-3">Order Summary</h3>
                <div className="space-y-2 text-12">
                  <div><span className="text-text-muted block text-11 uppercase tracking-wide">Patient</span><span className="font-semibold text-text-dark">{patient?.name}</span></div>
                  <div><span className="text-text-muted block text-11 uppercase tracking-wide">Product</span><span className="font-semibold text-text-dark">{product?.name}</span></div>
                  <hr className="border-border" />
                  <div><span className="text-text-muted block text-11 uppercase tracking-wide">Specs</span>
                    <div className="space-y-0.5 text-text-primary">
                      <div>Trim: {custom.trimStyle}</div>
                      <div>Pattern: {custom.pattern || '—'}</div>
                      <div>Closure: {custom.closure}</div>
                      <div>Padding: {custom.padding}</div>
                      <div>Laterality: {custom.laterality}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="max-w-640">
            <h2 className="text-base font-bold text-text-dark mb-1">Review Your Order</h2>
            <p className="text-12 text-text-muted mb-4">Verify all details before submitting.</p>
            <div className="bg-white border border-border rounded p-4 space-y-4 mb-3">
              {[
                { icon: User, title: 'Patient', editStep: 1, rows: [['Name', patient?.name], ['ID', patient?.id], ['DOB', patient?.dob], ['Diagnosis', patient?.diagnosis]] },
                { icon: Package, title: 'Product', editStep: 2, rows: [['DAFO Type', product?.name], ['Category', product?.category], ['SKU', product?.sku]] },
                { icon: Settings, title: 'Specifications', editStep: 3, rows: [['Trim', custom.trimStyle], ['Pattern', custom.pattern || '—'], ['Closure', custom.closure], ['Padding', custom.padding], ['Laterality', custom.laterality]] },
              ].map((section) => (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-2">
                    <section.icon size={14} className="text-dafo-blue" />
                    <h3 className="text-13 font-bold text-text-dark flex-1">{section.title}</h3>
                    <button onClick={() => setStep(section.editStep)} className="text-12 text-dafo-blue font-medium">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-13">
                    {section.rows.map(([k, v]) => (
                      <div key={k}><span className="text-text-muted text-12">{k}: </span><span className="font-medium text-text-dark">{v}</span></div>
                    ))}
                  </div>
                  {section.title !== 'Specifications' && <hr className="border-border mt-3" />}
                </div>
              ))}
              {custom.notes && <div className="bg-background rounded p-2 text-12"><span className="text-text-muted">Notes: </span>{custom.notes}</div>}
            </div>
            <div className="flex items-start gap-2 p-3 bg-accent-light rounded text-12 text-amber-800">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <div><strong>Verify all details.</strong> Orders cannot be modified after submission.</div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Submit */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="max-w-md mx-auto text-center py-8">
            <div className="w-14 h-14 rounded-full bg-dafo-blue-50 text-dafo-blue flex items-center justify-center mx-auto mb-4"><Send size={24} /></div>
            <h2 className="text-lg font-bold text-text-dark mb-1">Ready to Submit</h2>
            <p className="text-13 text-text-muted mb-5">Order for <strong>{patient?.name}</strong> — <strong>{product?.name}</strong></p>
            <div className="text-left bg-background rounded p-3 mb-5 space-y-1 text-12">
              <div>Patient: {patient?.name}</div>
              <div>Product: {product?.name}</div>
              <div>Trim: {custom.trimStyle} — {custom.laterality}</div>
              <div>Est. Processing: 10–14 business days</div>
            </div>
            <button onClick={() => setSubmitted(true)} className="w-full py-2.5 bg-dafo-blue text-white rounded font-bold text-sm flex items-center justify-center gap-2 hover:bg-dafo-blue-light transition-colors">
              <Send size={16} /> Submit Order to Cascade
            </button>
            <p className="text-11 text-text-muted mt-2">You'll receive confirmation and can track in real time.</p>
          </motion.div>
        )}
      </div>

      {/* Footer nav */}
      {step < 5 && (
        <div className="flex items-center justify-between pt-4 mt-6 border-t border-border">
          <div>{step > 1 && <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-3 py-1.5 border border-border rounded text-13 font-medium text-text-primary hover:bg-background"><ArrowLeft size={14} /> Back</button>}</div>
          <div className="flex items-center gap-2">
            {step >= 3 && <button onClick={() => setShowDiscard(true)} className="text-12 text-text-muted hover:text-error flex items-center gap-1"><Trash2 size={12} /> Discard Draft</button>}
            <button onClick={() => setStep(step + 1)} disabled={!canNext()} className={`flex items-center gap-1 px-4 py-1.5 rounded text-13 font-semibold transition-colors ${canNext() ? 'bg-dafo-blue text-white hover:bg-dafo-blue-light' : 'bg-border text-text-muted cursor-not-allowed'}`}>
              {step === 4 ? 'Proceed to Submit' : 'Continue'} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Discard modal */}
      {showDiscard && (
        <div className="fixed inset-0 z-modal bg-black/40 flex items-center justify-center" onClick={() => setShowDiscard(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg p-6 w-360 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-error-light text-error flex items-center justify-center mx-auto mb-3"><Trash2 size={20} /></div>
            <h2 className="text-base font-bold text-text-dark mb-1">Discard this draft?</h2>
            <p className="text-13 text-text-muted mb-4">All progress will be lost.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDiscard(false)} className="flex-1 py-1.5 border border-border rounded text-13 font-medium">Cancel</button>
              <button onClick={() => navigate('/')} className="flex-1 py-1.5 bg-error text-white rounded text-13 font-semibold">Discard Draft</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
