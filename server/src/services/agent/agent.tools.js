const Hostel = require("../../models/Hostel");
const Room = require("../../models/Room");
const Review = require("../../models/Review");

const {
    hostelSearchServices
} = require("../hostelSearch.services");



function cleanHostel(hostel) {

    if (!hostel) {
        return null;
    }

    return {
        id: hostel._id?.toString(),

        name: hostel.name || "",

        city: hostel.city || "",

        locality: hostel.locality || "",

        address: hostel.address || "",

        gender: hostel.gender || null,

        description:
            hostel.description || "",

        amenities:
            Array.isArray(hostel.amenities)
                ? hostel.amenities
                : [],

        rating:
            hostel.rating ?? null,

        startingPrice:
            hostel.startingPrice ?? null,

        pricing:
            hostel.pricing ?? null,

        images:
            Array.isArray(hostel.images)
                ? hostel.images
                : []
    };
}


/*
|--------------------------------------------------------------------------
| Search Hostels
|--------------------------------------------------------------------------
*/

async function searchHostelsTool(
    filters = {}
) {

    try {

        const safeFilters = {};


        if (filters.city) {
            safeFilters.city =
                String(filters.city).trim();
        }


        if (filters.locality) {
            safeFilters.locality =
                String(filters.locality).trim();
        }


        if (filters.gender) {
            safeFilters.gender =
                String(filters.gender).toLowerCase();
        }


        if (
            Array.isArray(filters.amenities) &&
            filters.amenities.length > 0
        ) {

            safeFilters.amenities =
                filters.amenities.map(
                    item =>
                        String(item).trim()
                );
        }


        if (
            filters.rating !== undefined &&
            filters.rating !== null
        ) {

            safeFilters.rating =
                Number(filters.rating);
        }


        if (
            filters.minPrice !== undefined &&
            filters.minPrice !== null
        ) {

            safeFilters.minPrice =
                Number(filters.minPrice);
        }


        if (
            filters.maxPrice !== undefined &&
            filters.maxPrice !== null
        ) {

            safeFilters.maxPrice =
                Number(filters.maxPrice);
        }


        /*
        |----------------------------------------------------------------------
        | Monthly is the default for PG/hostel searches
        |----------------------------------------------------------------------
        */

        safeFilters.priceType =
            filters.priceType ||
            "monthly";


        if (filters.roomType) {
            safeFilters.roomType =
                filters.roomType;
        }


        if (
            filters.capacity !== undefined &&
            filters.capacity !== null
        ) {

            safeFilters.capacity =
                Number(filters.capacity);
        }


        if (filters.checkIn) {
            safeFilters.checkIn =
                filters.checkIn;
        }


        if (filters.checkOut) {
            safeFilters.checkOut =
                filters.checkOut;
        }


        if (
            filters.availableBeds !== undefined &&
            filters.availableBeds !== null
        ) {

            safeFilters.availableBeds =
                Number(filters.availableBeds);
        }


        safeFilters.sort =
            filters.sort ||
            "newest";


        safeFilters.page = 1;
        safeFilters.limit = 10;


        console.log(
            "\n🔎 AI SEARCH"
        );

        console.log(
            JSON.stringify(
                safeFilters,
                null,
                2
            )
        );


        const result =
            await hostelSearchServices(
                safeFilters
            );


        const hostels =
            Array.isArray(
                result?.hostels
            )
                ? result.hostels
                : [];


        console.log(
            `✅ AI found ${hostels.length} stays`
        );


        return {

            success: true,

            total:
                result?.pagination?.total ??
                hostels.length,

            filters:
                safeFilters,

            hostels:
                hostels.map(
                    cleanHostel
                )
        };

    } catch (error) {

        console.error(
            "❌ searchHostelsTool:",
            error
        );

        return {

            success: false,

            total: 0,

            hostels: [],

            error:
                error.message ||
                "Unable to search stays."
        };
    }
}


/*
|--------------------------------------------------------------------------
| Hostel Details
|--------------------------------------------------------------------------
*/

async function getHostelTool(
    hostelId
) {

    try {

        const hostel =
            await Hostel.findOne({

                _id: hostelId,

                status: "approved"

            }).lean();


        if (!hostel) {

            return {

                success: false,

                error:
                    "Hostel not found."
            };
        }


        return {

            success: true,

            hostel:
                cleanHostel(hostel)
        };

    } catch (error) {

        console.error(
            "❌ getHostelTool:",
            error
        );

        return {

            success: false,

            error:
                "Unable to retrieve hostel details."
        };
    }
}


/*
|--------------------------------------------------------------------------
| Hostel Rooms
|--------------------------------------------------------------------------
*/

async function getRoomsTool(
    hostelId
) {

    try {

        const rooms =
            await Room.find({
                hostel: hostelId
            }).lean();


        return {

            success: true,

            rooms:
                rooms.map(room => ({

                    id:
                        room._id?.toString(),

                    roomType:
                        room.roomType || null,

                    capacity:
                        room.capacity ?? null,

                    pricing:
                        room.pricing ?? null,

                    amenities:
                        Array.isArray(
                            room.amenities
                        )
                            ? room.amenities
                            : [],

                    images:
                        Array.isArray(
                            room.images
                        )
                            ? room.images
                            : []
                }))
        };

    } catch (error) {

        console.error(
            "❌ getRoomsTool:",
            error
        );

        return {

            success: false,

            rooms: [],

            error:
                "Unable to retrieve rooms."
        };
    }
}


/*
|--------------------------------------------------------------------------
| Hostel Reviews
|--------------------------------------------------------------------------
*/

async function getReviewsTool(
    hostelId
) {

    try {

        const reviews =
            await Review.find({
                hostel: hostelId
            })
                .sort({
                    createdAt: -1
                })
                .limit(10)
                .lean();


        return {

            success: true,

            reviews:
                reviews.map(review => ({

                    rating:
                        review.rating ?? null,

                    comment:
                        review.comment || "",

                    createdAt:
                        review.createdAt || null
                }))
        };

    } catch (error) {

        console.error(
            "❌ getReviewsTool:",
            error
        );

        return {

            success: false,

            reviews: [],

            error:
                "Unable to retrieve reviews."
        };
    }
}


module.exports = {

    searchHostelsTool,

    getHostelTool,

    getRoomsTool,

    getReviewsTool
};