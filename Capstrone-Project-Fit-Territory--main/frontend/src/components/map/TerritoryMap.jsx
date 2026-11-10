import { useState } from 'react'
import { Circle, CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { LocateFixed, Layers3, MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

function RecenterButton({ point }) {
  const map = useMap()
  if (!point) return null
  map.setView(point, Math.max(map.getZoom(), 14), { animate: true })
  return null
}

const territoryZones = [
  { center: [40.779, -73.967], radius: 430, captured: true, label: 'Oakwood Green' },
  { center: [40.769, -73.952], radius: 350, captured: false, label: 'East Meadow' },
  { center: [40.79, -73.95], radius: 390, captured: true, label: 'North Ridge' },
  { center: [40.762, -73.974], radius: 300, captured: false, label: 'South Gate' },
]

export default function TerritoryMap({ tracking = false, compact = false }) {
  const [location, setLocation] = useState(null)
  const [locationMessage, setLocationMessage] = useState('')
  const [locating, setLocating] = useState(false)
  const center = [40.7768, -73.9654]

  const locate = () => {
    setLocationMessage('')
    if (!navigator.geolocation) {
      setLocationMessage('Location is not available in this browser.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation([coords.latitude, coords.longitude])
        setLocating(false)
      },
      (error) => {
        setLocationMessage(error.code === error.PERMISSION_DENIED ? 'Location permission was denied. Demo map remains available.' : 'Could not get your location. Try again outdoors.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    )
  }

  return (
    <div className={`territory-map ${compact ? 'map-compact' : ''}`}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={!compact} zoomControl={!compact}>
        <RecenterButton point={location} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {territoryZones.map((zone) => (
          <Circle key={zone.label} center={zone.center} radius={zone.radius} pathOptions={{
            color: zone.captured ? '#a5df6d' : '#d8ab5d',
            fillColor: zone.captured ? '#8fc858' : '#c99742',
            fillOpacity: zone.captured ? 0.18 : 0.12,
            weight: 2,
            dashArray: zone.captured ? undefined : '5 8',
          }}>
            <Tooltip>{zone.label} · {zone.captured ? 'Explored' : 'Unclaimed'}</Tooltip>
          </Circle>
        ))}
        <CircleMarker center={[40.7768, -73.9654]} radius={7} pathOptions={{ color: '#fff', fillColor: '#d0f86a', fillOpacity: 1, weight: 3 }}>
          <Tooltip>Trailhead · demo map</Tooltip>
        </CircleMarker>
        {location && <CircleMarker center={location} radius={9} pathOptions={{ color: '#fff', fillColor: '#59baff', fillOpacity: 1, weight: 3 }}><Tooltip>Your current location</Tooltip></CircleMarker>}
        {tracking && <Polyline positions={[[40.7768, -73.9654], [40.779, -73.967], [40.7805, -73.9605]]} pathOptions={{ color: '#d1f26b', weight: 4, dashArray: '8 8' }} />}
      </MapContainer>
      <div className="map-overlay map-overlay-top">
        <span className="map-status"><span className="status-dot" /> {tracking ? 'DEMO TRACKING' : 'TERRITORY VIEW'}</span>
        {!compact && <button className="map-tool" aria-label="Map layers"><Layers3 size={17} /></button>}
      </div>
      <button className="map-locate" onClick={locate} disabled={locating} aria-label="Use my location">
        <LocateFixed size={17} /> {locating ? 'Finding you…' : 'My location'}
      </button>
      <div className="map-legend">
        <span><i className="legend-captured" /> Explored</span><span><i className="legend-open" /> Unclaimed</span>
      </div>
      {locationMessage && <div className="map-message"><MapPin size={14} />{locationMessage}</div>}
      <div className="map-credit">OpenStreetMap · Demo territory data</div>
    </div>
  )
}
