const express = require('express')
const { createRoom, getRoomsByHostel, getRoomById, updateRoom, deleteRoom } = require('../controllers/room.controller')
const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')

const RoomRouter = express.Router()

RoomRouter.post('/hostels/:id/rooms', tokenVerify, authorizeRoles('hostelOwner'), createRoom)

RoomRouter.get('/hostels/:id/rooms', getRoomsByHostel)

RoomRouter.get('/rooms/:id', getRoomById)

RoomRouter.put('/rooms/:id', tokenVerify, authorizeRoles('hostelOwner'), updateRoom)

RoomRouter.delete('/rooms/:id', tokenVerify, authorizeRoles('hostelOwner'), deleteRoom)

module.exports = { RoomRouter }
