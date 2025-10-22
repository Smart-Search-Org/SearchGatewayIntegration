const LlmService = require("../service/llm_service");
const SearchService = require("../service/search_service");
const express = require('express');
const authApi = require("../middlewares/auth_app");
const router = express.Router();

llm_service = new LlmService()
search_service = new SearchService()

router.post('/smart-search', authApi, async function (req, res, next) {
    try {
        const user_id = req.user._id;
        const index_name = req.body.index_name;
        const query = req.body.query;

        if (!index_name) {
            console.error('Error in /search route: missing "index_name" in request body');
            return res.status(400).json({ error: 'Missing "index_name" in request body' });
        }

        if (!query) {
            console.error('Error in /search route: missing "query" in request body');
            return res.status(400).json({ error: 'Missing "query" in request body' });
        }

        const llm_result = await llm_service.get_llm_response(query);
        const search_result = await search_service.get_search_response(user_id, index_name, llm_result);

        res.json(search_result);
    } catch (error) {
        console.error('Error in /search route:', error.message);
        res.status(500).json({ error: 'Failed to get response from LLM' });
    }
});

module.exports = router;
