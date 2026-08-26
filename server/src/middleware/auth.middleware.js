const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET;

function tokenVerify(req, res, next) {
    const authorization = req.get('Authorization')

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token required'
        })
    }

    const token = authorization.split(' ')[1]

    try {
        const decoded = jwt.verify(token, jwtSecret)

        req.user = decoded

        if (decoded.role !== 'Admin' && decoded.role !== 'Owner') {
            return res.status(403).json({
                message: 'Access denied'
            })
        }

        next()

    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
}

module.exports = { tokenVerify }