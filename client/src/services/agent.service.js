import api from "./api";


export const askStayFinderAgent =
    async (
        message,
        history = []
    ) => {

        const response =
            await api.post(
                "/stay",
                {
                    message,
                    history,
                }
            );

        return response.data;
    };