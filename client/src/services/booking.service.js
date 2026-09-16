import api from './api'

export const createBooking = async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data
}

export const getMyBookings = async () => {
    const response = await api.get('/bookings/my')
    return response.data
}

export const getBookingById = async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
}

export const cancelBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`)
    return response.data
}

export const getOwnerBookings = async () => {
    const response = await api.get('/bookings/owner')
    return response.data
}

export const confirmBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/confirm`)
    return response.data
}

export const ownerCancelBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`)
    return response.data
}

export const checkInBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/check-in`)
    return response.data
}

export const completeBooking = async (id) => {
    const response = await api.put(`/bookings/${id}/complete`)
    return response.data
}