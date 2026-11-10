import { useEffect, useState } from 'react'
import { isDemoMode } from '../services/apiClient'

export default function useApiResource(loader, demoData) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })

  useEffect(() => {
    let active = true
    const load = async () => {
      if (isDemoMode()) {
        setState({ data: demoData, loading: false, error: '' })
        return
      }
      setState({ data: null, loading: true, error: '' })
      try {
        const data = await loader()
        if (active) setState({ data, loading: false, error: '' })
      } catch (error) {
        console.error('Unable to load resource from the Fit Territory API.', error)
        if (active) {
          setState({
            data: null,
            loading: false,
            error: error.response?.data?.message || error.message || 'The backend request failed.',
          })
        }
      }
    }
    load()
    return () => { active = false }
  }, [loader, demoData])

  return state
}
