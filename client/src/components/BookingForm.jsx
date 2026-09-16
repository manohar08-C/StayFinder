import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBooking } from '../services/booking.service'
import { useAuth } from '../context/AuthContext'

const getToday = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${date.getFullYear()}-${month}-${day}`
}

function BookingForm({ room, beds, onClose, onBookingSuccess }) {

    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [pricingType, setPricingType] = useState('daily')
    const [selectedBeds, setSelectedBeds] = useState(beds)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const today = getToday()

    const validateDates = () => {
        if (!checkIn || !checkOut) return 'Please select check-in and check-out dates.'
        if (checkIn < today) return 'Check-in cannot be in the past.'
        if (checkOut <= checkIn) return 'Check-out must be after check-in.'
        return ''
    }

    const goNext = () => {
        const dateError = step === 1 ? validateDates() : ''
        if (dateError) {
            setError(dateError)
            return
        }
        if (step === 2 && (selectedBeds < 1 || selectedBeds > (room.availableBeds ?? room.capacity ?? 0))) {
            setError('Select a valid number of available beds.')
            return
        }
        setError('')
        setStep(current => current + 1)
    }

    const handleBooking = async (e) => {

        e.preventDefault()

        if (!isAuthenticated) {
            setError('Please login before booking.')
            return
        }

        const dateError = validateDates()
        if (dateError || selectedBeds < 1) {
            setError(dateError || 'Select at least one bed.')
            return
        }

        const hostelId = typeof room.hostel === 'string'
            ? room.hostel
            : room.hostel?._id

        if (!room._id || !hostelId) {
            setError('This room cannot be booked because its ID is missing.')
            return
        }

        try {

            setLoading(true)
            setError('')

            const bookingData = {
                hostel: hostelId,
                room: room._id,
                checkIn,
                checkOut,
                numberOfBeds: selectedBeds,
                pricingType
            }

            const data = await createBooking(bookingData)

            onBookingSuccess?.(room._id, selectedBeds)
            const bookingId = data.data?.booking?._id || data.booking?._id
            if (bookingId) navigate(`/booking-success/${bookingId}`)
            else onClose()

        } catch (error) {

            console.error(error)

            setError(error.response?.data?.message || 'Booking failed. Please try again.')

        } finally {

            setLoading(false)

        }
    }

    return (
        <div className="booking-form">

            <h3>
                Book {room.roomType || 'Room'}
            </h3>

            <ol className="booking-steps" aria-label="Booking progress">
                {['Dates', 'Beds', 'Pricing', 'Review'].map((label, index) => <li className={step >= index + 1 ? 'active' : ''} key={label}>{index + 1}. {label}</li>)}
            </ol>

            {error && <p className="form-error" role="alert">{error}</p>}

            <form onSubmit={handleBooking}>
                {step === 1 && <div className="booking-step-panel">
                    <label htmlFor="check-in">Check-in</label>
                    <input id="check-in" type="date" min={today} value={checkIn} onChange={event => setCheckIn(event.target.value)} required />
                    <label htmlFor="check-out">Check-out</label>
                    <input id="check-out" type="date" min={checkIn || today} value={checkOut} onChange={event => setCheckOut(event.target.value)} required />
                </div>}

                {step === 2 && <div className="booking-step-panel">
                    <label>Number of beds</label>
                    <input type="number" min="1" max={room.availableBeds ?? room.capacity ?? 0} value={selectedBeds} onChange={event => setSelectedBeds(Number(event.target.value))} required />
                    <p>{room.availableBeds ?? room.capacity ?? 0} beds currently available.</p>
                </div>}

                {step === 3 && <div className="booking-step-panel">
                    <label htmlFor="pricing-type">Choose pricing</label>
                    <select id="pricing-type" value={pricingType} onChange={event => setPricingType(event.target.value)}>
                        <option value="daily">Daily · ₹{room.pricing?.daily ?? 'N/A'}</option>
                        <option value="monthly">Monthly · ₹{room.pricing?.monthly ?? 'N/A'}</option>
                    </select>
                </div>}

                {step === 4 && <div className="booking-review-summary">
                    <h4>Review your booking</h4>
                    <p><strong>{room.roomType || 'Room'}</strong></p>
                    <p>{checkIn} to {checkOut}</p>
                    <p>{selectedBeds} bed{selectedBeds === 1 ? '' : 's'} · {pricingType} pricing</p>
                </div>}

                {step < 4 ? <button type="button" onClick={goNext}>Continue</button> : <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Confirming...' : 'Confirm booking'}
                </button>}

                {step > 1 && <button type="button" onClick={() => { setError(''); setStep(current => current - 1) }}>Back</button>}

                <button
                    type="button"
                    onClick={onClose}
                >
                    Cancel
                </button>

            </form>

        </div>
    )
}

export default BookingForm