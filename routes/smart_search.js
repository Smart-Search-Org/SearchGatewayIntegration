const express = require('express');
const LlmService = require("../service/llm_service");
const SearchService = require("../service/search_service");

module.exports = (keycloak) => {
    const router = express.Router();
    const llm_service = new LlmService();
    const search_service = new SearchService();

    router.post('/smart-search', keycloak.protect(), async (req, res) => {
        try {
            const user_id = req.kauth.grant.access_token.content.sub;
            const { index_name, query } = req.body;

            if (!index_name || !query) return res.status(400).json({ error: 'Missing required fields' });

            const llm_result = await llm_service.get_llm_response(query);
            const search_result = await search_service.get_search_response(user_id, index_name, llm_result);

            res.json(search_result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get response from LLM' });
        }
    });

    return router;
};
