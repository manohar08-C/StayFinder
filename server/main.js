const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
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

app.use(cors())
app.use(express.json())

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


app.listen(3000, () => {
    console.log('the app is running on 3000 port')
})