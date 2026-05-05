const { OpenAI } = require("openai");

// Initialize with Groq's URL and your new key
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1", //
  apiKey: process.env.GROQ_API_KEY, 
});

async function generateResponse(userPrompt, knowledgeBaseContext, systemInstructions) {
  try {
    const response = await openai.chat.completions.create({
      // llama-3.1-8b-instant is the "workhorse" of their free tier (14,400 requests/day)
      model: "llama-3.1-8b-instant", //
      messages: [
        {
          role: "system",
          content: systemInstructions || `
            You are an AI customer support assistant for "Swift Support".
            Use ONLY the provided Knowledge Base for technical or specific questions. 
            Rules:
            1. If the user says "Hi", "Hello", "Hey", or any greeting, respond with: "Hi! How can I help you today?". Do NOT create a ticket for greetings.
            2. If the user asks a question that is in the Knowledge Base, provide a concise answer.
            3. If the user asks a question or reports an issue that is NOT in the Knowledge Base, respond ONLY with: "CREATE_TICKET: {title: title, description: description, priority: priority, status: status}."
             - Don't add slashes or quotes in the CREATE_TICKET format.
             - keep the format EXACTLY as specified, with no extra text and comma separated like json format.
             - Title should be a short summary of the issue.
             - Description should be a brief summary of what the user wants.
             - Priority can be "low", "medium", or "high".
             - Status should be "open".
            4. Never invent information outside of the Knowledge Base.
          `,
        },
        {
          role: "user",
          content: `KNOWLEDGE BASE: ${knowledgeBaseContext}\n\nCUSTOMER QUESTION: ${userPrompt}`,
        },
      ],
      temperature: 0, 
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

module.exports = { generateResponse };