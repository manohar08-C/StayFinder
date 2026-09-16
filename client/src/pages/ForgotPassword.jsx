import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/auth.service'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async event => {
        event.preventDefault()
        setMessage('')
        setError('')
        setLoading(true)

        try {
            const response = await forgotPassword(email)
            setMessage(response.message || 'If an account exists, a reset link has been sent.')
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to process password reset request.')
        } finally {
            setLoading(false)
        }
    }

    return <main className="login-page">
        <section className="auth-panel">
            <p className="eyebrow">Account recovery</p>
            <h1>Forgot password?</h1>
            <p className="auth-helper">Enter your email and we will send a secure password reset link.</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="forgot-email">Email address</label>
                <input id="forgot-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required />
                <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
            </form>
            {message && <p className="auth-success">{message}</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="auth-links"><Link to="/login">Back to login</Link></div>
        </section>
    </main>
}

export default ForgotPassword