import api from './api'

export const addFavorite = async (hostelId) => {
    const response = await api.post(`/favorites/${hostelId}`)

    return response.data
}

export const getFavorites = async () => {
    const response = await api.get('/favorites')
    return response.data
}

export const removeFavorite = async (hostelId) => {
    const response = await api.delete(`/favorites/${hostelId}`)
    return response.data
}