const express = require('express')

const BookingRoute = express.Router()
const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')
const {
    createBooking,
    getMyBookings,
    getBookingById,
    getOwnerPendingBookings,
    confirmBooking,
    cancelBooking,
    checkInBooking,
    completeBooking
} = require('../controllers/booking.controller')

BookingRoute.post('/bookings', tokenVerify, authorizeRoles('User', 'hostelOwner'), createBooking)

BookingRoute.get('/bookings/my', tokenVerify, authorizeRoles('User', 'hostelOwner'), getMyBookings)

BookingRoute.get('/bookings/owner', tokenVerify, authorizeRoles('hostelOwner'), getOwnerPendingBookings)

BookingRoute.get('/bookings/:id', tokenVerify, authorizeRoles('User', 'hostelOwner'), getBookingById)

BookingRoute.put('/bookings/:id/confirm', tokenVerify, authorizeRoles('hostelOwner'), confirmBooking)

BookingRoute.put('/bookings/:id/check-in', tokenVerify, authorizeRoles('hostelOwner'), checkInBooking)

BookingRoute.put('/bookings/:id/complete', tokenVerify, authorizeRoles('hostelOwner'), completeBooking)

BookingRoute.put('/bookings/:id/cancel', tokenVerify, authorizeRoles('User', 'hostelOwner'), cancelBooking)

module.exports = { BookingRoute }