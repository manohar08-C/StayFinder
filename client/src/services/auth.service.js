import api from './api'

export const signup = async (userData) => {
    const response = await api.post('/signup', userData)

    return response.data
}

export const login = async (credentials) => {
    const response = await api.post('/login', credentials)

    return response.data
}

export const forgotPassword = async (email) => {
    const response = await api.post('/forgot-password', { email })

    return response.data
}

export const resetPassword = async (token, password) => {
    const response = await api.post(`/reset-password/${token}`, { password })

    return response.data
}