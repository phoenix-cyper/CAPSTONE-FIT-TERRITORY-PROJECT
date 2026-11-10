import RealActivityTracker from '../components/RealActivityTracker'
import { useEffect, useMemo, useState } from 'react'
import { getProfile, updateProfile } from '../api/profile'
import { Link } from 'react-router-dom'
import {
  Activity, ArrowRight, Award, BadgeCheck, CalendarDays, Check,
  ChevronDown, CircleHelp, Clock3, Dumbbell, Flame, Footprints, Gift,
  Heart, Leaf, LockKeyhole, MapPin, Medal, Pause, Play,
  Plus, Route, Search, Send, Settings, Shield, Sparkles, Target,
  Trophy, Wallet, X,
} from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import SectionHeading from '../components/common/SectionHeading'
import TerritoryMap from '../components/map/TerritoryMap'
import { useActivity } from '../context/activityContext'
import {
  challenges, exercises, leaderboard, rewards, sampleActivities,
  transactions, workoutPlans,
} from '../data/demoData'
import { coachService } from '../services/coachService'

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remaining = seconds % 60
  return [hours, minutes, remaining].map((part) => String(part).padStart(2, '0')).join(':')
}

function ActivityControls() {
  const { status, elapsed, distance, start, pause, stop } = useActivity()
  return (
    <div className="activity-controls-wrap">
      <div className="tracking-state"><span className={`tracking-light ${status}`} />{status === 'running' ? 'DEMO SESSION IN PROGRESS' : status === 'paused' ? 'SESSION PAUSED' : 'READY WHEN YOU ARE'}</div>
      <div className="tracking-clock">{formatTime(elapsed)}</div>
      <div className="tracking-stats">
        <div><strong>{distance.toFixed(2)}</strong><span>KM · DEMO DISTANCE</span></div>
        <div><strong>{elapsed ? `${Math.round((distance / elapsed) * 3600)} km/h` : '—'}</strong><span>AVG SPEED</span></div>
        <div><strong>{elapsed ? `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}` : '—'}</strong><span>PACE / KM*</span></div>
      </div>
      <p className="tracking-disclaimer">Simulated demo distance only — no GPS route is being recorded. *Pace display is illustrative.</p>
      <div className="tracking-buttons">
        {status === 'running' ? (
          <button className="button button-secondary" onClick={pause}><Pause size={16} fill="currentColor" /> Pause</button>
        ) : (
          <button className="button button-primary" onClick={start}><Play size={16} fill="currentColor" /> {status === 'paused' ? 'Resume activity' : 'Start demo activity'}</button>
        )}
        {status !== 'idle' && <button className="button button-danger" onClick={stop}><Check size={16} /> Stop & save</button>}
      </div>
    </div>
  )
}

function ActivityHistory() {
  const { activities } = useActivity()
  const saved = activities.map((item) => ({ ...item, name: item.type, detail: `${new Date(item.date).toLocaleDateString()} · Demo`, distance: `${item.distance} km`, time: formatTime(item.duration) }))
  const rows = [...saved, ...sampleActivities]
  return (
    <div className="activity-list history-list">
      {rows.length === 0 ? <div className="empty-state">No activities yet. Start a demo session to see it here.</div> : rows.map((item, index) => (
        <div className="activity-row" key={item.id || item.name + index}>
          <div className={`activity-icon ${item.verified === false ? 'demo-activity-icon' : item.icon || 'walk'}`}><Footprints size={17} /></div>
          <div className="activity-name"><strong>{item.name}</strong><span>{item.detail}{item.verified === false && ' · Not verified'}</span></div>
          <div className="activity-numbers"><strong>{item.distance}</strong><span>{item.time}</span></div>
        </div>
      ))}
    </div>
  )
}


export function ActivityPage() {
  return (
    <>
      <PageHeader
        eyebrow="MOVE AT YOUR PACE"
        title="Activity tracker."
        description="Track outdoor GPS routes, strength sessions, HIIT and more."
        action={<span className="demo-pill"><span /> LIVE TRACKER</span>}
      />
      <RealActivityTracker />
    </>
  )
}


export function WorkoutsPage() {
  const [level, setLevel] = useState('All levels')
  const [started, setStarted] = useState('')
  const list = level === 'All levels' ? workoutPlans : workoutPlans.filter((plan) => plan.level.toLowerCase() === level.toLowerCase())
  return (
    <>
      <PageHeader eyebrow="BUILD YOUR PRACTICE" title="Training, your way." description="Flexible plans that fit the life you're living." action={<button className="button button-primary" onClick={() => document.querySelector('.plans-grid')?.scrollIntoView({ behavior: 'smooth' })}><Plus size={16} /> Find a plan</button>} />
      {started && <div className="inline-success"><Check size={16} /> {started} added to your week. Your plan is saved in this demo.</div>}
      <section className="workout-feature panel">
        <div className="feature-copy"><span className="feature-label"><Sparkles size={14} /> PLAN FOR YOU</span><h2>Ready for a new route?</h2><p>A balanced week of strength and walking can help you feel stronger on every trail.</p><div className="feature-meta"><span><CalendarDays size={14} /> 4 weeks</span><span><Clock3 size={14} /> 3 sessions / week</span><span><Flame size={14} /> All levels</span></div><Link className="button button-primary" to="/coach">Personalize with coach <ArrowRight size={15} /></Link></div>
        <div className="feature-art"><div className="art-sun" /><div className="art-hill hill-back" /><div className="art-hill hill-front" /><div className="art-route"><Route size={86} strokeWidth={1.1} /></div><span className="art-caption">FIND YOUR<br />NEXT SUMMIT</span></div>
      </section>
      <div className="section-heading plan-heading"><div><h2>Plans for every pace</h2><p>Pick a starting point. Adjust as you go.</p></div><label className="select-wrap"><span className="sr-only">Filter by experience level</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option>All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><ChevronDown size={15} /></label></div>
      <div className="plans-grid">
        {list.map((plan) => <article className={`panel plan-card plan-${plan.color}`} key={plan.title}><div className="plan-card-top"><span className={`plan-symbol ${plan.color}`}><Dumbbell size={19} /></span><span className={`level-tag ${plan.level.toLowerCase()}`}>{plan.level}</span></div><h3>{plan.title}</h3><p>{plan.description}</p><div className="plan-meta"><span><Clock3 size={14} />{plan.duration}</span><span><CalendarDays size={14} />{plan.days}</span></div><button className="button button-outline full-button" onClick={() => setStarted(plan.title)}>{started === plan.title ? <><Check size={15} /> Added to your week</> : <>Start this plan <ArrowRight size={15} /></>}</button></article>)}
      </div>
      <section className="panel schedule-panel"><SectionHeading title="Your week at a glance" subtitle="A gentle rhythm beats an all-or-nothing plan" /><div className="week-strip">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => <div className={`week-day ${index === 2 ? 'today' : ''}`} key={day}><span>{day}</span><strong>{20 + index}</strong><i className={index === 0 || index === 2 || index === 5 ? 'scheduled' : ''}>{index === 0 || index === 2 || index === 5 ? <Footprints size={15} /> : '—'}</i><small>{index === 0 || index === 2 || index === 5 ? 'Move' : 'Rest'}</small></div>)}</div></section>
    </>
  )
}

export function ExercisesPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [saved, setSaved] = useState([])
  const filtered = useMemo(() => exercises.filter((exercise) =>
    (filter === 'All' || exercise.category === filter) &&
    `${exercise.title} ${exercise.description} ${exercise.equipment}`.toLowerCase().includes(query.toLowerCase()),
  ), [filter, query])
  return (
    <>
      <PageHeader eyebrow="MOVE WITH INTENTION" title="Exercise library." description="Simple, practical movements for wherever you are." />
      <section className="library-toolbar panel"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movements or equipment" /></div><div className="filter-pills">{['All', 'Strength', 'Upper body', 'Mobility'].map((item) => <button key={item} className={`filter-pill ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)}>{item}</button>)}</div></section>
      {filtered.length === 0 ? <div className="panel empty-state">No exercises match that search. Try a different name or category.</div> : <div className="exercise-grid">{filtered.map((exercise, index) => <article className="panel exercise-card" key={exercise.title}><div className={`exercise-art exercise-art-${index % 4}`}><div className="exercise-art-ring"><Dumbbell size={28} /></div><span>DEMO MOVEMENT</span><button className={`save-exercise ${saved.includes(exercise.title) ? 'saved' : ''}`} onClick={() => setSaved((items) => items.includes(exercise.title) ? items.filter((item) => item !== exercise.title) : [...items, exercise.title])} aria-label={saved.includes(exercise.title) ? 'Remove from saved' : 'Save exercise'}><Heart size={17} fill={saved.includes(exercise.title) ? 'currentColor' : 'none'} /></button></div><div className="exercise-content"><div className="exercise-tags"><span>{exercise.category}</span><span>{exercise.equipment}</span></div><h3>{exercise.title}</h3><p>{exercise.description}</p><div className="exercise-bottom"><span><Target size={14} />{exercise.duration}</span><button className="text-link" onClick={() => setSaved((items) => items.includes(exercise.title) ? items : [...items, exercise.title])}>Add to routine <Plus size={14} /></button></div></div></article>)}</div>}
      <div className="demo-note"><CircleHelp size={15} /> Demonstration media placeholders only. Consider consulting a qualified professional before starting a new exercise routine.</div>
    </>
  )
}

export function CoachPage() {
  const [goal, setGoal] = useState('Build everyday energy')
  const [level, setLevel] = useState('Beginner')
  const [duration, setDuration] = useState('30 minutes')
  const [messages, setMessages] = useState([{ role: 'coach', text: 'Hi Jordan! Tell me what you’re working toward and I’ll put together a practical idea. I’m a local demo coach, not a connected AI.' }])
  const [busy, setBusy] = useState(false)
  const send = async () => {
    setBusy(true)
    setMessages((items) => [...items, { role: 'you', text: `${goal} · ${level} · ${duration}` }])
    try {
      const result = await coachService.recommend({ goal, level, duration })
      setMessages((items) => [...items, { role: 'coach', text: result.message + (result.demo ? ' (Local sample suggestion)' : '') }])
    } catch (error) {
      console.error('Coach request failed.', error)
      setMessages((items) => [...items, { role: 'error', text: `Could not reach the coach service: ${error.message}` }])
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <PageHeader eyebrow="A LITTLE GUIDANCE" title="Your fitness coach." description="Thoughtful ideas, shaped around your goals. Local recommendations are on." action={<span className="demo-pill"><span /> MOCK COACH</span>} />
      <div className="coach-layout">
        <section className="panel coach-chat-panel"><div className="chat-heading"><div className="coach-avatar"><Sparkles size={20} /></div><div><strong>Terri</strong><span><i /> Local demo coach</span></div><button className="icon-button" aria-label="Coach information"><CircleHelp size={17} /></button></div><div className="chat-messages">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><div className={message.role === 'coach' ? 'chat-coach-icon' : 'chat-user-icon'}>{message.role === 'coach' ? <Sparkles size={14} /> : 'JL'}</div><p>{message.text}</p></div>)}{busy && <div className="chat-typing">Terri is putting a suggestion together…</div>}</div><div className="chat-compose"><input aria-label="Ask the local demo coach" placeholder="Ask about your goals…" onKeyDown={(event) => { if (event.key === 'Enter' && !busy) send() }} /><button onClick={send} disabled={busy} className="button button-primary" aria-label="Send message"><Send size={16} /></button></div><div className="chat-footnote"><Shield size={13} /> Demo suggestions are generated locally. No AI service is connected.</div></section>
        <aside className="panel coach-preferences"><div className="section-heading"><div><h2>Your preferences</h2><p>Shape a useful suggestion</p></div><Settings size={16} /></div><label className="form-label">YOUR GOAL<select value={goal} onChange={(event) => setGoal(event.target.value)}><option>Build everyday energy</option><option>Get stronger for trails</option><option>Improve my endurance</option><option>Build a consistent habit</option></select></label><label className="form-label">EXPERIENCE LEVEL<select value={level} onChange={(event) => setLevel(event.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label className="form-label">TIME AVAILABLE<select value={duration} onChange={(event) => setDuration(event.target.value)}><option>15 minutes</option><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option></select></label><div className="equipment-box"><strong>Available equipment</strong><div><span className="equipment-chip selected"><Check size={12} /> Bodyweight</span><span className="equipment-chip">Dumbbells</span><span className="equipment-chip">Resistance band</span></div></div><button className="button button-primary full-button" onClick={send} disabled={busy}><Sparkles size={15} /> Get a suggestion</button></aside>
      </div>
      <section className="panel coach-safety"><Heart size={16} /><span>Listen to your body and adjust any suggestion to your needs. For medical advice or a personalized care plan, consult a qualified professional.</span></section>
    </>
  )
}

export function LeaderboardPage() {
  const [period, setPeriod] = useState('Weekly')
  return (
    <>
      <PageHeader eyebrow="FRIENDLY MILES, GOOD COMPANY" title="Your circle." description="A little inspiration from your community. All profiles and scores are sample data." action={<button className="button button-secondary"><Plus size={16} /> Invite a friend</button>} />
      <section className="leaderboard-hero panel"><div><span className="feature-label"><Trophy size={14} /> YOUR COMMUNITY</span><h2>Small steps. Big momentum.</h2><p>Celebrate movement together, wherever your paths take you.</p></div><div className="podium-emblem"><Trophy size={42} /><span>THIS WEEK</span></div></section>
      <section className="panel leaderboard-panel"><div className="leaderboard-toolbar"><div><h2>Distance leaderboard</h2><p>Sample rankings · No live location is shared</p></div><div className="segmented-control">{['Weekly', 'Monthly'].map((item) => <button className={period === item ? 'selected' : ''} key={item} onClick={() => setPeriod(item)}>{item}</button>)}</div></div><div className="leaderboard-table"><div className="leader-table-head"><span>RANK</span><span>ATHLETE</span><span>ACTIVITY</span><span>DISTANCE</span></div>{leaderboard.map((person, index) => <div className={`leader-table-row ${person.you ? 'you-row' : ''}`} key={person.name}><span className={`rank rank-${index + 1}`}>{index === 0 ? <Medal size={16} /> : index + 1}</span><span className="leader-table-person"><span className={`avatar avatar-${person.color}`}>{person.avatar}</span><span><strong>{person.name}</strong><small>{person.handle}</small></span></span><span className="leader-activity"><Footprints size={15} /> 6 sessions</span><strong className="leader-distance">{period === 'Weekly' ? person.score : `${(Number(person.score.split(' ')[0]) * 3.4).toFixed(1)} km`}</strong></div>)}</div><div className="privacy-banner"><LockKeyhole size={15} /><span>Location sharing is off. Your precise location is never shown on this leaderboard.</span><Link to="/profile">Privacy settings</Link></div></section>
    </>
  )
}

export function ChallengesPage() {
  const [joined, setJoined] = useState([])
  return (
    <>
      <PageHeader eyebrow="A REASON TO GET OUT THERE" title="A new challenge awaits." description="Choose a small goal, enjoy the process, and celebrate your progress." action={<span className="demo-pill"><span /> SAMPLE CHALLENGES</span>} />
      <div className="challenge-summary panel"><div className="challenge-summary-icon"><Target size={21} /></div><div><strong>Keep your own pace.</strong><span>Challenge progress is demo-only; rewards are not validated or issued.</span></div><div className="challenge-streak"><Flame size={17} /><strong>4 day streak</strong></div></div>
      <div className="challenge-grid">{challenges.map((challenge, index) => {
        const pct = Math.min(100, challenge.progress / challenge.goal * 100)
        const joinedNow = joined.includes(challenge.title)
        return <article className={`panel challenge-card challenge-card-${index + 1}`} key={challenge.title}><div className="challenge-card-head"><span className="challenge-icon">{index === 0 ? <Route size={20} /> : index === 1 ? <Sparkles size={20} /> : <CalendarDays size={20} />}</span><span className="challenge-time">{challenge.days}</span></div><span className="eyebrow">COMMUNITY CHALLENGE</span><h2>{challenge.title}</h2><p>{challenge.detail}</p><div className="challenge-progress-label"><span>YOUR PROGRESS</span><strong>{challenge.progress} <small>/ {challenge.goal}{index === 0 ? ' km' : ''}</small></strong></div><div className="progress-track"><span style={{ width: `${pct}%` }} /></div><div className="challenge-footer"><span className="challenge-reward"><span className="coin-symbol">F</span> {challenge.reward} demo coins</span><button className={`button ${joinedNow ? 'button-outline' : 'button-primary'}`} onClick={() => setJoined((items) => joinedNow ? items.filter((item) => item !== challenge.title) : [...items, challenge.title])}>{joinedNow ? <><Check size={15} /> Joined</> : <>Join challenge <ArrowRight size={15} /></>}</button></div></article>
      })}</div>
      <div className="demo-note"><Award size={15} /> Joining is stored only for this page session. Coin rewards are sample values and cannot be redeemed.</div>
    </>
  )
}

export function WalletPage() {
  return (
    <>
      <PageHeader eyebrow="A LITTLE THANK-YOU FOR SHOWING UP" title="Your Fit Coins." description="Sample balance and transaction history for the demo experience." action={<Link to="/rewards" className="button button-primary">Explore rewards <ArrowRight size={15} /></Link>} />
      <div className="wallet-top-grid"><section className="wallet-card panel"><div className="wallet-card-top"><span>YOUR DEMO BALANCE</span><Wallet size={19} /></div><div className="wallet-balance"><span className="coin-symbol large">F</span><strong>1,240</strong><small>Fit Coins</small></div><p>Sample balance · Not connected to a rewards backend</p><div className="wallet-card-footer"><span><Flame size={14} /> 4-day streak</span><span><Award size={14} /> 3 badges earned</span></div></section><section className="panel earn-panel"><span className="eyebrow">HOW COINS WORK</span><h2>Movement makes momentum.</h2><p>In a connected app, your backend can award coins for validated activities. This demo balance is illustrative only.</p><div className="earn-methods"><div><Footprints size={17} /><span><strong>Complete a walk</strong><small>Rewards require server validation</small></span></div><div><Trophy size={17} /><span><strong>Finish a challenge</strong><small>Sample challenge rewards only</small></span></div></div></section></div>
      <section className="panel transactions-panel"><SectionHeading title="Recent transactions" subtitle="Demo ledger · Stored sample data" action={<button className="text-link" onClick={() => window.alert('This is a sample transaction list; live data is not connected.')}>How it works <CircleHelp size={14} /></button>} /><div className="transactions-list">{transactions.map((transaction) => <div className="transaction-row" key={transaction.label}><span className="transaction-icon"><Plus size={16} /></span><span className="transaction-label"><strong>{transaction.label}</strong><small>{transaction.date}</small></span><strong className="transaction-amount">{transaction.amount} <span>F</span></strong></div>)}</div></section>
    </>
  )
}

export function RewardsPage() {
  const [notice, setNotice] = useState('')
  return (
    <>
      <PageHeader eyebrow="REWARDS & RECOGNITION" title="Good things, earned." description="Demo catalog only. No real items, services, or benefits are fulfilled." action={<Link to="/wallet" className="coin-pill"><span className="coin-symbol">F</span> 1,240</Link>} />
      <div className="reward-notice"><Gift size={17} /><span><strong>Demo rewards</strong> — redemptions are not processed and will not deduct coins.</span></div>
      {notice && <div className="inline-notice"><CircleHelp size={15} /> {notice}<button aria-label="Dismiss" onClick={() => setNotice('')}><X size={14} /></button></div>}
      <section className="reward-grid">{rewards.map((reward, index) => <article className="panel reward-card" key={reward.title}><div className={`reward-art reward-art-${index}`}><div>{index === 0 ? <BadgeCheck size={38} /> : index === 1 ? <Leaf size={38} /> : <Gift size={38} />}</div><span>{reward.category}</span></div><div className="reward-info"><div className="reward-card-heading"><h2>{reward.title}</h2><span className="coin-price"><span className="coin-symbol">F</span> {reward.cost}</span></div><p>{reward.description}</p><div className="reward-progress"><span>YOUR PROGRESS</span><strong>{Math.min(100, Math.round(1240 / reward.cost * 100))}%</strong></div><div className="progress-track"><span style={{ width: `${Math.min(100, 1240 / reward.cost * 100)}%` }} /></div><button className="button button-outline full-button" onClick={() => setNotice(`“${reward.title}” is a demo reward. Redemption is not connected to a fulfillment service.`)}>View demo reward <ArrowRight size={15} /></button></div></article>)}</section>
    </>
  )
}


export function ProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    fitnessGoal: 'Build everyday energy',
    experienceLevel: 'Beginner',
  })

  const [form, setForm] = useState(profile)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data)
        setForm(data)
      })
      .catch(() => {
        setError('Could not load your profile. Check the backend.')
      })
      .finally(() => setLoading(false))
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSave(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
     
const updated = await updateProfile(form)

// Update the sidebar and topbar name immediately
window.dispatchEvent(
  new CustomEvent('profileUpdated', {
    detail: updated,
  })
)

setProfile(updated)
setForm(updated)
setEditing(false)
setMessage('Profile saved successfully!')

    } catch {
      setError('Could not save your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setForm(profile)
    setEditing(false)
    setError('')
    setMessage('')
  }

  const initials = profile.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'JL'

  return (
    <>
      <PageHeader
        eyebrow="YOUR SPACE"
        title="Profile & settings."
        description="Manage your profile and personal fitness preferences."
      />

      {loading ? (
        <section className="panel" style={{ padding: 24 }}>
          Loading your profile...
        </section>
      ) : (
        <div className="profile-layout">
          <section className="panel profile-card">
            <div className="profile-cover">
              <div className="profile-cover-orb" />
            </div>

            <div className="profile-main">
              <div className="avatar avatar-lime profile-large-avatar">
                {initials}
              </div>

              <span className="profile-level">
                {profile.experienceLevel?.toUpperCase() || 'BEGINNER'}
              </span>

              <h2>{profile.name}</h2>
              <p>{profile.bio}</p>

              <div className="profile-stats">
                <div>
                  <strong>—</strong>
                  <span>KM THIS WEEK</span>
                </div>
                <div>
                  <strong>—</strong>
                  <span>KM EXPLORED</span>
                </div>
                <div>
                  <strong>—</strong>
                  <span>DAY STREAK</span>
                </div>
              </div>

              <button
                className="button button-outline full-button"
                onClick={() => {
                  setForm(profile)
                  setEditing(true)
                  setMessage('')
                  setError('')
                }}
              >
                Edit profile
              </button>
            </div>
          </section>

          <div className="profile-settings-column">
            {editing && (
              <section className="panel settings-panel">
                <SectionHeading
                  title="Edit your profile"
                  subtitle="Your changes will be saved to the database."
                />

                <form onSubmit={handleSave}>
                  <label className="form-label">
                    FULL NAME
                    <input
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="Your name"
                    />
                  </label>

                  <label className="form-label">
                    BIO
                    <textarea
                      name="bio"
                      value={form.bio || ''}
                      onChange={handleChange}
                      maxLength={500}
                      rows={3}
                      placeholder="Tell us about yourself"
                    />
                  </label>

                  <label className="form-label">
                    FITNESS GOAL
                    <select
                      name="fitnessGoal"
                      value={form.fitnessGoal || 'Build everyday energy'}
                      onChange={handleChange}
                    >
                      <option>Build everyday energy</option>
                      <option>Get stronger for trails</option>
                      <option>Improve my endurance</option>
                      <option>Build a consistent habit</option>
                    </select>
                  </label>

                  <label className="form-label">
                    EXPERIENCE LEVEL
                    <select
                      name="experienceLevel"
                      value={form.experienceLevel || 'Beginner'}
                      onChange={handleChange}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </label>

                  {error && (
                    <p role="alert" style={{ color: '#ff9b9b' }}>
                      {error}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      flexWrap: 'wrap',
                      marginTop: 16,
                    }}
                  >
                    <button
                      type="submit"
                      className="button button-primary"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save changes'}
                    </button>

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}

            {message && (
              <div className="inline-success" role="status">
                <Check size={16} /> {message}
              </div>
            )}

            {!editing && error && (
              <div className="panel" role="alert" style={{ padding: 16 }}>
                {error}
              </div>
            )}

            <section className="panel settings-panel">
              <SectionHeading
                title="Privacy & sharing"
                subtitle="Your location is private by default"
              />

              <div className="privacy-setting">
                <span className="setting-icon">
                  <MapPin size={17} />
                </span>
                <span className="setting-copy">
                  <strong>Share my location</strong>
                  <small>
                    Allow friends to see your live location
                  </small>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={sharing}
                  className={`toggle ${sharing ? 'toggle-on' : ''}`}
                  onClick={() => setSharing((value) => !value)}
                  aria-label="Toggle location sharing"
                >
                  <i />
                </button>
              </div>

              <div className="privacy-setting">
                <span className="setting-icon">
                  <Trophy size={17} />
                </span>
                <span className="setting-copy">
                  <strong>Leaderboard visibility</strong>
                  <small>Show sample stats to your friends</small>
                </span>
                <span className="visibility-state">VISIBLE</span>
              </div>

              <div className="privacy-callout">
                <Shield size={15} />
                Your precise location is not shared by this demo app.
              </div>
            </section>

            <section className="panel settings-panel">
              <SectionHeading
                title="Preferences"
                subtitle="Your saved fitness preferences"
              />

              <div className="preference-row">
                <span className="setting-icon">
                  <Activity size={17} />
                </span>
                <span className="setting-copy">
                  <strong>Fitness goals</strong>
                  <small>{profile.fitnessGoal}</small>
                </span>
              </div>

              <div className="preference-row">
                <span className="setting-icon">
                  <Heart size={17} />
                </span>
                <span className="setting-copy">
                  <strong>Experience level</strong>
                  <small>{profile.experienceLevel}</small>
                </span>
              </div>

              <div className="preference-row">
                <span className="setting-icon">
                  <Settings size={17} />
                </span>
                <span className="setting-copy">
                  <strong>App settings</strong>
                  <small>FitTerritory demo mode</small>
                </span>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  )
}

