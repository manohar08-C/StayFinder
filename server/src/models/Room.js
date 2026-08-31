const mongoose = require('mongoose')

const RoomSchema = mongoose.Schema({
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    roomType: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    availableBeds: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function (value) {
                return value <= this.capacity
            },
            message: 'availableBeds cannot be more than capacity'
        }
    },
    area: {
        type: Number,
        min: 0
    },
    amenities: [String],
    images: [String]
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;