import api from './api'

export const getRoomsByHostel = async (hostelId) => {
    const response = await api.get(`/hostels/${hostelId}/rooms`)
    return response.data
}

export const getRoomById = async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`)
    return response.data
}

export const createRoom = async (hostelId, roomData) => {
    const response = await api.post(`/hostels/${hostelId}/rooms`, roomData)
    return response.data
}

export const updateRoom = async (roomId, roomData) => {
    const response = await api.put(`/rooms/${roomId}`, roomData)
    return response.data
}

export const deleteRoom = async (roomId) => {
    const response = await api.delete(`/rooms/${roomId}`)
    return response.data
}