const axios = require('axios');


class SearchRepository {
    constructor() {
        this.SEARCH_URL = process.env.LLM_URL || "http://localhost:8002";
    }

    async get_search_response(request_object) {
        try {
            const response = await axios.post(
                `${this.SEARCH_URL}/search`,
                request_object
            );

            const content = response.data;

            try {
                return JSON.parse(content);
            } catch (err) {
                console.warn("Failed to parse JSON, returning raw text");
                return { raw: content };
            }
        } catch (error) {
            console.error("Search request failed:", error.message);
            throw error;
        }
    }
}

module.exports = SearchRepository;