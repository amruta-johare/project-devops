import { Link, useNavigate } from 'react-router-dom'

// Navbar reads role from localStorage to show correct links
export default function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') // 'TENANT' or 'OWNER'

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <span className="font-semibold text-gray-800 text-lg">🏠 PG Management</span>
      <div className="flex gap-4 items-center text-sm">

        {role === 'TENANT' && (
          <>
            <Link to="/tenant/home" className="text-gray-600 hover:text-blue-600">Browse PGs</Link>
            <Link to="/tenant/applications" className="text-gray-600 hover:text-blue-600">My Applications</Link>
            <Link to="/tenant/tenants" className="text-gray-600 hover:text-blue-600">Other Tenants</Link>
          </>
        )}

        {role === 'OWNER' && (
          <>
            <Link to="/owner/dashboard" className="text-gray-600 hover:text-blue-600">My PGs</Link>
            <Link to="/owner/add-pg" className="text-gray-600 hover:text-blue-600">+ Add PG</Link>
          </>
        )}

        <button onClick={logout}
          className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">
          Logout
        </button>
      </div>
    </nav>
  )
}