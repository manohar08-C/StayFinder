const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/User')

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured')
}

const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

async function signup(req, res) {
    try {
        const { name, email, password } = req.body
        if (!password || password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashPassword})

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

async function forgotPassword(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.json({ message: 'If an account exists, a reset link has been sent' })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex')

        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000
        await user.save()

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
        await mailTransporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: user.email,
            subject: 'Reset your StayFinder password',
            text: `Reset your password using this link: ${resetUrl}`
        })

        return res.json({ message: 'If an account exists, a reset link has been sent' })
    } catch (err) {
        return res.status(500).json({ message: 'Unable to process password reset request' })
    }
}

async function resetPassword(req, res) {
    try {
        const { password } = req.body
        if (!password || password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            })
        }

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex')

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+password +resetPasswordToken +resetPasswordExpires')

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' })
        }

        user.password = await bcrypt.hash(password, 10)
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        return res.json({ message: 'Password reset successfully' })
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

module.exports = { signup, login, forgotPassword, resetPassword }
