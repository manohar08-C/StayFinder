const express = require('express')

const BookingRoute = express.Router()
const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')
const {
    createBooking,
    getMyBookings,
    getBookingById,
    getOwnerPendingBookings,
    confirmBooking,
    cancelBooking
} = require('../controllers/booking.controller')

BookingRoute.post('/bookings', tokenVerify, authorizeRoles('User'), createBooking)

BookingRoute.get('/bookings/my', tokenVerify, authorizeRoles('User'), getMyBookings)

BookingRoute.get('/bookings/owner', tokenVerify, authorizeRoles('hostelOwner'), getOwnerPendingBookings)

BookingRoute.get('/bookings/:id', tokenVerify, authorizeRoles('User'), getBookingById)

BookingRoute.put('/bookings/:id/confirm', tokenVerify, authorizeRoles('hostelOwner'), confirmBooking)

BookingRoute.put('/bookings/:id/cancel', tokenVerify, authorizeRoles('hostelOwner'), cancelBooking)

module.exports = { BookingRoute }