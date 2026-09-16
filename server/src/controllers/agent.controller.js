const {
    runStayFinderAgent
} = require("../services/agent/agent.service");


async function stayAgent(
    req,
    res
) {

    try {

        const {
            message,
            history = []
        } = req.body || {};


        if (
            typeof message !==
                "string" ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Message is required."
            });
        }


        const safeHistory =
            Array.isArray(history)

                ? history
                    .filter(
                        item =>
                            item &&
                            (
                                item.role ===
                                    "user" ||
                                item.role ===
                                    "assistant"
                            ) &&
                            typeof item.content ===
                                "string"
                    )
                    .slice(-10)

                : [];


        const result =
            await runStayFinderAgent({

                message:
                    message.trim(),

                history:
                    safeHistory
            });


        return res.json(
            result
        );

    } catch (error) {

        console.error(
            "❌ StayFinder AI:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "StayFinder AI could not process your request right now."
        });
    }
}


module.exports = {
    stayAgent
};