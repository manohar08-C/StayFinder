const express = require('express')
const { hostel, getHostel } = require('../controllers/hostel.controller')
const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/hostels', tokenVerify, authorizeRoles('Admin', 'hostelOwner'), hostel)

router.get('/hostels', getHostel)

module.exports = { router }