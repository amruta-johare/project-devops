import axios from 'axios'

// Base URL is empty — Vite proxy forwards /pg, /auth etc. to localhost:8080
const api = axios.create({
  baseURL: "http://localhost:8080",
})

// Automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api