function AgentMessage({ message }) {

    return (
        <div
            className={`agent-message ${
                message.role === 'user'
                    ? 'agent-message-user'
                    : 'agent-message-assistant'
            }`}
        >

            {message.role === 'assistant' && (
                <div className="agent-avatar">
                    ✦
                </div>
            )}

            <div className="agent-message-content">
                {message.content}
            </div>

        </div>
    )
}

export default AgentMessage