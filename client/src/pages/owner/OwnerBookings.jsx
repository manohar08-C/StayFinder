import { useEffect, useState } from 'react'

import {
    getOwnerBookings,
    confirmBooking,
    ownerCancelBooking,
    checkInBooking,
    completeBooking
} from '../../services/booking.service'

function OwnerBookings() {

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const loadBookings = async () => {
        try {
            setLoading(true)
            const response = await getOwnerBookings()
            setBookings(response.data?.bookings || response.bookings || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadBookings()
    }, [])

    const updateBooking = async (action, bookingId) => {
        try {
            await action(bookingId)
            await loadBookings()
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message || 'Booking update failed')
        }
    }

    if (loading) {
        return (
            <main className="owner-page">
                <h1>Owner Bookings</h1>
                <p>Loading...</p>
            </main>
        )
    }

    return (
        <main className="owner-page">
            <h1>Customer Bookings</h1>

            {bookings.length === 0 ? (
                <p className="owner-empty">No bookings found.</p>
            ) : (
                <section className="owner-booking-list">{bookings.map(booking => (
                    <article className="owner-booking-card" key={booking._id}>
                        <h2>{booking.hostel?.name || 'Hostel'}</h2>
                        <p><span>Customer</span><strong>{booking.user?.name || 'Customer'}</strong></p>
                        <p><span>Email</span><strong>{booking.user?.email || 'Not provided'}</strong></p>
                        <p><span>Room</span><strong>{booking.room?.roomType || 'Room'}</strong></p>
                        <p><span>Beds</span><strong>{booking.numberOfBeds}</strong></p>
                        <p><span>Check-in</span><strong>{new Date(booking.checkIn).toLocaleDateString()}</strong></p>
                        <p><span>Check-out</span><strong>{new Date(booking.checkOut).toLocaleDateString()}</strong></p>
                        <p><span>Amount</span><strong>₹{booking.totalAmount}</strong></p>
                        <p><span>Status</span><strong className="owner-status">{booking.status}</strong></p>

                        {booking.status === 'pending' && (
                            <div className="owner-booking-actions">
                                <button onClick={() => updateBooking(confirmBooking, booking._id)}>Confirm</button>
                                <button onClick={() => updateBooking(ownerCancelBooking, booking._id)}>Cancel</button>
                            </div>
                        )}

                        {booking.status === 'confirmed' && (
                            <div className="owner-booking-actions"><button onClick={() => updateBooking(checkInBooking, booking._id)}>Check In</button></div>
                        )}

                        {booking.status === 'checkedIn' && (
                            <div className="owner-booking-actions"><button onClick={() => updateBooking(completeBooking, booking._id)}>Complete Stay</button></div>
                        )}
                    </article>
                ))}</section>
            )}
        </main>
    )
}

export default OwnerBookings
