import api from './axiosInstance'

// POST /auth/signup
// Body: { user: { name, email, password, role }, college }
export const signup = (data) => api.post('/auth/signup', data)

// POST /auth/login  →  returns JWT string
export const login = (data) => api.post('/auth/login', data)