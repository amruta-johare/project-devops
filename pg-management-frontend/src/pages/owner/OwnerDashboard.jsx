import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { getMyPGs, deletePG } from '../../api/pgApi'

const EditIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)

function SkeletonRow() {
  return (
    <div className="px-5 py-4 animate-pulse border-b border-slate-50">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-4 bg-slate-100 rounded w-44 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-32" />
        </div>
        <div className="flex gap-2">
          <div className="h-7 bg-slate-100 rounded-lg w-20" />
          <div className="h-7 bg-slate-100 rounded-lg w-16" />
          <div className="h-7 bg-slate-100 rounded-lg w-16" />
        </div>
      </div>
    </div>
  )
}

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [pgs, setPGs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  async function fetchMyPGs() {
    setLoading(true)
    try {
      const res = await getMyPGs()
      setPGs(res.data)
    } catch {
      setPGs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMyPGs() }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this PG listing? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deletePG(id)
      fetchMyPGs()
    } catch {
      alert('Delete failed. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  // Summary stats
  const totalRooms = pgs.reduce((s, p) => s + p.totalRooms, 0)
  const availRooms = pgs.reduce((s, p) => s + p.availableRooms, 0)

  return (
    <PageLayout title="My PG Listings">

      {/* Stats row */}
      {!loading && pgs.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Listings', value: pgs.length },
            { label: 'Total Rooms',    value: totalRooms },
            { label: 'Available',      value: availRooms },
          ].map(s => (
            <div key={s.label} className="card px-5 py-4">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{s.label}</p>
              <p className="text-2xl font-semibold text-slate-800">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Header with Add button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">
          {!loading && `${pgs.length} listing${pgs.length !== 1 ? 's' : ''}`}
        </p>
        <button
          onClick={() => navigate('/owner/add-pg')}
          className="btn-primary"
        >
          + Add New PG
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">

        {/* Table head */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-slate-100 text-xs font-medium text-slate-400 uppercase tracking-wide">
          <span>PG Name</span>
          <span className="text-right">Rent</span>
          <span className="text-right">BHK</span>
          <span className="text-right">Rooms</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
        ) : pgs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm mb-4">No listings yet.</p>
            <button onClick={() => navigate('/owner/add-pg')} className="btn-primary">
              Add your first PG
            </button>
          </div>
        ) : (
          pgs.map((pg, idx) => (
            <div
              key={pg.id}
              className={`flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-3 sm:gap-4 items-start sm:items-center
                px-5 py-4 hover:bg-slate-50 transition-colors
                ${idx !== pgs.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              {/* Name + location */}
              <div>
                <p className="font-medium text-slate-800 text-sm">{pg.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{pg.location}</p>
              </div>

              <span className="text-sm font-medium text-slate-700 text-right">
                ₹{pg.rent.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 text-right">{pg.bhkType}</span>
              <span className="text-sm text-slate-500 text-right">
                {pg.availableRooms}/{pg.totalRooms}
              </span>

              {/* Action buttons */}
              <div className="flex gap-2 sm:justify-end">
                <button
                  onClick={() => navigate(`/owner/applicants/${pg.id}`)}
                  className="flex items-center gap-1.5 btn-ghost text-xs px-3 py-1.5"
                >
                  <UsersIcon /> Applicants
                </button>
                <button
                  onClick={() => navigate(`/owner/edit-pg/${pg.id}`, { state: { pg } })}
                  className="flex items-center gap-1.5 btn-ghost text-xs px-3 py-1.5"
                >
                  <EditIcon /> Edit
                </button>
                <button
                  onClick={() => handleDelete(pg.id)}
                  disabled={deletingId === pg.id}
                  className="flex items-center gap-1.5 btn-danger"
                >
                  <TrashIcon /> {deletingId === pg.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </PageLayout>
  )
}