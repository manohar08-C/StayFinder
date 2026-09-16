import { useState } from 'react'

import {
    createAdmin
} from '../../services/admin.service'

function CreateAdmin() {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [loading, setLoading] =
        useState(false)

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            setLoading(true)

            await createAdmin(form)

            alert(
                'Admin created successfully'
            )

            setForm({
                name: '',
                email: '',
                password: ''
            })

        } catch (error) {

            console.error(error)

            alert(
                error.response?.data?.message ||
                'Failed to create admin'
            )

        } finally {

            setLoading(false)

        }
    }

    return (

        <main>

            <h1>
                Create Admin
            </h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>
                        Name
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        minLength="8"
                        required
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? 'Creating...'
                        : 'Create Admin'}
                </button>

            </form>

        </main>
    )
}

export default CreateAdmin
