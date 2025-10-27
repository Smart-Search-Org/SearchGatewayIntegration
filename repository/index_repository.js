const axios = require('axios');


class IndexRepository {
    constructor() {
        this.SEARCH_ENGINE_URL = process.env.SEARCH_URL || "http://localhost:8002";
    }

    async create_index(request_object) {
        try {
            const response = await axios.post(
                `${this.SEARCH_ENGINE_URL}/index`,
                request_object
            );

            const content = response.data;
            console.info('Successfully parsed create index response');

            try {
                return JSON.parse(content);
            } catch (err) {
                console.warn("Failed to parse JSON, returning raw text");
                return { raw: content };
            }
        } catch (error) {
            console.error("Create index request failed:", error.message);
            throw error;
        }
    }

    async delete_index(user_id, index_name) {
        try {
            const response = await axios.delete(
                `${this.SEARCH_ENGINE_URL}/index?userId=${user_id}&indexName=${index_name}`,
            );

            const content = response.data;
            console.info('Successfully parsed delete index response');

            try {
                return JSON.parse(content);
            } catch (err) {
                console.warn("Failed to parse JSON, returning raw text");
                return { raw: content };
            }
        } catch (error) {
            console.error("Delete index request failed:", error.message);
            throw error;
        }
    }

    async get_index_structure(user_id, index_name) {
        try {
            const response = await axios.get(`${this.SEARCH_ENGINE_URL}/index-structure
?userId=${user_id}&indexName=${index_name}`);

            const content = response.data;
            console.info('Successfully parsed index structure response');

            try {
                return JSON.parse(content);
            } catch (err) {
                console.warn("Failed to parse JSON, returning raw text");
                return { raw: content };
            }
        } catch (error) {
            console.error("Index structure request failed:", error.message);
            throw error;
        }
    }

    async connect_user_database(request_object) {
        try {
            const response = await axios.post(
                `${this.SEARCH_ENGINE_URL}/index/docs`,
                request_object
            );

            const content = response.data;
            console.info('Successfully parsed index docs response');

            try {
                return JSON.parse(content);
            } catch (err) {
                console.warn("Failed to parse JSON, returning raw text");
                return { raw: content };
            }
        } catch (error) {
            console.error("Index docs request failed:", error.message);
            throw error;
        }
    }
}

module.exports = IndexRepository;