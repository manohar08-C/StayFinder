const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const User = require('../src/models/User')

async function createAdmin() {
    try {
        if (!process.env.Database_URL) {
            throw new Error('Database_URL is not configured')
        }

        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error('ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required')
        }
        if (ADMIN_PASSWORD.length < 8) {
            throw new Error('ADMIN_PASSWORD must be at least 8 characters')
        }

        await mongoose.connect(process.env.Database_URL)

        const existingAdmin = await User.findOne({ role: 'Admin' }).select('_id')
        if (existingAdmin) {
            console.log('Admin already exists')
            return
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
        await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'Admin'
        })

        console.log('Admin created successfully')
    } catch (err) {
        console.error('Admin creation failed:', err.message)
        process.exitCode = 1
    } finally {
        await mongoose.disconnect()
    }
}

createAdmin()
