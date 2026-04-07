import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// SVG icon components — no emoji, no external lib needed
const Icons = {
  home: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  file: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  plus: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  list: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  x: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
}

// Tenant nav items
const tenantNav = [
  { label: 'Browse PGs',       icon: Icons.home,  path: '/tenant/home' },
  { label: 'My Applications',  icon: Icons.file,  path: '/tenant/applications' },
  { label: 'Other Tenants',    icon: Icons.users, path: '/tenant/tenants' },
]

// Owner nav items
const ownerNav = [
  { label: 'My PGs',    icon: Icons.list, path: '/owner/dashboard' },
  { label: 'Add PG',   icon: Icons.plus, path: '/owner/add-pg' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem('role')       // 'TENANT' or 'OWNER'
  const name = localStorage.getItem('name') || 'User'
  const [open, setOpen] = useState(false)         // mobile drawer state

  const navItems = role === 'TENANT' ? tenantNav : ownerNav

  function logout() {
    localStorage.clear()
    navigate('/')
  }

  // Shared sidebar content
  function SidebarContent() {
    return (
      <div className="flex flex-col h-full">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <span className="text-white font-semibold text-base tracking-tight">RoomGo</span>
          <p className="text-slate-400 text-xs mt-0.5 font-normal">{role === 'TENANT' ? 'Tenant' : 'Owner'} Portal</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setOpen(false) }}
              className={`nav-link w-full text-left ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="opacity-70">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-white/10">
          {/* User chip */}
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{name}</p>
              <p className="text-slate-400 text-xs capitalize">{role?.toLowerCase()}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="nav-link w-full text-left mt-1 text-slate-400 hover:text-red-400"
          >
            <span className="opacity-70">{Icons.logout}</span>
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-slate-900 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile: hamburger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-slate-900 text-white rounded-xl shadow-lg"
      >
        {Icons.menu}
      </button>

      {/* ── Mobile: drawer overlay ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          {/* drawer */}
          <aside className="relative w-56 bg-slate-900 h-full flex flex-col z-50">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              {Icons.x}
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}