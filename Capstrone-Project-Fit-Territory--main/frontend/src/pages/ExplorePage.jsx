import { useState } from 'react'
import { ArrowRight, Compass, MapPin, Navigation, ShieldCheck } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import TerritoryMap from '../components/map/TerritoryMap'

const nearby = [
  { name: 'The Reservoir Loop', distance: '0.8 km away', length: '2.4 km route', state: 'EXPLORED', kind: 'captured' },
  { name: 'North Meadow Path', distance: '1.6 km away', length: '3.1 km route', state: 'NEW TERRITORY', kind: 'open' },
  { name: 'The Garden Gate', distance: '2.2 km away', length: '1.8 km route', state: 'CHALLENGE', kind: 'challenge' },
]

export default function ExplorePage() {
  const [selected, setSelected] = useState(null)
  return (
    <>
      <PageHeader eyebrow="OUT THERE, WAITING" title="Explore your world." description="Every route is a chance to make this place a little more yours." action={<button className="button button-secondary" onClick={() => document.querySelector('.territory-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}><Navigation size={16} /> Find my location</button>} />
      <section className="panel explore-map-panel">
        <div className="explore-map-heading"><div><span className="eyebrow">YOUR NEIGHBORHOOD</span><h2>Central Park & surroundings</h2><p>Demo map data · Start an activity to record your route</p></div><span className="explore-area"><MapPin size={14} /> New York, NY</span></div>
        <TerritoryMap />
      </section>
      <div className="explore-details-grid">
        <section className="panel nearby-panel">
          <div className="section-heading"><div><h2>Nearby discoveries</h2><p>Routes and places to explore</p></div><span className="nearby-count">3 spots</span></div>
          <div className="nearby-list">
            {nearby.map((spot) => (
              <button className={`nearby-row ${selected === spot.name ? 'nearby-selected' : ''}`} key={spot.name} onClick={() => setSelected(spot.name)}>
                <span className={`nearby-marker ${spot.kind}`}><MapPin size={17} /></span>
                <span className="nearby-copy"><strong>{spot.name}</strong><small>{spot.distance} · {spot.length}</small></span>
                <span className={`nearby-state ${spot.kind}`}>{spot.state}</span>
                <ArrowRight size={16} className="nearby-arrow" />
              </button>
            ))}
          </div>
        </section>
        <section className="panel map-info-panel">
          <div className="map-info-icon"><Compass size={21} /></div>
          <span className="eyebrow">HOW TERRITORY WORKS</span>
          <h2>Your steps tell a story.</h2>
          <p>Explore zones by completing activities. Territory is shown as sample data in this demo; real captures need to be verified by your backend.</p>
          <div className="info-divider" />
          <div className="info-note"><ShieldCheck size={16} /><span>Your precise location stays on this device unless you choose otherwise.</span></div>
          <a className="text-link" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">About OpenStreetMap <ArrowRight size={14} /></a>
        </section>
      </div>
    </>
  )
}
