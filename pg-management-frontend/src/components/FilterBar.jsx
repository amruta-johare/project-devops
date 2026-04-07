const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)

/**
 * FilterBar — horizontal row of filters for browsing PGs
 *
 * Props:
 *   filters  — { location, minRent, maxRent, bhkType }
 *   onChange — (key, value) => void
 *   onSearch — () => void
 *   onReset  — () => void
 */
export default function FilterBar({ filters, onChange, onSearch, onReset }) {
  return (
    <div className="card px-5 py-4 mb-6">
      <div className="flex flex-wrap gap-3 items-end">

        {/* Location */}
        <div className="flex flex-col gap-1 min-w-[140px] flex-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Location</label>
          <input
            className="field"
            placeholder="e.g. Mumbai"
            value={filters.location}
            onChange={e => onChange('location', e.target.value)}
          />
        </div>

        {/* Min Rent */}
        <div className="flex flex-col gap-1 w-[120px]">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Min Rent</label>
          <input
            className="field"
            type="number"
            placeholder="0"
            value={filters.minRent}
            onChange={e => onChange('minRent', e.target.value)}
          />
        </div>

        {/* Max Rent */}
        <div className="flex flex-col gap-1 w-[120px]">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Max Rent</label>
          <input
            className="field"
            type="number"
            placeholder="Any"
            value={filters.maxRent}
            onChange={e => onChange('maxRent', e.target.value)}
          />
        </div>

        {/* BHK type */}
        <div className="flex flex-col gap-1 w-[110px]">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">BHK Type</label>
          <select
            className="field"
            value={filters.bhkType}
            onChange={e => onChange('bhkType', e.target.value)}
          >
            <option value="">Any</option>
            <option>1BHK</option>
            <option>2BHK</option>
            <option>3BHK</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 items-end pb-0.5">
          <button onClick={onSearch} className="btn-primary flex items-center gap-2">
            <SearchIcon /> Search
          </button>
          <button onClick={onReset} className="btn-ghost flex items-center gap-2">
            <FilterIcon /> Reset
          </button>
        </div>

      </div>
    </div>
  )
}