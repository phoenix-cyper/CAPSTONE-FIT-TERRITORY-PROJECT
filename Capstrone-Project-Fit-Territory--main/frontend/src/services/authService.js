import apiClient from './apiClient'

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials).then((response) => response.data),
  register: (profile) => apiClient.post('/auth/register', profile).then((response) => response.data),
  logout: () => apiClient.post('/auth/logout').then((response) => response.data),
  me: () => apiClient.get('/auth/me').then((response) => response.data),
}
