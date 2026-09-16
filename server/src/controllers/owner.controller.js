const OwnerApplication = require('../models/OwnerApplication')
const User = require('../models/User')

async function applyAsOwner(req, res) {
    try {
        const { businessName, phone, address, city } = req.body

        if (!businessName || !phone || !address || !city) {
            return res.status(400).json({
                message: 'Business name, phone, address and city are required'
            })
        }

        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.role !== 'User') {
            return res.status(400).json({
                message: 'Only normal users can apply as hostel owners'
            })
        }

        const existingApplication = await OwnerApplication.findOne({ user: user._id })
        if (existingApplication && existingApplication.status !== 'rejected') {
            return res.status(409).json({
                message: `Owner application already exists with status ${existingApplication.status}`
            })
        }

        const application = existingApplication
            ? await OwnerApplication.findOneAndUpdate(
                { _id: existingApplication._id, status: 'rejected' },
                {
                    businessName,
                    phone,
                    address,
                    city,
                    status: 'pending',
                    $unset: { rejectionReason: 1, reviewedBy: 1, reviewedAt: 1 }
                },
                { new: true, runValidators: true }
            )
            : await OwnerApplication.create({
                user: user._id,
                businessName,
                phone,
                address,
                city
            })

        if (!application) {
            return res.status(409).json({
                message: 'Owner application status changed; please try again'
            })
        }

        return res.status(201).json({
            message: 'Owner application submitted successfully',
            data: { application }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message || 'Unable to submit owner application'
        })
    }
}

module.exports = { applyAsOwner }
