const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    cleanliness: {
        type: Number,
        min: 1,
        max: 5
    },
    food: {
        type: Number,
        min: 1,
        max: 5
    },
    location: {
        type: Number,
        min: 1,
        max: 5
    },
    staff: {
        type: Number,
        min: 1,
        max: 5
    },
    valueForMoney: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;