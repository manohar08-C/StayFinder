import api from './api'

export const getHostels = async (params = {}) => {
    const response = await api.get('/hostels', {
        params
    })

    return response.data
}

export const getHostelById = async (id) => {
    const response = await api.get(`/hostels/${id}`)

    return response.data
}