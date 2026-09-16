const express = require('express')
const { tokenVerify, authorizeRoles } = require('../middleware/auth.middleware')
const {
	addFavorite,
	getFavorites,
	removeFavorite
} = require('../controllers/favorite.controller')

const FavoriteRouter = express.Router()

FavoriteRouter.post('/favorites/:hostelId', tokenVerify, authorizeRoles('User', 'hostelOwner'), addFavorite)

FavoriteRouter.get('/favorites', tokenVerify, authorizeRoles('User', 'hostelOwner'), getFavorites)

FavoriteRouter.delete('/favorites/:hostelId', tokenVerify, authorizeRoles('User', 'hostelOwner'), removeFavorite)

module.exports = { FavoriteRouter }