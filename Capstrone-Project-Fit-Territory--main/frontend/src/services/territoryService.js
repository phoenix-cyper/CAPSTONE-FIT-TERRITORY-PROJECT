import apiClient from './apiClient'

export const territoryService = {
  nearby: (params) => apiClient.get('/territories/nearby', { params }).then((response) => response.data),
  capture: (territoryId, activityId) =>
    apiClient.post(`/territories/${territoryId}/capture`, { activityId }).then((response) => response.data),
}
