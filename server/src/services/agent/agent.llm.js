const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error(
        "GEMINI_API_KEY is not configured in the server .env file."
    );
}

const ai = new GoogleGenAI({
    apiKey
});

const model =
    process.env.GEMINI_MODEL ||
    "gemini-2.5-flash";

module.exports = {
    ai,
    model
};