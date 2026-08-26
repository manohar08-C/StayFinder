const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET || 'mySecretKey'

function tokenVerify(req, res, next) {
    const authorization = req.get('Authorization')

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token required'
        })
    }

    const token = authorization.slice(7).trim()

    try {
        const decoded = jwt.verify(token, jwtSecret)

        req.user = decoded

        next()

    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied'
            })
        }

        next()
    }
}

module.exports = { tokenVerify, authorizeRoles }