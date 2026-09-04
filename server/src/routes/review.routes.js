const express = require('express')

const ReviewRoute = express.Router()

const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')
const {
	createReview,
	getHostelReviews,
	updateReview,
	deleteReview
} = require('../controllers/review.controller')

ReviewRoute.post('/reviews', tokenVerify, authorizeRoles('User'), createReview)

ReviewRoute.get('/reviews/hostel/:hostelId', getHostelReviews)

ReviewRoute.put('/reviews/:reviewId', tokenVerify, authorizeRoles('User'), updateReview)

ReviewRoute.delete('/reviews/:reviewId', tokenVerify, authorizeRoles('User'), deleteReview)


module.exports = { ReviewRoute }