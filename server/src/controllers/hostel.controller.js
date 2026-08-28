const Hostel = require('../models/Hostel')

async function hostel(req, res){
    try
    {
    const { name, description, gender, address, city, locality, amenities } = req.body
    const hostel = await Hostel.create({
        owner: req.user.id,
        name,
        description,
        gender,
        address,
        city,
        locality,
        amenities
    })

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
    try{
        const hostels = await Hostel.find({ status: 'approved' })
        return res.status(200).json({
            message: 'Hostels fetched successfully',
            data: {
                hostels
            }
        })
    }catch(err){
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
    const hostels = await Hostel.find({ owner: req.user.id })

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
        const {
            name,
            description,
            gender,
            address,
            city,
            locality,
            amenities
        } = req.body;

        const updateData = {
            name,
            description,
            gender,
            address,
            city,
            locality,
            amenities
        };

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
        const hostel = await Hostel.findOneAndDelete(
            {
                _id: req.params.id,
                owner: req.user.id
            }
        )

        if (!hostel){
            return res.status(404).json({ message: 'Hostel not found' })
        }

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