import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applyAsOwner } from '../services/owner.service'

function OwnerApplication() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        businessName: '',
        phone: '',
        address: '',
        city: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            await applyAsOwner(form)
            alert('Owner application submitted successfully')
            navigate('/profile')
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message || 'Failed to submit owner application')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1>Create Owner Account</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Business Name</label>
                    <input
                        name="businessName"
                        value={form.businessName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Phone</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Address</label>
                    <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>City</label>
                    <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </main>
    )
}

export default OwnerApplication
