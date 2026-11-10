import apiClient from './apiClient'

export const workoutService = {
  plans: (params) => apiClient.get('/workouts/plans', { params }).then((response) => response.data),
  exercises: (params) => apiClient.get('/workouts/exercises', { params }).then((response) => response.data),
  complete: (workoutId, result) =>
    apiClient.post(`/workouts/${workoutId}/complete`, result).then((response) => response.data),
}
