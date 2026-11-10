
import apiClient from '../services/apiClient'

export async function checkBackendHealth() {
  try {
    const response = await apiClient.get('/health')
    return response.data
  } catch (error) {
    console.error('Backend health check failed:', error)

    return {
      application: 'FitTerritory Backend',
      status: 'DOWN',
    }
  }
}
