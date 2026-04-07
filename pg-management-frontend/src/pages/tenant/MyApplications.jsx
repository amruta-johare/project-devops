import { useState, useEffect } from 'react'
import PageLayout from '../../components/PageLayout'
import { getMyApplications } from '../../api/applicationApi'

const StatusBadge = ({ status }) => {
  const map = {
    PENDING:  'badge-pending',
    APPROVED: 'badge-approved',
    REJECTED: 'badge-rejected',
  }
  const label = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' }
  return <span className={map[status] || 'badge-pending'}>{label[status] || status}</span>
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between px-5 py-4 animate-pulse">
      <div>
        <div className="h-4 bg-slate-100 rounded w-40 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-24" />
      </div>
      <div className="h-6 bg-slate-100 rounded-full w-20" />
    </div>
  )
}

export default function MyApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyApplications()
      .then(res => setApps(res.data))
      .catch(() => setApps([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout title="My Applications">

      <div className="card overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-slate-100 text-xs font-medium text-slate-400 uppercase tracking-wide">
          <span>PG Details</span>
          <span className="text-right">Rent</span>
          <span className="text-right">Status</span>
        </div>

        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : apps.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            You haven't applied to any PGs yet.
          </div>
        ) : (
          apps.map((app, idx) => (
            <div
              key={app.id}
              className={`grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-4
                ${idx !== apps.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              {/* PG info */}
              <div>
                <p className="font-medium text-slate-800 text-sm">{app.pg.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{app.pg.location} · {app.pg.bhkType}</p>
              </div>

              {/* Rent */}
              <span className="text-sm text-slate-600 font-medium text-right">
                ₹{app.pg.rent.toLocaleString()}
              </span>

              {/* Status */}
              <div className="text-right">
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))
        )}

      </div>

    </PageLayout>
  )
}