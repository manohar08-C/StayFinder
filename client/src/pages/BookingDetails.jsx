import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import {
    getBookingById
} from '../services/booking.service'

function BookingDetails() {

    const { id } = useParams()

    const [booking, setBooking] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')

    useEffect(() => {

        const loadBooking = async () => {

            try {

                setLoading(true)

                const response =
                    await getBookingById(id)

                setBooking(
                    response.data?.booking ||
                    response.booking ||
                    response.data
                )

            } catch (error) {

                console.error(error)

                setError(
                    error.response?.data?.message ||
                    'Failed to load booking'
                )

            } finally {

                setLoading(false)

            }
        }

        loadBooking()

    }, [id])

    if (loading) {

        return (
            <main>
                <h1>
                    Loading booking...
                </h1>
            </main>
        )
    }

    if (error || !booking) {

        return (
            <main>

                <h1>
                    Booking Not Found
                </h1>

                <p>
                    {error}
                </p>

                <Link to="/bookings">
                    Back to My Bookings
                </Link>

            </main>
        )
    }

    return (

        <main className="booking-details">

            <Link to="/bookings">
                ← My Bookings
            </Link>

            <h1>
                Booking Details
            </h1>

            <section>

                <h2>
                    {booking.hostel?.name ||
                        'Hostel'}
                </h2>

                <p>
                    {booking.hostel?.city}
                </p>

            </section>

            <section>

                <h3>
                    Booking Information
                </h3>

                <p>
                    Booking ID:
                    {' '}
                    {booking._id}
                </p>

                <p>
                    Room:
                    {' '}
                    {booking.room?.roomType ||
                        'Room'}
                </p>

                <p>
                    Beds:
                    {' '}
                    {booking.numberOfBeds}
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
                    Pricing:
                    {' '}
                    {booking.pricingType}
                </p>

                <p>
                    Price per unit:
                    {' '}
                    ₹{booking.pricePerUnit}
                </p>

                <p>
                    Total:
                    {' '}
                    <strong>
                        ₹{booking.totalAmount}
                    </strong>
                </p>

                <p>
                    Status:
                    {' '}
                    <strong>
                        {booking.status}
                    </strong>
                </p>

            </section>

            <section>

                <h3>
                    Booking Timeline
                </h3>

                <p>
                    Created:
                    {' '}
                    {booking.createdAt &&
                        new Date(
                            booking.createdAt
                        ).toLocaleString()
                    }
                </p>

            </section>

        </main>
    )
}

export default BookingDetails
