import { useEffect, useState } from 'react'

import {
    getMyHostels,
    createHostel,
    updateHostel
} from '../../services/owner.service'

function OwnerHostel() {

    const [hostel, setHostel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        locality: '',
        gender: '',
        images: [],
        imageUrls: '',
        latitude: '',
        longitude: ''
    })

    const readCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported in this browser.')
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setForm(prev => ({
                    ...prev,
                    latitude: String(latitude),
                    longitude: String(longitude)
                }))
            },
            () => {
                alert('Unable to get your current location. Please enter latitude and longitude manually.')
            }
        )
    }

    const loadHostel = async () => {
        try {
            setLoading(true)
            const response = await getMyHostels()
            const hostels = response.data?.hostels || response.hostels || []

            if (hostels.length > 0) {
                const current = hostels[0]
                setHostel(current)
                setForm({
                    name: current.name || '',
                    description: current.description || '',
                    address: current.address || '',
                    city: current.city || '',
                    locality: current.locality || '',
                    gender: current.gender || '',
                    images: [],
                    imageUrls: (current.images || []).join('\n'),
                    latitude: current.location?.coordinates?.[1] !== undefined
                        ? String(current.location.coordinates[1])
                        : '',
                    longitude: current.location?.coordinates?.[0] !== undefined
                        ? String(current.location.coordinates[0])
                        : ''
                })
            } else {
                setHostel(null)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadHostel()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.images.length && !form.imageUrls.trim()) {
            alert('Please select at least one hostel image.')
            return
        }

        const latitude = Number(form.latitude)
        const longitude = Number(form.longitude)

        if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
            alert('Please enter a valid latitude and longitude for the hostel location.')
            return
        }

        const payload = new FormData()
        payload.append('name', form.name)
        payload.append('description', form.description)
        payload.append('address', form.address)
        payload.append('city', form.city)
        payload.append('locality', form.locality)
        payload.append('gender', form.gender)
        payload.append('imageUrls', form.imageUrls)
        payload.append('location', JSON.stringify({ coordinates: [longitude, latitude] }))
        form.images.forEach(image => payload.append('images', image))

        try {
            if (hostel) {
                const response = await updateHostel(hostel._id, payload)
                const updated = response.data?.hostel || response.hostel
                setHostel(updated || hostel)
            } else {
                const response = await createHostel(payload)
                const created = response.data?.hostel || response.hostel || response.Hostel
                setHostel(created)
            }

            setEditing(false)
            alert('Hostel saved successfully')
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message || error.message || 'Failed to save hostel')
        }
    }

    if (loading) {
        return <main><h1>Loading...</h1></main>
    }

    return (
        <main className="owner-page">
            <h1>My Hostel</h1>

            {!editing && hostel && (
                <section className="owner-summary">
                    <h2>{hostel.name}</h2>
                    <p>{hostel.city}{hostel.locality ? `, ${hostel.locality}` : ''}</p>
                    <p>{hostel.description}</p>
                    <p>Gender: {hostel.gender}</p>
                    <p><span className="owner-status">{hostel.status}</span></p>
                    <div className="owner-actions"><button onClick={() => setEditing(true)}>Edit Hostel</button></div>
                </section>
            )}

            {!hostel && !editing && (
                <section className="owner-empty">
                    <h2>You don't have a hostel yet.</h2>
                    <button onClick={() => setEditing(true)}>Create Hostel</button>
                </section>
            )}

            {editing && (
                <form className="owner-form" onSubmit={handleSubmit}>
                    <div>
                        <label>Hostel Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Address</label>
                        <input name="address" value={form.address} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>City</label>
                        <input name="city" value={form.city} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Locality</label>
                        <input name="locality" value={form.locality} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Gender</label>
                        <select name="gender" value={form.gender} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="co-ed">Co-ed</option>
                        </select>
                    </div>

                    <div>
                        <label>Hostel Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setForm(prev => ({ ...prev, images: Array.from(e.target.files) }))}
                            required={!hostel && !form.imageUrls}
                        />
                        <small>{form.images.length ? `${form.images.length} image(s) selected` : 'Choose images from your device'}</small>
                    </div>

                    <div>
                        <label>Latitude</label>
                        <input
                            name="latitude"
                            type="number"
                            step="any"
                            value={form.latitude}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Longitude</label>
                        <input
                            name="longitude"
                            type="number"
                            step="any"
                            value={form.longitude}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="button" onClick={readCurrentLocation}>
                        Use My Current Location
                    </button>

                    <button type="submit">Save Hostel</button>
                    <button type="button" onClick={() => setEditing(false)}>Cancel</button>
                </form>
            )}
        </main>
    )
}

export default OwnerHostel
