const express = require('express')

const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')
const { getPendingHostels, getPendingHostelById, approveHostel, rejectHostel } = require('../controllers/admin.controller')

const AdminRouter = express.Router()

AdminRouter.get('/admin/hostels/pending', tokenVerify, authorizeRoles('Admin'), getPendingHostels)

AdminRouter.get('/admin/hostels/:id', tokenVerify, authorizeRoles('Admin'), getPendingHostelById)

AdminRouter.patch('/admin/hostels/:id/approve', tokenVerify, authorizeRoles('Admin'), approveHostel)

AdminRouter.patch('/admin/hostels/:id/reject', tokenVerify, authorizeRoles('Admin'), rejectHostel)

module.exports = { AdminRouter }