const axios = require('axios');


class LlmRepository {
    constructor() {
        this.LLM_URL = process.env.LLM_URL || "http://localhost:8001";
        this.MODEL = "Qwen/Qwen2.5-1.5B-Instruct";
    }

    // The main method
    async get_llm_response(userQuery) {
        const systemPrompt = `
You are a query transformation engine.

Your task:
Take a user's natural language query and convert it into a valid JSON object that describes the search intent.

Output *only* valid JSON — no explanations, no markdown, no extra text.

Current fields that are searchable and filterable:
id: int
name: varchar
description: varchar
amount: float

JSON schema:
{
  "query": "string",        // main topic or keyword
  "filters": {              // additional filtering constraints
    "key": "value"
  }
}

Rules:
- The "query" field must summarize the main search term or intent.
- Extract any constraints (like brand, price, category, location, date, etc.) and include them as key-value pairs under "filters".
- If no filters are found, return "filters": {}.
- Do not include comments, extra text, or code fences.
- Output must be *parsable JSON only*.

Example inputs and outputs:

Input: "Show me Apple laptops under $1000"
Output:
{
  "query": "Apple laptops",
  "filters": {
    "brand": "Apple",
    "price_max": 1000
  }
}

Input: "Find restaurants in Paris"
Output:
{
  "query": "restaurants",
  "filters": {
    "location": "Paris"
  }
}

Input: "Tell me about climate change"
Output:
{
  "query": "climate change",
  "filters": {}
}
`;

        const requestBody = {
            model: this.MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userQuery }
            ]
        };

        try {
            const response = await axios.post(
                `${this.LLM_URL}/v1/chat/completions`,
                requestBody
            );

            // Most chat APIs return content in choices[0].message.content
            const content = response.data?.choices?.[0]?.message?.content || "";

            // Try to parse JSON response
            try {
                return JSON.parse(content);
            } catch (err) {
                console.warn("Failed to parse JSON, returning raw text");
                return { raw: content };
            }
        } catch (error) {
            console.error("LLM request failed:", error.message);
            throw error;
        }
    }
}

module.exports = LlmRepository;