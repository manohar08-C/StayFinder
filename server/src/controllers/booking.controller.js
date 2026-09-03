const mongoose = require('mongoose')
const Booking = require('../models/Booking')
const Hostel = require('../models/Hostel')
const Room = require('../models/Room')

async function createBooking(req, res) {
    const {
        hostel: hostelId,
        room: roomId,
        checkIn,
        checkOut,
        pricingType,
        numberOfBeds = 1
    } = req.body

    if (!hostelId || !roomId || !checkIn || !checkOut || !pricingType) {
        return res.status(400).json({
            message: 'Hostel, room, check-in, check-out and pricing type are required'
        })
    }

    const requestedBeds = Number(numberOfBeds)
    if (!Number.isInteger(requestedBeds) || requestedBeds < 1) {
        return res.status(400).json({
            message: 'numberOfBeds must be a positive integer'
        })
    }

    if (!['daily', 'monthly'].includes(pricingType)) {
        return res.status(400).json({
            message: 'pricingType must be either daily or monthly'
        })
    }

    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)

    if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
    ) {
        return res.status(400).json({
            message: 'Invalid check-in or check-out date'
        })
    }

    if (endDate <= startDate) {
        return res.status(400).json({
            message: 'Check-out must be after check-in'
        })
    }

    const session = await mongoose.startSession()

    try {
        let booking

        await session.withTransaction(async () => {
            const hostel = await Hostel.findOne({
                _id: hostelId,
                status: 'approved'
            }).session(session)

            if (!hostel) {
                const error = new Error('Hostel not found')
                error.statusCode = 404
                throw error
            }

            const room = await Room.findOneAndUpdate({
                _id: roomId,
                hostel: hostelId
            }, {
                $inc: { availabilityVersion: 1 }
            }, {
                new: true,
                session
            })

            if (!room) {
                const error = new Error('Room not found')
                error.statusCode = 404
                throw error
            }

            const pricingConfig = room.pricing

            const pricePerUnit = pricingConfig[pricingType]

            if (pricePerUnit === undefined || Number(pricePerUnit) < 0) {
                const error = new Error(`Room does not have a valid ${pricingType} price`) 
                error.statusCode = 400
                throw error
            }

            const millisecondsPerDay = 1000 * 60 * 60 * 24
            const days = Math.ceil((endDate - startDate) / millisecondsPerDay)

            let totalAmount = 0

            if (pricingType === 'daily') {
                totalAmount = requestedBeds * days * pricePerUnit
            } else {
                const fullMonths = Math.floor(days / 30)
                const remainingDays = days % 30

                totalAmount = requestedBeds * (
                    (fullMonths * pricingConfig.monthly) +
                    (remainingDays * pricingConfig.daily)
                )
            }

            const roomCapacity = Number(room.capacity)
            if (requestedBeds > roomCapacity) {
                const error = new Error('Requested beds cannot exceed room capacity')
                error.statusCode = 400
                throw error
            }

            const overlappingBookings = await Booking.find({
                room: room._id,
                status: { $ne: 'cancelled' },
                checkIn: { $lt: endDate },
                checkOut: { $gt: startDate }
            }).session(session)

            const bookedBeds = overlappingBookings.reduce((sum, booking) => {
                return sum + (Number(booking.numberOfBeds) || 1)
            }, 0)

            if ((bookedBeds + requestedBeds) > roomCapacity) {
                const error = new Error('No beds available for the selected dates')
                error.statusCode = 409
                throw error
            }

            const [createdBooking] = await Booking.create([
                {
                    user: req.user.id,
                    hostel: hostel._id,
                    room: room._id,
                    checkIn: startDate,
                    checkOut: endDate,
                    pricingType,
                    pricePerUnit,
                    numberOfBeds: requestedBeds,
                    totalAmount,
                    status: 'pending'
                }
            ], { session })

            booking = createdBooking
        })

        return res.status(201).json({
            message: 'Booking created successfully',
            data: {
                booking
            }
        })
    } catch (err) {
        const statusCode = err.statusCode || 400
        return res.status(statusCode).json({
            message: err.message || 'Unable to create booking'
        })
    } finally {
        await session.endSession()
    }
}

async function getMyBookings(req, res){
    try{
        const bookings = await Booking.find({ user: req.user.id })
            .populate('hostel', 'name city locality address location')
            .populate('room', 'roomType pricing')
        
        return res.status(200).json({
            message: 'Bookings retrieved successfully',
            data: {
                bookings
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message || 'Unable to retrieve bookings'
        })
    }
}

async function getBookingById(req, res) {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user.id
        })
            .populate('hostel', 'name city locality address location')
            .populate('room', 'roomType pricing')

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            })
        }

        return res.status(200).json({
            message: 'Booking fetched successfully',
            data: {
                booking
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message || 'Unable to fetch booking'
        })
    }
}

async function getOwnerPendingBookings(req, res) {
    try {
        const ownerHostels = await Hostel.find({ owner: req.user.id }).select('_id')

        const hostelIds = ownerHostels.map(hostel => hostel._id)

        const bookings = await Booking.find({
            hostel: { $in: hostelIds },
            status: 'pending'
        })
            .populate('user', 'name email phone')
            .populate('hostel', 'name city locality address')

            .populate('room', 'roomType pricing')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: 'Pending bookings retrieved successfully',
            data: {
                bookings
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message || 'Unable to retrieve pending bookings'
        })
    }
}

async function confirmBooking(req, res) {
    try {
        const booking = await Booking.findById(req.params.id)

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            })
        }

        const hostel = await Hostel.findOne({
            _id: booking.hostel,
            owner: req.user.id
        })

        if (!hostel) {
            return res.status(403).json({
                message: 'You are not authorized to manage this booking'
            })
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({
                message: `Booking cannot be confirmed because it is already ${booking.status}`
            })
        }

        booking.status = 'confirmed'
        await booking.save()

        return res.status(200).json({
            message: 'Booking confirmed successfully',
            data: {
                booking
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message || 'Unable to confirm booking'
        })
    }
}

async function cancelBooking(req, res) {
    const session = await mongoose.startSession()

    try {
        let booking

        await session.withTransaction(async () => {
            booking = await Booking.findById(req.params.id).session(session)

            if (!booking) {
                const error = new Error('Booking not found')
                error.statusCode = 404
                throw error
            }

            const hostel = await Hostel.findOne({
                _id: booking.hostel,
                owner: req.user.id
            }).session(session)

            if (!hostel) {
                const error = new Error('You are not authorized to manage this booking')
                error.statusCode = 403
                throw error
            }

            if (booking.status !== 'pending') {
                const error = new Error(`Booking cannot be cancelled because it is already ${booking.status}`)
                error.statusCode = 400
                throw error
            }

            const updatedBooking = await Booking.findOneAndUpdate(
                {
                    _id: booking._id,
                    hostel: hostel._id,
                    status: 'pending'
                },
                { status: 'cancelled' },
                { new: true, session }
            )

            if (!updatedBooking) {
                const error = new Error('Booking could not be cancelled')
                error.statusCode = 400
                throw error
            }

            booking = updatedBooking
        })

        return res.status(200).json({
            message: 'Booking cancelled successfully',
            data: {
                booking
            }
        })
    } catch (err) {
        const statusCode = err.statusCode || 400
        return res.status(statusCode).json({
            message: err.message || 'Unable to cancel booking'
        })
    } finally {
        await session.endSession()
    }
}

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    getOwnerPendingBookings,
    confirmBooking,
    cancelBooking
}