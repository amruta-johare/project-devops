import api from './axiosInstance'

// POST /applications/:pgId  — tenant applies
export const applyToPG = (pgId) =>
  api.post(`/applications/${pgId}`)

// GET /applications/my  — tenant views own applications
export const getMyApplications = () =>
  api.get('/applications/my')

// GET /applications/pg/:pgId  — owner views applicants for a PG
export const getApplicantsForPG = (pgId) =>
  api.get(`/applications/pg/${pgId}`)

// PUT /applications/:appId?status=APPROVED|REJECTED
export const updateApplicationStatus = (appId, status) =>
  api.put(`/applications/${appId}`, null, { params: { status } })