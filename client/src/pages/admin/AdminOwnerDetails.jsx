import { useEffect, useState } from 'react'

import {
    Link,
    useNavigate,
    useParams
} from 'react-router-dom'

import {
    getOwnerApplicationById,
    approveOwnerApplication,
    rejectOwnerApplication
} from '../../services/admin.service'

function AdminOwnerDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const [application, setApplication] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [rejectionReason, setRejectionReason] =
        useState('')

    const [processing, setProcessing] =
        useState(false)

    useEffect(() => {

        const loadApplication = async () => {

            try {

                const response =
                    await getOwnerApplicationById(id)

                setApplication(
                    response.data?.application ||
                    response.application ||
                    response.data
                )

            } catch (error) {

                console.error(error)

            } finally {

                setLoading(false)

            }
        }

        loadApplication()

    }, [id])

    const handleApprove = async () => {

        try {

            setProcessing(true)

            await approveOwnerApplication(id)

            alert(
                'Owner application approved'
            )

            navigate('/admin/owners')

        } catch (error) {

            console.error(error)

            alert(
                error.response?.data?.message ||
                'Approval failed'
            )

        } finally {

            setProcessing(false)

        }
    }

    const handleReject = async () => {

        if (!rejectionReason.trim()) {

            alert(
                'Please enter a rejection reason'
            )

            return
        }

        try {

            setProcessing(true)

            await rejectOwnerApplication(
                id,
                rejectionReason.trim()
            )

            alert(
                'Owner application rejected'
            )

            navigate('/admin/owners')

        } catch (error) {

            console.error(error)

            alert(
                error.response?.data?.message ||
                'Rejection failed'
            )

        } finally {

            setProcessing(false)

        }
    }

    if (loading) {

        return (
            <main className="admin-page admin-detail">
                <h1>
                    Loading application...
                </h1>
            </main>
        )
    }

    if (!application) {

        return (
            <main>

                <h1>
                    Application Not Found
                </h1>

                <Link to="/admin/owners">
                    Back
                </Link>

            </main>
        )
    }

    return (

        <main className="admin-page admin-detail">

            <Link to="/admin/owners">
                ← Owner Applications
            </Link>

            <h1>
                Owner Application
            </h1>

            <section className="admin-detail-panel">

                <h2>
                    {application.businessName}
                </h2>

                <dl className="admin-detail-grid">
                    <div><dt>Applicant</dt><dd>{application.user?.name || 'Not provided'}</dd></div>
                    <div><dt>Email</dt><dd>{application.user?.email || 'Not provided'}</dd></div>
                    <div><dt>Phone</dt><dd>{application.phone || 'Not provided'}</dd></div>
                    <div><dt>Address</dt><dd>{application.address || 'Not provided'}</dd></div>
                    <div><dt>City</dt><dd>{application.city || 'Not provided'}</dd></div>
                    <div><dt>Status</dt><dd><span className="admin-status">{application.status}</span></dd></div>
                </dl>

            </section>

            {application.status === 'pending' && (

                <section className="admin-actions">

                    <div className="admin-action">
                    <button
                        onClick={handleApprove}
                        disabled={processing}
                    >
                        {processing
                            ? 'Processing...'
                            : 'Approve Owner'}
                    </button>
                    </div>

                    <div className="admin-action admin-action-danger">

                        <h3>
                            Reject Application
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
                            disabled={processing}
                        >
                            Reject Owner
                        </button>

                    </div>

                </section>

            )}

        </main>
    )
}

export default AdminOwnerDetails
