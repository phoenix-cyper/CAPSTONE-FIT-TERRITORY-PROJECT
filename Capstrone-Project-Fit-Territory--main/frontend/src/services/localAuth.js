
const USERS_KEY = 'fitterritory_users'
const SESSION_KEY = 'fitterritory_session'

const getUsers = () => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const hashPassword = async (password, salt) => {
  const encoder = new TextEncoder()

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 120000,
      hash: 'SHA-256',
    },
    key,
    256
  )

  return Array.from(new Uint8Array(bits))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export const registerUser = async ({ name, email, password }) => {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('This email is already registered.')
  }

  if (password.length < 8) {
    throw new Error('Password must contain at least 8 characters.')
  }

  const salt = crypto.randomUUID()
  const passwordHash = await hashPassword(password, salt)

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    salt,
    passwordHash,
    role: 'USER',
  }

  saveUsers([...users, user])

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return session
}

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase()
  const user = getUsers().find((item) => item.email === normalizedEmail)

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  const passwordHash = await hashPassword(password, user.salt)

  if (passwordHash !== user.passwordHash) {
    throw new Error('Invalid email or password.')
  }

  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return session
}

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY)
}
