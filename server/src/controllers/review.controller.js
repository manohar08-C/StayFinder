const mongoose = require('mongoose')
const Hostel = require('../models/Hostel')
const Booking = require('../models/Booking')
const Review = require('../models/Review')

const writableFields = [
    'rating',
    'cleanliness',
    'food',
    'location',
    'staff',
    'valueForMoney',
    'comment'
]

function isValidObjectId(value) {
    return mongoose.Types.ObjectId.isValid(value)
}

function getWritableReviewData(body) {
    return writableFields.reduce((data, field) => {
        if (body[field] !== undefined) data[field] = body[field]
        return data
    }, {})
}

function createError(message, statusCode) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

async function withTransaction(callback) {
    const session = await mongoose.startSession()

    try {
        return await session.withTransaction(() => callback(session))
    } catch (error) {
        const isStandaloneMongo = error.code === 20 || error.message.includes('Transaction numbers are only allowed')

        if (!isStandaloneMongo) throw error

        return callback(null)
    } finally {
        await session.endSession()
    }
}

async function recalculateHostelRating(hostelId, session) {
    const [summary] = await Review.aggregate([
        { $match: { hostel: hostelId } },
        {
            $group: {
                _id: null,
                average: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]).session(session)

    await Hostel.updateOne(
        { _id: hostelId },
        {
            $set: {
                rating: {
                    average: summary ? Number(summary.average.toFixed(2)) : 0,
                    count: summary?.count || 0
                }
            }
        },
        { session }
    )
}

async function createReview(req, res) {
    const { booking: bookingId } = req.body

    if (!isValidObjectId(bookingId)) {
        return res.status(400).json({ message: 'A valid booking is required' })
    }

    try {
        const review = await withTransaction(async session => {
            const booking = await Booking.findOne({
                _id: bookingId,
                user: req.user.id
            }).session(session)

            if (!booking) throw createError('Booking not found', 404)
            if (!['checkedIn', 'completed'].includes(booking.status)) {
                throw createError(
                    'You can review only after checking in',
                    403
                )
            }

            const existingReview = await Review.exists({ booking: booking._id }).session(session)
            if (existingReview) {
                throw createError('This booking has already been reviewed', 409)
            }

            const [createdReview] = await Review.create([{
                ...getWritableReviewData(req.body),
                user: req.user.id,
                hostel: booking.hostel,
                room: booking.room,
                booking: booking._id
            }], { session })

            await recalculateHostelRating(booking.hostel, session)
            return createdReview
        })

        return res.status(201).json({
            message: 'Review created successfully',
            data: { review }
        })
    } catch (err) {
        const duplicate = err.code === 11000
        return res.status(duplicate ? 409 : err.statusCode || 400).json({
            message: duplicate
                ? 'This booking has already been reviewed'
                : err.message || 'Unable to create review'
        })
    }
}

async function getHostelReviews(req, res) {
    const { hostelId } = req.params

    if (!isValidObjectId(hostelId)) {
        return res.status(400).json({ message: 'A valid hostel ID is required' })
    }

    try {
        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10))
        const skip = (page - 1) * limit
        const filter = { hostel: hostelId }

        const [reviews, total, hostel] = await Promise.all([
            Review.find(filter)
                .populate('user', 'name')
                .populate('room', 'roomType')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Review.countDocuments(filter),
            Hostel.findById(hostelId).select('rating')
        ])

        if (!hostel) return res.status(404).json({ message: 'Hostel not found' })

        return res.status(200).json({
            message: 'Reviews fetched successfully',
            data: {
                reviews,
                rating: hostel.rating
            },
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                skip
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message || 'Unable to fetch reviews'
        })
    }
}

async function updateReview(req, res) {
    const { reviewId } = req.params

    if (!isValidObjectId(reviewId)) {
        return res.status(400).json({ message: 'A valid review ID is required' })
    }

    try {
        const review = await withTransaction(async session => {
            const review = await Review.findOne({
                _id: reviewId,
                user: req.user.id
            }).session(session)

            if (!review) throw createError('Review not found', 404)

            Object.assign(review, getWritableReviewData(req.body))
            await review.save({ session })
            await recalculateHostelRating(review.hostel, session)
            return review
        })

        return res.status(200).json({
            message: 'Review updated successfully',
            data: { review }
        })
    } catch (err) {
        return res.status(err.statusCode || 400).json({
            message: err.message || 'Unable to update review'
        })
    }
}

async function deleteReview(req, res) {
    const { reviewId } = req.params

    if (!isValidObjectId(reviewId)) {
        return res.status(400).json({ message: 'A valid review ID is required' })
    }

    try {
        const review = await withTransaction(async session => {
            const review = await Review.findOneAndDelete({
                _id: reviewId,
                user: req.user.id
            }, { session })

            if (!review) throw createError('Review not found', 404)

            await recalculateHostelRating(review.hostel, session)
            return review
        })

        return res.status(200).json({
            message: 'Review deleted successfully',
            data: { review }
        })
    } catch (err) {
        return res.status(err.statusCode || 400).json({
            message: err.message || 'Unable to delete review'
        })
    }
}

module.exports = {
    createReview,
    getHostelReviews,
    updateReview,
    deleteReview
}
