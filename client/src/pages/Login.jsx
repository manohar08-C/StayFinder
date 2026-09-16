import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { login } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'

function Login() {

    const { login: saveLogin } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            const data = await login(formData)

            const profile = await saveLogin(data.token)
            const destination = profile?.role === 'Admin'
                ? '/admin/dashboard'
                : profile?.role === 'hostelOwner'
                    ? '/owner/dashboard'
                    : '/profile'

            navigate(destination, { replace: true })

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to log in'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-page">
            <section className="auth-panel">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

            </form>

            {error && <p>{error}</p>}
            <div className="auth-links">
                <Link to="/forgot-password">Forgot password?</Link>
                <span>New to StayFinder? <Link to="/signup">Create an account</Link></span>
            </div>
            </section>
        </main>
    )
}

export default Login