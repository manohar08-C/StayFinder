const Favorite = require('../models/Favorite')
const mongoose = require('mongoose')
const Hostel = require('../models/Hostel')

function isValidObjectId(value) {
	return mongoose.Types.ObjectId.isValid(value)
}

async function addFavorite(req, res) {
	const { hostelId } = req.params

	if (!isValidObjectId(hostelId)) {
		return res.status(400).json({ message: 'Invalid hostel ID' })
	}

	try {
		const hostel = await Hostel.findOne({
			_id: hostelId,
			status: 'approved'
		}).select('_id')

		if (!hostel) {
			return res.status(404).json({ message: 'Approved hostel not found' })
		}

		const favorite = await Favorite.create({
			user: req.user.id,
			hostel: hostel._id
		})

		return res.status(201).json({
			message: 'Hostel added to favorites',
			data: { favorite }
		})
	} catch (err) {
		if (err.code === 11000) {
			return res.status(409).json({ message: 'Hostel is already in your favorites' })
		}

		return res.status(400).json({
			message: err.message || 'Unable to add favorite'
		})
	}
}

async function getFavorites(req, res) {
	try {
		const favorites = await Favorite.find({ user: req.user.id })
			.populate({
				path: 'hostel',
				match: { status: 'approved' },
				select: 'name description gender address city locality amenities images rating status'
			})
			.sort({ createdAt: -1 })

		return res.status(200).json({
			message: 'Favorites retrieved successfully',
			data: {
				favorites: favorites.filter(favorite => favorite.hostel)
			}
		})
	} catch (err) {
		return res.status(400).json({
			message: err.message || 'Unable to retrieve favorites'
		})
	}
}

async function removeFavorite(req, res) {
	const { hostelId } = req.params

	if (!isValidObjectId(hostelId)) {
		return res.status(400).json({ message: 'Invalid hostel ID' })
	}

	try {
		const favorite = await Favorite.findOneAndDelete({
			user: req.user.id,
			hostel: hostelId
		})

		if (!favorite) {
			return res.status(404).json({ message: 'Favorite not found' })
		}

		return res.status(200).json({
			message: 'Hostel removed from favorites',
			data: { favorite }
		})
	} catch (err) {
		return res.status(400).json({
			message: err.message || 'Unable to remove favorite'
		})
	}
}

module.exports = { addFavorite, getFavorites, removeFavorite }