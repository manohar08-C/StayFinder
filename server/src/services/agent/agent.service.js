const {
    ai,
    model
} = require("./agent.llm");

const {
    SYSTEM_PROMPT
} = require("./agent.prompts");

const {
    searchHostelsTool,
    getHostelTool,
    getRoomsTool,
    getReviewsTool
} = require("./agent.tools");

const {
    Type
} = require("@google/genai");


/*
|--------------------------------------------------------------------------
| AI Tools
|--------------------------------------------------------------------------
*/

const AGENT_TOOLS = [

    {

        functionDeclarations: [

            {

                name:
                    "search_hostels",

                description:
                    "Search approved StayFinder stays using user requirements.",

                parameters: {

                    type:
                        Type.OBJECT,

                    properties: {

                        city: {
                            type:
                                Type.STRING
                        },

                        locality: {
                            type:
                                Type.STRING
                        },

                        gender: {

                            type:
                                Type.STRING,

                            enum: [
                                "male",
                                "female"
                            ]
                        },

                        amenities: {

                            type:
                                Type.ARRAY,

                            items: {
                                type:
                                    Type.STRING
                            }
                        },

                        rating: {
                            type:
                                Type.NUMBER
                        },

                        minPrice: {
                            type:
                                Type.NUMBER
                        },

                        maxPrice: {
                            type:
                                Type.NUMBER
                        },

                        priceType: {

                            type:
                                Type.STRING,

                            enum: [
                                "daily",
                                "monthly"
                            ]
                        },

                        roomType: {
                            type:
                                Type.STRING
                        },

                        capacity: {
                            type:
                                Type.NUMBER
                        },

                        checkIn: {
                            type:
                                Type.STRING
                        },

                        checkOut: {
                            type:
                                Type.STRING
                        },

                        availableBeds: {
                            type:
                                Type.NUMBER
                        },

                        sort: {

                            type:
                                Type.STRING,

                            enum: [
                                "rating_desc",
                                "price_asc",
                                "price_desc",
                                "newest"
                            ]
                        }
                    }
                }
            },


            {

                name:
                    "get_hostel_details",

                description:
                    "Get information about one approved hostel.",

                parameters: {

                    type:
                        Type.OBJECT,

                    properties: {

                        hostelId: {
                            type:
                                Type.STRING
                        }
                    },

                    required: [
                        "hostelId"
                    ]
                }
            },


            {

                name:
                    "get_hostel_rooms",

                description:
                    "Get rooms available in a hostel.",

                parameters: {

                    type:
                        Type.OBJECT,

                    properties: {

                        hostelId: {
                            type:
                                Type.STRING
                        }
                    },

                    required: [
                        "hostelId"
                    ]
                }
            },


            {

                name:
                    "get_hostel_reviews",

                description:
                    "Get recent reviews of a hostel.",

                parameters: {

                    type:
                        Type.OBJECT,

                    properties: {

                        hostelId: {
                            type:
                                Type.STRING
                        }
                    },

                    required: [
                        "hostelId"
                    ]
                }
            }
        ]
    }
];


/*
|--------------------------------------------------------------------------
| Execute Tool
|--------------------------------------------------------------------------
*/

async function executeTool(
    name,
    args
) {

    console.log(
        `🛠️ AI TOOL: ${name}`
    );


    switch (name) {

        case "search_hostels":

            return await searchHostelsTool(
                args
            );


        case "get_hostel_details":

            return await getHostelTool(
                args.hostelId
            );


        case "get_hostel_rooms":

            return await getRoomsTool(
                args.hostelId
            );


        case "get_hostel_reviews":

            return await getReviewsTool(
                args.hostelId
            );


        default:

            return {

                success: false,

                error:
                    "Unknown tool."
            };
    }
}


/*
|--------------------------------------------------------------------------
| Build Conversation
|--------------------------------------------------------------------------
*/

function buildContents(
    history,
    message
) {

    const contents = [];


    if (Array.isArray(history)) {

        for (
            const item
            of history.slice(-10)
        ) {

            if (
                !item ||
                typeof item.content !==
                    "string" ||
                !item.content.trim()
            ) {
                continue;
            }


            contents.push({

                role:
                    item.role ===
                    "assistant"
                        ? "model"
                        : "user",

                parts: [

                    {
                        text:
                            item.content
                    }

                ]
            });
        }
    }


    contents.push({

        role:
            "user",

        parts: [

            {
                text:
                    message
            }

        ]
    });


    return contents;
}


/*
|--------------------------------------------------------------------------
| Main Agent
|--------------------------------------------------------------------------
*/

async function runStayFinderAgent({
    message,
    history = []
}) {

    if (
        typeof message !==
            "string" ||
        !message.trim()
    ) {

        throw new Error(
            "Message is required."
        );
    }


    let contents =
        buildContents(
            history,
            message.trim()
        );


    let appliedFilters =
        null;


    const toolsUsed = [];


    for (
        let round = 1;
        round <= 5;
        round++
    ) {

        console.log(
            `\n🤖 AI ROUND ${round}`
        );


        const response =
            await ai.models.generateContent({

                model,

                contents,

                config: {

                    systemInstruction:
                        SYSTEM_PROMPT,

                    tools:
                        AGENT_TOOLS,

                    temperature:
                        0.2
                }
            });


        const functionCalls =
            response.functionCalls ||
            [];


        /*
        |--------------------------------------------------------------------------
        | Normal AI Response
        |--------------------------------------------------------------------------
        */

        if (
            functionCalls.length ===
            0
        ) {

            return {

                success: true,

                message:
                    response.text ||
                    "I couldn't find an answer.",

                filters:
                    appliedFilters,

                toolsUsed
            };
        }


        /*
        |--------------------------------------------------------------------------
        | Preserve Gemini response
        |--------------------------------------------------------------------------
        */

        const modelContent =
            response
                .candidates?.[0]
                ?.content;


        if (!modelContent) {

            throw new Error(
                "Gemini did not return valid function-call content."
            );
        }


        contents.push(
            modelContent
        );


        /*
        |--------------------------------------------------------------------------
        | Execute Tools
        |--------------------------------------------------------------------------
        */

        const functionResponseParts =
            [];


        for (
            const call
            of functionCalls
        ) {

            const name =
                call.name;

            const args =
                call.args || {};


            toolsUsed.push(
                name
            );


            if (
                name ===
                "search_hostels"
            ) {

                appliedFilters =
                    {
                        ...args
                    };
            }


            const result =
                await executeTool(
                    name,
                    args
                );


            functionResponseParts.push({

                functionResponse: {

                    name:

                        name,

                    id:

                        call.id,

                    response:

                        result
                }
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Send results back to Gemini
        |--------------------------------------------------------------------------
        */

        contents.push({

            role:
                "user",

            parts:
                functionResponseParts
        });
    }


    return {

        success: false,

        message:
            "I couldn't complete the search. Please try again.",

        filters:
            appliedFilters,

        toolsUsed
    };
}


module.exports = {
    runStayFinderAgent
};