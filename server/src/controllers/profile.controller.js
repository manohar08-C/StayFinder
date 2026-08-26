async function profile(req, res) {
    try {
        return res.status(200).json({
            message: 'Profile accessed successfully',
            user: req.user
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Unable to fetch profile'
        })
    }
}

module.exports = { profile }