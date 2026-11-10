import apiClient from './apiClient'

export const activityService = {
  list: (params) => apiClient.get('/activities', { params }).then((response) => response.data),
  get: (id) => apiClient.get(`/activities/${id}`).then((response) => response.data),
  create: (activity) => apiClient.post('/activities', activity).then((response) => response.data),
  summary: () => apiClient.get('/activities/summary').then((response) => response.data),
}
