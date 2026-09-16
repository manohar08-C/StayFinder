const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()
const app = express()


const { tokenVerify } = require('./src/middleware/auth.middleware');
const { profile } = require('./src/controllers/profile.controller')

const { AuthRouter } = require('./src/routes/auth_routes')
const { HostelRouter } = require('./src/routes/hostel_routes')
const { AdminRouter } = require('./src/routes/admin.routes')
const { RoomRouter } = require('./src/routes/room.routes')
const { BookingRoute } = require('./src/routes/booking.routes')
const { ReviewRoute } = require('./src/routes/review.routes')
const { FavoriteRouter } = require('./src/routes/favorite.routes')
const { OwnerRouter } = require('./src/routes/owner.routes')
const { AgentRouter } = require('./src/routes/agent.routes')

// app.use(cors())
// app.use(express.json())
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173'
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins
}))

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose.connect(process.env.Database_URL)
    .then(() => console.log('the database is connected'))
    .catch((err) => console.error('the database is not connected', err))


app.get('/profile', tokenVerify, profile)

app.use(AuthRouter)
app.use(HostelRouter)
app.use(AdminRouter)
app.use(RoomRouter)
app.use(BookingRoute)
app.use(ReviewRoute)
app.use(FavoriteRouter)
app.use(OwnerRouter)
app.use(AgentRouter)


app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'StayFinder server is running'
    })
})

// app.listen(3000, () => {
//     console.log('the app is running on 3000 port')
// })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`StayFinder server is running on port ${PORT}`)
})