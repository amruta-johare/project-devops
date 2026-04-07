import { useState } from 'react'
import Sidebar from './Sidebar'

// The bell / search icon in the header (purely decorative — easy to wire up later)
const BellIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

const ChevronIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

/**
 * Wrap every authenticated page with this:
 *
 *   <PageLayout title="Browse PGs">
 *     ...content...
 *   </PageLayout>
 */
export default function PageLayout({ title, children }) {
  const name = localStorage.getItem('name') || 'User'
  const role = localStorage.getItem('role') || ''
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Sidebar />

      {/* Main area shifted right by sidebar width on md+ */}
      <div className="md:ml-56 flex flex-col min-h-screen">

        {/* ── Top header ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
          {/* Page title */}
          <h1 className="text-[15px] font-semibold text-slate-800 pl-10 md:pl-0">{title}</h1>

          {/* Right side: bell + profile */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
              <BellIcon />
            </button>

            {/* Profile pill */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                  {name[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{name}</span>
                <span className="text-slate-400 hidden sm:block"><ChevronIcon /></span>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-10 w-52 bg-white border border-slate-100 rounded-2xl shadow-lg p-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-sm font-medium text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{role.toLowerCase()} account</p>
                  </div>
                  <button
                    onClick={() => { localStorage.clear(); window.location.href = '/' }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl mt-1 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}