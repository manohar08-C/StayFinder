const express = require('express')
const { hostel, getHostels, getHostelById, getMyHostels, updateHostel, deleteHostel } = require('../controllers/hostel.controller')
const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')

const HostelRouter = express.Router()

HostelRouter.post('/hostels', tokenVerify, authorizeRoles('hostelOwner'), hostel)

HostelRouter.get('/hostels', getHostels)

// HostelRouter.get('/hostels/nearby', getNearbyHostels)

HostelRouter.get('/hostels/my', tokenVerify, authorizeRoles('hostelOwner'), getMyHostels)

HostelRouter.get('/hostels/:id', getHostelById)

HostelRouter.put('/hostels/:id', tokenVerify, authorizeRoles('hostelOwner'), updateHostel)

HostelRouter.delete('/hostels/:id', tokenVerify, authorizeRoles('hostelOwner'), deleteHostel)

module.exports = { HostelRouter }