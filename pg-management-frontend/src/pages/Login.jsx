import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/authApi'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      const token = res.data

      // Decode role + name from JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]))
      const role = payload.role      // 'TENANT' or 'OWNER'
      const name = payload.name || payload.sub.split('@')[0]

      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('name', name)

      if (role === 'TENANT') navigate('/tenant/home')
      else navigate('/owner/dashboard')
    } catch {
      setError('Incorrect email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-slate-900 px-10 py-12 flex-shrink-0">
        <span className="text-white font-semibold text-base tracking-tight">RoomGo </span>
        <div>
          <p className="text-2xl font-semibold text-white leading-snug mb-3">
            Your next home<br />is one click away.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Thousands of verified PGs across the city. Filter by budget, BHK, and location.
          </p>
        </div>
        <p className="text-slate-600 text-xs">Student Housing Platform</p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <h2 className="text-2xl font-semibold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-8">
            No account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
              Create one free
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <input
                className="field"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                className="field"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

        </div>
      </div>
    </div>
  )
}