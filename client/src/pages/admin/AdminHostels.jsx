import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
    getPendingHostels
} from '../../services/admin.service'

function AdminHostels() {

    const [hostels, setHostels] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')

    const loadHostels = async () => {

        try {

            setLoading(true)
            setError('')

            const response =
                await getPendingHostels()

            setHostels(
                response.data?.hostels ||
                response.hostels ||
                []
            )

        } catch (error) {

            console.error(error)

            setError(
                error.response?.data?.message ||
                'Failed to load pending hostels'
            )

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {

        loadHostels()

    }, [])

    if (loading) {

        return (
            <main>

                <h1>
                    Pending Hostels
                </h1>

                <p>
                    Loading...
                </p>

            </main>
        )
    }

    return (

        <main className="admin-page">

                <h1>
                Pending Hostels
            </h1>

            {error && (
                <p className="admin-error">
                    {error}
                </p>

            )}

            {hostels.length === 0 ? (

                <section className="admin-empty">

                    <h2>
                        No pending hostels
                    </h2>

                    <p>
                        There are no hostel submissions
                        waiting for approval.
                    </p>

                </section>

            ) : (

                <section className="admin-list">

                    {hostels.map(hostel => (

                        <article
                            key={hostel._id}
                            className="admin-card"
                        >
                            <div className="admin-card-content">
                                <h2>{hostel.name}</h2>
                                <p>{hostel.city}{hostel.locality ? `, ${hostel.locality}` : ''}</p>
                                <div className="admin-card-meta">
                                    <p><span>Owner</span><strong>{hostel.owner?.name || hostel.owner?.email || 'Unknown'}</strong></p>
                                    <p><span>Submitted status</span><strong>{hostel.status}</strong></p>
                                </div>
                                <div className="admin-card-footer"><span className="admin-status">{hostel.status}</span><Link className="admin-card-link" to={`/admin/hostels/${hostel._id}`}>Review hostel →</Link></div>
                            </div>

                        </article>

                    ))}

                </section>

            )}

        </main>
    )
}

export default AdminHostels
