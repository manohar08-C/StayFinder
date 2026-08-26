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
        message: 'hostel inserted succesfull',
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

module.exports = { hostel }