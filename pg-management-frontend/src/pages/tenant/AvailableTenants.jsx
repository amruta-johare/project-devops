import { useState, useEffect } from 'react'
import PageLayout from '../../components/PageLayout'
import { getAvailableTenants } from '../../api/tenantApi'

function Avatar({ name }) {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-pink-100 text-pink-700',
    'bg-slate-200 text-slate-600',
  ]
  // pick a consistent color per name
  const idx = (name.charCodeAt(0) || 0) % colors.length
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${colors[idx]}`}>
      {name[0].toUpperCase()}
    </div>
  )
}

function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 px-5 py-4 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0" />
      <div>
        <div className="h-3.5 bg-slate-100 rounded w-32 mb-1.5" />
        <div className="h-3 bg-slate-100 rounded w-20" />
      </div>
    </div>
  )
}

export default function AvailableTenants() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [college, setCollege] = useState('')

  async function fetchTenants() {
    setLoading(true)
    try {
      const res = await getAvailableTenants(college)
      setTenants(res.data)
    } catch {
      setTenants([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTenants() }, [])

  return (
    <PageLayout title="Available Tenants">

      {/* Filter bar */}
      <div className="card px-5 py-4 mb-6 flex gap-3 items-end">
        <div className="flex flex-col gap-1 flex-1 max-w-xs">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">College</label>
          <input
            className="field"
            placeholder="Filter by college name"
            value={college}
            onChange={e => setCollege(e.target.value)}
          />
        </div>
        <button onClick={fetchTenants} className="btn-primary">
          Filter
        </button>
        <button onClick={() => { setCollege(''); fetchTenants() }} className="btn-ghost">
          Reset
        </button>
      </div>

      {/* Results */}
      {!loading && (
        <p className="text-sm text-slate-400 mb-4">
          {tenants.length === 0
            ? 'No available tenants found.'
            : `${tenants.length} tenant${tenants.length > 1 ? 's' : ''} looking for PGs`}
        </p>
      )}

      <div className="card overflow-hidden">
        {/* Header row */}
        <div className="px-5 py-3 border-b border-slate-100 text-xs font-medium text-slate-400 uppercase tracking-wide">
          Tenant
        </div>

        {loading ? (
          <><SkeletonItem /><SkeletonItem /><SkeletonItem /></>
        ) : tenants.length === 0 ? (
          <div className="text-center py-14 text-slate-400 text-sm">
            No available tenants match your search.
          </div>
        ) : (
          tenants.map((t, idx) => (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors
                ${idx !== tenants.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <Avatar name={t.name} />
              <div>
                <p className="text-sm font-medium text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {/* {t.tenantProfile?.college || 'College not specified'} */}
                </p>
              </div>
              <span className="ml-auto text-xs text-slate-300 font-mono">{t.email}</span>
            </div>
          ))
        )}
      </div>

    </PageLayout>
  )
}