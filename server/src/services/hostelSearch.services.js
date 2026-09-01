const Hostel = require('../models/Hostel')
const Room = require('../models/Room')

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function normalizeGeoQuery(query = {}) {
    const lat = Number(query.lat)
    const lng = Number(query.lng)
    const radius = Number(query.radius)

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
        throw new Error('A valid latitude between -90 and 90 is required.')
    }

    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
        throw new Error('A valid longitude between -180 and 180 is required.')
    }

    if (!Number.isFinite(radius) || radius <= 0) {
        throw new Error('A valid radius in meters greater than 0 is required.')
    }

    return { lat, lng, radius }
}

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
        sort,
        lat,
        lng,
        radius
    } = query

    const pageNumber = Math.max(1, Number(page) || 1)
    const limitNumber = Math.max(1, Number(limit) || 10)
    const skip = (pageNumber - 1) * limitNumber
    const hasGeoSearch = lat !== undefined && lng !== undefined && radius !== undefined

    if (sort === 'price_asc' || sort === 'price_desc') {
        if (!hasGeoSearch) {
            return searchHostelsByPrice({ ...query, page: pageNumber, limit: limitNumber, skip })
        }
    }

    const filters = buildHostelMatch(query)
    const roomFilter = buildRoomMatch(query)
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

    if (hasGeoSearch) {
        const geoQuery = normalizeGeoQuery({ lat, lng, radius })
        const geoPipeline = buildUnifiedSearchPipeline({
            hostelMatch: filters,
            roomMatch: roomFilter,
            geo: geoQuery,
            sort,
            skip,
            limit: limitNumber
        })

        const totalPipeline = buildUnifiedSearchCountPipeline({
            hostelMatch: filters,
            roomMatch: roomFilter,
            geo: geoQuery
        })

        const [hostels, totalResult] = await Promise.all([
            Hostel.aggregate(geoPipeline),
            Hostel.aggregate(totalPipeline)
        ])

        const total = totalResult[0]?.total || 0
        const totalPages = Math.ceil(total / limitNumber)

        const hostelsWithPrice = hostels.map(hostel => ({
            ...hostel,
            distance: typeof hostel.distance === 'number'
                ? Number(hostel.distance.toFixed(2))
                : hostel.distance != null
                    ? Number(Number(hostel.distance).toFixed(2))
                    : null,
            startingPrice: hostel.startingPrice ?? null
        }))

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

function buildUnifiedSortStage({ sort, geo }) {
    if (sort === 'price_asc') return { startingPrice: 1 }
    if (sort === 'price_desc') return { startingPrice: -1 }
    if (sort === 'rating_desc') return { rating: -1, createdAt: -1 }
    if (sort === 'newest') return { createdAt: -1 }
    if (sort === 'distance' || geo) return { distance: 1 }
    return { createdAt: -1 }
}

function buildUnifiedSearchPipeline({ hostelMatch, roomMatch = {}, geo, sort, skip, limit }) {
    const pipeline = []

    if (geo) {
        pipeline.push({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [geo.lng, geo.lat]
                },
                distanceField: 'distance',
                maxDistance: geo.radius,
                query: hostelMatch,
                spherical: true,
                distanceMultiplier: 0.001
            }
        })
    } else {
        pipeline.push({ $match: hostelMatch })
    }

    const roomLookupPipeline = [{ $match: { $expr: { $eq: ['$hostel', '$$hostelId'] } } }]

    if (Object.keys(roomMatch).length > 0) {
        roomLookupPipeline.push({ $match: roomMatch })
    }

    pipeline.push({
        $lookup: {
            from: 'rooms',
            let: { hostelId: '$_id' },
            pipeline: roomLookupPipeline,
            as: 'rooms'
        }
    })

    pipeline.push({
        $addFields: {
            startingPrice: {
                $ifNull: [
                    { $min: '$rooms.price' },
                    null
                ]
            },
            distance: {
                $ifNull: ['$distance', null]
            }
        }
    })

    const shouldFilterByRoomMatch = Object.keys(roomMatch).length > 0 || sort === 'price_asc' || sort === 'price_desc'

    if (shouldFilterByRoomMatch) {
        pipeline.push({
            $match: {
                startingPrice: { $ne: null }
            }
        })
    }

    const sortStage = buildUnifiedSortStage({ sort, geo })
    if (sortStage) {
        pipeline.push({ $sort: sortStage })
    }

    if (Number.isInteger(skip) && skip > 0) {
        pipeline.push({ $skip: skip })
    }

    if (Number.isInteger(limit) && limit > 0) {
        pipeline.push({ $limit: limit })
    }

    return pipeline
}

function buildUnifiedSearchCountPipeline({ hostelMatch, roomMatch = {}, geo }) {
    const pipeline = buildUnifiedSearchPipeline({
        hostelMatch,
        roomMatch,
        geo,
        sort: 'newest',
        skip: 0,
        limit: 0
    })

    pipeline.push({ $count: 'total' })

    return pipeline
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