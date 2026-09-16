import api from './api'

export const getMyHostels = async () => {
    const response = await api.get('/hostels/my')
    return response.data
}

export const createHostel = async (hostelData) => {
    const response = await api.post('/hostels', hostelData)
    return response.data
}

export const updateHostel = async (hostelId, hostelData) => {
    const response = await api.put(`/hostels/${hostelId}`, hostelData)
    return response.data
}

export const deleteHostel = async (hostelId) => {
    const response = await api.delete(`/hostels/${hostelId}`)
    return response.data
}

export const applyAsOwner = async (applicationData) => {
    const response = await api.post('/owner/apply', applicationData)
    return response.data
}
