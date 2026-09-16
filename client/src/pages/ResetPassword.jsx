import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../services/auth.service'

function ResetPassword() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmation, setConfirmation] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async event => {
        event.preventDefault()
        setMessage('')
        setError('')

        if (password !== confirmation) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        try {
            const response = await resetPassword(token, password)
            setMessage(response.message || 'Password reset successfully.')
            window.setTimeout(() => navigate('/login'), 1200)
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to reset password.')
        } finally {
            setLoading(false)
        }
    }

    return <main className="login-page">
        <section className="auth-panel">
            <p className="eyebrow">Account recovery</p>
            <h1>Choose a new password</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="new-password">New password</label>
                <input id="new-password" type="password" value={password} onChange={event => setPassword(event.target.value)} minLength={8} required />
                <label htmlFor="confirm-password">Confirm password</label>
                <input id="confirm-password" type="password" value={confirmation} onChange={event => setConfirmation(event.target.value)} minLength={8} required />
                <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update password'}</button>
            </form>
            {message && <p className="auth-success">{message}</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="auth-links"><Link to="/login">Back to login</Link></div>
        </section>
    </main>
}

export default ResetPassword