import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyBookings } from '../services/booking.service'

function Reviews() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getMyBookings().then(response => setBookings(response.data?.bookings || response.bookings || []))
            .catch(requestError => setError(requestError.response?.data?.message || 'Something went wrong'))
            .finally(() => setLoading(false))
    }, [])

    const reviews = bookings.filter(booking => booking.review)

    return <main className="page-shell">
        <header className="page-heading"><p className="eyebrow">Your voice</p><h1>Reviews</h1><p>See what you have shared about your stays. Hostel reviews are available on each hostel's details page.</p></header>
        {loading && <p className="status-message">Loading reviews...</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && !error && reviews.length === 0 && <section className="empty-state"><h2>No reviews yet</h2><p>After a completed or checked-in stay, you can leave a review from My Bookings.</p><Link className="button button-primary" to="/bookings">View bookings</Link></section>}
        {!loading && !error && reviews.length > 0 && <section className="full-review-list">{reviews.map(booking => <article className="full-review-card" key={booking.review._id || booking._id}><div className="review-stars">{'★'.repeat(booking.review.rating || 0)}<span>{'☆'.repeat(5 - (booking.review.rating || 0))}</span></div><h2>{booking.hostel?.name || 'Hostel'}</h2><p>{booking.review.comment || 'No comment added.'}</p><Link to={`/bookings/${booking._id}`}>View booking →</Link></article>)}</section>}
    </main>
}

export default Reviews