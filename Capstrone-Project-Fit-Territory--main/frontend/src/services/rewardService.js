import apiClient from './apiClient'

export const rewardService = {
  catalog: () => apiClient.get('/rewards').then((response) => response.data),
  wallet: () => apiClient.get('/rewards/wallet').then((response) => response.data),
  redeem: (rewardId) =>
    apiClient.post(`/rewards/${rewardId}/redeem`).then((response) => response.data),
}
