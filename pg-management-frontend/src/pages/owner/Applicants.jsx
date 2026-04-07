import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { getApplicantsForPG, updateApplicationStatus } from '../../api/applicationApi'

const StatusBadge = ({ status }) => {
  const map = {
    PENDING:  'badge-pending',
    APPROVED: 'badge-approved',
    REJECTED: 'badge-rejected',
  }
  return <span className={map[status] || 'badge-pending'}>{status}</span>
}

function Avatar({ name }) {
  return (
    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
      {name[0].toUpperCase()}
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between px-5 py-4 animate-pulse border-b border-slate-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100" />
        <div>
          <div className="h-3.5 bg-slate-100 rounded w-32 mb-1.5" />
          <div className="h-3 bg-slate-100 rounded w-24" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-7 bg-slate-100 rounded-lg w-20" />
        <div className="h-7 bg-slate-100 rounded-lg w-16" />
      </div>
    </div>
  )
}

export default function Applicants() {
  const { pgId } = useParams()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, msg: '', ok: true })
  const [updating, setUpdating] = useState(null)

  function showToast(msg, ok = true) {
    setToast({ show: true, msg, ok })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000)
  }

  useEffect(() => {
    getApplicantsForPG(pgId)
      .then(res => setApps(res.data))
      .catch(() => setApps([]))
      .finally(() => setLoading(false))
  }, [pgId])

  async function handleStatus(appId, status) {
    setUpdating(appId + status)
    try {
      const res = await updateApplicationStatus(appId, status)
      // Update just this row without re-fetching everything
      setApps(prev => prev.map(a => a.id === appId ? res.data : a))
      showToast(`Application ${status.toLowerCase() === 'approved' ? 'approved' : 'rejected'}.`, status === 'APPROVED')
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed.', false)
    } finally {
      setUpdating(null)
    }
  }

  // Counts for the mini summary
  const pending  = apps.filter(a => a.status === 'PENDING').length
  const approved = apps.filter(a => a.status === 'APPROVED').length

  return (
    <PageLayout title={`Applicants — PG #${pgId}`}>

      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white
          ${toast.ok ? 'bg-emerald-600' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Summary row */}
      {!loading && apps.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total',    value: apps.length },
            { label: 'Pending',  value: pending },
            { label: 'Approved', value: approved },
          ].map(s => (
            <div key={s.label} className="card px-5 py-4">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{s.label}</p>
              <p className="text-2xl font-semibold text-slate-800">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">

        {/* Table head */}
        <div className="px-5 py-3 border-b border-slate-100 text-xs font-medium text-slate-400 uppercase tracking-wide">
          Applicant
        </div>

        {loading ? (
          <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
        ) : apps.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No applicants yet.
          </div>
        ) : (
          apps.map((app, idx) => (
            <div
              key={app.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors
                ${idx !== apps.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              {/* Left: avatar + info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar name={app.tenant.name} />
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-sm">{app.tenant.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{app.tenant.email}</p>
                </div>
              </div>

              {/* Status badge */}
              <StatusBadge status={app.status} />

              {/* Action buttons — only shown when PENDING */}
              {app.status === 'PENDING' && (
                <div className="flex gap-2 sm:ml-4">
                  <button
                    onClick={() => handleStatus(app.id, 'APPROVED')}
                    disabled={updating !== null}
                    className="btn-success"
                  >
                    {updating === app.id + 'APPROVED' ? '...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleStatus(app.id, 'REJECTED')}
                    disabled={updating !== null}
                    className="btn-danger"
                  >
                    {updating === app.id + 'REJECTED' ? '...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}

      </div>

    </PageLayout>
  )
}