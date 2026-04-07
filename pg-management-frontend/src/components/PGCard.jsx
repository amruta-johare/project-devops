const LocationIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const BedIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8"/>
    <path d="M2 10V6a2 2 0 012-2h4a2 2 0 012 2v4"/>
    <line x1="2" y1="16" x2="22" y2="16"/>
  </svg>
)

const DoorIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="2" width="18" height="20" rx="1"/>
    <circle cx="14.5" cy="12" r="1"/>
  </svg>
)

/**
 * PGCard — used in tenant's Browse PGs page
 * Props: pg (object), onApply (function)
 */
export default function PGCard({ pg, onApply }) {
  // Determine availability color
  const availPct = pg.totalRooms > 0 ? pg.availableRooms / pg.totalRooms : 0
  const availColor = availPct > 0.5 ? 'text-emerald-600' : availPct > 0 ? 'text-amber-600' : 'text-red-500'
  const availBg = availPct > 0.5 ? 'bg-emerald-50' : availPct > 0 ? 'bg-amber-50' : 'bg-red-50'

  return (
    <div className="card p-5 flex flex-col h-full hover:shadow-md transition-shadow duration-200">

      {/* Top row: name + price */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-800 text-[15px] leading-tight line-clamp-2">
          {pg.name}
        </h3>
        <div className="text-right flex-shrink-0">
          <span className="text-indigo-600 font-semibold text-base">
            ₹{pg.rent.toLocaleString()}
          </span>
          <span className="text-slate-400 text-xs block">/ month</span>
        </div>
      </div>

      {/* Meta: location + BHK */}
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center gap-1 text-slate-500 text-xs">
          <LocationIcon /> {pg.location}
        </span>
        <span className="flex items-center gap-1 text-slate-500 text-xs">
          <BedIcon /> {pg.bhkType}
        </span>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
        {pg.description || 'No description provided.'}
      </p>

      {/* Availability pill */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${availBg} ${availColor} self-start`}>
        <DoorIcon />
        {pg.availableRooms} of {pg.totalRooms} rooms available
      </div>

      {/* CTA */}
      <button
        onClick={() => onApply(pg.id)}
        disabled={pg.availableRooms === 0}
        className="w-full btn-primary text-center disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pg.availableRooms === 0 ? 'No Rooms Available' : 'Apply / Show Interest'}
      </button>

    </div>
  )
}