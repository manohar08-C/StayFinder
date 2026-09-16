// import { useState } from 'react'

// function RoomCard({
//     room,
//     onBook
// }) {

//     const [beds, setBeds] = useState(1)
//     const [error, setError] = useState('')

//     const capacity = room.capacity ?? 0

//     const dailyPrice = room.pricing?.daily
//     const monthlyPrice = room.pricing?.monthly

//     const availableBeds =
//         room.availableBeds ?? room.capacity ?? 0

//     const handleBook = () => {

//         if (beds < 1) {
//             setError('Please select at least 1 bed.')
//             return
//         }

//         if (beds > availableBeds) {
//             setError('Not enough beds available.')
//             return
//         }

//         setError('')
//         onBook(room, beds)
//     }

//     return (
//         <article className="room-card">

//             <div className="room-card-header">

//                 <div>
//                     <h3>
//                         {room.roomType || 'Room'}
//                     </h3>

//                     <p>
//                         Capacity: {capacity}
//                     </p>
//                 </div>

//                 <div>
//                     <strong>
//                         ₹{dailyPrice ?? 'N/A'}
//                     </strong>

//                     <span> / day</span>
//                 </div>

//             </div>

//             <div className="room-prices">

//                 <p>
//                     Daily:
//                     ₹{dailyPrice ?? 'N/A'}
//                 </p>

//                 <p>
//                     Monthly:
//                     ₹{monthlyPrice ?? 'N/A'}
//                 </p>

//             </div>

//             <p>
//                 Available beds: {availableBeds}
//             </p>

//             {error && <p className="form-error" role="alert">{error}</p>}

//             <div className="room-booking">

//                 <label>
//                     Beds
//                 </label>

//                 <input
//                     type="number"
//                     min="1"
//                     max={availableBeds}
//                     value={beds}
//                     onChange={(e) =>
//                         setBeds(Number(e.target.value))
//                     }
//                 />

//                 <button onClick={handleBook}>
//                     Book Now
//                 </button>

//             </div>

//         </article>

//         // <article className="owner-room-card" key={room._id}>

//         //     {room.images?.[0] && (
//         //         <img
//         //             src={room.images[0]}
//         //             alt={`${room.roomType} room`}
//         //             className="owner-room-card-image"
//         //         />
//         //     )}

//         //     <div className="owner-room-card-content">

//         //         <h3>{room.roomType}</h3>

//         //         <p>
//         //             <span>Capacity</span>
//         //             <strong>{room.capacity}</strong>
//         //         </p>

//         //         <p>
//         //             <span>Daily</span>
//         //             <strong>₹{room.pricing?.daily}</strong>
//         //         </p>

//         //         <p>
//         //             <span>Monthly</span>
//         //             <strong>₹{room.pricing?.monthly}</strong>
//         //         </p>

//         //         <div className="owner-actions">
//         //             <button onClick={() => editRoom(room)}>
//         //                 Edit
//         //             </button>

//         //             <button onClick={() => removeRoom(room._id)}>
//         //                 Delete
//         //             </button>
//         //         </div>

//         //     </div>

//         // </article>
//     )
// }


// export default RoomCard


import { useState } from 'react'
import RoomImageGallery from './RoomImageGallery'

function RoomCard({
    room,
    onBook
}) {
    const [beds, setBeds] = useState(1)
    const [error, setError] = useState('')

    const capacity = room.capacity ?? 0

    const dailyPrice = room.pricing?.daily
    const monthlyPrice = room.pricing?.monthly

    const availableBeds =
        room.availableBeds ?? room.capacity ?? 0

    const handleBook = () => {
        if (beds < 1) {
            setError('Please select at least 1 bed.')
            return
        }

        if (beds > availableBeds) {
            setError('Not enough beds available.')
            return
        }

        setError('')
        onBook(room, beds)
    }

    return (
        <article className="room-card">

            <RoomImageGallery
                images={room.images || []}
                alt={`${room.roomType || 'Room'} room`}
            />

            <div className="room-card-body">

                <div className="room-card-header">

                    <div>
                        <h3>
                            {room.roomType || 'Room'}
                        </h3>

                        <p>
                            Capacity: {capacity}
                        </p>
                    </div>

                    <div className="room-card-price">
                        <strong>
                            ₹{dailyPrice ?? 'N/A'}
                        </strong>

                        <span> / day</span>
                    </div>

                </div>

                <div className="room-prices">

                    <p>
                        <span>Daily</span>
                        <strong>
                            ₹{dailyPrice ?? 'N/A'}
                        </strong>
                    </p>

                    <p>
                        <span>Monthly</span>
                        <strong>
                            ₹{monthlyPrice ?? 'N/A'}
                        </strong>
                    </p>

                </div>

                <p className="room-available">
                    Available beds: <strong>{availableBeds}</strong>
                </p>

                {error && (
                    <p
                        className="form-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <div className="room-booking">

                    <label htmlFor={`beds-${room._id}`}>
                        Beds
                    </label>

                    <input
                        id={`beds-${room._id}`}
                        type="number"
                        min="1"
                        max={availableBeds}
                        value={beds}
                        onChange={(e) => {
                            const value = Number(e.target.value)

                            if (value < 1) {
                                setBeds(1)
                            } else if (value > availableBeds) {
                                setBeds(availableBeds)
                            } else {
                                setBeds(value)
                            }

                            setError('')
                        }}
                    />

                    <button
                        type="button"
                        onClick={handleBook}
                        disabled={availableBeds < 1}
                    >
                        {availableBeds < 1 ? 'Fully Booked' : 'Book Now'}
                    </button>

                </div>

            </div>

        </article>
    )
}

export default RoomCard

