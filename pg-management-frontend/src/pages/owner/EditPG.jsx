import { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { updatePG } from '../../api/pgApi'

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

export default function EditPG() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()
  const existing = state?.pg    // passed from OwnerDashboard via router state

  const [form, setForm] = useState({
    name:           existing?.name           || '',
    location:       existing?.location       || '',
    rent:           existing?.rent           || '',
    bhkType:        existing?.bhkType        || '',
    description:    existing?.description    || '',
    totalRooms:     existing?.totalRooms     || '',
    availableRooms: existing?.availableRooms || '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleUpdate() {
    setError('')
    setLoading(true)
    try {
      await updatePG(id, {
        ...form,
        rent:           Number(form.rent),
        totalRooms:     Number(form.totalRooms),
        availableRooms: Number(form.availableRooms),
      })
      navigate('/owner/dashboard')
    } catch {
      setError('Update failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="Edit PG">
      <div className="max-w-2xl">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="card p-6 space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="PG Name">
              <input className="field" placeholder="PG Name"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Location">
              <input className="field" placeholder="Location"
                value={form.location} onChange={e => set('location', e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Monthly Rent (₹)">
              <input className="field" type="number"
                value={form.rent} onChange={e => set('rent', e.target.value)} />
            </Field>
            <Field label="BHK Type">
              <select className="field" value={form.bhkType} onChange={e => set('bhkType', e.target.value)}>
                <option value="">Select type</option>
                <option>1BHK</option><option>2BHK</option><option>3BHK</option><option>4BHK</option><option>5BHK</option><option>6BHK</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Total Rooms">
              <input className="field" type="number"
                value={form.totalRooms} onChange={e => set('totalRooms', e.target.value)} />
            </Field>
            <Field label="Available Rooms">
              <input className="field" type="number"
                value={form.availableRooms} onChange={e => set('availableRooms', e.target.value)} />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              className="field h-28 resize-none"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button onClick={handleUpdate} disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
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