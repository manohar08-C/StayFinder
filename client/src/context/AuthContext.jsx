import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            setLoading(false)
            return
        }

        const getProfile = async () => {
            try {
                const response = await api.get('/profile')

                setUser(response.data.user || response.data.data)
            } catch (error) {
                console.error('Failed to fetch profile:', error)

                localStorage.removeItem('token')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getProfile()
    }, [])

    const login = async (token) => {
        localStorage.setItem('token', token)

        try {
            const response = await api.get('/profile')

            const profile = response.data.user || response.data.data
            setUser(profile)
            return profile
        } catch (error) {
            localStorage.removeItem('token')
            setUser(null)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                loading,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}