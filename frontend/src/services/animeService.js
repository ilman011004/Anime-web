
import { apiRequest } from './api'

const ANIME_ENDPOINT = '/anime'

export function getAllAnime() {
  return apiRequest(ANIME_ENDPOINT)
}

export function getAnimeById(id) {
  return apiRequest(`${ANIME_ENDPOINT}/${id}`)
}

export function createAnime(data) {
  return apiRequest(ANIME_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateAnime(id, data) {
  return apiRequest(`${ANIME_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteAnime(id) {
  return apiRequest(`${ANIME_ENDPOINT}/${id}`, {
    method: 'DELETE',
  })
}
