import { useState } from "react";

import {
    askStayFinderAgent
} from "../../services/agent.service";

import AgentMessage from "./AgentMessage";


function AgentPanel({
    onClose,
    onApplyFilters
}) {

    const [input, setInput] =
        useState("");

    const [messages, setMessages] =
        useState([

            {
                id: "welcome",

                role:
                    "assistant",

                content:
                    "Hi! I’m StayFinder AI. Tell me what kind of stay you are looking for."
            }

        ]);


    const [loading, setLoading] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Send Message
    |--------------------------------------------------------------------------
    */

    const sendMessage =
        async (event) => {

            event.preventDefault();

            event.stopPropagation();


            const message =
                input.trim();


            if (
                !message ||
                loading
            ) {
                return;
            }


            const history =
                messages.map(
                    item => ({

                        role:
                            item.role,

                        content:
                            item.content

                    })
                );


            setMessages(
                previous => [

                    ...previous,

                    {

                        id:
                            `user-${Date.now()}`,

                        role:
                            "user",

                        content:
                            message
                    }

                ]
            );


            setInput("");

            setLoading(true);


            try {

                console.log(
                    "🤖 Sending:",
                    message
                );


                const result =
                    await askStayFinderAgent(
                        message,
                        history
                    );


                console.log(
                    "🤖 Response:",
                    result
                );


                if (
                    result?.success
                ) {

                    setMessages(
                        previous => [

                            ...previous,

                            {

                                id:
                                    `assistant-${Date.now()}`,

                                role:
                                    "assistant",

                                content:
                                    result.message ||
                                    "I couldn't find an answer."
                            }

                        ]
                    );


                    /*
                    |----------------------------------------------------------
                    | Apply AI filters to Explore Stays
                    |----------------------------------------------------------
                    */

                    if (
                        result.filters
                    ) {

                        onApplyFilters?.(
                            result.filters
                        );
                    }

                } else {

                    setMessages(
                        previous => [

                            ...previous,

                            {

                                id:
                                    `error-${Date.now()}`,

                                role:
                                    "assistant",

                                content:
                                    result?.message ||
                                    "I couldn't process your request."
                            }

                        ]
                    );
                }


            } catch (error) {

                console.error(
                    "❌ AI ERROR:",
                    error
                );


                setMessages(
                    previous => [

                        ...previous,

                        {

                            id:
                                `error-${Date.now()}`,

                            role:
                                "assistant",

                            content:
                                error?.response?.data?.message ||
                                "StayFinder AI could not process your request right now."
                        }

                    ]
                );


            } finally {

                setLoading(false);

            }
        };


    /*
    |--------------------------------------------------------------------------
    | Suggestions
    |--------------------------------------------------------------------------
    */

    const suggestion =
        (text) => {

            if (loading) {
                return;
            }

            setInput(text);
        };


    return (

        <aside
            className="agent-panel"
            onClick={event =>
                event.stopPropagation()
            }
        >

            {/* HEADER */}

            <header
                className="agent-panel-header"
            >

                <div
                    className="agent-panel-brand"
                >

                    <div
                        className="agent-panel-avatar"
                    >
                        ✦
                    </div>


                    <div>

                        <strong>
                            StayFinder AI
                        </strong>

                        <span>
                            Find stays faster
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="agent-close-button"
                    onClick={onClose}
                >
                    ×
                </button>

            </header>


            {/* MESSAGES */}

            <div
                className="agent-panel-body"
            >

                {messages.map(
                    message => (

                        <AgentMessage
                            key={message.id}
                            message={message}
                        />

                    )
                )}


                {loading && (

                    <div
                        className="agent-message agent-message-assistant"
                    >

                        <div
                            className="agent-avatar"
                        >
                            ✦
                        </div>


                        <div
                            className="agent-typing"
                        >

                            <span />
                            <span />
                            <span />

                        </div>

                    </div>

                )}

            </div>


            {/* SUGGESTIONS */}

            <div
                className="agent-suggestions"
            >

                <button
                    type="button"
                    onClick={() =>
                        suggestion(
                            "Show me the cheapest stays in Hyderabad"
                        )
                    }
                >
                    Cheapest stays
                </button>


                <button
                    type="button"
                    onClick={() =>
                        suggestion(
                            "Find a PG in Gachibowli under ₹12000 with Wi-Fi"
                        )
                    }
                >
                    PG in Gachibowli
                </button>


                <button
                    type="button"
                    onClick={() =>
                        suggestion(
                            "Show me highly rated stays"
                        )
                    }
                >
                    Highly rated
                </button>

            </div>


            {/* INPUT */}

            <form
                className="agent-input-area"
                onSubmit={sendMessage}
            >

                <input
                    type="text"
                    value={input}
                    onChange={event =>
                        setInput(
                            event.target.value
                        )
                    }
                    placeholder="Find a stay..."
                    disabled={loading}
                    autoComplete="off"
                />


                <button
                    type="submit"
                    disabled={
                        loading ||
                        !input.trim()
                    }
                >
                    {loading
                        ? "..."
                        : "→"}
                </button>

            </form>

        </aside>
    );
}


export default AgentPanel;