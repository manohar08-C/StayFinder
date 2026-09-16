const mongoose = require('mongoose')

const BookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        hostel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hostel',
            required: true
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },

        checkIn: {
            type: Date,
            required: true
        },

        checkOut: {
            type: Date,
            required: true
        },

        pricingType: {
            type: String,
            enum: ['daily', 'monthly'],
            required: true
        },

        pricePerUnit: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'checkedIn',
                'cancelled',
                'completed'
            ],
            default: 'pending'
        },

        numberOfBeds: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
)

const Booking = mongoose.model('Booking', BookingSchema)

module.exports = Booking