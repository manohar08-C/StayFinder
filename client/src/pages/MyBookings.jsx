import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
    getMyBookings,
    cancelBooking
} from '../services/booking.service'
import { deleteReview } from '../services/review.service'
import ReviewForm from '../components/ReviewForm'

function MyBookings() {

    const [bookings, setBookings] = useState([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState('')

    const [cancellingId, setCancellingId] =
        useState(null)
    const [reviewingId, setReviewingId] = useState(null)
    const [reviewError, setReviewError] = useState('')

    const loadBookings = async () => {

        try {

            setLoading(true)
            setError('')

            const response =
                await getMyBookings()

            setBookings(
                response.data?.bookings ||
                response.bookings ||
                []
            )

        } catch (error) {

            console.error(error)

            setError(
                error.response?.data?.message ||
                'Failed to load bookings'
            )

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {

        loadBookings()

    }, [])

    const handleCancel = async (bookingId) => {

        const confirmed =
            window.confirm(
                'Are you sure you want to cancel this booking?'
            )

        if (!confirmed) {
            return
        }

        try {

            setCancellingId(bookingId)

            await cancelBooking(bookingId)

            setBookings(current =>
                current.map(booking =>
                    booking._id === bookingId
                        ? {
                            ...booking,
                            status: 'cancelled'
                        }
                        : booking
                )
            )

        } catch (error) {

            console.error(error)

            alert(
                error.response?.data?.message ||
                'Failed to cancel booking'
            )

        } finally {

            setCancellingId(null)

        }
    }

    const handleReviewSaved = (bookingId, review) => {
        setBookings(current => current.map(booking => booking._id === bookingId ? { ...booking, review } : booking))
        setReviewingId(null)
    }

    const handleReviewDelete = async (bookingId, reviewId) => {
        try {
            await deleteReview(reviewId)
            setBookings(current => current.map(booking => booking._id === bookingId ? { ...booking, review: null } : booking))
        } catch (requestError) {
            setReviewError(requestError.response?.data?.message || 'Unable to delete review')
        }
    }

    if (loading) {

        return (
            <main>

                <h1>
                    My Bookings
                </h1>

                <p>
                    Loading bookings...
                </p>

            </main>
        )
    }

    if (error) {

        return (
            <main>

                <h1>
                    My Bookings
                </h1>

                <p>
                    {error}
                </p>

                <button onClick={loadBookings}>
                    Try Again
                </button>

            </main>
        )
    }

    return (

        <main className="my-bookings">

            <h1>
                My Bookings
            </h1>

            {bookings.length === 0 ? (

                <section>

                    <h2>
                        No bookings yet
                    </h2>

                    <p>
                        You haven't booked a hostel yet.
                    </p>

                    <Link to="/hostels">
                        Explore Hostels
                    </Link>

                </section>

            ) : (

                <section className="booking-list">

                    {bookings.map(booking => (

                        <article
                            key={booking._id}
                            className="booking-card"
                        >

                            <h2>
                                {booking.hostel?.name ||
                                    'Hostel'}
                            </h2>

                            <p>
                                {booking.hostel?.city}

                                {booking.hostel?.locality &&
                                    `, ${booking.hostel.locality}`
                                }
                            </p>

                            <p>
                                Room:
                                {' '}
                                {booking.room?.roomType ||
                                    'Room'}
                            </p>

                            <p>
                                Check-in:
                                {' '}
                                {new Date(
                                    booking.checkIn
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                Check-out:
                                {' '}
                                {new Date(
                                    booking.checkOut
                                ).toLocaleDateString()}
                            </p>

                            <p>
                                Beds:
                                {' '}
                                {booking.numberOfBeds}
                            </p>

                            <p>
                                Pricing:
                                {' '}
                                {booking.pricingType}
                            </p>

                            <p>
                                Amount:
                                {' '}
                                ₹{booking.totalAmount}
                            </p>

                            <p>
                                Status:
                                {' '}
                                <strong>
                                    {booking.status}
                                </strong>
                            </p>

                            <div>

                                <Link
                                    to={`/bookings/${booking._id}`}
                                >
                                    View Details
                                </Link>

                                {booking.status === 'pending' && (

                                    <button
                                        onClick={() =>
                                            handleCancel(
                                                booking._id
                                            )
                                        }
                                        disabled={
                                            cancellingId ===
                                            booking._id
                                        }
                                    >
                                        {cancellingId ===
                                        booking._id
                                            ? 'Cancelling...'
                                            : 'Cancel Booking'}
                                    </button>

                                )}

                            </div>

                            {['checkedIn', 'completed'].includes(booking.status) && (
                                <div className="booking-review">
                                    {booking.review ? <>
                                        <p><strong>Your review:</strong> {'★'.repeat(booking.review.rating)} {booking.review.comment}</p>
                                        <button className="button button-quiet" onClick={() => setReviewingId(booking._id)}>Edit review</button>
                                        <button className="button button-quiet" onClick={() => handleReviewDelete(booking._id, booking.review._id)}>Delete review</button>
                                    </> : <button className="button button-secondary" onClick={() => setReviewingId(booking._id)}>Write a review</button>}
                                    {reviewingId === booking._id && <ReviewForm bookingId={booking._id} review={booking.review} onSaved={review => handleReviewSaved(booking._id, review)} onCancel={() => setReviewingId(null)} />}
                                </div>
                            )}

                        </article>

                    ))}

                </section>

            )}

            {reviewError && <p className="form-error" role="alert">{reviewError}</p>}
        </main>
    )
}

export default MyBookings
