import { useState, useEffect } from 'react'
import PageLayout from '../../components/PageLayout'
import PGCard from '../../components/PGCard'
import FilterBar from '../../components/FilterBar'
import { getAllPGs } from '../../api/pgApi'
import { applyToPG } from '../../api/applicationApi'

const EMPTY_FILTERS = { location: '', minRent: '', maxRent: '', bhkType: '' }

// Skeleton card for loading state
function CardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 bg-slate-100 rounded w-2/3" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
      </div>
      <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
      <div className="h-3 bg-slate-100 rounded w-full mb-2" />
      <div className="h-3 bg-slate-100 rounded w-4/5 mb-6" />
      <div className="h-9 bg-slate-100 rounded-xl" />
    </div>
  )
}

export default function TenantHome() {
  const [pgs, setPGs] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [toast, setToast] = useState({ show: false, msg: '', ok: true })

  function showToast(msg, ok = true) {
    setToast({ show: true, msg, ok })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500)
  }

  async function fetchPGs(activeFilters = filters) {
    setLoading(true)
    try {
      // Strip empty keys before sending as query params
      const clean = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v !== '')
      )
      const res = await getAllPGs(clean)
      setPGs(res.data)
    } catch {
      setPGs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPGs() }, [])

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS)
    fetchPGs(EMPTY_FILTERS)
  }

  async function handleApply(pgId) {
    try {
      await applyToPG(pgId)
      showToast('Application submitted successfully!', true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not apply — you may already have an approved PG.'
      showToast(msg, false)
    }
  }

  return (
    <PageLayout title="Browse PGs">

      {/* Toast notification */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all
          ${toast.ok ? 'bg-emerald-600' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onSearch={() => fetchPGs()}
        onReset={handleReset}
      />

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-slate-400 mb-4">
          {pgs.length === 0 ? 'No PGs found.' : `Showing ${pgs.length} PG${pgs.length > 1 ? 's' : ''}`}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : pgs.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="text-slate-400 text-sm">No PGs match your filters. Try resetting.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {pgs.map(pg => (
            <PGCard key={pg.id} pg={pg} onApply={handleApply} />
          ))}
        </div>
      )}

    </PageLayout>
  )
}