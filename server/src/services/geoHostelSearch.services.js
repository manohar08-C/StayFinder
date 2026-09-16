// const Hostel = require('../models/Hostel')

// function normalizeNearbyQuery(query = {}) {
//     const lat = Number(query.lat)
//     const lng = Number(query.lng)
//     const radius = Number(query.radius)

//     if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
//         throw new Error('A valid latitude between -90 and 90 is required.')
//     }

//     if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
//         throw new Error('A valid longitude between -180 and 180 is required.')
//     }

//     if (!Number.isFinite(radius) || radius <= 0) {
//         throw new Error('A valid radius in meters greater than 0 is required.')
//     }

//     return {
//         lat,
//         lng,
//         radius
//     }
// }

// async function searchHostelsNearby(query = {}) {
//     const { lat, lng, radius } = normalizeNearbyQuery(query)

//     const hostels = await Hostel.aggregate([
//         {
//             $geoNear: {
//                 near: {
//                     type: 'Point',
//                     coordinates: [lng, lat]
//                 },
//                 distanceField: 'distance',
//                 maxDistance: radius,
//                   query: {
//                     status: 'approved'
//                     },
//                 spherical: true,
//                 distanceMultiplier: 0.001
//             }
//         },
//         // {
//         //     $match: {
//         //         status: 'approved'
//         //     }
//         // },
//         {
//             $project: {
//                 _id: 1,
//                 name: 1,
//                 city: 1,
//                 locality: 1,
//                 gender: 1,
//                 rating: 1,
//                 status: 1,
//                 address: 1,
//                 distance: {
//                     $round: ['$distance', 2]
//                 }
//             }
//         },
//     ])

//     return hostels
// }

// module.exports = { searchHostelsNearby }
