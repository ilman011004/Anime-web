
import { apiRequest } from './api'

export function getEpisodesByAnimeId(animeId) {
  return apiRequest(`/anime/${animeId}/episodes`)
}

export function createEpisode(animeId, data) {
  return apiRequest(`/anime/${animeId}/episodes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function deleteEpisode(id) {
  return apiRequest(`/episodes/${id}`, {
    method: 'DELETE',
  })
}
