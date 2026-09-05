const Hostel = require('../models/Hostel')
const Room = require('../models/Room')
const Booking = require('../models/Booking')

async function createRoom(req, res) {
    try {
        const { roomType, pricing, capacity, area, amenities, images } = req.body

        const hostel = await Hostel.findOne({
            _id: req.params.id,
            owner: req.user.id
        })

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found or you are not the owner' })
        }

        const room = await Room.create({
            hostel: hostel._id,
            roomType,
            pricing,
            capacity,
            area,
            amenities,
            images
        })

        return res.status(201).json({
            message: 'Room created successfully',
            data: { room }
        })
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}


async function getRoomsByHostel(req, res){
    try{

        const hostel = await Hostel.findOne({
            _id: req.params.id,
            status: 'approved'
        })

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found or you are not the owner' })
        }

        const rooms = await Room.find({
            hostel: req.params.id 
        })

        return res.status(200).json({
            message: 'the rooms fetched succesfully',
            data: {
                "rooms": rooms
            }
        })
    }catch(err){
        return res.status(500).json({ message: 'Approved hostel not found' })
    }
}

async function getRoomById(req, res) {
    try {
        const room = await Room.findById(req.params.id)

        if (!room) {
            return res.status(404).json({ message: 'Room not found' })
        }

        const hostel = await Hostel.findOne({
            _id: room.hostel,
            status: 'approved'
        })

        if (!hostel) {
            return res.status(404).json({ message: 'Room not available because the hostel is not approved' })
        }

        return res.status(200).json({
            message: 'Room fetched successfully',
            data: {
                "room": room
            }
        })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch room' })
    }
}


async function updateRoom(req, res){
    try{
        const { roomType, pricing, capacity, area, amenities, images } = req.body

        if (
            pricing !== undefined &&
            (
                pricing.daily === undefined ||
                pricing.monthly === undefined
            )
        ) {
            return res.status(400).json({
                message: 'Daily and monthly pricing are required when updating pricing'
            })
        }

        const updatedData = {
            roomType,
            pricing,
            capacity,
            area,
            amenities,
            images
        }

        const room = await Room.findById(req.params.id)

        if(!room){
            return res.status(404).json({message: "unable to find the room to updated"})
        }

        const hostel = await Hostel.findOne({
            _id : room.hostel,
            owner: req.user.id
        })

        if(!hostel){
            return res.status(403).json({message: "You are not authorized to update this room"})
        }

        if (capacity !== undefined) {
            const bookedBedsResult = await Booking.aggregate([
                {
                    $match: {
                        room: room._id,
                        status: { $in: ['pending', 'confirmed', 'checkedIn'] },
                        checkOut: { $gt: new Date() }
                    }
                },
                {
                    $group: {
                        _id: null,
                        bookedBeds: { $sum: { $ifNull: ['$numberOfBeds', 1] } }
                    }
                }
            ])

            const bookedBeds = bookedBedsResult[0]?.bookedBeds || 0
            if (Number(capacity) < bookedBeds) {
                return res.status(400).json({
                    message: `Capacity cannot be less than currently booked beds (${bookedBeds})`
                })
            }
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new: true,
                runValidators: true
            }
        )

        return res.status(200).json({
            message: "Room data updated successfully",
            data:{
                room: updatedRoom
            }
        })
    }catch(err){
        res.status(500).json({"success": false, message: "server error! data is not found"})
    }
}

async function deleteRoom(req, res){
    try{
        const room = await Room.findById(req.params.id )

        if(!room){
            return res.status(404).json({message: "Room not found"})
        }

        const hostel = await Hostel.findOne({
            _id : room.hostel,
            owner: req.user.id
        })

        if(!hostel){
            return res.status(403).json({message: "You are not authorized to delete this room"})
        }

        const activeBooking = await Booking.findOne({
            room: room._id,
            status: { $ne: 'cancelled' }
        }).select('_id')

        if (activeBooking) {
            return res.status(400).json({
                message: 'Cannot delete a room with active bookings'
            })
        }

        const deletedRoom = await Room.findByIdAndDelete(
            req.params.id,
        )

        return res.status(200).json({
            message: "Room deleted successfully",
            data:{
                room: deletedRoom
            }
        })
    }catch(err){
        res.status(500).json({"success": false, message: "server error! data is not found"})
    }
}

        
module.exports = { createRoom, getRoomsByHostel, getRoomById, updateRoom, deleteRoom }