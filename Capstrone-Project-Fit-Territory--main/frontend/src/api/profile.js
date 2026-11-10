
export async function getProfile() {
  const response = await fetch('/api/profile')

  if (!response.ok) {
    throw new Error('Could not load profile')
  }

  return response.json()
}

export async function updateProfile(profile) {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })

  if (!response.ok) {
    throw new Error('Could not save profile')
  }

  return response.json()
}
