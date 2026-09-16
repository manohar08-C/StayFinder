import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getToday() {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${date.getFullYear()}-${month}-${day}`
}

function SearchBar() {
    const navigate = useNavigate()
    const today = getToday()
    const [city, setCity] = useState('')
    const [locality, setLocality] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [beds, setBeds] = useState('')

    const handleSearch = (event) => {
        event.preventDefault()

        const params = new URLSearchParams()

        if (city.trim()) params.set('city', city.trim())
        if (locality.trim()) params.set('locality', locality.trim())
        if (checkIn && checkOut && checkOut > checkIn) {
            params.set('checkIn', checkIn)
            params.set('checkOut', checkOut)

            if (beds) params.set('availableBeds', beds)
        }

        navigate(`/hostels?${params.toString()}`)
    }

    const handleCheckInChange = (event) => {
        const value = event.target.value
        setCheckIn(value)

        if (checkOut && value >= checkOut) {
            setCheckOut('')
        }
    }

    return (
        <section className="search-bar">
            <div className="search-bar-intro">
                <span className="search-bar-icon" aria-hidden="true">⌕</span>
                <div><strong>Search by your stay</strong><span>Choose a place, dates, and bed count to see matching hostels.</span></div>
            </div>
            <form onSubmit={handleSearch}>
                <div className="search-field search-field-place">
                    <label htmlFor="search-city">City</label>
                    <input
                        id="search-city"
                        type="text"
                        placeholder="e.g. Hyderabad"
                        value={city}
                        onChange={event => setCity(event.target.value)}
                    />
                </div>

                <div className="search-field search-field-place">
                    <label htmlFor="search-locality">Locality</label>
                    <input
                        id="search-locality"
                        type="text"
                        placeholder="e.g. Gachibowli"
                        value={locality}
                        onChange={event => setLocality(event.target.value)}
                    />
                </div>

                <div className="search-field search-field-date">
                    <label htmlFor="search-check-in">Check-in</label>
                    <input
                        id="search-check-in"
                        type="date"
                        min={today}
                        value={checkIn}
                        onChange={handleCheckInChange}
                    />
                </div>

                <div className="search-field search-field-date">
                    <label htmlFor="search-check-out">Check-out</label>
                    <input
                        id="search-check-out"
                        type="date"
                        min={checkIn || today}
                        value={checkOut}
                        onChange={event => setCheckOut(event.target.value)}
                    />
                </div>

                <div className="search-field search-field-beds">
                    <label htmlFor="search-beds">Beds</label>
                    <input
                        id="search-beds"
                        type="number"
                        min="1"
                        placeholder="Beds"
                        value={beds}
                        onChange={event => setBeds(event.target.value)}
                    />
                </div>

                <button className="search-submit" type="submit"><span aria-hidden="true">⌕</span> Search stays</button>
            </form>
        </section>
    )
}

export default SearchBar
