const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
    const response = ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config: {
            temperature: 0.7,
            systemInstruction: ``,
        },
    });

    return (await response).text;
}

module.exports = generateResponse;
