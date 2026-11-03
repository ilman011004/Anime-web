const API_BASE_URL = 'http://localhost:3000/api'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('animeverse_admin_token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  const result = isJson
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof result === 'object' && result !== null
        ? result.message
        : null

    throw new Error(message || `Request gagal (${response.status})`)
  }

  return result
}
