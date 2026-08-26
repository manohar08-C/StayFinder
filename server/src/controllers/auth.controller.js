const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const jwtSecret = process.env.JWT_SECRET || 'mySecretKey'

async function signup(req, res) {
    try {
        const { name, email, password, role } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashPassword, role })

        return res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email is already registered' })
        }
        return res.status(400).json({ message: err.message })
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email }).select('+password')
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '1h' }
        )

        return res.json({ token })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to log in' })
    }
}

module.exports = { signup, login }