const Hostel = require('../models/Hostel')
const Room = require('../models/Room')
const Booking = require('../models/Booking')
const { hostelSearchServices } = require('../services/hostelSearch.services')
const { uploadedImageUrls } = require('../middleware/upload.middleware')
// const { searchHostelsNearby } = require('../services/geoHostelSearch.services')

async function hostel(req, res){
    try
    {
    const body = req.body || {}
    const { name, description, gender, address, city, locality, amenities, imageUrls } = body
    const location = typeof body.location === 'string'
        ? JSON.parse(body.location)
        : body.location

    const existingImages = Array.isArray(imageUrls)
        ? imageUrls
        : typeof imageUrls === 'string'
            ? imageUrls.split(/[\n,]/).map(url => url.trim()).filter(Boolean)
            : []
    const parsedImages = [...existingImages, ...uploadedImageUrls(req)]

    if (!parsedImages.length) {
        return res.status(400).json({ message: 'At least one hostel image URL is required' })
    }

    const createData = {
        owner: req.user.id,
        name,
        description,
        gender,
        address,
        city,
        locality,
        amenities,
        images: parsedImages
    }

    if (location && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
        createData.location = {
            type: 'Point',
            coordinates: location.coordinates
        }
    }

    const hostel = await Hostel.create(createData)

    return res.status(201).json({
        message: 'Hostel Created succesfull',
        Hostel : {id: hostel._id, name:hostel.name, description:hostel.description, gender:hostel.gender,
            address:hostel.address, city:hostel.city, locality:hostel.locality, amenities:hostel.amenities, status:hostel.status
            }
    })
    }catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Hostel is already registered' })
        }
        return res.status(400).json({ message: err.message })
    }
}


async function getHostels(req, res){
    try {
        const result = await hostelSearchServices(req.query)

        return res.status(200).json({
            message: 'Hostels fetched successfully',
            data:{ 
                hostels: result.hostels 
            },
            pagination: result.pagination
        })
    } catch (err) {
        console.error('Unable to fetch hostels:', err)
        return res.status(500).json({ message: 'Unable to fetch hostels' })
    }
}



async function getHostelById(req, res){
    try{
        const hostel = await Hostel.findOne({
            _id: req.params.id,
            status: 'approved'
        })

        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found' })
        }

        return res.status(200).json({
            message: 'Hostel fetched successfully',
            data:{
                hostel
            }
        })
    }catch(err) {
        return res.status(400).json({ message: 'Unable to fetch hostel' })
    }
}


async function getMyHostels(req, res){
    try{
    const hostels = await Hostel.find({ owner: req.user.id
        }).sort({ createdAt: -1 })

    return res.status(200).json({
        message: 'Hostels fetched successfully',
        data:{
            hostels
        }
    })
    }catch(err){
        return res.status(404).json({ message: 'Unable to fetch hostel' })
    }
}


async function updateHostel(req, res){
    try{
        const body = req.body || {}
        const {
            name,
            description,
            gender,
            address,
            city,
            locality,
            amenities,
            imageUrls,
            location: rawLocation
        } = body;
        const location = typeof rawLocation === 'string'
            ? JSON.parse(rawLocation)
            : rawLocation

        const existingImages = Array.isArray(imageUrls)
            ? imageUrls
            : typeof imageUrls === 'string'
                ? imageUrls.split(/[\n,]/).map(url => url.trim()).filter(Boolean)
                : []
        const parsedImages = [...existingImages, ...uploadedImageUrls(req)]

        if (!parsedImages.length) {
            return res.status(400).json({ message: 'At least one hostel image URL is required' })
        }

        const updateData = {
            name,
            description,
            gender,
            address,
            city,
            locality,
            amenities,
            images: parsedImages
        };

        if (location && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
            updateData.location = {
                type: 'Point',
                coordinates: location.coordinates
            };
        } else {
            updateData.location = undefined;
        }

        const hostel = await Hostel.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user.id
            },
            updateData,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!hostel){
            return res.status(404).json({ message: 'Hostel not found' })
        }

        return res.status(200).json({
            message: 'Hostel updated successfully',
            data:{
                hostel
            }
        })
    }catch(err){
        return res.status(400).json({ message: err.message })
    }
}


async function deleteHostel(req, res){
    try{
        const hostel = await Hostel.findOne({
            _id: req.params.id,
            owner: req.user.id
        })

        if (!hostel){
            return res.status(404).json({ message: 'Hostel not found' })
        }

        const [roomExists, bookingExists] = await Promise.all([
            Room.exists({ hostel: hostel._id }),
            Booking.exists({
                hostel: hostel._id,
                status: { $ne: 'cancelled' }
            })
        ])

        if (roomExists || bookingExists) {
            return res.status(400).json({
                message: 'Cannot delete a hostel with rooms or non-cancelled bookings'
            })
        }

        await Hostel.deleteOne({ _id: hostel._id })

        return res.status(200).json({
            message: 'Hostel Deleted successfully',
            data:{
                hostel
            }
        })
    }catch(err){
        return res.status(400).json({ message: err.message })
    
    }
}


module.exports = { hostel, getHostels, getHostelById, getMyHostels, updateHostel, deleteHostel }