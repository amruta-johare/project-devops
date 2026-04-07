import { Navigate } from 'react-router-dom'

// Wrap any route that needs login with this component.
// If no token in localStorage → redirect to /login
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}