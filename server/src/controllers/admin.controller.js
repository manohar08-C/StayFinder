const Hostel = require('../models/Hostel')
const mongoose = require('mongoose')
const OwnerApplication = require('../models/OwnerApplication')
const User = require('../models/User')
const bcrypt = require('bcrypt')

async function getPendingHostels(req, res){
    try{
        const hostels = await Hostel.find({ status : 'pending'})

        return res.status(200).json({
            message: 'pending Hostels Fetch successfully',
            data:{
                    hostels
                }
        })
    }catch(err){
        return res.status(500).json({message: 'Unable to fetch pending hostels'})
    }
}

async function getPendingHostelById(req, res){
    try{
        const hostel = await Hostel.findOne({ 
            _id: req.params.id,
            status: "pending"
        })

        if(!hostel){
            return res.status(404).json({message : "pending Hostel is not found"})
        }
        
        return res.status(200).json({
            message: 'pending Hostel fetch succesfully',
            data: hostel
        })
    }catch(err){
        return res.status(500).json({ message: "unable to fetch the extact Hostel"})
    }
}

async function approveHostel(req, res){
    try{
        const hostel = await Hostel.findOneAndUpdate(
            {
                _id: req.params.id,
                status: 'pending'
            },
            {
                status: 'approved'
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        )

        if(!hostel){
            return res.status(404).json({message : "pending Hostel is not found"})
        }

        return res.status(200).json({
            message: "Pending Hostel has Approved",
            data: {
                hostel
            }
        })
    }catch(err){
        return res.status(500).json({ message: "unable to find the pending hostel"})
    }
}


async function rejectHostel(req, res){
    try{
        const hostel = await Hostel.findOneAndUpdate(
            {
                _id: req.params.id,
                status: 'pending'
            },
            {
                status: 'rejected'
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        )
        if(!hostel){
            return res.status(404).json({message : "pending Hostel is not found"})
        }

        return res.status(200).json({
            message: "Pending Hostel has Rejected",
            reason: "Uploaded data is not clear",
            data: {
                hostel
            }
        })
    }catch(err){
        return res.status(500).json({ message: "unable to find the pending hostel"})
    }
}

async function getOwnerApplications(req, res) {
    try {
        const applications = await OwnerApplication.find({ status: 'pending' })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: 'Owner applications fetched successfully',
            data: { applications }
        })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch owner applications' })
    }
}

async function getOwnerApplicationById(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid application ID' })
    }

    try {
        const application = await OwnerApplication.findById(req.params.id)
            .populate('user', 'name email')
            .populate('reviewedBy', 'name email')

        if (!application) {
            return res.status(404).json({ message: 'Owner application not found' })
        }

        return res.status(200).json({
            message: 'Owner application fetched successfully',
            data: { application }
        })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to fetch owner application' })
    }
}

async function approveOwnerApplication(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid application ID' })
    }

    const session = await mongoose.startSession()
    try {
        let application
        await session.withTransaction(async () => {
            application = await OwnerApplication.findOne({
                _id: req.params.id,
                status: 'pending'
            }).session(session)

            if (!application) {
                const error = new Error('Pending owner application not found')
                error.statusCode = 404
                throw error
            }

            const user = await User.findOneAndUpdate(
                { _id: application.user, role: 'User' },
                { role: 'hostelOwner' },
                { new: true, runValidators: true, session }
            )

            if (!user) {
                const error = new Error('User not found or is not a normal user')
                error.statusCode = 404
                throw error
            }

            application.status = 'approved'
            application.reviewedBy = req.user.id
            application.reviewedAt = new Date()
            await application.save({ session })
        })

        return res.status(200).json({
            message: 'Owner application approved successfully',
            data: { application }
        })
    } catch (err) {
        return res.status(err.statusCode || 400).json({
            message: err.message || 'Unable to approve owner application'
        })
    } finally {
        await session.endSession()
    }
}

async function rejectOwnerApplication(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid application ID' })
    }

    try {
        const application = await OwnerApplication.findOneAndUpdate(
            { _id: req.params.id, status: 'pending' },
            {
                status: 'rejected',
                rejectionReason: req.body.rejectionReason,
                reviewedBy: req.user.id,
                reviewedAt: new Date()
            },
            { new: true, runValidators: true }
        )

        if (!application) {
            return res.status(404).json({ message: 'Pending owner application not found' })
        }

        return res.status(200).json({
            message: 'Owner application rejected',
            data: { application }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message || 'Unable to reject application'
        })
    }
}

async function createAdminUser(req, res) {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password || password.length < 8) {
            return res.status(400).json({
                message: 'Name, email and a password of at least 8 characters are required'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'Admin'
        })

        return res.status(201).json({
            message: 'Admin created successfully',
            data: {
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            }
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email is already registered' })
        }
        return res.status(400).json({ message: err.message || 'Unable to create admin' })
    }
}

module.exports = {
    getPendingHostels,
    getPendingHostelById,
    approveHostel,
    rejectHostel,
    getOwnerApplications,
    getOwnerApplicationById,
    approveOwnerApplication,
    rejectOwnerApplication,
    createAdminUser
}