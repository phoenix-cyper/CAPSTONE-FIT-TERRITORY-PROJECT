import apiClient from './apiClient'

export const userService = {
  getProfile: () => apiClient.get('/users/me').then((response) => response.data),
  updateProfile: (profile) => apiClient.patch('/users/me', profile).then((response) => response.data),
  updatePrivacy: (settings) =>
    apiClient.patch('/users/me/privacy', settings).then((response) => response.data),
}
