const mongoose = require('mongoose')

const HostelSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'co-ed']
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    locality: {
        type: String,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            validate: {
                validator: coordinates => coordinates.length === 2,
                message: 'Location coordinates must contain longitude and latitude'
            }
        }
    },
    amenities: [String],
    images: [String],
    videos: [String],
    food: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected', 'inactive'],
        default: 'pending'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, { timestamps: true })

const Hostel = mongoose.model('Hostel', HostelSchema);

module.exports = Hostel;