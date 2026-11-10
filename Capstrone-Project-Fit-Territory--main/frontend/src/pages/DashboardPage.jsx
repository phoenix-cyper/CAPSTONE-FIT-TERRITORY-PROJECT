
import { useEffect, useState } from 'react'
import { checkBackendHealth } from '../api/backend'
import ActivitiesPanel from '../components/ActivitiesPanel'

export default function DashboardPage() {
  const [backendStatus, setBackendStatus] = useState('Checking...')

  useEffect(() => {
    checkBackendHealth()
      .then((data) => setBackendStatus(data.status || 'Unknown'))
      .catch(() => setBackendStatus('Unavailable'))
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '24px',
        background: '#101913',
        color: '#f4f7f0',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <header style={{ marginBottom: 28 }}>
        <div
          role="status"
          style={{
            marginBottom: 16,
            color: backendStatus === 'UP' ? '#b7e764' : '#e6b66a',
            fontSize: 13,
          }}
        >
          ● Backend: {backendStatus}
        </div>

        <p
          style={{
            color: '#b7e764',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          FITTERRITORY
        </p>

        <h1 style={{ fontSize: 32, marginBottom: 8 }}>
          Your Fitness Dashboard
        </h1>

        <p style={{ color: '#a7b4a8' }}>
          Track your activities, monitor your progress, and keep moving.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <MetricCard title="Your Activities" description="Saved to MySQL" />
        <MetricCard title="Activity Tracking" description="Running, walking, cycling and more" />
        <MetricCard title="Your Progress" description="Review your saved activity records" />
      </section>

      <section
        style={{
          padding: 20,
          background: '#17231b',
          border: '1px solid #314537',
          borderRadius: 16,
        }}
      >
        <ActivitiesPanel />
      </section>

      <footer
        style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: '1px solid #314537',
          color: '#a7b4a8',
          fontSize: 12,
        }}
      >
        FitTerritory · Move more. Explore more. Improve every day.
      </footer>
    </main>
  )
}

function MetricCard({ title, description }) {
  return (
    <article
      style={{
        padding: 20,
        background: '#17231b',
        border: '1px solid #314537',
        borderRadius: 14,
      }}
    >
      <h3 style={{ marginTop: 0, color: '#b7e764', fontSize: 16 }}>
        {title}
      </h3>

      <p style={{ marginBottom: 0, color: '#a7b4a8', fontSize: 13 }}>
        {description}
      </p>
    </article>
  )
}
