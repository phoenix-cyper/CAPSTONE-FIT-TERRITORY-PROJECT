import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityContext } from './activityContext'

const STORAGE_KEY = 'fit-territory-demo-activities'

function readActivities() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Could not read saved demo activities.', error)
    return []
  }
}

export default function ActivityProvider({ children }) {
  const [status, setStatus] = useState('idle')
  const [elapsed, setElapsed] = useState(0)
  const [activities, setActivities] = useState(readActivities)

  useEffect(() => {
    if (status !== 'running') return undefined
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [status])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
    } catch (error) {
      console.error('Could not save demo activities.', error)
    }
  }, [activities])

  const distance = elapsed * 0.0015
  const start = useCallback(() => {
    if (status === 'idle') setElapsed(0)
    setStatus('running')
  }, [status])
  const pause = useCallback(() => setStatus('paused'), [])
  const stop = useCallback(() => {
    if (elapsed > 0) {
      setActivities((items) => [
        {
          id: `${Date.now()}`,
          date: new Date().toISOString(),
          duration: elapsed,
          distance: Number(distance.toFixed(2)),
          type: 'Demo walk',
          verified: false,
        },
        ...items,
      ])
    }
    setElapsed(0)
    setStatus('idle')
  }, [distance, elapsed])

  const value = useMemo(
    () => ({ status, elapsed, distance, activities, start, pause, stop }),
    [status, elapsed, distance, activities, start, pause, stop],
  )

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}
