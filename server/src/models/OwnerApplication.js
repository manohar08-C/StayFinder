const mongoose = require('mongoose')

const OwnerApplicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        businessName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150
        },
        phone: {
            type: String,
            required: true,
            trim: true
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
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

const OwnerApplication = mongoose.model('OwnerApplication', OwnerApplicationSchema)

module.exports = OwnerApplication
