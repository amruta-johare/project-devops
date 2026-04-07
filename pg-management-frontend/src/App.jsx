import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TenantHome from './pages/tenant/TenantHome'
import MyApplications from './pages/tenant/MyApplications'
import AvailableTenants from './pages/tenant/AvailableTenants'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import AddPG from './pages/owner/AddPG'
import EditPG from './pages/owner/EditPG'
import Applicants from './pages/owner/Applicants'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/tenant/home"
          element={<ProtectedRoute><TenantHome /></ProtectedRoute>} />
        <Route path="/tenant/applications"
          element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
        <Route path="/tenant/tenants"
          element={<ProtectedRoute><AvailableTenants /></ProtectedRoute>} />

        <Route path="/owner/dashboard"
          element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/add-pg"
          element={<ProtectedRoute><AddPG /></ProtectedRoute>} />
        <Route path="/owner/edit-pg/:id"
          element={<ProtectedRoute><EditPG /></ProtectedRoute>} />
        <Route path="/owner/applicants/:pgId"
          element={<ProtectedRoute><Applicants /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}