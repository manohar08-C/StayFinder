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
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            validate: {
                validator: coordinates => !coordinates || coordinates.length === 2,
                message: 'Location coordinates must contain longitude and latitude'
            }
        }
    },
    amenities: [String],
    images: {
        type: [String],
        required: true,
        validate: {
            validator: value => Array.isArray(value) && value.length > 0 && value.every(item => typeof item === 'string' && item.trim().length > 0),
            message: 'At least one valid hostel image URL is required'
        }
    },
    videos: [String],
    food: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'inactive'],
        default: 'pending'
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            min: 0,
            default: 0
        }
    }
}, { timestamps: true })

HostelSchema.index({ location: '2dsphere' })
const Hostel = mongoose.model('Hostel', HostelSchema);

module.exports = Hostel;