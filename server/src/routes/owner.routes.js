const express = require('express')
const { applyAsOwner } = require('../controllers/owner.controller')
const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')

const OwnerRouter = express.Router()

OwnerRouter.post('/owner/apply', tokenVerify, authorizeRoles('User'), applyAsOwner)

module.exports = { OwnerRouter }
