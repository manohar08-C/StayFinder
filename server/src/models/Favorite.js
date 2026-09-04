const mongoose = require('mongoose')

const FavoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true
    }
}, { timestamps: true })

// A user can favorite a hostel only once
FavoriteSchema.index(
    { user: 1, hostel: 1 },
    { unique: true }
)

const Favorite = mongoose.model('Favorite', FavoriteSchema)

module.exports = Favorite