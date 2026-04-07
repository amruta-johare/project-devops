import { useNavigate } from 'react-router-dom'

// Illustration stays SAME
function BuildingIllustration() {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs opacity-95">
      <rect x="0" y="240" width="320" height="4" rx="2" fill="#e2e8f0"/>
      <rect x="80" y="60" width="160" height="184" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5"/>
      <rect x="80" y="60" width="160" height="20" rx="6" fill="#4f46e5"/>

      {[0,1,2].map(row =>
        [0,1,2,3].map(col => (
          <rect
            key={`${row}-${col}`}
            x={100 + col * 35}
            y={100 + row * 42}
            width="20"
            height="24"
            rx="4"
            fill={row === 1 && col === 1 ? '#4f46e5' : '#e0e7ff'}
          />
        ))
      )}

      <rect x="146" y="200" width="28" height="44" rx="4" fill="#4f46e5"/>

      <rect x="20" y="130" width="52" height="114" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
      <rect x="248" y="110" width="52" height="134" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>

      {[0,1,2].map(row =>
        [0,1].map(col => (
          <rect key={`sl-${row}-${col}`} x={30 + col*22} y={145 + row*30} width="14" height="16" rx="3" fill="#c7d2fe"/>
        ))
      )}

      {[0,1,2].map(row =>
        [0,1].map(col => (
          <rect key={`sr-${row}-${col}`} x={256 + col*22} y={125 + row*30} width="14" height="16" rx="3" fill="#c7d2fe"/>
        ))
      )}
    </svg>
  )
}

function CheckItem({ text }) {
  return (
    <li className="flex items-start gap-3 text-slate-600 text-sm">
      <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
        <svg width="10" height="10" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
      {text}
    </li>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-50 flex flex-col">

      {/* NAVBAR */}
      <nav className="px-10 py-5 flex justify-between items-center backdrop-blur-md bg-white/70 border-b border-slate-100 sticky top-0 z-10">
        <span className="font-semibold text-lg text-slate-800 tracking-tight">
          Room<span className="text-indigo-600">Go</span>
        </span>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-slate-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition"
          >
            Log in
          </button>

          <button
            onClick={() => navigate('/signup')}
            className="bg-indigo-600 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <main className="flex-1 flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-10 py-20 gap-20 w-full">

        {/* LEFT */}
        <div className="flex-1 max-w-xl">
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
            Student Housing Platform
          </span>

          <h1 className="text-5xl font-semibold text-slate-900 leading-tight mb-6 tracking-tight">
            Find your perfect <br />
            <span className="text-indigo-600">PG accommodation</span>
          </h1>

          <p className="text-slate-500 text-base leading-relaxed mb-10">
            Discover verified PGs that match your lifestyle. Filter by location, budget, and preferences — and apply instantly with zero hassle.
          </p>

          <ul className="space-y-3 mb-10">
            <CheckItem text="Smart filters for location, rent & BHK" />
            <CheckItem text="One-click apply with real-time tracking" />
            <CheckItem text="Easy management for PG owners" />
          </ul>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/signup')}
              className="bg-indigo-600 text-white px-7 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
            >
              Create free account
            </button>

            <button
              onClick={() => navigate('/login')}
              className="border border-slate-300 text-slate-700 px-7 py-3 rounded-lg font-medium hover:bg-slate-100 transition"
            >
              Log in instead
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-white/70 backdrop-blur-lg border border-slate-200 rounded-3xl p-12 shadow-xl w-full max-w-md flex items-center justify-center">
            <BuildingIllustration />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-8 py-6 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/60 backdrop-blur">
        © 2026 RoomGo — Student Housing Management System
      </footer>
    </div>
  )
}