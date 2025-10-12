const LlmService = require("../service/llm_service");
const express = require('express');
const router = express.Router();
llm_service = new LlmService()


router.post('/', async function (req, res, next) {
    try {
        const query = req.body.query;

        if (!query) {
            return res.status(400).json({ error: 'Missing "query" in request body' });
        }

        const result = await llm_service.get_llm_response(query);
        res.json(result);
    } catch (error) {
        console.error('Error in /search route:', error.message);
        res.status(500).json({ error: 'Failed to get response from LLM' });
    }
});

module.exports = router;
