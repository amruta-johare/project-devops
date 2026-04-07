import api from './axiosInstance'

// GET /tenants/available?college=  — owner views unbooked tenants
export const getAvailableTenants = (college = '') =>
  api.get('/tenants/available', { params: college ? { college } : {} })