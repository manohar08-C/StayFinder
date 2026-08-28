const Hostel = require('../models/Hostel')

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

module.exports = { getPendingHostels, getPendingHostelById, approveHostel, rejectHostel }