import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyBookings } from '../services/booking.service'
import { getFavorites } from '../services/favorite.service'

function UserDashboard() {
    const { user } = useAuth()
    const location = useLocation()
    const [bookings, setBookings] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getMyBookings(), getFavorites()])
            .then(([bookingResponse, favoriteResponse]) => {
                setBookings(bookingResponse.data?.bookings || bookingResponse.bookings || [])
                setFavorites(favoriteResponse.data?.favorites || favoriteResponse.favorites || [])
            })
            .catch(error => console.error('Dashboard data could not be loaded:', error))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (loading || !location.hash) return

        const target = document.getElementById(location.hash.slice(1))
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [loading, location.hash])

    const upcoming = bookings.filter(booking => ['pending', 'confirmed', 'checkedIn'].includes(booking.status))
    const history = bookings.filter(booking => !upcoming.includes(booking))
    const reviews = bookings.filter(booking => booking.review)

    return (
        <main className="page-shell user-dashboard">
            <header className="page-heading">
                <p className="eyebrow">Personal space</p>
                <h1>Welcome back, {user?.name || 'traveler'}</h1>
                <p>Your StayFinder profile and everything for your next stay, in one calm place.</p>
            </header>

            {loading ? <p className="status-message">Loading your dashboard...</p> : <>
                <section className="dashboard-stats" aria-label="Dashboard summary">
                    <div><strong>{upcoming.length}</strong><span>Upcoming bookings</span></div>
                    <div><strong>{bookings.length}</strong><span>Booking history</span></div>
                    <div><strong>{favorites.length}</strong><span>Saved hostels</span></div>
                </section>
                
                <section className="dashboard-grid">
                    <section className="dashboard-tile dashboard-tile-wide" id="upcoming-bookings">
                        <span className="tile-kicker">Your stays</span>
                            <h2>Upcoming bookings</h2>{upcoming.length ? upcoming.slice(0, 2).map(booking => 
                            <Link className="dashboard-list-row" to={`/bookings/${booking._id}`} key={booking._id}>
                        <span>{booking.hostel?.name || 'Hostel'}</span><strong>{new Date(booking.checkIn).toLocaleDateString()}</strong></Link>) :
                         <p>No upcoming bookings yet.</p>}<Link className="tile-link" to="/bookings">View all bookings →</Link></section>
                    
                    <section className="dashboard-tile" id="profile"><span className="tile-kicker">Your identity</span>
                        <h2>Profile</h2><p className="profile-intro">Your StayFinder account information.</p><dl className="profile-list"><div><dt>Name</dt><dd>{user?.name || 'Not provided'}</dd></div>
                        <div><dt>Email</dt><dd>{user?.email || 'Not provided'}</dd></div>
                        <div><dt>Phone</dt><dd>{user?.phone || 'Not provided'}</dd></div>
                        <div><dt>Account type</dt><dd>{user?.role || 'User'}</dd></div></dl><Link className="tile-link" to="/profile">Open full profile →</Link></section>
                    
                    <section className="dashboard-tile" id="booking-history"><span className="tile-kicker">Past stays</span>
                        <h2>Booking history</h2>{history.length ? <p>{history.length} completed or cancelled booking{history.length === 1 ? '' : 's'}.</p> : 
                        <p>No booking history yet.</p>}<Link className="tile-link" to="/bookings">Open booking history →</Link></section>
                    
                    <section className="dashboard-tile" id="favorites"><span className="tile-kicker">Shortlist</span>
                        <h2>Favorites</h2><p>{favorites.length ? `${favorites.length} hostel${favorites.length === 1 ? '' : 's'} saved` : 'No favorite hostels'}</p>
                        <Link className="tile-link" to="/favorites">Open favorites →</Link></section>
                    
                    <section className="dashboard-tile" id="reviews"><span className="tile-kicker">Your voice</span>
                        <h2>Reviews</h2>{reviews.length ? <div className="dashboard-review-list">{reviews.slice(0, 3).map(booking => <article className="dashboard-review" key={booking.review._id || booking._id}><div className="review-stars">{'★'.repeat(booking.review.rating || 0)}<span>{'☆'.repeat(5 - (booking.review.rating || 0))}</span></div><strong>{booking.hostel?.name || 'Hostel'}</strong><p>{booking.review.comment || 'No comment added.'}</p></article>)}</div> :
                         <p>No reviews yet. Reviews become available after a stay.</p>}<p className="settings-note">Hostel reviews are shown on each hostel's details page.</p><Link className="tile-link" to="/reviews">Open all reviews →</Link></section>

                    <section className="dashboard-tile" id="account-settings"><span className="tile-kicker">Preferences</span>
                        <h2>Account settings</h2><p>Signed in as {user?.email || 'your account'}.</p><p className="settings-note">
                            Update profile details through your account support channel.</p></section>
                    
                    <Link className="dashboard-tile" to="/owner/apply"><span className="tile-kicker">Have a space?</span><h2>Become a host</h2><p>Apply to list your hostel.</p></Link>
                </section>
            </>}
        </main>
    )
}

export default UserDashboard
