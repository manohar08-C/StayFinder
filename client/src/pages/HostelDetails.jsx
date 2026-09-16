import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { getHostelById } from '../services/hostel.service'
import { getRoomsByHostel } from '../services/room.service'
import { getHostelReviews } from '../services/review.service'
import { addFavorite, getFavorites, removeFavorite } from '../services/favorite.service'
import { useAuth } from '../context/AuthContext'

import RoomCard from '../components/RoomCard'
import ReviewCard from '../components/ReviewCard'
import BookingForm from '../components/BookingForm'


function HostelDetails() {

    const { id } = useParams()
    const { isAuthenticated } = useAuth()
    const [hostel, setHostel] = useState(null)
    const [rooms, setRooms] = useState([])
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [favorite, setFavorite] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [selectedBeds, setSelectedBeds] = useState(1)
    const [favoriteError, setFavoriteError] = useState('')
    const bookingSectionRef = useRef(null)


    useEffect(() => {

        const loadHostel = async () => {

            try {

                setLoading(true)
                setError('')
                setHostel(null)
                setRooms([])
                setReviews([])

                const hostelData = await getHostelById(id)

                const hostelResult =
                    hostelData.data?.hostel || hostelData.data

                setHostel(hostelResult)

                try {
                    const roomResult = await getRoomsByHostel(id)

                    setRooms(
                        roomResult.data?.rooms ||
                        roomResult.rooms ||
                        []
                    )
                } catch (roomError) {
                    console.error('Rooms could not be loaded:', roomError)
                    setRooms([])
                }

                if (isAuthenticated) {
                    try {
                        const favoriteResult = await getFavorites()
                        const favoriteItems = favoriteResult.data?.favorites || favoriteResult.favorites || []
                        setFavorite(favoriteItems.some(item => (item.hostel?._id || item.hostel) === id))
                    } catch (favoriteLoadError) {
                        console.error('Favorites could not be loaded:', favoriteLoadError)
                    }
                }

                try {

                    const reviewResult = await getHostelReviews(id)

                    setReviews(
                        reviewResult.data?.reviews ||
                        reviewResult.reviews ||
                        []
                    )

                } catch (reviewError) {

                    console.log( 'Reviews could not be loaded:',
                        reviewError
                    )

                    setReviews([])

                }

            } catch (err) {

                console.error(err)

                setError(
                    err.response?.data?.message ||
                    'Failed to load hostel'
                )

            } finally {

                setLoading(false)
            }
        }

        loadHostel()

    }, [id, isAuthenticated])


    const handleFavorite = async () => {

        if (!isAuthenticated) {
            setFavoriteError('Please login to add favorites.')
            return
        }

        try {

            if (favorite) {

                await removeFavorite(id)

                setFavorite(false)

            } else {

                await addFavorite(id)

                setFavorite(true)

            }

            setFavoriteError('')

        } catch (error) {

            console.error(error)

            setFavoriteError(error.response?.data?.message || 'Favorite operation failed')
        }
    }


    const handleBook = (room, beds) => {

        const roomHostelId = typeof room.hostel === 'string'
            ? room.hostel
            : room.hostel?._id

        if (!room._id || !roomHostelId) {
            alert('This room cannot be booked because its ID is missing.')
            return
        }

        setSelectedRoom(room)

        setSelectedBeds(beds)

        window.requestAnimationFrame(() => {
            bookingSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        })

    }

    const handleBookingSuccess = (roomId, bookedBeds) => {
        setRooms(currentRooms => currentRooms.map(room => {
            if (room._id !== roomId) return room

            const currentBeds = room.availableBeds ?? room.capacity ?? 0

            return {
                ...room,
                availableBeds: Math.max(0, currentBeds - bookedBeds)
            }
        }))
    }


    if (loading) {

        return (
            <main>
                <h1>Loading hostel...</h1>
            </main>
        )
    }


    if (error || !hostel) {

        return (
            <main>

                <h1>
                    Hostel not found
                </h1>

                <p>
                    {error}
                </p>

                <Link to="/hostels">
                    Back to Hostels
                </Link>

            </main>
        )
    }


    const rating =
        hostel.rating?.average ?? 0

    const reviewCount =
        hostel.rating?.count ?? 0

    const dailyPrices = rooms
        .map(room => room.pricing?.daily)
        .filter(price => typeof price === 'number')

    const monthlyPrices = rooms
        .map(room => room.pricing?.monthly)
        .filter(price => typeof price === 'number')

    const dailyPrice = dailyPrices.length
        ? Math.min(...dailyPrices)
        : undefined

    const monthlyPrice = monthlyPrices.length
        ? Math.min(...monthlyPrices)
        : undefined


    return (

        <main className="hostel-details page-shell">

            {/* ============================= */}
            {/* HEADER */}
            {/* ============================= */}

            <section className="hostel-header details-hero">

                <div>

                    <h1>
                        {hostel.name}
                    </h1>

                    <p>
                        {hostel.city}

                        {hostel.locality &&
                            `, ${hostel.locality}`
                        }
                    </p>

                    <p>
                        ⭐ {rating}
                        {' '}
                        ({reviewCount} reviews)
                    </p>

                </div>


                <button className="favorite-button"
                    onClick={handleFavorite}
                >
                    {favorite
                        ? '❤️ Remove Favorite'
                        : '🤍 Add Favorite'}
                </button>
                {favoriteError && <p className="form-error" role="alert">{favoriteError}</p>}

            </section>


            {/* ============================= */}
            {/* IMAGES */}
            {/* ============================= */}

            <section className="hostel-images image-gallery" aria-label="Hostel image gallery">

                {hostel.images?.length > 0 ? (

                    hostel.images.map(
                        (image, index) => (

                            <img
                                key={index}
                                src={
                                    typeof image === 'string'
                                        ? image
                                        : image.url
                                }
                                alt={`${hostel.name} ${index + 1}`}
                            />

                        )
                    )

                ) : (

                    <div>
                        <p>
                            No images available
                        </p>
                    </div>

                )}

            </section>


            {/* ============================= */}
            {/* DESCRIPTION */}
            {/* ============================= */}

            <section className="details-section">

                <h2>
                    About this Hostel
                </h2>

                <p>
                    {hostel.description ||
                        'No description available.'}
                </p>

            </section>


            {/* ============================= */}
            {/* PRICING */}
            {/* ============================= */}

            <section className="details-section pricing-section">

                <h2>
                    Starting Price
                </h2>

                <div>

                    <p>
                        Daily
                    </p>

                    <strong>
                        ₹{dailyPrice ?? 'N/A'}
                    </strong>

                </div>

                <div>

                    <p>
                        Monthly
                    </p>

                    <strong>
                        ₹{monthlyPrice ?? 'N/A'}
                    </strong>

                </div>

            </section>


            {/* ============================= */}
            {/* AMENITIES */}
            {/* ============================= */}

            <section className="details-section amenities-section">

                <h2>
                    Amenities
                </h2>

                {hostel.amenities?.length > 0 ? (

                    <ul>

                        {hostel.amenities.map(
                            (amenity, index) => (

                                <li key={index}>
                                    ✓ {amenity}
                                </li>

                            )
                        )}

                    </ul>

                ) : (

                    <p>
                        No amenities listed.
                    </p>

                )}

            </section>


            {/* ============================= */}
            {/* ROOMS */}
            {/* ============================= */}

            <section className="details-section rooms-section">

                <h2>
                    Available Rooms
                </h2>

                {rooms.length === 0 ? (

                    <p>
                        No rooms available.
                    </p>

                ) : (

                    <div className="room-grid">

                        {rooms.map(room => (

                            <RoomCard
                                key={room._id}
                                room={room}
                                onBook={handleBook}
                            />

                        ))}

                    </div>

                )}

            </section>


            {/* ============================= */}
            {/* LOCATION */}
            {/* ============================= */}

            <section className="details-section location-section">

                <h2>
                    Location
                </h2>

                <p>
                    {hostel.address ||
                        `${hostel.locality || ''}, ${hostel.city || ''}`}
                </p>

                {hostel.location?.coordinates && (

                    <div>

                        <p>
                            Latitude:
                            {' '}
                            {hostel.location.coordinates[1]}
                        </p>

                        <p>
                            Longitude:
                            {' '}
                            {hostel.location.coordinates[0]}
                        </p>

                    </div>

                )}

                <a className="map-link" href={`https://www.google.com/maps/search/?api=1&query=${hostel.location?.coordinates?.[1] || ''},${hostel.location?.coordinates?.[0] || ''}`} target="_blank" rel="noreferrer">
                    Open location in Maps →
                </a>

            </section>


            {/* ============================= */}
            {/* REVIEWS */}
            {/* ============================= */}

            <section className="details-section reviews-section">

                <h2>
                    Reviews
                </h2>

                {reviews.length === 0 ? (

                    <p>
                        No reviews yet.
                    </p>

                ) : (

                    <div className="review-list">

                        {reviews.map(review => (

                            <ReviewCard
                                key={review._id}
                                review={review}
                            />

                        ))}

                    </div>

                )}

            </section>


            {/* ============================= */}
            {/* BOOKING MODAL / FORM */}
            {/* ============================= */}

            {selectedRoom && (

                <section
                    className="booking-section details-section"
                    ref={bookingSectionRef}
                >

                    <BookingForm
                        room={selectedRoom}
                        beds={selectedBeds}
                        onBookingSuccess={handleBookingSuccess}
                        onClose={() =>
                            setSelectedRoom(null)
                        }
                    />

                </section>

            )}

        </main>
    )
}

export default HostelDetails