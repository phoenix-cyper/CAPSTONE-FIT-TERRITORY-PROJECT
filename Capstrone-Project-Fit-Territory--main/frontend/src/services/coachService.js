
export const coachService = {
  async chat({ message, goal, level, duration, history = [] }) {
    const response = await fetch('/api/coach/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        goal,
        level,
        duration,
        history,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(
        data.message || data.error || 'Could not reach the AI Coach.'
      )
    }

    return data
  },
}
