import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
    getOwnerApplications
} from '../../services/admin.service'

function AdminOwners() {

    const [applications, setApplications] =
        useState([])

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')

    const loadApplications = async () => {

        try {

            setLoading(true)

            const response =
                await getOwnerApplications()

            setApplications(
                response.data?.applications ||
                response.applications ||
                []
            )

        } catch (error) {

            console.error(error)

            setError(
                error.response?.data?.message ||
                'Failed to load applications'
            )

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {

        loadApplications()

    }, [])

    if (loading) {

        return (
            <main>

                <h1>
                    Owner Applications
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
                Owner Applications
            </h1>

            {error && (
                <p className="admin-error">
                    {error}
                </p>
            )}

            {applications.length === 0 ? (

                <p className="admin-empty">
                    No pending owner applications.
                </p>

            ) : (

                <section className="admin-list">

                    {applications.map(
                        application => (

                            <article
                                key={
                                    application._id
                                }
                                className="admin-card"
                            >
                                <div className="admin-card-content">
                                    <h2>{application.businessName}</h2>
                                    <div className="admin-card-meta">
                                        <p><span>Applicant</span><strong>{application.user?.name || 'Unknown'}</strong></p>
                                        <p><span>Email</span><strong>{application.user?.email || 'Not provided'}</strong></p>
                                        <p><span>Phone</span><strong>{application.phone || 'Not provided'}</strong></p>
                                        <p><span>City</span><strong>{application.city || 'Not provided'}</strong></p>
                                    </div>
                                    <div className="admin-card-footer"><span className="admin-status">{application.status}</span><Link className="admin-card-link" to={`/admin/owners/${application._id}`}>Review application →</Link></div>
                                </div>

                            </article>

                        )
                    )}

                </section>

            )}

        </main>
    )
}

export default AdminOwners
