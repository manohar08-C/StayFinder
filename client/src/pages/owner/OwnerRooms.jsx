// import { useEffect, useState } from 'react'

// import { getMyHostels } from '../../services/owner.service'
// import {
//     getRoomsByHostel,
//     createRoom,
//     updateRoom,
//     deleteRoom
// } from '../../services/room.service'

// function OwnerRooms() {

//     const [hostel, setHostel] = useState(null)
//     const [rooms, setRooms] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [editingRoom, setEditingRoom] = useState(null)

//     const emptyRoom = {
//         roomType: '',
//         capacity: 1,
//         pricing: {
//             daily: '',
//             monthly: ''
//         },
//         images: [],
//         imageUrls: ''
//     }

//     const [form, setForm] = useState(emptyRoom)

//     const loadRooms = async () => {
//         try {
//             setLoading(true)
//             const hostelResponse = await getMyHostels()
//             const hostels = hostelResponse.data?.hostels || hostelResponse.hostels || []

//             if (!hostels.length) {
//                 setHostel(null)
//                 setRooms([])
//                 return
//             }

//             const currentHostel = hostels[0]
//             setHostel(currentHostel)

//             const roomResponse = await getRoomsByHostel(currentHostel._id)
//             setRooms(roomResponse.data?.rooms || roomResponse.rooms || [])
//         } catch (error) {
//             console.error(error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         loadRooms()
//     }, [])

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         if (!form.images.length && !form.imageUrls.trim()) {
//             alert('Please select at least one room image.')
//             return
//         }

//         try {
//             const data = new FormData()
//             data.append('roomType', form.roomType)
//             data.append('capacity', String(Number(form.capacity)))
//             data.append('pricing', JSON.stringify({
//                 daily: Number(form.pricing.daily),
//                 monthly: Number(form.pricing.monthly)
//             }))
//             data.append('imageUrls', form.imageUrls)
//             form.images.forEach(image => data.append('images', image))

//             if (editingRoom) {
//                 await updateRoom(editingRoom._id, data)
//             } else {
//                 await createRoom(hostel._id, data)
//             }

//             setForm(emptyRoom)
//             setEditingRoom(null)
//             await loadRooms()
//         } catch (error) {
//             console.error(error)
//             alert(error.response?.data?.message || 'Failed to save room')
//         }
//     }

//     const editRoom = (room) => {
//         setEditingRoom(room)
//         setForm({
//             roomType: room.roomType || '',
//             capacity: room.capacity || 1,
//             pricing: {
//                 daily: room.pricing?.daily || '',
//                 monthly: room.pricing?.monthly || ''
//             },
//             images: [],
//             imageUrls: (room.images || []).join('\n')
//         })
//     }

//     const removeRoom = async (roomId) => {
//         const confirmed = window.confirm('Delete this room?')
//         if (!confirmed) return

//         try {
//             await deleteRoom(roomId)
//             await loadRooms()
//         } catch (error) {
//             console.error(error)
//             alert(error.response?.data?.message || 'Failed to delete room')
//         }
//     }

//     if (loading) {
//         return <main><h1>Loading rooms...</h1></main>
//     }

//     if (!hostel) {
//         return (
//             <main>
//                 <h1>Rooms</h1>
//                 <p>Create your hostel first.</p>
//             </main>
//         )
//     }

//     return (
//         <main className="owner-page">
//             <h1>Manage Rooms</h1>

//             <section className="owner-room-form">
//                 <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>

//                 <form className="owner-form" onSubmit={handleSubmit}>
//                     <div>
//                         <label>Room Type</label>
//                         <select
//                             value={form.roomType}
//                             onChange={(e) => setForm(prev => ({ ...prev, roomType: e.target.value }))}
//                             required
//                         >
//                             <option value="">Select</option>
//                             <option value="Single">Single</option>
//                             <option value="Double">Double</option>
//                             <option value="Triple">Triple</option>
//                             <option value="Dormitory">Dormitory</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label>Capacity</label>
//                         <input
//                             type="number"
//                             min="1"
//                             value={form.capacity}
//                             onChange={(e) => setForm(prev => ({ ...prev, capacity: e.target.value }))}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label>Daily Price</label>
//                         <input
//                             type="number"
//                             min="0"
//                             value={form.pricing.daily}
//                             onChange={(e) => setForm(prev => ({
//                                 ...prev,
//                                 pricing: { ...prev.pricing, daily: e.target.value }
//                             }))}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label>Monthly Price</label>
//                         <input
//                             type="number"
//                             min="0"
//                             value={form.pricing.monthly}
//                             onChange={(e) => setForm(prev => ({
//                                 ...prev,
//                                 pricing: { ...prev.pricing, monthly: e.target.value }
//                             }))}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label>Room Images</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             multiple
//                             onChange={(e) => setForm(prev => ({ ...prev, images: Array.from(e.target.files) }))}
//                             required={!editingRoom && !form.imageUrls}
//                         />
//                         <small>{form.images.length ? `${form.images.length} image(s) selected` : 'Choose images from your device'}</small>
//                     </div>

//                     <button type="submit">
//                         {editingRoom ? 'Update Room' : 'Add Room'}
//                     </button>
//                 </form>
//             </section>

//             <section>
//                 <h2>Your Rooms</h2>

//                 {rooms.length === 0 ? (
//                     <p className="owner-empty">No rooms added yet.</p>
//                 ) : (
//                     <div className="owner-room-grid">{rooms.map(room => (
//                         <article className="owner-room-card" key={room._id}>
//                             <h3>{room.roomType}</h3>
//                             <p>Capacity: {room.capacity}</p>
//                             <p>Daily: ₹{room.pricing?.daily}</p>
//                             <p>Monthly: ₹{room.pricing?.monthly}</p>

//                             <div className="owner-actions"><button onClick={() => editRoom(room)}>Edit</button><button onClick={() => removeRoom(room._id)}>Delete</button></div>
//                         </article>
//                     ))}</div>
//                 )}
//             </section>
//         </main>
//     )
// }

// export default OwnerRooms



import { useEffect, useState } from 'react'

import { getMyHostels } from '../../services/owner.service'

import {
    getRoomsByHostel,
    createRoom,
    updateRoom,
    deleteRoom
} from '../../services/room.service'

import RoomImageGallery from '../../components/RoomImageGallery'

function OwnerRooms() {

    const [hostel, setHostel] = useState(null)
    const [rooms, setRooms] = useState([])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [editingRoom, setEditingRoom] = useState(null)

    const emptyRoom = {
        roomType: '',
        capacity: 1,
        pricing: {
            daily: '',
            monthly: ''
        },
        images: [],
        imageUrls: ''
    }

    const [form, setForm] = useState(emptyRoom)


    const loadRooms = async () => {
        try {
            setLoading(true)

            const hostelResponse = await getMyHostels()

            const hostels =
                hostelResponse.data?.hostels ||
                hostelResponse.hostels ||
                []

            if (!hostels.length) {
                setHostel(null)
                setRooms([])
                return
            }

            const currentHostel = hostels[0]

            setHostel(currentHostel)

            const roomResponse =
                await getRoomsByHostel(currentHostel._id)

            setRooms(
                roomResponse.data?.rooms ||
                roomResponse.rooms ||
                []
            )

        } catch (error) {
            console.error('Load rooms error:', error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        loadRooms()
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!hostel?._id) {
            alert('Hostel not found.')
            return
        }

        if (!form.roomType) {
            alert('Please select a room type.')
            return
        }

        if (!form.images.length && !form.imageUrls.trim()) {
            alert('Please select at least one room image.')
            return
        }

        try {
            setSaving(true)

            const data = new FormData()

            data.append(
                'roomType',
                form.roomType
            )

            data.append(
                'capacity',
                String(Number(form.capacity))
            )

            data.append(
                'pricing',
                JSON.stringify({
                    daily: Number(form.pricing.daily),
                    monthly: Number(form.pricing.monthly)
                })
            )

            if (form.imageUrls.trim()) {
                data.append(
                    'imageUrls',
                    form.imageUrls
                )
            }

            form.images.forEach((image) => {
                data.append('images', image)
            })


            if (editingRoom) {
                await updateRoom(
                    editingRoom._id,
                    data
                )
            } else {
                await createRoom(
                    hostel._id,
                    data
                )
            }

            setForm(emptyRoom)
            setEditingRoom(null)

            await loadRooms()

        } catch (error) {
            console.error('Save room error:', error)

            alert(
                error.response?.data?.message ||
                'Failed to save room'
            )

        } finally {
            setSaving(false)
        }
    }


    const editRoom = (room) => {

        setEditingRoom(room)

        setForm({
            roomType: room.roomType || '',

            capacity: room.capacity || 1,

            pricing: {
                daily: room.pricing?.daily || '',
                monthly: room.pricing?.monthly || ''
            },

            images: [],

            imageUrls: ''
        })

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }


    const cancelEdit = () => {
        setEditingRoom(null)
        setForm(emptyRoom)
    }


    const removeRoom = async (roomId) => {

        const confirmed =
            window.confirm(
                'Are you sure you want to delete this room?'
            )

        if (!confirmed) return

        try {

            await deleteRoom(roomId)

            await loadRooms()

        } catch (error) {

            console.error(
                'Delete room error:',
                error
            )

            alert(
                error.response?.data?.message ||
                'Failed to delete room'
            )
        }
    }


    if (loading) {
        return (
            <main className="owner-page">
                <div className="owner-loading">
                    <h1>Loading rooms...</h1>
                    <p>Please wait.</p>
                </div>
            </main>
        )
    }


    if (!hostel) {
        return (
            <main className="owner-page">

                <h1>Manage Rooms</h1>

                <div className="owner-empty">
                    <h2>No Hostel Found</h2>
                    <p>
                        Create your hostel first before adding rooms.
                    </p>
                </div>

            </main>
        )
    }


    return (
        <main className="owner-page">

            <header className="owner-page-header">

                <div>
                    <span className="owner-eyebrow">
                        {hostel.name}
                    </span>

                    <h1>Manage Rooms</h1>

                    <p>
                        Add, update and manage the rooms
                        available in your hostel.
                    </p>
                </div>

            </header>


            {/* ADD / EDIT ROOM */}

            <section className="owner-room-form-section">

                <div className="owner-section-heading">

                    <div>
                        <span className="owner-eyebrow">
                            Room Management
                        </span>

                        <h2>
                            {editingRoom
                                ? 'Edit Room'
                                : 'Add New Room'
                            }
                        </h2>
                    </div>

                    {editingRoom && (
                        <button
                            type="button"
                            className="owner-secondary-button"
                            onClick={cancelEdit}
                        >
                            Cancel Edit
                        </button>
                    )}

                </div>


                <form
                    className="owner-form"
                    onSubmit={handleSubmit}
                >

                    <div>
                        <label htmlFor="roomType">
                            Room Type
                        </label>

                        <select
                            id="roomType"
                            value={form.roomType}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    roomType: e.target.value
                                }))
                            }
                            required
                        >
                            <option value="">
                                Select room type
                            </option>

                            <option value="Single">
                                Single
                            </option>

                            <option value="Double">
                                Double
                            </option>

                            <option value="Triple">
                                Triple
                            </option>

                            <option value="Dormitory">
                                Dormitory
                            </option>
                        </select>
                    </div>


                    <div>
                        <label htmlFor="capacity">
                            Capacity
                        </label>

                        <input
                            id="capacity"
                            type="number"
                            min="1"
                            value={form.capacity}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    capacity: e.target.value
                                }))
                            }
                            required
                        />
                    </div>


                    <div>
                        <label htmlFor="dailyPrice">
                            Daily Price
                        </label>

                        <input
                            id="dailyPrice"
                            type="number"
                            min="0"
                            value={form.pricing.daily}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    pricing: {
                                        ...prev.pricing,
                                        daily: e.target.value
                                    }
                                }))
                            }
                            required
                        />
                    </div>


                    <div>
                        <label htmlFor="monthlyPrice">
                            Monthly Price
                        </label>

                        <input
                            id="monthlyPrice"
                            type="number"
                            min="0"
                            value={form.pricing.monthly}
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    pricing: {
                                        ...prev.pricing,
                                        monthly: e.target.value
                                    }
                                }))
                            }
                            required
                        />
                    </div>


                    <div className="owner-image-upload">

                        <label htmlFor="roomImages">
                            Room Images
                        </label>

                        <input
                            id="roomImages"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                                setForm(prev => ({
                                    ...prev,
                                    images:
                                        Array.from(
                                            e.target.files || []
                                        )
                                }))
                            }
                            required={
                                !editingRoom &&
                                !form.imageUrls
                            }
                        />

                        <small>
                            You can select multiple images.
                            Maximum 10 images per room.
                        </small>

                        {form.images.length > 0 && (
                            <div className="selected-images">
                                <strong>
                                    {form.images.length} image(s) selected
                                </strong>

                                <div className="selected-image-names">
                                    {form.images.map(
                                        (image, index) => (
                                            <span key={`${image.name}-${index}`}>
                                                {image.name}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    </div>


                    <div className="owner-form-actions">

                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving...'
                                : editingRoom
                                    ? 'Update Room'
                                    : 'Add Room'
                            }
                        </button>

                        {editingRoom && (
                            <button
                                type="button"
                                className="owner-secondary-button"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </section>


            {/* ROOMS */}

            <section className="owner-room-list-section">

                <div className="owner-section-heading">

                    <div>
                        <span className="owner-eyebrow">
                            Inventory
                        </span>

                        <h2>Your Rooms</h2>
                    </div>

                    <span className="owner-room-count">
                        {rooms.length}{' '}
                        {rooms.length === 1
                            ? 'Room'
                            : 'Rooms'
                        }
                    </span>

                </div>


                {rooms.length === 0 ? (

                    <div className="owner-empty">

                        <h2>No Rooms Added</h2>

                        <p>
                            Add your first room using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="owner-room-grid">

                        {rooms.map((room) => (

                            <article
                                className="owner-room-card"
                                key={room._id}
                            >

                                <RoomImageGallery
                                    images={room.images || []}
                                    alt={`${room.roomType || 'Room'} room`}
                                />


                                <div className="owner-room-card-content">

                                    <div className="owner-room-card-title">

                                        <div>
                                            <span className="owner-room-type">
                                                Room
                                            </span>

                                            <h3>
                                                {room.roomType || 'Room'}
                                            </h3>
                                        </div>

                                    </div>


                                    <div className="owner-room-details">

                                        <div>
                                            <span>
                                                Capacity
                                            </span>

                                            <strong>
                                                {room.capacity}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Daily
                                            </span>

                                            <strong>
                                                ₹{room.pricing?.daily ?? 'N/A'}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Monthly
                                            </span>

                                            <strong>
                                                ₹{room.pricing?.monthly ?? 'N/A'}
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Available Beds
                                            </span>

                                            <strong>
                                                {room.availableBeds ??
                                                    room.capacity ??
                                                    0}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="owner-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                editRoom(room)
                                            }
                                        >
                                            Edit Room
                                        </button>

                                        <button
                                            type="button"
                                            className="danger"
                                            onClick={() =>
                                                removeRoom(room._id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>

        </main>
    )
}

export default OwnerRooms

