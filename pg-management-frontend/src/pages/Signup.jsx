import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../api/authApi'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'TENANT', college: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setError('')
    setLoading(true)
    try {
      const payload = {
        user: { name: form.name, email: form.email, password: form.password, role: form.role },
        college: form.role === 'TENANT' ? form.college : ''
      }
      await signup(payload)
      navigate('/login')
    } catch {
      setError('Signup failed. This email may already be registered.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-slate-900 px-10 py-12 flex-shrink-0">
        <span className="text-white font-semibold text-base tracking-tight">RoomGo</span>
        <div>
          <p className="text-2xl font-semibold text-white leading-snug mb-3">
            Join thousands of<br />students & owners.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create your account in seconds. Find PGs or list your property.
          </p>
        </div>
        <p className="text-slate-600 text-xs">Student Housing Platform</p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <h2 className="text-2xl font-semibold text-slate-800 mb-1">Create your account</h2>
          <p className="text-slate-400 text-sm mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <div className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Full name</label>
              <input className="field" placeholder="Your name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Email address</label>
              <input className="field" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <input className="field" type="password" placeholder="Choose a password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>

            {/* Role toggle */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {['TENANT', 'OWNER'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-all
                      ${form.role === r
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {r === 'TENANT' ? 'Tenant' : 'PG Owner'}
                  </button>
                ))}
              </div>
            </div>

            {/* College — only for tenants */}
            {form.role === 'TENANT' && (
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">College name</label>
                <input className="field" placeholder="e.g. SPIT, VIT"
                  value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} />
              </div>
            )}

          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

        </div>
      </div>
    </div>
  )
}