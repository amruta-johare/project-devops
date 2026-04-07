// ─── AddPG.jsx ────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { addPG } from '../../api/pgApi'

const EMPTY = {
  name: '', location: '', rent: '', bhkType: '',
  description: '', totalRooms: '', availableRooms: ''
}

// Shared label + field block
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

export default function AddPG() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      await addPG({
        ...form,
        rent: Number(form.rent),
        totalRooms: Number(form.totalRooms),
        availableRooms: Number(form.availableRooms),
      })
      navigate('/owner/dashboard')
    } catch {
      setError('Failed to add PG. Please check all fields and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Add New PG">
      <div className="max-w-2xl">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="card p-6 space-y-5">

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="PG Name">
              <input className="field" placeholder="e.g. Sunshine PG"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Location">
              <input className="field" placeholder="e.g. Andheri, Mumbai"
                value={form.location} onChange={e => set('location', e.target.value)} />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Monthly Rent (₹)">
              <input className="field" type="number" placeholder="6000"
                value={form.rent} onChange={e => set('rent', e.target.value)} />
            </Field>
            <Field label="BHK Type">
              <select className="field" value={form.bhkType} onChange={e => set('bhkType', e.target.value)}>
                <option value="">Select type</option>
                <option>1BHK</option><option>2BHK</option><option>3BHK</option>
              </select>
            </Field>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Total Rooms">
              <input className="field" type="number" placeholder="10"
                value={form.totalRooms} onChange={e => set('totalRooms', e.target.value)} />
            </Field>
            <Field label="Available Rooms">
              <input className="field" type="number" placeholder="5"
                value={form.availableRooms} onChange={e => set('availableRooms', e.target.value)} />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              className="field h-28 resize-none"
              placeholder="Describe the PG — nearby landmarks, rules, facilities..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSubmit} disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Add PG'}
            </button>
            <button onClick={() => navigate('/owner/dashboard')} className="btn-ghost">
              Cancel
            </button>
          </div>

        </div>
      </div>
    </PageLayout>
  )
}