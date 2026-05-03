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
            Use ONLY the provided Knowledge Base. 
            Rules:
            1. Concise answer if info exists.
            2. If missing, respond: "CREATE_TICKET: {title: title, description: description, priority: priority, status: status}."
             - Don't add slashes or quotes in the CREATE_TICKET format.
             - keep the format EXACTLY as specified, with no extra text and comma separated like json format.
             - Title should be a short summary of the issue and should not be empty.
             - Description can be short but not empty.
             - Priority can be "low", "medium", or "high" based on urgency.
             - Status can be "open", "in-progress", or "resolved".
             - Do NOT say anything else if info is missing except the CREATE_TICKET format."
            3. Never invent info.
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