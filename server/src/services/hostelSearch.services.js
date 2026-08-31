const Hostel = require('../models/Hostel')
const Room = require('../models/Room')

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

async function hostelSearchServices(query) {
    const {
        city,
        locality,
        gender,
        amenities,
        rating,
        minPrice,
        maxPrice,
        roomType,
        capacity,
        availableBeds,
        page,
        limit,
        sort
    } = query

    const pageNumber = Math.max(1, Number(page) || 1)
    const limitNumber = Math.max(1, Number(limit) || 10)
    const skip = (pageNumber - 1) * limitNumber

    if (sort === 'price_asc' || sort === 'price_desc') {
        return searchHostelsByPrice({ ...query, page: pageNumber, limit: limitNumber, skip })
    }

    const filters = { status: 'approved' }

    if (city) filters.city = new RegExp(`^${escapeRegex(city)}$`, 'i')
    if (locality) filters.locality = new RegExp(`^${escapeRegex(locality)}$`, 'i')
    if (gender) filters.gender = gender

    if (amenities) {
        const amenityList = Array.isArray(amenities)
            ? amenities
            : String(amenities).split(',')

        const cleanedAmenities = amenityList
            .map(item => String(item).trim())
            .filter(Boolean)

        if (cleanedAmenities.length) {
            filters.amenities = { $all: cleanedAmenities }
        }
    }

    if (rating) {
        const parsedRating = Number(rating)
        if (!Number.isNaN(parsedRating)) {
            filters.rating = { $gte: parsedRating }
        }
    }

    const roomFilter = {}

    if (minPrice || maxPrice) {
        roomFilter.price = {}
        if (minPrice) roomFilter.price.$gte = Number(minPrice)
        if (maxPrice) roomFilter.price.$lte = Number(maxPrice)
    }

    if (roomType) roomFilter.roomType = roomType

    if (capacity) {
        const parsedCapacity = Number(capacity)
        if (!Number.isNaN(parsedCapacity)) {
            roomFilter.capacity = { $gte: parsedCapacity }
        }
    }

    if (availableBeds) {
        const parsedAvailableBeds = Number(availableBeds)
        if (!Number.isNaN(parsedAvailableBeds)) {
            roomFilter.availableBeds = { $gte: parsedAvailableBeds }
        }
    }

    const hasRoomFilters = Object.keys(roomFilter).length > 0

    if (hasRoomFilters) {
        const rooms = await Room.find(roomFilter).select('hostel')
        const hostelIds = [...new Set(rooms.map(room => room.hostel.toString()))]

        if (!hostelIds.length) {
            return {
                hostels: [],
                pagination: {
                    total: 0,
                    page: pageNumber,
                    limit: limitNumber,
                    pages: 0,
                    skip
                }
            }
        }

        filters._id = { $in: hostelIds }
    }

    const total = await Hostel.countDocuments(filters)

    let sortOption = {}

    if (sort === 'newest') {
        sortOption = { createdAt: -1 }
    } else if (sort === 'rating_desc') {
        sortOption = { rating: -1, createdAt: -1 }
    }

    const hostels = await Hostel.find(filters)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)

    const hostelIds = hostels.map(hostel => hostel._id.toString())
    const startingPriceMap = await buildStartingPriceMap(hostelIds, roomFilter)

    const hostelsWithPrice = hostels.map(hostel => ({
        ...hostel.toObject(),
        startingPrice: startingPriceMap.get(hostel._id.toString()) ?? null
    }))

    const totalPages = Math.ceil(total / limitNumber)

    return {
        hostels: hostelsWithPrice,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            pages: totalPages,
            skip
        }
    }
}

function buildHostelMatch(query) {
    const {
        city,
        locality,
        gender,
        amenities,
        rating
    } = query

    const hostelMatch = { status: 'approved' }

    if (city) hostelMatch.city = new RegExp(`^${escapeRegex(city)}$`, 'i')
    if (locality) hostelMatch.locality = new RegExp(`^${escapeRegex(locality)}$`, 'i')
    if (gender) hostelMatch.gender = gender

    if (amenities) {
        const amenityList = Array.isArray(amenities)
            ? amenities
            : String(amenities).split(',')

        const cleanedAmenities = amenityList
            .map(item => String(item).trim())
            .filter(Boolean)

        if (cleanedAmenities.length) {
            hostelMatch.amenities = { $all: cleanedAmenities }
        }
    }

    if (rating) {
        const parsedRating = Number(rating)
        if (!Number.isNaN(parsedRating)) {
            hostelMatch.rating = { $gte: parsedRating }
        }
    }

    return hostelMatch
}

function buildRoomMatch(query) {
    const {
        minPrice,
        maxPrice,
        roomType,
        capacity,
        availableBeds
    } = query

    const roomMatch = {}

    if (minPrice || maxPrice) {
        roomMatch.price = {}
        if (minPrice) roomMatch.price.$gte = Number(minPrice)
        if (maxPrice) roomMatch.price.$lte = Number(maxPrice)
    }

    if (roomType) roomMatch.roomType = roomType

    if (capacity) {
        const parsedCapacity = Number(capacity)
        if (!Number.isNaN(parsedCapacity)) {
            roomMatch.capacity = { $gte: parsedCapacity }
        }
    }

    if (availableBeds) {
        const parsedAvailableBeds = Number(availableBeds)
        if (!Number.isNaN(parsedAvailableBeds)) {
            roomMatch.availableBeds = { $gte: parsedAvailableBeds }
        }
    }

    return roomMatch
}

function buildRoomLookupPipeline(roomMatch = {}) {
    const roomLookupPipeline = [
        { $match: { $expr: { $eq: ['$hostel', '$$hostelId'] } } }
    ]

    if (Object.keys(roomMatch).length > 0) {
        roomLookupPipeline.push({ $match: roomMatch })
    }

    return roomLookupPipeline
}

async function buildStartingPriceMap(hostelIds, roomFilter = {}) {
    if (!hostelIds.length) return new Map()

    const roomMatch = { hostel: { $in: hostelIds } }
    if (Object.keys(roomFilter).length > 0) {
        Object.assign(roomMatch, roomFilter)
    }

    const prices = await Room.aggregate([
        { $match: roomMatch },
        {
            $group: {
                _id: '$hostel',
                startingPrice: { $min: '$price' }
            }
        }
    ])

    return new Map(prices.map(item => [item._id.toString(), item.startingPrice]))
}

function buildPriceSearchPipeline({ hostelMatch, roomMatch, skip, limitNumber, sort }) {
    const roomLookupPipeline = buildRoomLookupPipeline(roomMatch)

    return [
        { $match: hostelMatch },
        {
            $lookup: {
                from: 'rooms',
                let: { hostelId: '$_id' },
                pipeline: roomLookupPipeline,
                as: 'rooms'
            }
        },
        {
            $addFields: {
                startingPrice: {
                    $ifNull: [
                        { $min: '$rooms.price' },
                        null
                    ]
                }
            }
        },
        {
            $match: {
                startingPrice: { $ne: null }
            }
        },
        {
            $sort: {
                startingPrice: sort === 'price_asc' ? 1 : -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        }
    ]
}

function buildPriceSearchCountPipeline({ hostelMatch, roomMatch }) {
    return [
        { $match: hostelMatch },
        {
            $lookup: {
                from: 'rooms',
                let: { hostelId: '$_id' },
                pipeline: buildRoomLookupPipeline(roomMatch),
                as: 'rooms'
            }
        },
        {
            $addFields: {
                startingPrice: {
                    $ifNull: [
                        { $min: '$rooms.price' },
                        null
                    ]
                }
            }
        },
        {
            $match: {
                startingPrice: { $ne: null }
            }
        },
        {
            $count: 'total'
        }
    ]
}

async function searchHostelsByPrice({ page, limit, sort, ...query }) {
    const pageNumber = Math.max(1, Number(page) || 1)
    const limitNumber = Math.max(1, Number(limit) || 10)
    const skip = (pageNumber - 1) * limitNumber

    const hostelMatch = buildHostelMatch(query)
    const roomMatch = buildRoomMatch(query)

    const hostelPipeline = buildPriceSearchPipeline({
        hostelMatch,
        roomMatch,
        skip,
        limitNumber,
        sort
    })

    const hostels = await Hostel.aggregate(hostelPipeline)
    const total = await Hostel.aggregate(buildPriceSearchCountPipeline({
        hostelMatch,
        roomMatch
    }))

    const count = total[0]?.total || 0
    const totalPages = Math.ceil(count / limitNumber)

    return {
        hostels,
        pagination: {
            total: count,
            page: pageNumber,
            limit: limitNumber,
            pages: totalPages,
            skip
        }
    }
}

module.exports = { hostelSearchServices, searchHostelsByPrice }