
import apiClient from '../services/apiClient'

const getActivities = async () => {
  const response = await apiClient.get('/activities')
  return response.data
}

const createActivity = async (activity) => {
  const response = await apiClient.post('/activities', activity)
  return response.data
}

export { getActivities, createActivity }
