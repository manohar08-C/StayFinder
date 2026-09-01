const express = require('express')
const { hostel, getHostels, getHostelById, getMyHostels, updateHostel, deleteHostel } = require('../controllers/hostel.controller')
const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/hostels', tokenVerify, authorizeRoles('hostelOwner'), hostel)

router.get('/hostels', getHostels)

// router.get('/hostels/nearby', getNearbyHostels)

router.get('/hostels/my', tokenVerify, authorizeRoles('hostelOwner'), getMyHostels)

router.get('/hostels/:id', getHostelById)

router.put('/hostels/:id', tokenVerify, authorizeRoles('hostelOwner'), updateHostel)

router.delete('/hostels/:id', tokenVerify, authorizeRoles('hostelOwner'), deleteHostel)

module.exports = { router }