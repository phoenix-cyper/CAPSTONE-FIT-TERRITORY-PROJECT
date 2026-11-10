
import { useEffect, useState } from 'react'
import { createActivity, getActivities } from '../api/activities'

const getToday = () => {
  const date = new Date()
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
  return localDate.toISOString().slice(0, 10)
}

const createEmptyForm = () => ({
  activityType: 'Running',
  distanceKm: '',
  durationMinutes: '',
  calories: '',
  activityDate: getToday(),
})

export default function ActivitiesPanel() {
  const [activities, setActivities] = useState([])
  const [form, setForm] = useState(createEmptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadActivities() {
      try {
        const data = await getActivities()

        if (!cancelled) {
          setActivities(data)
          setError('')
        }
      } catch {
        if (!cancelled) {
          setError(
            'Could not load activities. Check that the backend is running.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadActivities()

    return () => {
      cancelled = true
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const savedActivity = await createActivity({
        activityType: form.activityType,
        distanceKm: Number(form.distanceKm),
        durationMinutes: Number(form.durationMinutes),
        calories: Number(form.calories),
        activityDate: form.activityDate,
      })

      setActivities((current) => [savedActivity, ...current])
      setForm(createEmptyForm())
      setMessage('Activity saved successfully!')
    } catch {
      setError('Could not save activity. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const totalDistance = activities.reduce(
    (sum, activity) => sum + Number(activity.distanceKm || 0),
    0
  )

  const totalCalories = activities.reduce(
    (sum, activity) => sum + Number(activity.calories || 0),
    0
  )

  const totalMinutes = activities.reduce(
    (sum, activity) => sum + Number(activity.durationMinutes || 0),
    0
  )

  return (
    <section style={styles.panel}>
      <h2 style={styles.heading}>My Activities</h2>

      <p style={styles.subtitle}>
        Record your workouts and track your progress.
      </p>

      <div style={styles.statsGrid}>
        <StatCard label="Activities" value={activities.length} />
        <StatCard
          label="Total Distance"
          value={`${totalDistance.toFixed(1)} km`}
        />
        <StatCard label="Calories Burned" value={totalCalories} />
        <StatCard label="Active Time" value={`${totalMinutes} min`} />
      </div>

      <h3 style={styles.subheading}>Add an activity</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Activity type
          <select
            name="activityType"
            value={form.activityType}
            onChange={handleChange}
            required
            style={styles.field}
          >
            <option value="Running">Running</option>
            <option value="Walking">Walking</option>
            <option value="Cycling">Cycling</option>
            <option value="Hiking">Hiking</option>
            <option value="Workout">Workout</option>
          </select>
        </label>

        <label style={styles.label}>
          Distance (km)
          <input
            name="distanceKm"
            type="number"
            min="0"
            max="10000"
            step="0.1"
            value={form.distanceKm}
            onChange={handleChange}
            required
            style={styles.field}
            placeholder="e.g. 4.8"
          />
        </label>

        <label style={styles.label}>
          Duration (minutes)
          <input
            name="durationMinutes"
            type="number"
            min="1"
            max="100000"
            step="1"
            value={form.durationMinutes}
            onChange={handleChange}
            required
            style={styles.field}
            placeholder="e.g. 42"
          />
        </label>

        <label style={styles.label}>
          Calories burned
          <input
            name="calories"
            type="number"
            min="0"
            max="1000000"
            step="1"
            value={form.calories}
            onChange={handleChange}
            required
            style={styles.field}
            placeholder="e.g. 318"
          />
        </label>

        <label style={styles.label}>
          Activity date
          <input
            name="activityDate"
            type="date"
            value={form.activityDate}
            onChange={handleChange}
            required
            style={styles.field}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{
            ...styles.button,
            opacity: saving ? 0.65 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save activity'}
        </button>
      </form>

      {error && (
        <p role="alert" style={styles.error}>
          {error}
        </p>
      )}

      {message && (
        <p role="status" style={styles.success}>
          {message}
        </p>
      )}

      <h3 style={styles.subheading}>Activity history</h3>

      {loading ? (
        <p style={styles.subtitle}>Loading activities...</p>
      ) : activities.length === 0 ? (
        <p style={styles.subtitle}>
          No activities found. Add your first activity above.
        </p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>Activity</th>
                <th style={styles.cell}>Distance</th>
                <th style={styles.cell}>Duration</th>
                <th style={styles.cell}>Calories</th>
                <th style={styles.cell}>Date</th>
              </tr>
            </thead>

            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td style={styles.cell}>{activity.activityType}</td>
                  <td style={styles.cell}>
                    {Number(activity.distanceKm).toFixed(1)} km
                  </td>
                  <td style={styles.cell}>
                    {activity.durationMinutes} min
                  </td>
                  <td style={styles.cell}>{activity.calories}</td>
                  <td style={styles.cell}>{activity.activityDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <strong style={styles.statValue}>{value}</strong>
    </div>
  )
}

const styles = {
  panel: {
    width: '100%',
    boxSizing: 'border-box',
    color: '#f4f7f0',
  },
  heading: {
    marginBottom: 8,
    fontSize: 24,
  },
  subtitle: {
    color: '#a7b4a8',
    fontSize: 14,
    lineHeight: 1.6,
  },
  subheading: {
    marginTop: 28,
    marginBottom: 16,
    fontSize: 18,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    padding: 16,
    background: '#17231b',
    border: '1px solid #314537',
    borderRadius: 12,
  },
  statLabel: {
    margin: '0 0 10px',
    color: '#a7b4a8',
    fontSize: 13,
  },
  statValue: {
    fontSize: 22,
    color: '#b7e764',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },
  label: {
    display: 'block',
    color: '#dce5da',
    fontSize: 13,
  },
  field: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: 7,
    padding: 11,
    border: '1px solid #49604c',
    borderRadius: 8,
    background: '#17231b',
    color: '#ffffff',
  },
  button: {
    alignSelf: 'end',
    minHeight: 42,
    padding: '11px 16px',
    border: 'none',
    borderRadius: 8,
    background: '#b7e764',
    color: '#17231b',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    color: '#ff9b9b',
    marginTop: 14,
  },
  success: {
    color: '#b7e764',
    marginTop: 14,
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: 13,
  },
  cell: {
    padding: '12px 10px',
    borderBottom: '1px solid #314537',
    whiteSpace: 'nowrap',
  },
}
