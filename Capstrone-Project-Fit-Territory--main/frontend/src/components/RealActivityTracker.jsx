
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './real-activity-tracker.css'
import { getActivities, createActivity } from '../api/activities'

const DEFAULT_CENTER = [20.5937, 78.9629]

function distanceBetween(a, b) {
  const toRad = value => (value * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) ** 2

  return 6371000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
}

export default function RealActivityTracker() {
  const mapElementRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const accuracyCircleRef = useRef(null)
  const routeLineRef = useRef(null)
  const watchIdRef = useRef(null)
  const lastPointRef = useRef(null)
  const routeRef = useRef([])
  const distanceRef = useRef(0)
  const startedAtRef = useRef(null)
  const elapsedBeforePauseRef = useRef(0)

  const [activityType, setActivityType] = useState('Running')
  const [status, setStatus] = useState('idle')
  const [elapsed, setElapsed] = useState(0)
  const [distance, setDistance] = useState(0)
  const [accuracy, setAccuracy] = useState(null)
  const [locationText, setLocationText] = useState('Location not found yet')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState([])

  // Initialize the map once.
  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return

    const map = L.map(mapElementRef.current, {
      zoomControl: true,
    }).setView(DEFAULT_CENTER, 5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    mapRef.current = map

    routeLineRef.current = L.polyline([], {
      color: '#b7e764',
      weight: 5,
      opacity: 0.9,
    }).addTo(map)

    // Try to find the location as soon as the map opens.
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          if (!mapRef.current) return

          const point = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          mapRef.current.setView([point.lat, point.lng], 17)

          if (markerRef.current) {
            markerRef.current.setLatLng([point.lat, point.lng])
          } else {
            markerRef.current = L.circleMarker([point.lat, point.lng], {
              radius: 9,
              color: '#ffffff',
              weight: 3,
              fillColor: '#2878ff',
              fillOpacity: 1,
            }).addTo(mapRef.current)
          }

          if (accuracyCircleRef.current) {
            accuracyCircleRef.current.setLatLng([point.lat, point.lng])
            accuracyCircleRef.current.setRadius(position.coords.accuracy)
          } else {
            accuracyCircleRef.current = L.circle(
              [point.lat, point.lng],
              {
                radius: position.coords.accuracy,
                color: '#2878ff',
                weight: 1,
                fillColor: '#2878ff',
                fillOpacity: 0.12,
              },
            ).addTo(mapRef.current)
          }

          setAccuracy(Math.round(position.coords.accuracy))
          setLocationText('Your location found')
        },
        geoError => {
          setError(
            geoError.code === 1
              ? 'Location permission denied. Allow location access in your browser settings.'
              : geoError.code === 2
                ? 'Your device could not determine your location. Try outdoors.'
                : 'Location request timed out. Try again outdoors.',
          )
          setLocationText('Location unavailable')
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 20000,
        },
      )
    } else {
      setError('This browser does not support GPS location.')
    }

    // Leaflet needs to recalculate its size after the layout renders.
    const resizeTimer = setTimeout(() => map.invalidateSize(), 200)

    return () => {
      clearTimeout(resizeTimer)

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }

      map.remove()
      mapRef.current = null
      markerRef.current = null
      accuracyCircleRef.current = null
      routeLineRef.current = null
    }
  }, [])

  // Load saved activities from the backend.
  useEffect(() => {
    getActivities()
      .then(setHistory)
      .catch(() => setError('Could not load saved activities from the backend.'))
  }, [])

  // Session timer.
  useEffect(() => {
    if (status !== 'running') return

    const timer = setInterval(() => {
      if (startedAtRef.current !== null) {
        const seconds =
          elapsedBeforePauseRef.current +
          Math.floor((Date.now() - startedAtRef.current) / 1000)

        setElapsed(seconds)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [status])

  function stopGps() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  function handlePosition(position) {
    const point = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: position.timestamp,
      accuracy: position.coords.accuracy,
    }

    setAccuracy(Math.round(point.accuracy))
    setLocationText('GPS signal received')
    setError('')

    if (markerRef.current) {
      markerRef.current.setLatLng([point.lat, point.lng])
    } else if (mapRef.current) {
      markerRef.current = L.circleMarker([point.lat, point.lng], {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#2878ff',
        fillOpacity: 1,
      }).addTo(mapRef.current)
    }

    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setLatLng([point.lat, point.lng])
      accuracyCircleRef.current.setRadius(point.accuracy)
    } else if (mapRef.current) {
      accuracyCircleRef.current = L.circle([point.lat, point.lng], {
        radius: point.accuracy,
        color: '#2878ff',
        fillColor: '#2878ff',
        fillOpacity: 0.12,
      }).addTo(mapRef.current)
    }

    // Keep the map following your location during an active session.
    if (mapRef.current && status !== 'paused') {
      mapRef.current.panTo([point.lat, point.lng], { animate: true })
    }

    // Ignore poor fixes for route distance, but still show the position.
    if (point.accuracy > 50) {
      setLocationText(`GPS signal weak — accuracy ±${Math.round(point.accuracy)} m`)
      return
    }

    const previous = lastPointRef.current

    if (previous) {
      const meters = distanceBetween(previous, point)
      const seconds = (point.timestamp - previous.timestamp) / 1000
      const speed = seconds > 0 ? meters / seconds : 0

      // Ignore tiny GPS drift and implausible jumps.
      if (meters < 3 || seconds <= 0 || speed > 12) return

      distanceRef.current += meters / 1000
      setDistance(distanceRef.current)
    }

    lastPointRef.current = point
    routeRef.current.push(point)

    if (routeLineRef.current) {
      routeLineRef.current.addLatLng([point.lat, point.lng])
    }
  }

  function startTracking() {
    setError('')
    setNotice('')

    if (!navigator.geolocation) {
      setError('GPS is not supported by this browser.')
      return
    }

    // Start GPS first. The timer starts when tracking begins.
    startedAtRef.current = Date.now()
    setStatus('running')

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      geoError => {
        setError(
          geoError.code === 1
            ? 'Location permission denied. Allow location access in browser settings.'
            : 'GPS signal unavailable. Try outdoors and retry.',
        )
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      },
    )
  }

  function pauseTracking() {
    elapsedBeforePauseRef.current = elapsed
    startedAtRef.current = null
    stopGps()
    setStatus('paused')
  }

  function resumeTracking() {
    setError('')
    startedAtRef.current = Date.now()
    setStatus('running')

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      geoError => {
        setError(
          geoError.code === 1
            ? 'Location permission denied.'
            : 'GPS signal unavailable. Try outdoors.',
        )
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      },
    )
  }

  async function finishTracking() {
    stopGps()
    startedAtRef.current = null
    setStatus('idle')
    setSaving(true)
    setError('')
    setNotice('')

    const durationMinutes = Math.floor(elapsed / 60)
    const distanceKm = Number(distanceRef.current.toFixed(3))
    const averagePaceSecondsPerKm =
      distanceKm > 0 ? Math.round(elapsed / distanceKm) : 0

    const payload = {
      activityType,
      activityMode: 'OUTDOOR',
      distanceKm,
      durationMinutes,
      calories: Math.round(elapsed / 60 * 5),
      activityDate: new Date().toISOString(),
      averagePaceSecondsPerKm,
      gpsRouteJson: JSON.stringify(routeRef.current),
      workoutDetailsJson: JSON.stringify({}),
    }

    try {
      const saved = await createActivity(payload)
      setHistory(previous => [saved, ...previous])
      setNotice('Activity saved successfully.')
      resetSession()
    } catch {
      setError('Could not save activity. Check that your backend is running, then try again.')
    } finally {
      setSaving(false)
    }
  }

  function resetSession() {
    stopGps()
    setStatus('idle')
    setElapsed(0)
    setDistance(0)
    setAccuracy(null)
    distanceRef.current = 0
    elapsedBeforePauseRef.current = 0
    startedAtRef.current = null
    lastPointRef.current = null
    routeRef.current = []

    routeLineRef.current?.setLatLngs([])

    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current)
      markerRef.current = null
    }

    if (accuracyCircleRef.current && mapRef.current) {
      mapRef.current.removeLayer(accuracyCircleRef.current)
      accuracyCircleRef.current = null
    }

    setLocationText('Location not found yet')
  }

  return (
    <div className="real-tracker">
      <section className="rt-panel">
        <div className="rt-heading">
          <div>
            <h2>Live GPS tracker</h2>
            <p>Allow location access to show your current position and record your route.</p>
          </div>
          <span className={`rt-status ${status}`}>
            {status === 'running' ? 'TRACKING' : status === 'paused' ? 'PAUSED' : 'READY'}
          </span>
        </div>

        <label className="rt-label">
          Activity
          <select
            value={activityType}
            onChange={event => setActivityType(event.target.value)}
            disabled={status !== 'idle'}
          >
            {['Running', 'Walking', 'Hiking', 'Cycling'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <div className="rt-metrics">
          <div className="rt-metric">
            <span>DURATION</span>
            <strong>{formatTime(elapsed)}</strong>
          </div>
          <div className="rt-metric">
            <span>DISTANCE</span>
            <strong>{distance.toFixed(2)} km</strong>
          </div>
          <div className="rt-metric">
            <span>GPS ACCURACY</span>
            <strong>{accuracy === null ? '—' : `±${accuracy} m`}</strong>
          </div>
        </div>

        <p className="rt-muted">{locationText}</p>

        {error && <p className="rt-error" role="alert">{error}</p>}
        {notice && <p className="rt-notice">{notice}</p>}

        <div className="rt-actions">
          {status === 'idle' && (
            <button className="rt-primary-button" onClick={startTracking}>
              Start tracking
            </button>
          )}

          {status === 'running' && (
            <button className="rt-secondary-button" onClick={pauseTracking}>
              Pause
            </button>
          )}

          {status === 'paused' && (
            <button className="rt-primary-button" onClick={resumeTracking}>
              Resume
            </button>
          )}

          {status !== 'idle' && (
            <button
              className="rt-finish-button"
              onClick={finishTracking}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Finish & save'}
            </button>
          )}
        </div>

        <p className="rt-muted">
          Blue dot: current location. Blue circle: estimated GPS uncertainty.
          A weak GPS signal can make the route less accurate.
        </p>
      </section>

      <section className="rt-map-panel">
        <div className="rt-heading">
          <div>
            <h2>Your location and route</h2>
            <p>The map follows your GPS position while tracking.</p>
          </div>
          <span className="rt-map-tag">LIVE MAP</span>
        </div>
        <div
          ref={mapElementRef}
          className="rt-map"
          role="application"
          aria-label="Map showing your GPS location and activity route"
        />
      </section>

      <section className="rt-history">
        <h2>Activity history</h2>
        {history.length === 0 ? (
          <p className="rt-muted">Your saved activities will appear here.</p>
        ) : (
          <div className="rt-history-list">
            {history.map((item, index) => (
              <div className="rt-history-row" key={item.id ?? index}>
                <div>
                  <strong>{item.activityType}</strong>
                  <p>{item.activityDate ? new Date(item.activityDate).toLocaleString() : 'Saved activity'}</p>
                </div>
                <div className="rt-history-values">
                  <strong>{Number(item.distanceKm || 0).toFixed(2)} km</strong>
                  <span>{item.durationMinutes || 0} min</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
