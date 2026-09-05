const User = require('../models/User')

async function profile(req, res) {
    try {

        const user = await User.findById(req.user.id).select(
            '-password -resetPasswordToken -resetPasswordExpires'
        )

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        return res.status(200).json({
            message: 'Profile fetched successfully',
            user
        })

    } catch (err) {

        console.error('Profile Error:', err)

        return res.status(500).json({
            message: 'Unable to fetch profile'
        })
    }
}

module.exports = { profile }