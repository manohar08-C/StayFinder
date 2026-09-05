const express = require('express')

const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')
const {
	getPendingHostels,
	getPendingHostelById,
	approveHostel,
	rejectHostel,
	getOwnerApplications,
	getOwnerApplicationById,
	approveOwnerApplication,
	rejectOwnerApplication,
	createAdminUser
} = require('../controllers/admin.controller')

const AdminRouter = express.Router()

AdminRouter.get('/admin/hostels/pending', tokenVerify, authorizeRoles('Admin'), getPendingHostels)

AdminRouter.get('/admin/hostels/:id', tokenVerify, authorizeRoles('Admin'), getPendingHostelById)

AdminRouter.patch('/admin/hostels/:id/approve', tokenVerify, authorizeRoles('Admin'), approveHostel)

AdminRouter.patch('/admin/hostels/:id/reject', tokenVerify, authorizeRoles('Admin'), rejectHostel)

AdminRouter.get('/admin/owner-applications', tokenVerify, authorizeRoles('Admin'), getOwnerApplications)

AdminRouter.get('/admin/owner-applications/:id', tokenVerify, authorizeRoles('Admin'), getOwnerApplicationById)

AdminRouter.put('/admin/owner-applications/:id/approve', tokenVerify, authorizeRoles('Admin'), approveOwnerApplication)

AdminRouter.put('/admin/owner-applications/:id/reject', tokenVerify, authorizeRoles('Admin'), rejectOwnerApplication)

AdminRouter.post('/admin/users/admin', tokenVerify, authorizeRoles('Admin'), createAdminUser)

module.exports = { AdminRouter }