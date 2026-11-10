import apiClient from './apiClient'

export const leaderboardService = {
  get: (period = 'weekly') =>
    apiClient.get('/leaderboard', { params: { period } }).then((response) => response.data),
}
