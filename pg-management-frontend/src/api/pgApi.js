import api from './axiosInstance'

// GET /pg?location=&minRent=&maxRent=&bhkType=
export const getAllPGs = (filters = {}) =>
  api.get('/pg', { params: filters })

// GET /pg/my  — owner only
export const getMyPGs = () => api.get('/pg/my')

// POST /pg
export const addPG = (data) => api.post('/pg', data)

// PUT /pg/:id
export const updatePG = (id, data) => api.put(`/pg/${id}`, data)

// DELETE /pg/:id
export const deletePG = (id) => api.delete(`/pg/${id}`)