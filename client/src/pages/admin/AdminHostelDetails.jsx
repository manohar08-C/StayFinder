import { useEffect, useState } from 'react'
import {
    Link,
    useNavigate,
    useParams
} from 'react-router-dom'

import {
    getAdminHostelById,
    approveHostel,
    rejectHostel
} from '../../services/admin.service'

function AdminHostelDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [hostel, setHostel] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')

    const [rejectionReason, setRejectionReason] =
        useState('')

    const [actionLoading, setActionLoading] =
        useState(false)

    useEffect(() => {

        const loadHostel = async () => {

            try {

                const response =
                    await getAdminHostelById(id)

                setHostel(
                    response.data?.hostel ||
                    response.hostel ||
                    response.data
                )

            } catch (error) {

                console.error(error)

                setError(
                    error.response?.data?.message ||
                    'Failed to load hostel'
                )

            } finally {

                setLoading(false)

            }
        }

        loadHostel()

    }, [id])

    const handleApprove = async () => {

        try {

            setActionLoading(true)

            await approveHostel(id)

            alert(
                'Hostel approved successfully'
            )

            navigate('/admin/hostels')

        } catch (error) {

            console.error(error)

            alert(
                error.response?.data?.message ||
                'Failed to approve hostel'
            )

        } finally {

            setActionLoading(false)

        }
    }

    const handleReject = async () => {

        if (!rejectionReason.trim()) {

            alert(
                'Please provide a rejection reason'
            )

            return
        }

        try {

            setActionLoading(true)

            await rejectHostel(
                id,
                rejectionReason.trim()
            )

            alert(
                'Hostel rejected successfully'
            )

            navigate('/admin/hostels')

        } catch (error) {

            console.error(error)

            alert(
                error.response?.data?.message ||
                'Failed to reject hostel'
            )

        } finally {

            setActionLoading(false)

        }
    }

    if (loading) {

        return (
            <main className="admin-page admin-detail">
                <h1>
                    Loading hostel...
                </h1>
            </main>
        )
    }

    if (error || !hostel) {

        return (
            <main>

                <h1>
                    Hostel Not Found
                </h1>

                <p>
                    {error}
                </p>

                <Link to="/admin/hostels">
                    Back
                </Link>

            </main>
        )
    }

    return (

        <main className="admin-page admin-detail">

            <Link to="/admin/hostels">
                ← Pending Hostels
            </Link>

            <h1>
                Review Hostel
            </h1>

            <section className="admin-detail-panel">

                <h2>
                    {hostel.name}
                </h2>

                <dl className="admin-detail-grid">
                    <div><dt>City</dt><dd>{hostel.city || 'Not provided'}</dd></div>
                    <div><dt>Locality</dt><dd>{hostel.locality || 'Not provided'}</dd></div>
                    <div><dt>Address</dt><dd>{hostel.address || 'Not provided'}</dd></div>
                    <div><dt>Gender</dt><dd>{hostel.gender || 'Not provided'}</dd></div>
                    <div><dt>Status</dt><dd><span className="admin-status">{hostel.status}</span></dd></div>
                </dl>
                <p className="admin-description">{hostel.description || 'No description provided.'}</p>

            </section>

            {hostel.images?.length > 0 && (

                <section className="admin-detail-panel">

                    <h2>
                        Images
                    </h2>

                    <div className="admin-gallery">{hostel.images.map(
                        (image, index) => (

                            <img
                                key={index}
                                src={
                                    typeof image === 'string'
                                        ? image
                                        : image.url
                                }
                                alt={`Hostel ${index + 1}`}
                                width="200"
                            />

                        )
                    )}</div>

                </section>

            )}

            {hostel.status === 'pending' && (

                <section className="admin-actions">

                    <div className="admin-action">
                    <button
                        onClick={handleApprove}
                        disabled={actionLoading}
                    >
                        {actionLoading
                            ? 'Processing...'
                            : 'Approve Hostel'}
                    </button>
                    </div>

                    <div className="admin-action admin-action-danger">

                        <h3>
                            Reject Hostel
                        </h3>

                        <textarea
                            placeholder="Reason for rejection"
                            value={rejectionReason}
                            onChange={(e) =>
                                setRejectionReason(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            onClick={handleReject}
                            disabled={actionLoading}
                        >
                            Reject Hostel
                        </button>

                    </div>

                </section>

            )}

        </main>
    )
}

export default AdminHostelDetails
