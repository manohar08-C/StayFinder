function AgentButton({
    onClick,
    isOpen
}) {

    const handleClick =
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            onClick?.();
        };


    return (

        <button
            type="button"
            className={
                `agent-floating-button ${
                    isOpen
                        ? "is-open"
                        : ""
                }`
            }
            onClick={handleClick}
            aria-label="Open StayFinder AI"
        >

            <span
                className="agent-button-icon"
            >
                ✦
            </span>

            <span
                className="agent-button-text"
            >
                StayFinder AI
            </span>

        </button>
    );
}


export default AgentButton;