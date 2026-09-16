const jwt = require('jsonwebtoken')
const User = require('../models/User')

const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured')
}

async function tokenVerify(req, res, next) {
    const authorization = req.get('Authorization')

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token required'
        })
    }

    const token = authorization.slice(7).trim()

    if (!token) {
        return res.status(401).json({
            message: 'Token required'
        })
    }

    try {
        // Verify token signature and expiration
        const decoded = jwt.verify(token, jwtSecret)

        // Get the CURRENT user from database
        const user = await User.findById(decoded.id).select(
            '_id name email role'
        )

        if (!user) {
            return res.status(401).json({
                message: 'User no longer exists'
            })
        }

        // Always use current database role
        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        }

        next()

    } catch (err) {
        console.error('Token verification error:', err.message)

        return res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
}


function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: 'Authentication required'
            })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied'
            })
        }

        next()
    }
}


module.exports = {
    tokenVerify,
    authorizeRoles
}