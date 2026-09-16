import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signup } from '../services/auth.service'

function Signup() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [message, setMessage] = useState('')
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

        setMessage('')
        setError('')
        setLoading(true)

        try {
            const data = await signup(formData)

            setMessage(data.message)

            setFormData({
                name: '',
                email: '',
                password: ''
            })

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to create account'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="signup-page">
            <section className="auth-panel">
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

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
                    minLength={8}
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

            </form>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <div className="auth-links">
                <span>Already have an account? <Link to="/login">Log in</Link></span>
            </div>
            </section>
        </main>
    )
}

export default Signup